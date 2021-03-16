import { Data, newCharacter, newSkill, newSkillEffect, newDamageSkill, newSingleTargetDamageSkill, newBasicSingleTargetDamageSkill } from '../CharacterDataStructure'

Data.characters.push(newCharacter('Sakuya Izayoi', 'https://en.touhouwiki.net/images/b/b7/Th105Sakuya.png', 18, 100, 110, [
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
]))