import { Data, newCharacter, newSkill, newSkillEffect, newDamageSkill, newSingleTargetDamageSkill, newBasicSingleTargetDamageSkill } from '../CharacterDataStructure'
import { newCondition, newEffect, addCondition, removeCondition } from '../Conditions'
import * as SkillFunctions from '../SkillFunctions'
import { valueRender, skillDurationRender, targetRender, changeRender } from '../Descriptions';

Data.characters.push(newCharacter('Youmu Konpaku', 'https://en.touhouwiki.net/images/thumb/8/8c/Th17Youmu.png/451px-Th17Youmu.png', 20, 90, 120, [
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
]))

Data.functions.skill.Youmu__CreateClone = (G, caster, target, params) => {
  const condition = newCondition('Wheel of Pain of the Living and Dead', false, [
    newEffect('damageTaken', 'DamageAbsorbingShield', {
      value: SkillFunctions.skillValue(caster, params)
    }),
    newEffect('statsCalculation', 'Youmu__Clone')
  ])
  addCondition(G, caster, condition);
}

Data.functions.statsCalculation.Youmu__Clone = (G, character, condition, effect) => {
  character.current.status.Youmu__Clone = true;
}

Data.functions.skill.Youmu__CloneDamage = (G, caster, target, params) => {
  if (caster.current.status.Youmu__Clone !== true) return;
  SkillFunctions.dealDamage(G, caster, target, params.scaling, 0);
}

Data.functions.skill.Youmu__ApplyDelayedDamage = (G, caster, target, params) => {
  const condition = newCondition('Slash of the Eternal Future', params.delay, [
    newEffect('conditionEnd', 'Youmu__DelayedDamage', {
      targetID: target.current.ID,
      scaling: params.scaling * (1 + params.boostscaling * caster.current.boosts),
    }),
  ])
  addCondition(G, caster, condition);
}

Data.descriptionGenerators.Youmu__CloneDamage = (character, skill, effect) => {
  return `deals extra ${valueRender(character, effect)} extra damage if Youmu has summoned "Wheel of Pain of the Living and Dead"`
}
Data.descriptionGenerators.Youmu__CreateClone = (character, skill, effect) => {
  return `summons spirit clone with ${valueRender(character, effect)} hp. While clone persists Transmigration Slash deals extra damage.`
}
Data.descriptionGenerators.Youmu__ApplyDelayedDamage = (character, skill, effect) => {
  return `after ${effect.params.delay} seconds deals ${valueRender(character, effect)} damage to the target (may change based on the current attack).`
}
Data.descriptionGenerators.Youmu__DelayedDamage = (character, condition, effect) => {
  return `${valueRender(character, effect)} damage`
}

Data.functions.conditionEnd.Youmu__DelayedDamage = (G, character, condition, effect, eventParams) => {
  const target = G.characters[effect.params.targetID];
  SkillFunctions.dealDamage(G, character, target, SkillFunctions.skillValue(character, effect.params));
}