export const Data = {
  characters: [],
  functions: {
    skill: {},
    statsCalculation: {},
    damageTaken: {},
    damageDealt: {},
    conditionEnd: {},
    turnStart: {},
    turnEnd: {},
    onTimer: {}
  },
  descriptionGenerators: {}
}

export function newCharacter(name, img, attack, maxHealth, speed, skills = undefined) {
  let actualSkills = skills || []
  return {
    name: name,
    img: img,
    ID: undefined,
    base: {
      attack: attack,
      maxHealth: maxHealth,
      speed: speed
    },
    current: {
      ID: undefined,
      attack: attack,
      maxHealth: maxHealth,
      health: maxHealth,
      speed: speed,
      progress: 0,
      boosts: 0,
      status: {},
      conditions: [],
      active: true,
      alive: true
    },
    skills: actualSkills
  }
}

export function newBasicSingleTargetDamageSkill(name, scaling, effects) {
  return newSingleTargetDamageSkill(name, 0, scaling, 0, effects);
}

export function newSingleTargetDamageSkill(name, cost, scaling, boostscaling = 0.2, effects = undefined) {
  return newDamageSkill(name, 'enemy', cost, scaling, boostscaling, effects);
}

export function newDamageSkill(name, target, cost, scaling, boostscaling, effects = undefined) {
  const actualEffects = effects === undefined ? [] : effects;
  const damageEffect = newSkillEffect('DamageTarget', {
    scaling: scaling,
    boostscaling: boostscaling
  })
  return newSkill(name, target, cost, [damageEffect, ...actualEffects])
}

export function newSkill(name, target, cost, effects = undefined) {
  const actualEffects = effects === undefined ? [] : effects;
  return {
    name: name,
    target: target,
    cost: cost,
    effects: actualEffects,
    current: {
      active: true
    }
  }
}

export function newSkillEffect(name, params) {
  return {
    name: name,
    params: params
  }
}