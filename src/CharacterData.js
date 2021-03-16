import { Data } from './CharacterDataStructure'
import './characters/Marisa'
import './characters/Reimu'
import './characters/Youmu'
import './characters/Remilia'
import './characters/Flandre'
import './characters/Sakuya'
import './characters/Erula'
import './skills/Basic'
import './skills/BuffDebuffs'

Data.characters.forEach((character, index) => {
  character.ID = index;
})

export default Data
