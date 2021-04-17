import { Data } from './CharacterDataStructure'
import './characters/Marisa'
import './characters/Reimu'
import './characters/Youmu'
import './characters/Remilia'
import './characters/Flandre'
import './characters/Sakuya'
import './characters/Erula'
import './characters/Patchouli'
import './characters/Utsuho'
import './characters/Byakuren'

import './skills/Basic/Basic'
import './skills/Basic/BasicDescriptions'
import './skills/BuffDebuffs/BuffDebuffs'
import './skills/BuffDebuffs/BuffDebuffsDescriptions'

Data.characters.forEach((character, index) => {
  character.ID = index;
})

export default Data
