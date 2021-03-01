import { INVALID_MOVE } from 'boardgame.io/core';
import { newCondition, newEffect, addCondition, removeCondition } from './Conditions'

const SkillFunctions = {};

SkillFunctions.ATBModifierTarget = (G, caster, target, params) => {
  target.current.progress += params.value;
  if (target.current.progress < 0) target.current.progress = 0;
}

SkillFunctions.DamageTarget = (G, caster, target, params) => {
  dealDamage(G, caster, target, skillValue(caster, params));
}

SkillFunctions.ExecuteTarget = (G, caster, target, params) => {
  const threshold = skillValue(caster, params);
  if (target.current.health < threshold) {
    death(G, target);
  }
}

SkillFunctions.DamageTargetWithLifeSteal = (G, caster, target, params) => {
  const damageDealt = dealDamage(G, caster, target, skillValue(caster, params));
  receiveHealing(G, caster, damageDealt * params.lifesteal);
}

SkillFunctions.GainPower = (G, caster, target, params) => {
  team(G, caster).power += params.value;
}

SkillFunctions.AttributeMultiplier = (G, character, condition, effect) => {
  character.current[effect.params.attribute] += character.base[effect.params.attribute] * effect.params.value;
}

SkillFunctions.ApplyBasicCondition = (G, caster, target, params) => {
  const condition = newCondition(params.name, skillDuration(caster, params.duration, params.boostscaling), [
    newEffect('statsCalculation', 'AttributeMultiplier', {
      value: params.value,
      attribute: params.attribute
    })
  ]);
  addCondition(G, target, condition);
}

SkillFunctions.LifeSteal = (G, character, condition, effect, eventParams) => {
  receiveHealing(G, character, eventParams.damage)
}

SkillFunctions.ApplyLifesteal = (G, caster, target, params) => {
  const condition = newCondition(params.name, skillDurationDefault(caster, params), [
    newEffect('damageDealt', 'Lifesteal', {
      value: params.value
    })
  ])
  addCondition(G, target, condition);
}

SkillFunctions.DamageAbsorbingShield = (G, character, condition, effect, eventParams) => {
  const damageReduction = Math.min(eventParams.damage, effect.params.value);
  eventParams.damage -= damageReduction;
  effect.params.value -= damageReduction;
  if (effect.params.value === 0) {
    removeCondition(G, condition);
  }
}

SkillFunctions.ApplyDamageAbsorbingShieldTarget = (G, caster, target, params) => {
  const condition = newCondition(params.name, skillDurationDefault(caster, params), [
    newEffect('damageTaken', 'DamageAbsorbingShield', {
      value: skillDamage(caster, params.scaling, params.boostscaling)
    })
  ]);
  addCondition(G, target, condition);
}

SkillFunctions.Stun = (G, character, condition, effect) => {
  character.current.status.stunned = true;
  character.current.active = false;
}

SkillFunctions.ApplyStun = (G, caster, target, params) => {
  const condition = newCondition('Stunned', skillDurationDefault(caster, params), [
    newEffect('statsCalculation', 'Stun', {})
  ]);
  addCondition(G, target, condition);
}

SkillFunctions.Youmu__CreateClone = (G, caster, target, params) => {
  const condition = newCondition('Wheel of Pain of the Living and Dead', false, [
    newEffect('damageTaken', 'DamageAbsorbingShield', {
      value: skillValue(caster, params)
    }),
    newEffect('statsCalculation', 'Youmu__Clone')
  ])
  addCondition(G, caster, condition);
}

SkillFunctions.Youmu__Clone = (G, character, condition, effect) => {
  character.current.status.Youmu__Clone = true;
}

SkillFunctions.Youmu__CloneDamage = (G, caster, target, params) => {
  if (caster.current.status.Youmu__Clone !== true) return;
  dealDamage(G, caster, target, params.scaling, 0);
}

SkillFunctions.Youmu__ApplyDelayedDamage = (G, caster, target, params) => {
  const condition = newCondition('Slash of the Eternal Future', params.delay, [
    newEffect('conditionEnds', 'Youmu__DelayedDamage', {
      targetID: target.current.ID,
      scaling: params.scaling * (1 + params.boostscaling * caster.current.boosts),
    }),
  ])
  addCondition(G, caster, condition);
}
SkillFunctions.Youmu__DelayedDamage = (G, character, condition, effect, eventParams) => {
  const target = G.characters[effect.params.targetID];
  dealDamage(G, character, target, skillValue(character, effect.params));
}

export function skillValue(character, params) {

  return character.current[params.attribute || 'attack'] * params.scaling * (1 + character.current.boosts * (params.boostscaling || 0));
}

export function skillDamage(character, scaling, boostscaling) {
  return character.current.attack * scaling * (1 + boostscaling * character.current.boosts);
}

export function skillDamageDefault(character, params) {
  return skillDamage(character.current.attack, params.scaling, params.boostscaling);
}

export function skillDuration(character, baseDuration, boostscaling) {
  return baseDuration * (1 + (boostscaling || 0) * character.current.boosts);
}

export function skillDurationDefault(character, params) {
  return skillDuration(character, params.duration, params.boostscaling)
}

export function isAvailableTarget(G, caster, target, skill) {
  if (target.current.alive === false) return false;
  if (skill.target === 'enemy' || skill.target === 'allenemy') return teamID(G, caster) !== teamID(G, target)
  else if (skill.target === 'ally') return teamID(G, caster) === teamID(G, target)
  else if (skill.target === 'self') return caster.current.ID === target.current.ID
  else throw 'Invalid targeting variant'
}

function dealDamage(G, caster, target, damage) {
  const eventParams = {
    damage: damage
  }
  takeDamage(G, target, eventParams)
  caster.current.conditions.forEach(conditionID => {
    const condition = G.conditions[conditionID];
    condition.effects.forEach(effect => {
      if (effect.type !== 'damageDealt') return;
      const skillFunction = SkillFunctions[effect.name];
      skillFunction(G, caster, condition, effect, eventParams)
    })
  })
  return eventParams.damage;
}

function takeDamage(G, character, eventParams) {
  character.current.conditions.forEach(conditionID => {
    const condition = G.conditions[conditionID];
    condition.effects.forEach(effect => {
      if (effect.type !== 'damageTaken') return;
      const skillFunction = SkillFunctions[effect.name];
      skillFunction(G, character, condition, effect, eventParams);
    })
  });
  character.current.health -= eventParams.damage;
  if (character.current.health <= 0) {
    death(G, character);
  }
}

function receiveHealing(G, character, amount) {
  character.current.health += amount;
  if (character.current.health > character.current.maxHealth) {
    character.current.health = character.current.maxHealth;
  }
}

function death(G, character) {
  character.current.health = 0;
  character.current.active = false;
  character.current.alive = false;
  G.conditions.forEach((condition, index) => {
    if (condition.characterID === character.index) delete G.conditions[index];
  })
}

function teamID(G, character) {
  if (G.teams[0].characters.indexOf(character.current.ID) !== -1) return 0
  else return 1;
}

function team(G, character) {
  return G.teams[teamID(G, character)];
}

export default SkillFunctions


