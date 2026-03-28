// src/utils/tierMap.js
// Tier assignment based on aura score

import { TIER_THRESHOLDS } from './constants.js';

/**
 * Assigns a tier string based on the user's aura score.
 * @param {number} score - The user's current aura score
 * @returns {string} - The tier name
 */
export function assignTier(score) {
  if (score >= TIER_THRESHOLDS.Apex) return 'Apex';
  if (score >= TIER_THRESHOLDS.Luminary) return 'Luminary';
  if (score >= TIER_THRESHOLDS.Influential) return 'Influential';
  if (score >= TIER_THRESHOLDS.Resonant) return 'Resonant';
  if (score >= TIER_THRESHOLDS.Rising) return 'Rising';
  if (score >= TIER_THRESHOLDS.Spark) return 'Spark';
  return 'Dormant';
}

export default assignTier;
