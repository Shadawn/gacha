import { Data } from './CharacterDataStructure'
export function newCondition(name, duration, effects, data) {
  return {
    name: name,
    duration: duration,
    effects: effects || [],
    ID: undefined,
    characterID: undefined,
    time: undefined
  }
}
//Effect types: 'statsCalculation'(G, character, condition, effect) - executes when character stats are calculated. stats are recalculated whenever anything changes.
//'damageTaken'(G, character, condition, effect, eventParams) - executes just before character takes damage. eventParams has 1 property 'damage' that can be changed if damage changes via effect (like shield).
//'damageDealt'(G, character, condition, effect, eventParams) - executes just after character deals damage to enemy. eventParams has 1 property 'damage' that's the same as in 'damageTaken'.
//'conditionEnd'(G, character, condition, effect, eventParams)
//'turnEnd'(G, character, condition, effect) - executes immediately after character turn ends.
//'custom' - does not execute,   
export function newEffect(type, name, params) {
  return {
    type: type,
    name: name,
    params: params
  }
}

export function addCondition(G, character, condition) {
  condition.ID = G.conditions.length;
  condition.time = condition.duration === false ? false : G.time + condition.duration;
  condition.characterID = character.current.ID;
  G.conditions.push(condition);
  character.current.conditions.push(condition.ID);
}

export function removeCondition(G, condition) {
  const character = G.characters[condition.characterID];
  condition.effects.forEach(effect => {
    if (effect.type !== 'conditionEnd') return;
    const skillFunction = Data.functions.conditionEnd[effect.name];
    const eventParams = {};
    skillFunction(G, character, condition, effect, eventParams);
  })
  character.current.conditions.splice(character.current.conditions.indexOf(condition.ID), 1);
  G.conditions[condition.ID] = undefined;
}