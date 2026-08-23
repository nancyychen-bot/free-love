import { MATCHING_CONFIG } from '@/lib/matching-config';

export type ProfileData = {
  userId: string;
  profile: { gender: string; orientation: string; seeking: string[]; radiusMiles: number; locationName: string | null };
  qualities: { quality: string; rank: number }[];
  values: { value: string; rank: number }[];
  lifeAnswers: { prompt: string; answer: string }[];
  dealbreakers: { question: string; answer: string; isDealbreaker: boolean }[];
  physical: { question: string; answer: string; isDealbreaker: boolean }[];
};

export function scoreCompatibility(a: ProfileData, b: ProfileData): number {
  const w = MATCHING_CONFIG.WEIGHTS;

  const valuesScore = scoreRankedOverlap(
    a.values.map(v => ({ item: v.value, rank: v.rank })),
    b.values.map(v => ({ item: v.value, rank: v.rank }))
  );

  // Qualities: A's want vs B's self, and vice versa
  const aWants = a.qualities.filter(q => q.quality.startsWith('want:')).map(q => ({ item: q.quality.replace('want:', ''), rank: q.rank }));
  const bIs = b.qualities.filter(q => q.quality.startsWith('self:')).map(q => ({ item: q.quality.replace('self:', ''), rank: q.rank }));
  const bWants = b.qualities.filter(q => q.quality.startsWith('want:')).map(q => ({ item: q.quality.replace('want:', ''), rank: q.rank }));
  const aIs = a.qualities.filter(q => q.quality.startsWith('self:')).map(q => ({ item: q.quality.replace('self:', ''), rank: q.rank }));
  const qualitiesScore = (scoreRankedMatch(aWants, bIs) + scoreRankedMatch(bWants, aIs)) / 2;

  const lifestyleScore = scoreLifestyle(a.dealbreakers, b.dealbreakers);
  const physicalScore = scorePhysical(a.physical, b.physical);
  const lifeAnswerScore = 0.5; // LLM scoring deferred

  return valuesScore * w.VALUES + qualitiesScore * w.QUALITIES + lifeAnswerScore * w.LIFE_ANSWERS + lifestyleScore * w.LIFESTYLE + physicalScore * w.PHYSICAL;
}

function scoreRankedOverlap(listA: { item: string; rank: number }[], listB: { item: string; rank: number }[]): number {
  if (listA.length === 0) return 0;
  let total = 0;
  for (const a of listA) {
    const b = listB.find(x => x.item === a.item);
    if (b) total += 1 / (1 + Math.abs(a.rank - b.rank));
  }
  return total / listA.length;
}

function scoreRankedMatch(wants: { item: string; rank: number }[], is_: { item: string; rank: number }[]): number {
  if (wants.length === 0) return 0;
  let total = 0;
  for (const w of wants) {
    const match = is_.find(i => i.item === w.item);
    if (match) total += 1 / (1 + Math.abs(w.rank - match.rank));
  }
  return total / wants.length;
}

function scoreLifestyle(basicsA: { question: string; answer: string }[], basicsB: { question: string; answer: string }[]): number {
  const shared = basicsA.filter(a => basicsB.some(b => b.question === a.question));
  if (shared.length === 0) return 0.5;
  let matches = 0;
  const flexible = ['maybe', 'not sure yet', 'open to open', 'somewhere in between', 'i drink socially', 'i smoke sometimes'];
  for (const a of shared) {
    const b = basicsB.find(x => x.question === a.question)!;
    if (a.answer === b.answer) matches += 1;
    else if (flexible.includes(a.answer) || flexible.includes(b.answer)) matches += 0.5;
  }
  return matches / shared.length;
}

function scorePhysical(physA: { question: string; answer: string }[], physB: { question: string; answer: string }[]): number {
  const prefQuestions = ['height_preference', 'body_type_preference', 'hair_color_preference', 'ethnicity_preference', 'fitness_preference'];
  let matches = 0, total = 0;
  for (const pq of prefQuestions) {
    const aboutQ = pq.replace('_preference', '');
    const aPref = physA.find(p => p.question === pq)?.answer;
    const bAbout = physB.find(p => p.question === aboutQ)?.answer;
    const bPref = physB.find(p => p.question === pq)?.answer;
    const aAbout = physA.find(p => p.question === aboutQ)?.answer;
    if (aPref && bAbout) { total++; if (aPref === 'no preference' || aPref.split(', ').some(p => bAbout.toLowerCase().includes(p.toLowerCase()))) matches++; }
    if (bPref && aAbout) { total++; if (bPref === 'no preference' || bPref.split(', ').some(p => aAbout.toLowerCase().includes(p.toLowerCase()))) matches++; }
  }
  return total > 0 ? matches / total : 0.5;
}

export function passesHardFilters(a: ProfileData, b: ProfileData): boolean {
  // Orientation — normalize plural seeking terms to singular gender terms
  const seekingToGender: Record<string, string[]> = {
    'men': ['man'], 'women': ['woman'], 'non-binary people': ['non-binary'],
    'man': ['man'], 'woman': ['woman'], 'non-binary': ['non-binary'],
  };
  const aSeeksB = a.profile.seeking.some(s => {
    const targets = seekingToGender[s.toLowerCase()] || [s.toLowerCase()];
    return targets.some(t => b.profile.gender.toLowerCase() === t);
  });
  const bSeeksA = b.profile.seeking.some(s => {
    const targets = seekingToGender[s.toLowerCase()] || [s.toLowerCase()];
    return targets.some(t => a.profile.gender.toLowerCase() === t);
  });
  if (!aSeeksB || !bSeeksA) return false;

  // Dealbreaker conflicts
  const flexible = ['maybe', 'not sure yet', 'open to open', 'somewhere in between'];
  for (const d of a.dealbreakers.filter(x => x.isDealbreaker)) {
    const other = b.dealbreakers.find(x => x.question === d.question);
    if (other && other.answer !== d.answer && !flexible.includes(other.answer) && !flexible.includes(d.answer)) return false;
  }
  for (const d of b.dealbreakers.filter(x => x.isDealbreaker)) {
    const other = a.dealbreakers.find(x => x.question === d.question);
    if (other && other.answer !== d.answer && !flexible.includes(other.answer) && !flexible.includes(d.answer)) return false;
  }

  // Physical dealbreakers
  for (const p of a.physical.filter(x => x.isDealbreaker && x.question.includes('preference'))) {
    const aboutQ = p.question.replace('_preference', '');
    const bAbout = b.physical.find(x => x.question === aboutQ);
    if (bAbout && p.answer !== 'no preference') {
      const prefs = p.answer.split(', ').map(s => s.toLowerCase());
      if (!prefs.some(pr => bAbout.answer.toLowerCase().includes(pr))) return false;
    }
  }
  for (const p of b.physical.filter(x => x.isDealbreaker && x.question.includes('preference'))) {
    const aboutQ = p.question.replace('_preference', '');
    const aAbout = a.physical.find(x => x.question === aboutQ);
    if (aAbout && p.answer !== 'no preference') {
      const prefs = p.answer.split(', ').map(s => s.toLowerCase());
      if (!prefs.some(pr => aAbout.answer.toLowerCase().includes(pr))) return false;
    }
  }

  return true;
}

export function generateExplanation(a: ProfileData, b: ProfileData, score: number): string {
  const sharedValues = a.values.filter(av => b.values.some(bv => bv.value === av.value)).map(v => v.value);
  const aWants = a.qualities.filter(q => q.quality.startsWith('want:')).map(q => q.quality.replace('want:', ''));
  const bIs = b.qualities.filter(q => q.quality.startsWith('self:')).map(q => q.quality.replace('self:', ''));
  const matched = aWants.filter(w => bIs.includes(w));

  let text = '';
  if (sharedValues.length > 0) text += `You both value ${sharedValues.slice(0, 2).join(' and ')}. `;
  if (matched.length > 0) text += `You're looking for ${matched[0]}, and they describe themselves that way. `;
  const flagged = a.dealbreakers.filter(d => d.isDealbreaker);
  const conflicts = flagged.filter(d => { const o = b.dealbreakers.find(x => x.question === d.question); return o && o.answer !== d.answer; });
  if (conflicts.length === 0 && flagged.length > 0) text += 'Neither of you flagged a dealbreaker the other holds.';
  return text || `Compatibility score: ${(score * 100).toFixed(0)}%.`;
}
