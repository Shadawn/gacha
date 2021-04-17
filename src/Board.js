import React from 'react';
import { skillDuration, skillValue, isAvailableTarget } from './SkillFunctions.js';
import CharacterData from './CharacterData'
import { valueRender, skillDurationRender, targetRender, changeRender } from './Descriptions.js';

const descriptionGenerators = CharacterData.descriptionGenerators;

export class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      skillID: undefined,
      carouselActiveCharacterID: undefined
    };
  }

  render() {
    if (this.props.ctx.gameover) return <div>
      <p>{this.props.ctx.gameover.winner !== undefined ? `Player ${this.props.ctx.gameover.winner + 1} wins!` : `Draw!`}</p>
    </div>
    return <div>
      <CharacterCarousel board={this} />
      <PlayerBoard board={this} playerID={'0'} />
      {/*<PlayerBoard board={this} playerID={'1'} />*/}
    </div>
  }
}

function selectCharacterCarousel(board, characterID) {
  board.setState({
    carouselActiveCharacterID: characterID
  })
}

function pickCharacterCarousel(board) {
  board.props.moves.selectCharacter(board.state.carouselActiveCharacterID);
  board.setState({
    carouselActiveCharacterID: undefined
  })
}
function CharacterCarousel(props) {
  const board = props.board;
  const G = board.props.G;
  if (board.props.ctx.phase !== 'characterSelect') return null;
  return <div>
    <div style={{
      display: 'flex',
      flexWrap: 'wrap'
    }}>{
        G.roster.map(character => {
          return <div key={character.ID}>
            <img src={character.img} width='100' height='100' style={{
              margin: '5px',
              outline: (character.ID === board.state.carouselActiveCharacterID) ? 'green solid' : 'black solid'
            }} onClick={(e) => selectCharacterCarousel(board, character.ID)}></img>
          </div>
        })}
    </div>
    <button onClick={(e) => pickCharacterCarousel(board)}>Pick this character</button>
  </div>
}

function PlayerBoard(props) {
  const board = props.board;
  return <div>
    <p>Combat time: {Math.round(board.props.G.time * 100) / 100} s</p>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
      <div>{renderTeam(board, 0)}</div>
      {CombatLog(board.props.G.combatLog)}
      <div>{renderTeam(board, 1)}</div>
    </div>
    <div style={{ display: 'flex' }}>{/*(board.props.ctx.currentPlayer === props.playerID) ? renderSkills(board) : ''*/renderSkills(board)}</div>
  </div>
}

function CombatLog(log) {
  return <div>
    <p>Combat log (last actions on top)</p>
    <div style={{
      maxHeight: '400px',
      overflow: 'auto'
    }}>

      {log.map((logEntry, index, array) => <p>{array[array.length - 1 - index]}</p>)}
    </div>
  </div>
}

function selectSkill(board, skillID) {
  board.setState({
    skillID: skillID
  });
}

function useSkill(board, targetCharacterID) {
  if (board.state.skillID === undefined) return;
  board.props.moves.useSkill(board.state.skillID, targetCharacterID);
  board.setState({
    skillID: undefined
  });
}

function renderTeam(board, teamID) {
  const G = board.props.G;
  const team = G.teams[teamID];
  return <div>
    <p>Power: {Math.round(team.power)}</p>
    {team.characters.map((characterID) => {
      const character = G.characters[characterID];
      return <div key={characterID}>
        <div style={{
          display: 'flex',
          outline: (G.activeCharacterID === characterID ? 'solid' : 'none')
        }}>
          <img src={character.img} width='100' height='100' style={{
            outline: (isAvailableTargetCurrentSkill(board, character) ? 'green solid' : 'none')
          }} onClick={(e) => useSkill(board, characterID)}></img>
          <div>
            <p>{character.name}: Attack {Math.round(character.current.attack)} HP {Math.round(character.current.health)}/{character.current.maxHealth} Speed {Math.round(character.current.speed)} Progress {Math.round(character.current.progress)} Boosts {character.current.boosts}</p>
            <p>Conditions: {character.current.conditions.map((conditionID) => {
              const condition = G.conditions[conditionID];
              const effectsDescriptionArray = condition.effects.map(effect => {
                const effectDescriptionGenerator = descriptionGenerators[effect.name];
                if (effectDescriptionGenerator === undefined) return undefined;
                return effectDescriptionGenerator(character, condition, effect)
              })
              effectsDescriptionArray.splice(0, 0, condition.time === false ? undefined : `${Math.round(condition.time - G.time)} s`)
              const effectsDescription = effectsDescriptionArray.filter(description => {
                return description !== undefined
              }).join(', ');
              return `${condition.name}${effectsDescription !== '' ? ' (' + effectsDescription + ')' : ''}`
            }).join(', ')}</p>
          </div>
        </div>
      </div>
    })}
  </div>
}

function isAvailableTargetCurrentSkill(board, target) {
  if (board.state.skillID === undefined) return false;
  const G = board.props.G;
  const activeCharacter = activeCharacterBoard(board);
  if (activeCharacter === undefined) return false;
  return isAvailableTarget(G, activeCharacter, target, activeCharacter.skills[board.state.skillID])
}

function renderSkills(board) {
  const G = board.props.G;
  const activeCharacter = activeCharacterBoard(board);
  if (activeCharacter === undefined) {
    return null;
  }
  let description;
  if (board.state.skillID === undefined) description = null;
  else {
    const activeSkill = activeCharacter.skills[board.state.skillID];
    description = activeSkill.name + ': ' + activeSkill.effects.map(effect => {
      const descriptionGenerator = descriptionGenerators[effect.name];
      if (descriptionGenerator === undefined) return 'No descripton';
      return descriptionGenerator(activeCharacter, activeSkill, effect);
    }).join(' and ');
  }
  return <div>{activeCharacter.skills.map((skill, skillID) => {
    return <button key={skill.name} onClick={(e) => selectSkill(board, skillID)} disabled={!skill.current.active} style={{
      outline: (skillID === board.state.skillID ? 'solid' : 'none')
    }}>{skill.name + (skill.cost > 0 ? ` (${skill.cost} power)` : '')}</button>
  })
  }
    <p>{description}</p>
  </div>
}

function activeCharacterBoard(board) {
  const G = board.props.G;
  if (board.props.ctx.phase === 'characterSelect') {
    if (board.state.carouselActiveCharacterID !== undefined) return G.roster[board.state.carouselActiveCharacterID];
  } else {
    return G.characters[G.activeCharacterID];
  }
}


