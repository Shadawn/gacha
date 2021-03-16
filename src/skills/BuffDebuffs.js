import { Data } from '../CharacterDataStructure'
import { newCondition, newEffect, addCondition, removeCondition } from '../Conditions'
import * as SkillFunctions from '../SkillFunctions'

Data.functions.skill.ApplyBasicCondition = (G, caster, target, params) => {
  const condition = newCondition(params.name, SkillFunctions.skillDurationDefault(caster, params), [
    newEffect('statsCalculation', 'AttributeMultiplier', {
      value: params.value,
      attribute: params.attribute,
      cleanse: params.value < 0
    })
  ]);
  addCondition(G, target, condition);
}

Data.functions.statsCalculation.AttributeMultiplier = (G, character, condition, effect) => {
  character.current[effect.params.attribute] += character.base[effect.params.attribute] * effect.params.value;
}

Data.functions.skill.ApplyLifesteal = (G, caster, target, params) => {
  const condition = newCondition(params.name, SkillFunctions.skillDurationDefault(caster, params), [
    newEffect('damageDealt', 'Lifesteal', {
      value: params.value
    })
  ])
  addCondition(G, target, condition);
}

Data.functions.damageDealt.LifeSteal = (G, character, condition, effect, eventParams) => {
  SkillFunctions.receiveHealing(G, character, eventParams.damage)
}

Data.functions.skill.ApplyDamageAbsorbingShieldTarget = (G, caster, target, params) => {
  const condition = newCondition(params.name, SkillFunctions.skillDurationDefault(caster, params), [
    newEffect('damageTaken', 'DamageAbsorbingShield', {
      value: SkillFunctions.skillDamage(caster, params.scaling, params.boostscaling)
    })
  ]);
  addCondition(G, target, condition);
}

Data.functions.damageTaken.DamageAbsorbingShield = (G, character, condition, effect, eventParams) => {
  const damageReduction = Math.min(eventParams.damage, effect.params.value);
  eventParams.damage -= damageReduction;
  effect.params.value -= damageReduction;
  if (effect.params.value === 0) {
    removeCondition(G, condition);
  }
}

Data.functions.skill.ApplyStun = (G, caster, target, params) => {
  const condition = newCondition('Stunned', SkillFunctions.skillDurationDefault(caster, params), [
    newEffect('statsCalculation', 'Stun', {
      cleanse: true
    })
  ]);
  addCondition(G, target, condition);
}

Data.functions.statsCalculation.Stun = (G, character, condition, effect) => {
  character.current.status.stunned = true;
  character.current.active = false;
}

