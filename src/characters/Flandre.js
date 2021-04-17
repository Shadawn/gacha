import { Data, newCharacter, newSkill, newSkillEffect, newDamageSkill, newSingleTargetDamageSkill, newBasicSingleTargetDamageSkill } from '../CharacterDataStructure'

Data.characters.push(newCharacter('Flandre Scarlet', 'https://en.touhouwiki.net/images/b/bd/Th06Flandre.png', 25, 140, 75, [
  newBasicSingleTargetDamageSkill('Starbow break', 0.9, [
    newSkillEffect('ApplyBasicCondition', {
      name: 'Starbow break',
      attribute: 'attack',
      value: -0.2,
      boostscaling: 0,
      duration: 10
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
      value: 40
    })])
]))