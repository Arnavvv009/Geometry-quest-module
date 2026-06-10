export function calcXP(attemptNumber: number, hintsUsed: number, streak: number): number {
  let base: number;
  if (attemptNumber === 1 && hintsUsed === 0) base = 15;
  else if (attemptNumber === 1 && hintsUsed > 0) base = 8;
  else if (attemptNumber === 2) base = 11;
  else base = 5;
  const streakBonus = streak >= 5 ? 5 : 0;
  return base + streakBonus;
}

export const GEO_RANKS = [
  { minXP: 0,    title: 'Angle Apprentice' },
  { minXP: 100,  title: 'Shape Scout'       },
  { minXP: 250,  title: 'Triangle Tactician' },
  { minXP: 500,  title: 'Polygon Protector'  },
  { minXP: 800,  title: 'Mensuration Master' },
  { minXP: 1200, title: 'GeoQuest Legend'   },
];

export const getGeoRank = (xp: number): string => {
  const rank = [...GEO_RANKS].reverse().find(r => xp >= r.minXP);
  return rank ? rank.title : 'Angle Apprentice';
};

export const getNextRank = (xp: number): { title: string; xpNeeded: number } | null => {
  const next = GEO_RANKS.find(r => r.minXP > xp);
  if (!next) return null;
  return { title: next.title, xpNeeded: next.minXP - xp };
};

export const calcStars = (correct: number, total = 10): number => {
  if (correct >= 9) return 3;
  if (correct >= 7) return 2;
  if (correct >= 6) return 1;
  return 0;
};

export const canUnlockWorld = (worldScore: number | null): boolean =>
  worldScore !== null && worldScore >= 6;

export const getXPRankProgress = (xp: number): number => {
  const currentRankIdx = [...GEO_RANKS].reverse().findIndex(r => xp >= r.minXP);
  const currentRank = [...GEO_RANKS].reverse()[currentRankIdx];
  const nextRank = GEO_RANKS.find(r => r.minXP > xp);
  if (!nextRank) return 100;
  const range = nextRank.minXP - currentRank.minXP;
  const progress = xp - currentRank.minXP;
  return Math.min(100, Math.round((progress / range) * 100));
};
