import { Data } from '../../CharacterDataStructure'
import * as SkillFunctions from '../../SkillFunctions'

Data.functions.skill.ATBModifierTarget = (G, caster, target, params) => {
  target.current.progress += params.value;
  if (target.current.progress < 0) target.current.progress = 0;
}
Data.functions.skill.DamageTarget = (G, caster, target, params) => {
  SkillFunctions.dealDefaultDamage(G, caster, target, params);
}
Data.functions.skill.HealTarget = (G, caster, target, params) => {
  SkillFunctions.receiveHealing(G, target, SkillFunctions.skillValue(caster, params));
}
Data.functions.skill.ExecuteTarget = (G, caster, target, params) => {
  const threshold = SkillFunctions.skillValue(caster, params);
  if (target.current.health < threshold) {
    SkillFunctions.death(G, target);
  }
}
Data.functions.skill.DamageTargetWithLifeSteal = (G, caster, target, params) => {
  const damageDealt = SkillFunctions.dealDefaultDamage(G, caster, target, params);
  SkillFunctions.receiveHealing(G, caster, damageDealt * params.lifesteal);
}
Data.functions.skill.GainPower = (G, caster, target, params) => {
  SkillFunctions.team(G, caster).power += params.value;
}

