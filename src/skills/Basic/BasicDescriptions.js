import { Data } from '../../CharacterDataStructure'
import { valueRender, skillDurationRender, targetRender, changeRender } from '../../Descriptions.js';

Data.descriptionGenerators.ATBModifierTarget = (character, skill, effect) => {
  return `changes ${targetRender(skill, false)}'s turn progress by ${effect.params.value / 10}%`
}
Data.descriptionGenerators.DamageTarget = (character, skill, effect) => {
  return `deals ${valueRender(character, effect)} damage to ${targetRender(skill)}`
}
Data.descriptionGenerators.HealTarget = (character, skill, effect) => {
  return `heals ${targetRender(skill)} for ${valueRender(character, effect)} hp`
}
Data.descriptionGenerators.ExecuteTarget = (character, skill, effect) => {
  return `instantly kills ${targetRender(skill)} if it is below ${valueRender(character, effect)} hp`
}
Data.descriptionGenerators.DamageTargetWithLifeSteal = (character, skill, effect) => {
  return `deals ${valueRender(character, effect)} damage to the target and heals ${character.name} for ${effect.params.lifesteal * 100}% of damage dealt`;
}
Data.descriptionGenerators.GainPower = (character, skill, effect) => {
  return `gain ${effect.params.value} power`
}