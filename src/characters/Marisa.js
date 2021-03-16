import { Data, newCharacter, newSkill, newSkillEffect, newDamageSkill, newSingleTargetDamageSkill, newBasicSingleTargetDamageSkill } from '../CharacterDataStructure'

Data.characters.push(newCharacter('Marisa Kirisame', 'https://en.touhouwiki.net/images/1/11/Th175Marisa.png', 20, 100, 100, [
  newBasicSingleTargetDamageSkill('Meteonic Debris', 1),
  newSkill('Astrologic Sign "Orreries Sun"', 'ally', 20, [newSkillEffect('ApplyBasicCondition', {
    name: 'Orreries Sun',
    attribute: 'attack',
    value: 0.5,
    boostscaling: 0.2,
    duration: 30
  })]),
  newDamageSkill('Love Sign "Master Spark"', 'allenemy', 50, 0.8, 0.5)
]))

