import { INVALID_MOVE, TurnOrder } from 'boardgame.io/core';
import { isAvailableTarget } from './SkillFunctions';
import { removeCondition } from './Conditions';
import CharacterData from './CharacterData';

function useSkill(G, ctx, skillID, targetID) {
  const caster = G.characters[G.activeCharacterID];
  const skill = caster.skills[skillID];
  if (skill === undefined) return INVALID_MOVE;
  const currentTeamID = parseInt(ctx.currentPlayer);
  const currentTeam = G.teams[currentTeamID];
  const enemyTeamID = 1 - currentTeamID;
  const enemyTeam = G.teams[enemyTeamID];
  if (currentTeam.power < skill.cost) return INVALID_MOVE;
  const targets = [];
  if (skill.target === 'allenemy') {
    enemyTeam.characters.forEach(characterID => {
      let target = G.characters[targetID]
      if (isAvailableTarget(G, caster, target, skill)) targets.push(target);
    })
  } else if (skill.target === 'allally') {
    currentTeam.characters.forEach(characterID => {
      let target = G.characters[targetID]
      if (isAvailableTarget(G, caster, target, skill)) targets.push(target);
    })
  }
  else {
    let target = G.characters[targetID];
    if (isAvailableTarget(G, caster, target, skill)) targets.push(target);
  }
  if (targets.length === 0) return INVALID_MOVE;
  targets.forEach(target => {
    skill.effects.forEach(effect => {
      const skillFunction = CharacterData.functions.skill[effect.name];
      skillFunction(G, caster, target, effect.params);
    });
  })
  recalculateCurrentStats(G);
  if (skill.cost !== 0) {
    caster.current.boosts = 0;
  } else {
    caster.current.boosts++;
  }
  currentTeam.power -= skill.cost
  goToNextCharacter(G, ctx);
}

function selectCharacter(G, ctx, rosterID) {
  const character = Object.assign({}, G.roster[rosterID]);
  character.current.ID = G.characters.length;
  G.characters.push(character);
  G.teams[parseInt(ctx.currentPlayer)].characters.push(character.current.ID);
}

export const Game = {
  name: 'Gensokyo-Battlegrounds',
  setup: () => {
    let G = {
      roster: CharacterData.characters,
      characters: [],
      conditions: [],
      teams: [{
        power: 0,
        characters: []
      },
      {
        power: 0,
        characters: []
      }],
      time: 0,
      activeCharacterID: undefined
    };
    return G;
  },
  turn: {
    order: {
      first: (G, ctx) => parseInt(nextActivePlayer(G))
    }
  },
  phases: {
    characterSelect: {
      moves: { selectCharacter },
      turn: {
        order: TurnOrder.DEFAULT,
        moveLimit: 1
      },
      start: true,
      endIf: G => (G.teams[0].characters.length === 3 && G.teams[1].characters.length === 3),
      next: 'battle',
      onEnd: (G, ctx) => {
        goToNextCharacter(G);
      }
    },
    battle: {
      //this is default phase. No overrides.
    }
  },
  moves: {
    useSkill
  },
  endIf: (G, ctx) => {
    const currentWinner = winner(G);
    if (currentWinner === undefined) return;
    if (currentWinner === null) return {
      draw: true
    }
    else return {
      winner: currentWinner
    }
  },
  minPlayers: 2,
  maxPlayers: 2
};

function goToNextCharacter(G, ctx) {
  if (G.activeCharacterID !== undefined) {
    const activeCharacter = G.characters[G.activeCharacterID];
    iterateEffects(activeCharacter.current.conditions, 'turnEnd', G);
    activeCharacter.current.progress = 0;
    G.activeCharacterID = undefined;
  };
  //Iterate over all characters to find who will do next move and how much time it will take.
  let nextEventData = getNextEventData(G);
  while (nextEventData.type === 'condition') {
    forwardGameTime(G, nextEventData.time);
    removeCondition(G, G.conditions[nextEventData.ID]);
    recalculateCurrentStats(G);
    nextEventData = getNextEventData(G);
  }
  forwardGameTime(G, nextEventData.time);
  G.activeCharacterID = nextEventData.ID;
  G.characters[G.activeCharacterID].progress = 1000;
  if (ctx !== undefined) ctx.events.endTurn({ next: nextActivePlayer(G) });
}

function getNextEventData(G) {
  const nextCharacterTurnData = G.characters.reduce((nextTurnData, character, index) => {
    if (!character.current.active) return nextTurnData;
    const timeUntilTurn = (1000 - character.current.progress) / character.current.speed;
    if (nextTurnData.time <= timeUntilTurn) return nextTurnData;
    return {
      ID: index,
      time: timeUntilTurn,
    }
  }, {
    ID: undefined,
    time: Number.POSITIVE_INFINITY
  });
  const nextConditionChangeData = G.conditions.reduce((nextConditionChangeData, condition, index) => {
    if (condition === undefined || condition === null) return nextConditionChangeData;
    if (condition.time === false) return nextConditionChangeData;
    const timeUntilConditionChange = condition.time - G.time;
    if (nextConditionChangeData.time <= timeUntilConditionChange) return nextConditionChangeData;
    return {
      ID: index,
      time: timeUntilConditionChange
    }
  }, {
    ID: undefined,
    time: Number.POSITIVE_INFINITY
  });
  let eventType, eventData;
  if (nextConditionChangeData.time <= nextCharacterTurnData.time) {
    eventType = 'condition';
    eventData = nextConditionChangeData
  } else {
    eventType = 'character';
    eventData = nextCharacterTurnData
  }
  return {
    type: eventType,
    ID: eventData.ID,
    time: eventData.time
  }
}

function forwardGameTime(G, time) {
  G.time += time;
  G.teams.forEach(team => {
    team.power += time * 3;
  });
  G.characters.forEach(character => {
    if (!character.current.active) return;
    character.current.progress += character.current.speed * time;
    if (character.current.progress > 1000) character.current.progress = 1000;
  });
}

function recalculateCurrentStats(G) {
  G.characters.forEach(character => {
    character.current.attack = character.base.attack;
    character.current.maxHealth = character.base.maxHealth;
    character.current.speed = character.base.speed;
    character.current.status = {};
    character.current.active = character.current.alive;
  })
  iterateEffects(G.conditions, 'statsCalculation', G);
}

function nextActivePlayer(G) {
  return G.teams[0].characters.includes(G.activeCharacterID) ? '0' : '1'
}

function winner(G) {
  if (G.teams[0].characters.length < 3 || G.teams[1].characters.length < 3) return undefined; //character select didn't yet end.
  let player1alive = false;
  G.teams[0].characters.forEach(characterID => {
    const character = G.characters[characterID];
    if (character.current.alive === true) player1alive = true;
  });
  let player2alive = false;
  G.teams[1].characters.forEach(characterID => {
    const character = G.characters[characterID];
    if (character.current.alive === true) player2alive = true;
  });
  if (player1alive && player2alive) return undefined //game continues.
  else if (player1alive && !player2alive) return 0
  else if (!player1alive && player2alive) return 1
  else return null //draw.
}

//This functions iterate all effects of an array of conditions and executes those that have a particular type
export function iterateEffects(conditions, eventType, G, ...params) {
  conditions.forEach(conditionID => {
    const condition = (typeof (conditionID) === 'number') ? G.conditions[conditionID] : conditionID; //Expect conditionID to either be number (ID) or condition object itself.
    if (condition === undefined || condition === null) return; //Array have undefined in expired conditions.
    const character = G.characters[condition.characterID];
    condition.effects.forEach(effect => {
      if (effect.type !== eventType) return;
      const effectFunction = CharacterData.functions[eventType][effect.name];
      effectFunction(G, character, condition, effect, ...params);
    })
  })
}

