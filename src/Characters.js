const characters = () => {
  let characters = [
    newCharacter('Reimu Hakurei', 'https://en.touhouwiki.net/images/thumb/f/f7/Th175Reimu.png/355px-Th175Reimu.png', 15, 120, 100, [
      newBasicSingleTargetDamageSkill('Hakurei Amulet', 0.8, [newSkillEffect('ATBModifierTarget', {
        value: -150
      })]),
      newSkill('Dream Land "Great Duplex Barrier"', 'ally', 20, [
        newSkillEffect('ApplyDamageAbsorbingShieldTarget', {
          name: 'Great Duplex Barrier',
          scaling: 1.2,
          boostscaling: 0.2,
          duration: 30
        })
      ]),
      newSingleTargetDamageSkill('Fantasy Heaven', 40, 2.5, 0.3)
    ]),
    newCharacter('Marisa Kirisame', 'https://en.touhouwiki.net/images/1/11/Th175Marisa.png', 20, 100, 100, [
      newBasicSingleTargetDamageSkill('Meteonic Debris', 1),
      newSkill('Astrologic Sign "Orreries Sun"', 'ally', 20, [newSkillEffect('ApplyBasicCondition', {
        name: 'Orreries Sun',
        attribute: 'attack',
        value: 0.5,
        boostscaling: 0.2,
        duration: 30
      })]),
      newDamageSkill('Love Sign "Master Spark"', 'allenemy', 50, 0.8, 0.5)
    ]),
    newCharacter('Youmu Konpaku', 'https://en.touhouwiki.net/images/thumb/8/8c/Th17Youmu.png/451px-Th17Youmu.png', 20, 90, 120, [
      newBasicSingleTargetDamageSkill('Transmigration Slash', 0.9, [
        newSkillEffect('Youmu__CloneDamage', {
          scaling: 0.5
        })
      ]),
      newSkill('Soul Sign "Wheel of Pain of the Living and Dead"', 'self', 30, [
        newSkillEffect('Youmu__CreateClone', {
          scaling: 1.2,
          boostscaling: 0.2
        })
      ]),
      newSkill('Human Oni "Slash of the Eternal Future"', 'enemy', 25, [
        newSkillEffect('Youmu__ApplyDelayedDamage', {
          scaling: 2.25,
          boostscaling: 0.2,
          delay: 12
        })
      ])
    ]),
    newCharacter('Remilia Scarlet', 'https://en.touhouwiki.net/images/thumb/e/e7/Th105Remilia.png/413px-Th105Remilia.png', 18, 80, 140, [
      newSkill('Vampire Claw', 'enemy', 0, [
        newSkillEffect('DamageTargetWithLifeSteal', {
          scaling: 0.8,
          boostscaling: 0,
          lifesteal: 0.4
        })]),
      newSkill('Divine Spear "Spear the Gungnir"', 'enemy', 10, [
        newSkillEffect('ExecuteTarget', {
          scaling: 1.3,
          boostscaling: 0.2
        })]),
      newSkill('Destiny "Miserable Fate"', 'enemy', 30, [
        newSkillEffect('ApplyBasicCondition', {
          name: 'Miserable Fate (power)',
          attribute: 'attack',
          value: -0.4,
          boostscaling: 0.2,
          duration: 30
        }),
        newSkillEffect('ApplyBasicCondition', {
          name: 'Miserable Fate (agility)',
          attribute: 'speed',
          value: -0.4,
          boostscaling: 0.2,
          duration: 30
        })])
    ]),
    newCharacter('Flandre Scarlet', 'https://en.touhouwiki.net/images/b/bd/Th06Flandre.png', 25, 140, 75, [
      newBasicSingleTargetDamageSkill('Starbow break', 0.9, [
        newSkillEffect('ApplyBasicCondition', {
          name: 'Starbow break',
          attribute: 'attack',
          value: -0.2,
          boostscaling: 0,
          duration: 20
        })]),
      newSkill('Scarlet Devil Sign "Bloody Catastrophe"', 'self', 20, [
        newSkillEffect('ApplyLifesteal', {
          name: 'Bloody Catastrophe',
          value: 0.6,
          duration: 40,
          boostscaling: 0.2
        })]),
      newSingleTargetDamageSkill('Taboo "Laevatein"', 80, 3, 0.2, [
        newSkillEffect('GainPower', {
          value: 60
        })])
    ]),
    newCharacter('Sakuya Izayoi', 'https://en.touhouwiki.net/images/b/b7/Th105Sakuya.png', 18, 100, 110, [
      newBasicSingleTargetDamageSkill('Magic Star Sword', 0.8, [
        newSkillEffect('ApplyStun', {
          duration: 1.5
        })]),
      newSkill('Time Sign "Private Square"', 'enemy', 20, [
        newSkillEffect('ApplyStun', {
          duration: 12,
          boostscaling: 0.2
        })]),
      newSkill("Sakuya's World", 'self', 30, [
        newSkillEffect('ApplyBasicCondition', {
          name: "Sakuya's World",
          attribute: 'speed',
          value: 9,
          duration: 3,
          boostscaling: 0.2
        })])
    ])
  ]
  characters.forEach((character, index) => {
    character.current.ID = index;
  })
  return characters;
}

function newCharacter(name, img, attack, maxHealth, speed, skills = undefined) {
  let actualSkills = skills === undefined ? [] : skills
  return {
    name: name,
    img: img,
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

function newBasicSingleTargetDamageSkill(name, scaling, effects) {
  return newSingleTargetDamageSkill(name, 0, scaling, 0, effects);
}

function newSingleTargetDamageSkill(name, cost, scaling, boostscaling = 0.2, effects = undefined) {
  return newDamageSkill(name, 'enemy', cost, scaling, boostscaling, effects);
}

function newDamageSkill(name, target, cost, scaling, boostscaling, effects = undefined) {
  const actualEffects = effects === undefined ? [] : effects;
  const damageEffect = newSkillEffect('DamageTarget', {
    scaling: scaling,
    boostscaling: boostscaling
  })
  return newSkill(name, target, cost, [damageEffect, ...actualEffects])
}

function newSkill(name, target, cost, effects = undefined) {
  const actualEffects = effects === undefined ? [] : effects;
  return {
    name: name,
    target: target,
    cost: cost,
    effects: actualEffects
  }
}

export function newSkillEffect(name, params) {
  return {
    name: name,
    params: params
  }
}

export default characters