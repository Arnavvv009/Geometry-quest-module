import type { Badge, AppState } from '../types';

export const BADGES: Badge[] = [
  // Unit A
  {
    id: 'angle_ace', unit: 'A', icon: '⬡', color: '#00D4FF',
    label: 'Angle Ace',
    description: 'Complete Wonder & Story phases in Lines & Angles',
    condition: s => s.phaseComplete.A.wonder && s.phaseComplete.A.story,
  },
  {
    id: 'parallel_pioneer', unit: 'A', icon: '∥', color: '#FFD700',
    label: 'Parallel Pioneer',
    description: 'Complete all 3 simulation stations in Lines & Angles',
    condition: s => s.simStationsComplete.A.every(Boolean),
  },
  {
    id: 'angle_architect', unit: 'A', icon: '📐', color: '#00FF88',
    label: 'Angle Architect',
    description: 'Score 80+ total across all worlds in Unit A',
    condition: s => s.worldScores.A.reduce((sum, ws) => sum + (ws || 0), 0) >= 80,
  },
  {
    id: 'perfect_parallel', unit: 'A', icon: '💎', color: '#9B59F5',
    label: 'Perfect Parallel',
    description: 'Score 10/10 in any world of Lines & Angles',
    condition: s => s.worldScores.A.some(ws => ws === 10),
  },
  {
    id: 'streak_geometer', unit: 'A', icon: '🔥', color: '#FF8C42',
    label: 'Streak Geometer',
    description: 'Achieve a streak of 10 correct answers',
    condition: s => s.maxStreak >= 10,
  },
  // Unit B
  {
    id: 'triangle_trailblazer', unit: 'B', icon: '△', color: '#FF3D9A',
    label: 'Triangle Trailblazer',
    description: 'Complete Wonder & Story phases in Triangles & Polygons',
    condition: s => s.phaseComplete.B.wonder && s.phaseComplete.B.story,
  },
  {
    id: 'congruence_captain', unit: 'B', icon: '≅', color: '#00D4FF',
    label: 'Congruence Captain',
    description: 'Complete all 3 simulation stations in Triangles & Polygons',
    condition: s => s.simStationsComplete.B.every(Boolean),
  },
  {
    id: 'polygon_pro', unit: 'B', icon: '⬢', color: '#00FF88',
    label: 'Polygon Pro',
    description: 'Score 80+ total across all worlds in Unit B',
    condition: s => s.worldScores.B.reduce((sum, ws) => sum + (ws || 0), 0) >= 80,
  },
  {
    id: 'triangle_titan', unit: 'B', icon: '🔷', color: '#FFD700',
    label: 'Triangle Titan',
    description: 'Score 10/10 in any world of Triangles & Polygons',
    condition: s => s.worldScores.B.some(ws => ws === 10),
  },
  {
    id: 'congruence_king', unit: 'B', icon: '👑', color: '#FF8C42',
    label: 'Congruence Royalty',
    description: 'Complete the Congruence Matcher station',
    condition: s => s.simStationsComplete.B[1],
  },
  // Unit C
  {
    id: 'mensuration_maverick', unit: 'C', icon: '📏', color: '#9B59F5',
    label: 'Mensuration Maverick',
    description: 'Complete Wonder & Story phases in Mensuration',
    condition: s => s.phaseComplete.C.wonder && s.phaseComplete.C.story,
  },
  {
    id: 'volume_victor', unit: 'C', icon: '🧊', color: '#00D4FF',
    label: 'Volume Victor',
    description: 'Complete all 3 simulation stations in Mensuration',
    condition: s => s.simStationsComplete.C.every(Boolean),
  },
  {
    id: 'area_authority', unit: 'C', icon: '📊', color: '#00FF88',
    label: 'Area Authority',
    description: 'Score 80+ total across all worlds in Unit C',
    condition: s => s.worldScores.C.reduce((sum, ws) => sum + (ws || 0), 0) >= 80,
  },
  {
    id: 'perfect_measure', unit: 'C', icon: '🌊', color: '#00D4FF',
    label: 'Perfect Measure',
    description: 'Score 10/10 in any world of Mensuration',
    condition: s => s.worldScores.C.some(ws => ws === 10),
  },
  {
    id: 'real_world_ranger', unit: 'C', icon: '🏗️', color: '#FF8C42',
    label: 'Real World Ranger',
    description: 'Answer 8+ real-world word problems correctly',
    condition: s => (s.realWorldQsCorrect || 0) >= 8,
  },
  // Cross-unit
  {
    id: 'full_geoquest', unit: 'all', icon: '🌟', color: '#FFD700',
    label: 'Full GeoQuest Journey',
    description: 'Complete all 5 phases across all 3 units',
    condition: s => (['A', 'B', 'C'] as const).every(u =>
      Object.values(s.phaseComplete[u]).every(Boolean)
    ),
  },
  {
    id: 'geoquest_legend', unit: 'all', icon: '👑', color: '#FFD700',
    label: 'GeoQuest Legend',
    description: 'Score 80+ in all three units',
    condition: s => (['A', 'B', 'C'] as const).every(u =>
      s.worldScores[u].reduce((sum, ws) => sum + (ws || 0), 0) >= 80
    ),
  },
  {
    id: 'simulation_scientist', unit: 'all', icon: '🎓', color: '#9B59F5',
    label: 'Simulation Scientist',
    description: 'Complete all 9 simulation stations',
    condition: s => (['A', 'B', 'C'] as const).every(u =>
      s.simStationsComplete[u].every(Boolean)
    ),
  },
  {
    id: 'streak_supremacy', unit: 'all', icon: '⚡', color: '#FF8C42',
    label: 'Streak Supremacy',
    description: 'Achieve a streak of 15 correct answers',
    condition: s => s.maxStreak >= 15,
  },
  {
    id: 'perfect_world_3', unit: 'all', icon: '🏅', color: '#FFD700',
    label: 'Perfect World × 3',
    description: 'Score 10/10 in a world from each unit',
    condition: s => (['A', 'B', 'C'] as const).every(u =>
      s.worldScores[u].some(ws => ws === 10)
    ),
  },
];

export function checkBadges(state: AppState): string[] {
  return BADGES
    .filter(b => !state.badges.includes(b.id) && b.condition(state))
    .map(b => b.id);
}

export function getBadgeById(id: string): Badge | undefined {
  return BADGES.find(b => b.id === id);
}
