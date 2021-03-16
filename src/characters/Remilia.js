import { Data, newCharacter, newSkill, newSkillEffect, newDamageSkill, newSingleTargetDamageSkill, newBasicSingleTargetDamageSkill } from '../CharacterDataStructure'

Data.characters.push(newCharacter('Remilia Scarlet', 'https://en.touhouwiki.net/images/thumb/e/e7/Th105Remilia.png/413px-Th105Remilia.png', 18, 80, 140, [
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
]))