import { Data } from '../../CharacterDataStructure'
import { valueRender, skillDurationRender, targetRender, changeRender } from '../../Descriptions.js';

Data.descriptionGenerators.ApplyDamageAbsorbingShieldTarget = (character, skill, effect) => {
  return `grant target damage-absorbing shield for ${valueRender(character, effect)} hp ${skillDurationRender(character, effect)} `
}
Data.descriptionGenerators.DamageAbsorbingShield = (character, condition, effect) => {
  return `${Math.round(effect.params.value)} hp`
}
Data.descriptionGenerators.ApplyPercentDamageReduction = (character, skill, effect) => {
  return `reduce damage taken by target by ${Math.abs(effect.params.value * 100)}% ${skillDurationRender(character, effect)}`
}
Data.descriptionGenerators.ApplyBasicCondition = (character, skill, effect) => {
  return `${changeRender(effect.params.value)} ${targetRender(skill, false)}'s ${effect.params.attribute} by ${Math.abs(effect.params.value * 100)}% ${skillDurationRender(character, effect)}`
}
Data.descriptionGenerators.ApplyLifesteal = (character, skill, effect) => {
  return `grants ${targetRender(skill)} ${effect.params.value * 100}% lifesteal ${skillDurationRender(character, effect)}`
}
Data.descriptionGenerators.ApplyStun = (character, skill, effect) => {
  return `stuns ${targetRender(skill)} ${skillDurationRender(character, effect)}`
}