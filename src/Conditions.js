import { Data } from './CharacterDataStructure'
export function newCondition(name, duration, effects, data) {
  let unique;
  if (data === undefined) unique = true
  else unique = data.unique === undefined ? true : data.unique;
  return {
    name: name,
    duration: duration,
    effects: effects || [],
    ID: undefined,
    characterID: undefined,
    time: undefined,
    unique: unique
  }
}
//Effect types: 'statsCalculation'(G, character, condition, effect) - executes when character stats are calculated. stats are recalculated whenever anything changes.
//'damageTaken'(G, character, condition, effect, eventParams) - executes just before character takes damage. eventParams has 1 property 'damage' that can be changed if damage changes via effect (like shield).
//'damageDealt'(G, character, condition, effect, eventParams) - executes just after character deals damage to enemy. eventParams has 1 property 'damage' that's the same as in 'damageTaken'.
//'conditionEnd'(G, character, condition, effect, eventParams)
//'turnStart'(G, character, condition, effect) - executes immediately before character turn begins.
//'turnEnd'(G, character, condition, effect) - executes immediately after character turn ends.
//'custom' - does not execute,
//'onTimer'(G, character, condition, effect) - executes on specified interval.
export function newEffect(type, name, params) {
  return {
    type: type,
    name: name,
    params: params
  }
}

export function addCondition(G, character, condition) {
  if (condition.unique) {
    const existingCondition = character.current.conditions.find(index => {
      return G.conditions[index].name === condition.name
    });
    if (existingCondition !== undefined) {
      removeCondition(G, G.conditions[existingCondition])
    }
  }
  condition.ID = G.conditions.length;
  condition.time = condition.duration === false ? false : G.time + condition.duration;
  condition.characterID = character.current.ID;
  for (const effect of condition.effects) {
    effect.params.time = G.time;
    if (effect.params.executionOrder === undefined) effect.params.executionOrder = 0;
  }
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