import { Data, newCharacter, newSkill, newSkillEffect, newDamageSkill, newSingleTargetDamageSkill, newBasicSingleTargetDamageSkill } from '../CharacterDataStructure'

Data.characters.push(newCharacter('Reimu Hakurei', 'https://en.touhouwiki.net/images/thumb/f/f7/Th175Reimu.png/355px-Th175Reimu.png', 18, 120, 100, [
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
]))