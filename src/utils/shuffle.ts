import type { GeoQuestion } from '../types';

export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function generateUnitQuestions(bank: GeoQuestion[]): GeoQuestion[] {
  const byType: Record<string, GeoQuestion[]> = {};
  bank.forEach(q => {
    if (!byType[q.type]) byType[q.type] = [];
    byType[q.type].push(q);
  });

  const selected = Object.values(byType).flatMap(qs =>
    shuffleArray(qs).slice(0, 10)
  );

  return shuffleArray(selected);
}

export function generateAngleDistractors(correct: number, min = 0, max = 360, count = 3): number[] {
  const offsets = [-10, -5, 5, 10, -15, 15, -20, 20, -30, 30];
  const distractors = new Set<number>();
  let i = 0;
  while (distractors.size < count && i < offsets.length) {
    const d = correct + offsets[i];
    if (d >= min && d <= max && d !== correct) distractors.add(d);
    i++;
  }
  if (distractors.size < count) {
    let fallback = 1;
    while (distractors.size < count) {
      if (fallback !== correct && fallback >= min && fallback <= max) distractors.add(fallback);
      fallback += 7;
    }
  }
  return shuffleArray([correct, ...Array.from(distractors).slice(0, count)]);
}

export function generateAreaDistractors(correct: number, count = 3): number[] {
  const factors = [0.5, 0.75, 1.25, 1.5, 2, 1.33];
  const distractors = new Set<number>();
  factors.forEach(f => {
    const d = parseFloat((correct * f).toFixed(2));
    if (d !== correct && distractors.size < count) distractors.add(d);
  });
  return shuffleArray([correct, ...Array.from(distractors).slice(0, count)]);
}
