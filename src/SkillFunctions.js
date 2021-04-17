import { Data } from './CharacterDataStructure'
import { removeCondition } from './Conditions'
import { iterateEffects } from './Game'

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
  if (baseDuration === false) return false;
  return baseDuration * (1 + (boostscaling || 0) * character.current.boosts);
}

export function skillDurationDefault(character, params) {
  return skillDuration(character, params.duration, params.boostscaling)
}

export function isAvailableTarget(G, caster, target, skill) {
  if (target.current.alive === false) return false;
  if (skill.target === 'enemy' || skill.target === 'allenemy') return teamID(G, caster) !== teamID(G, target)
  else if (skill.target === 'ally' || skill.target === 'allally') return teamID(G, caster) === teamID(G, target)
  else if (skill.target === 'self') return caster.current.ID === target.current.ID
  else throw 'Invalid targeting variant'
}

export function dealDamage(G, caster, target, damage) {
  const eventParams = {
    damage: damage
  }
  takeDamage(G, target, eventParams)
  if (caster !== undefined) {
    iterateEffects(caster.current.conditions, 'damageDealt', G, eventParams);
  }
  return eventParams.damage;
}

export function dealDefaultDamage(G, caster, target, params) {
  return dealDamage(G, caster, target, skillValue(caster, params));
}

function takeDamage(G, character, eventParams) {
  iterateEffects(character.current.conditions, 'damageTaken', G, eventParams);
  character.current.health -= eventParams.damage;
  if (character.current.health <= 0) {
    death(G, character);
  }
}

export function receiveHealing(G, character, amount) {
  character.current.health += amount;
  if (character.current.health > character.current.maxHealth) {
    character.current.health = character.current.maxHealth;
  }
}

export function death(G, character) {
  character.current.health = 0;
  character.current.active = false;
  character.current.alive = false;
  G.conditions.forEach((condition, index) => {
    if (condition === undefined || condition === null) return;
    if (condition.characterID === character.current.ID) removeCondition(G, condition);
  })
}

export function teamID(G, character) {
  if (G.teams[0].characters.indexOf(character.current.ID) !== -1) return 0
  else return 1;
}

export function team(G, character) {
  return G.teams[teamID(G, character)];
}

export function enemyTeam(G, character) {
  return G.teams[1 - teamID(G, character)];
}