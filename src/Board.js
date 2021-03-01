import React from 'react';
import { skillDamage, skillDuration, skillValue, isAvailableTarget } from './SkillFunctions.js';

function valueRender(character, effect) {
  return `${Math.round(skillValue(character, effect.params))} (${effect.params.scaling * 100}% of Atk${effect.params.boostscaling > 0 ? `, + ${effect.params.boostscaling * 100}% per boost` : ''})`
}
function skillDurationRender(character, effect) {
  return effect.params.duration === undefined ? 'indefinitely' : `for ${Math.round(skillDuration(character, effect.params.duration, effect.params.boostscaling) * 10) / 10} seconds`;
}
function targetRender(skill, the = true) {
  if (skill.target === 'allenemy') return 'all enemies';
  else if (skill.target === 'allally') return 'all allies';
  else return the ? 'the target' : 'target';
}
function changeRender(value) {
  return value > 0 ? 'increases' : 'decreases';
}
const descriptionGenerators = {}
descriptionGenerators.DamageTarget = (character, skill, effect) => {
  return `deals ${valueRender(character, effect)} damage to ${targetRender(skill)}`
}
descriptionGenerators.ATBModifierTarget = (character, skill, effect) => {
  return `changes ${targetRender(skill, false)}'s turn progress by ${effect.params.value / 10}%`
}
descriptionGenerators.ApplyDamageAbsorbingShieldTarget = (character, skill, effect) => {
  return `grant target damage-absorbing shield for ${valueRender(character, effect)} hp ${skillDurationRender(character, effect)} `
}
descriptionGenerators.DamageTargetWithLifeSteal = (character, skill, effect) => {
  return `deals ${valueRender(character, effect)} damage to the target and heals ${character.name} for ${effect.params.lifesteal * 100}% of damage dealt`;
}
descriptionGenerators.ApplyBasicCondition = (character, skill, effect) => {
  return `${changeRender(effect.params.value)} ${targetRender(skill, false)}'s ${effect.params.attribute} by ${Math.abs(effect.params.value * 100)}% ${skillDurationRender(character, effect)}`
}
descriptionGenerators.Youmu__CloneDamage = (character, skill, effect) => {
  return `deals extra ${valueRender(character, effect)} extra damage if Youmu has summoned "Wheel of Pain of the Living and Dead"`
}
descriptionGenerators.Youmu__CreateClone = (character, skill, effect) => {
  return `summons spirit clone with ${valueRender(character, effect)} hp. While clone persists Transmigration Slash deals extra damage.`
}
descriptionGenerators.Youmu__ApplyDelayedDamage = (character, skill, effect) => {
  return `after ${effect.params.delay} seconds deals ${valueRender(character, effect)} damage to the target (may change based on the current attack).`
}
descriptionGenerators.Youmu__DelayedDamage = (character, condition, effect) => {
  return `${valueRender(character, effect)} damage`
}
descriptionGenerators.DamageAbsorbingShield = (character, condition, effect) => {
  return `${Math.round(effect.params.value)} hp`
}
descriptionGenerators.GainPower = (character, skill, effect) => {
  return `gain ${effect.params.value} power`
}
descriptionGenerators.ApplyLifesteal = (character, skill, effect) => {
  return `grants ${targetRender(skill)} ${effect.params.value * 100}% lifesteal ${skillDurationRender(character, effect)}`
}
descriptionGenerators.ApplyStun = (character, skill, effect) => {
  return `stuns ${targetRender(skill)} ${skillDurationRender(character, effect)}`
}
descriptionGenerators.ExecuteTarget = (character, skill, effect) => {
  return `instantly kills ${targetRender(skill)} if it is below ${valueRender(character, effect)} hp`
}

export class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      skillID: undefined
    };
  }

  render() {
    if (this.props.ctx.gameover) return <div>
      <p>{this.props.ctx.gameover.winner !== undefined ? `Player ${this.props.ctx.gameover.winner + 1} wins!` : `Draw!`}</p>
    </div>
    return <div>
      <PlayerBoard board={this} playerID={'0'} />
      {/*<PlayerBoard board={this} playerID={'1'} />*/}
    </div>
  }
}

function PlayerBoard(props) {
  const board = props.board;
  return <div>
    <p>Combat time: {Math.round(board.props.G.time * 100) / 100} s</p>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
      <div>{renderTeam(board, 0)}</div>
      <div>{renderTeam(board, 1)}</div>
    </div>
    <div style={{ display: 'flex' }}>{/*(board.props.ctx.currentPlayer === props.playerID) ? renderSkills(board) : ''*/renderSkills(board)}</div>
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
      return <div key={character.name}>
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
            }).join(' ,')}</p>
          </div>
        </div>
      </div>
    })}
  </div>
}

function isAvailableTargetCurrentSkill(board, target) {
  if (board.state.skillID === undefined) return false;
  const G = board.props.G;
  const activeCharacter = G.characters[G.activeCharacterID];
  return isAvailableTarget(G, activeCharacter, target, activeCharacter.skills[board.state.skillID])
}

function renderSkills(board) {
  const G = board.props.G;
  const activeCharacter = G.characters[G.activeCharacterID];
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
    return <button key={skill.name} onClick={(e) => selectSkill(board, skillID)} style={{
      outline: (skillID === board.state.skillID ? 'solid' : 'none')
    }}>{skill.name + (skill.cost > 0 ? ` (${skill.cost} power)` : '')}</button>
  })
  }
    <p>{description}</p>
  </div>
}



