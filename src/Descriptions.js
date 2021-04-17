import { skillDuration, skillValue, isAvailableTarget } from './SkillFunctions.js';
export function valueRender(character, effect) {
  return `${Math.round(skillValue(character, effect.params))} (${effect.params.scaling * 100}% of Atk${effect.params.boostscaling > 0 ? `, + ${effect.params.boostscaling * 100}% per boost` : ''})`
}
export function skillDurationRender(character, effect) {
  return effect.params.duration === undefined ? 'indefinitely' : `for ${Math.round(skillDuration(character, effect.params.duration, effect.params.boostscaling) * 10) / 10} seconds`;
}
export function targetRender(skill, the = true) {
  if (skill.target === 'allenemy') return 'all enemies';
  else if (skill.target === 'allally') return 'all allies';
  else return the ? 'the target' : 'target';
}
export function changeRender(value) {
  return value > 0 ? 'increases' : 'decreases';
}