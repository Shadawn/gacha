import { Data, newCharacter, newSkill, newSkillEffect, newDamageSkill, newSingleTargetDamageSkill, newBasicSingleTargetDamageSkill } from '../CharacterDataStructure'
import * as SkillFunctions from '../SkillFunctions';
import { newCondition, newEffect, addCondition, removeCondition } from '../Conditions';

Data.characters.push(newCharacter('Erula', 'https://i.imgur.com/bc13Snt.jpeg', 10, 100, 90, [
  newBasicSingleTargetDamageSkill('Poisoned Needle', 0.5, [
    newSkillEffect('Erula__ApplyPoison')
  ]),
  newSkill('Earth Blessing', 'ally', 20, [
    newSkillEffect('HealTarget', {
      scaling: 2,
      boostscaling: 0.2
    })]),
  newSkill("Active Metabolism", 'allally', 30, [
    newSkillEffect('Erula__Cleanse')])
]))

Data.functions.turnEnd.Erula__Poison = (G, character, condition, effect) => {
  SkillFunctions.dealDamage(G, undefined, character, character.base.maxHealth * 0.05);
}

Data.functions.skill.Erula__ApplyPoison = (G, caster, target, params) => {
  const condition = newCondition("Erula's Poison", false, [
    newEffect('turnEnd', 'Erula__Poison', {
      cleanse: true
    }),
  ])
  addCondition(G, target, condition);
}

Data.functions.skill.Erula__Cleanse = (G, caster, target, params) => {
  target.current.conditions.forEach(conditionID => {
    const condition = G.conditions[conditionID];
    const cleanseData = {
      cleanse: false
    }
    condition.effects.forEach(effect => {
      if (effect.params.cleanse === true) cleanseData.cleanse = true;
    })
    if (cleanseData.cleanse) removeCondition(G, condition);
  });

}