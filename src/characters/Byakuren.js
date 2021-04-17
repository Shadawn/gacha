import { Data, newCharacter, newSkill, newSkillEffect, newDamageSkill, newSingleTargetDamageSkill, newBasicSingleTargetDamageSkill } from '../CharacterDataStructure'
import { newCondition, newEffect, addCondition, } from '../Conditions'
import * as SkillFunctions from '../SkillFunctions'
import { valueRender, skillDurationRender, targetRender, changeRender } from '../Descriptions';

Data.characters.push(newCharacter('Byakuren Hijiri', 'https://en.touhouwiki.net/images/thumb/6/6e/Th155Byakuren.png/521px-Th155Byakuren.png', 18, 120, 105, [
  newBasicSingleTargetDamageSkill('Zen Martial Arts', 0.9, [
    newSkillEffect('Byakuren__ApplyZen', {
      name: 'Zen Martial Arts',
      damageReduction: 0.5,
      boostscaling: 0,
      duration: 2
    })]),
  newSkill("Nirvana's Cloudy Way in Purple", 'enemy', 40, [
    newSkillEffect('ApplySilence', {
      duration: 15,
      boostscaling: 0.25
    })]),
  newSkill('Superhuman', 'self', 80, [
    newSkillEffect('Byakuren__ApplySuperhuman', {
      duration: 60,
      attackBuffValue: 1,
      speedBuffValue: 1
    })])
]))

Data.functions.skill.Byakuren__ApplyZen = (G, caster, target, params) => {
  const condition = newCondition(params.name, SkillFunctions.skillDurationDefault(caster, params), [
    newEffect('damageTaken', 'DamageTakenMultiplier', {
      value: -params.damageReduction,
      executionOrder: -100
    })
  ]);
  addCondition(G, caster, condition);
}

Data.functions.skill.Byakuren__ApplySuperhuman = (G, caster, target, params) => {
  const condition = newCondition("Superhuman", SkillFunctions.skillDurationDefault(caster, params), [
    newEffect('statsCalculation', 'AttributeMultiplier', {
      value: params.attackBuffValue,
      attribute: 'attack'
    }),
    newEffect('statsCalculation', 'AttributeMultiplier', {
      value: params.speedBuffValue,
      attribute: 'speed'
    })
  ]);
  addCondition(G, target, condition);
  target.current.progress += 1000;
}

Data.descriptionGenerators.Byakuren__ApplyZen = (character, skill, effect) => {
  return `reduces damage taken by self by ${Math.abs(effect.params.damageReduction * 100)}% ${skillDurationRender(character, effect)}`
}

Data.descriptionGenerators.Byakuren__ApplySuperhuman = (character, skill, effect) => {
  return `${skillDurationRender(character, effect)} increases attack by ${Math.abs(effect.params.attackBuffValue * 100)}% and speed by ${Math.abs(effect.params.speedBuffValue * 100)}%. Grants another turn immediately`
}

