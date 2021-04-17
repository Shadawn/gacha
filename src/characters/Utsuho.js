import { Data, newCharacter, newSkill, newSkillEffect, newDamageSkill, newSingleTargetDamageSkill, newBasicSingleTargetDamageSkill } from '../CharacterDataStructure'
import { newCondition, newEffect, addCondition, removeCondition } from '../Conditions'
import * as SkillFunctions from '../SkillFunctions'

Data.characters.push(newCharacter('Utsuho Reiuji', 'https://en.touhouwiki.net/images/2/28/Th123Utsuho.png', 25, 140, 80, [
  newBasicSingleTargetDamageSkill('Radiant Blade', 1.20, [
    newSkillEffect('Utsuho__RecoilDamage', {
      scaling: 0.35
    })
  ]),
  newSkill('Control "Self Tokamak"', 'self', 0, [
    newSkillEffect('Utsuho__SelfTokamak', {
      percentDamage: 0.01,
      powerConversion: 0.2,
      cancelConversion: 0.2,
      interval: 1
    })
  ]),
  newSkill('"Abyss Nova"', 'self', 40, [
    newSkillEffect('Utsuho__AbyssNova', {
      scaling: 1.5,
      boostscaling: 0.1
    })
  ])
]))

Data.functions.skill.Utsuho__RecoilDamage = (G, caster, target, params) => {
  SkillFunctions.dealDefaultDamage(G, caster, caster, params);
}

Data.functions.skill.Utsuho__SelfTokamak = (G, caster, target, params) => {
  let tokamak = undefined;
  target.current.conditions.forEach(conditionID => {
    const condition = G.conditions[conditionID];
    condition.effects.forEach(effect => { if (effect.name === 'Utsuho__SelfTokamak') tokamak = condition })
  }
  );

  if (tokamak === undefined) {
    Utsuho__CreateTokamak(G, caster, params);
  } else {
    removeCondition(G, tokamak);
    SkillFunctions.team(G, target).power += target.current.health * params.cancelConversion;
  }
}

Data.functions.onTimer.Utsuho__SelfTokamak = (G, character, condition, effect) => {
  const damage = character.current.health * effect.params.percentDamage;
  G.characters.forEach(characterTarget => SkillFunctions.dealDamage(G, character, characterTarget, damage));
  SkillFunctions.team(G, character).power += damage * effect.params.powerConversion;
}

Data.functions.skill.Utsuho__AbyssNova = (G, caster, target, params) => {
  const condition = newCondition('Abyss Nova', false, [
    newEffect('turnStart', 'Utsuho__AbyssNovaDamage', {
      scaling: params.scaling,
      boostscaling: params.boostscaling
    }),
  ])
  addCondition(G, caster, condition);
}

Data.functions.turnStart.Utsuho__AbyssNovaDamage = (G, character, condition, effect, eventParams) => {
  const targets = SkillFunctions.enemyTeam(G, character).characters.map(targetID => G.characters[targetID]);
  targets.forEach(target => SkillFunctions.dealDefaultDamage(G, character, target, effect.params));
  removeCondition(G, condition);
}

function Utsuho__CreateTokamak(G, character, params) {
  character.current.status.SelfToakamak = true;
  const condition = newCondition('Control "Self Tokamak"', false, [
    newEffect('onTimer', 'Utsuho__SelfTokamak', params),
  ]);
  addCondition(G, character, condition);
}
