import type { ProfileData } from './score';

/**
 * LLM-based life answer scoring.
 *
 * This is the plug-in point for AI analysis. It only runs on pairs
 * that have already passed hard filters AND cleared the deterministic
 * scoring floor — so the number of calls is proportional to match
 * volume, not user base size.
 *
 * INPUT:
 *   - Two ProfileData objects, each with lifeAnswers[]
 *     containing { prompt, answer } pairs
 *
 * OUTPUT:
 *   - score: 0-1 representing meaning overlap in their life answers
 *   - explanation: human-readable "why this match?" text, or null
 *     to fall back to the template-based explanation
 *
 * TO IMPLEMENT:
 *   1. Send both users' life answers to a Haiku-class model
 *   2. Prompt: "Score the meaning overlap between these two people's
 *      answers on a scale of 0-1. Consider shared values, compatible
 *      communication styles, and alignment on what they want from life.
 *      Also write a 2-3 sentence explanation of why these two might
 *      work well together."
 *   3. Parse the response and return { score, explanation }
 *
 * COST NOTES:
 *   - With 100 users: ~150 LLM calls per matching cycle
 *   - With 1000 users: ~500-1000 calls (hard filters eliminate most pairs)
 *   - Haiku-class at ~$0.001 per call = $0.15-$1.00 per cycle
 */
export async function scoreLifeAnswersWithLLM(
  a: ProfileData,
  b: ProfileData
): Promise<{ score: number; explanation: string | null }> {
  // STUB: returns a baseline positive score
  // Replace this with actual LLM call when ready
  const bothHaveAnswers = a.lifeAnswers.length > 0 && b.lifeAnswers.length > 0;
  return {
    score: bothHaveAnswers ? 0.65 : 0.4,
    explanation: null,
  };
}
