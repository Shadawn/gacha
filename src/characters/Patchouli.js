import { Data, newCharacter, newSkill, newSkillEffect, newDamageSkill, newSingleTargetDamageSkill, newBasicSingleTargetDamageSkill } from '../CharacterDataStructure'

Data.characters.push(newCharacter('Patchouli Knowledge', 'https://en.touhouwiki.net/images/thumb/9/99/Th105Patchouli.png/413px-Th105Patchouli.png', 30, 80, 60, [
  newBasicSingleTargetDamageSkill('Elemental Harvester', 0.7, [
    newSkillEffect('GainPower', {
      value: 40
    })]),
  newSkill('Emerald Megalith', 'self', 30, [
    newSkillEffect('ApplyDamageAbsorbingShieldTarget', {
      name: 'Emerald Megalith',
      scaling: 2,
      boostscaling: 0.4,
      duration: false
    })
  ]),
  newDamageSkill('Royal Flare', 'allenemy', 70, 2, 0.4)
]))