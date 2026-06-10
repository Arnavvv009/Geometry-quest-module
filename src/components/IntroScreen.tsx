import { useState, useEffect } from 'react';
import type { AppState, UnitKey } from '../types';
import { BADGES } from '../data/badges';
import { getGeoRank } from '../utils/scoring';
import { useAudio } from '../hooks/useAudio';
import { introNarration } from '../utils/narration';

interface Props {
  state: AppState;
  onSelectUnit: (unit: UnitKey) => void;
  onOpenBadges: () => void;
  onReset: () => void;
}

const UNITS: Array<{
  key: UnitKey;
  title: string;
  subtitle: string;
  emoji: string;
  color: string;
  accentColor: string;
  gradient: string;
  concepts: string[];
  simStations: string[];
}> = [
  {
    key: 'A',
    title: 'Lines & Angles',
    subtitle: 'Master the language of geometry',
    emoji: '📐',
    color: '#00D4FF',
    accentColor: '#9B59F5',
    gradient: 'from-[#00D4FF20] to-[#9B59F510]',
    concepts: ['Complementary', 'Supplementary', 'Vertically Opposite', 'Parallel Lines'],
    simStations: ['Angle Sculptor', 'Intersection Explorer', 'Parallel Street Builder'],
  },
  {
    key: 'B',
    title: 'Triangles & Polygons',
    subtitle: 'Conquer shapes and congruence',
    emoji: '🔷',
    color: '#FF3D9A',
    accentColor: '#FF8C42',
    gradient: 'from-[#FF3D9A20] to-[#FF8C4210]',
    concepts: ['Triangle Angles', 'Congruence (SSS, SAS, ASA)', 'Isosceles', 'Polygon Angles'],
    simStations: ['Triangle Angle Prover', 'Congruence Matcher', 'Polygon Builder'],
  },
  {
    key: 'C',
    title: 'Mensuration',
    subtitle: 'Measure the world around you',
    emoji: '🌊',
    color: '#00FF88',
    accentColor: '#FFD700',
    gradient: 'from-[#00FF8820] to-[#FFD70010]',
    concepts: ['Area & Perimeter', 'Circles & Sectors', 'Volume of Prisms', 'Surface Area'],
    simStations: ['Area Painter', 'Circle Unroller', 'Volume Filler'],
  },
];

export default function IntroScreen({ state, onSelectUnit, onOpenBadges, onReset }: Props) {
  const [hoveredUnit, setHoveredUnit] = useState<UnitKey | null>(null);
  const { narrate, stopSpeech } = useAudio(state.audioEnabled);

  // Narrate intro when the screen mounts
  useEffect(() => {
    narrate(introNarration());
    return () => stopSpeech();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getUnitProgress = (key: UnitKey) => {
    const phases = state.phaseComplete[key];
    const done = Object.values(phases).filter(Boolean).length;
    return { done, total: 5 };
  };

  const totalWorldsCompleted = Object.values(state.worldScores).flat().filter(s => s !== null).length;
  const totalBadges = state.badges.length;

  return (
    <div className="h-full flex flex-col px-4 pt-2 pb-2 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-2 animate-slide-up shrink-0">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[rgba(0,212,255,0.1)] border border-[rgba(0,212,255,0.3)] mb-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--geo-green)] animate-pulse-green" />
          <span className="font-mono text-xs font-bold text-[var(--geo-cyan)]">Singapore MOE Curriculum · Grade 7</span>
        </div>

        <h1 className="font-display text-3xl font-black leading-none mb-1">
          <span className="text-glow-cyan" style={{ color: 'var(--geo-cyan)' }}>GEO</span>
          <span className="text-white">METRY</span>
        </h1>
        <p className="font-body text-sm font-semibold text-[var(--muted-foreground)] mb-4">
          3 Units · 300 Questions · Endless Discovery 🌟
        </p>

        {/* Stats row */}
        <div className="flex items-center justify-center gap-3 mb-1">
          {[
            { label: 'XP', val: state.xp.toLocaleString(), color: 'var(--geo-gold)' },
            { label: 'Worlds', val: String(totalWorldsCompleted), color: 'var(--geo-cyan)' },
            { label: 'Badges', val: String(totalBadges), color: 'var(--geo-magenta)' },
            { label: 'Rank', val: getGeoRank(state.xp), color: 'white' },
          ].map((s, i, arr) => (
            <div key={s.label} className="flex items-center gap-3">
              <div className="text-center">
                <div className="font-display text-base font-extrabold truncate max-w-[100px]" style={{ color: s.color }}>{s.val}</div>
                <div className="font-mono text-xs text-[var(--muted-foreground)]">{s.label}</div>
              </div>
              {i < arr.length - 1 && <div className="w-px h-6 bg-[var(--muted)]" />}
            </div>
          ))}
        </div>
      </div>

      {/* Unit Cards — equal-height grid, no stretch gap */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-2 shrink-0 mt-4">
        {UNITS.map((unit, idx) => {
          const prog = getUnitProgress(unit.key);
          const isHovered = hoveredUnit === unit.key;
          const worldsDone = state.worldScores[unit.key].filter(s => s !== null).length;
          const simsDone = state.simStationsComplete[unit.key].filter(Boolean).length;
          const avgScore = worldsDone > 0
            ? Math.round(state.worldScores[unit.key].filter(s => s !== null).reduce((a, b) => a + (b || 0), 0) / worldsDone * 10)
            : 0;

          return (
            <button
              key={unit.key}
              className="unit-card animate-slide-up text-left w-full"
              style={{
                animationDelay: `${idx * 100}ms`,
                background: `linear-gradient(135deg, rgba(17,21,64,0.95) 0%, rgba(26,32,64,0.9) 100%)`,
                border: `1.5px solid ${isHovered ? unit.color : 'rgba(255,255,255,0.08)'}`,
                boxShadow: isHovered ? `0 0 30px ${unit.color}30, 0 8px 32px rgba(0,0,0,0.4)` : '0 4px 16px rgba(0,0,0,0.3)',
              }}
              onMouseEnter={() => setHoveredUnit(unit.key)}
              onMouseLeave={() => setHoveredUnit(null)}
              onClick={() => onSelectUnit(unit.key)}
              data-testid={`button-unit-${unit.key}`}
            >
              <div
                className="absolute inset-x-0 top-0 h-1 rounded-t-3xl transition-opacity duration-300"
                style={{ background: `linear-gradient(90deg, ${unit.color}, ${unit.accentColor})`, opacity: isHovered ? 1 : 0.5 }}
              />
              <div className="p-4 flex flex-col">
                {/* Header */}
                <div className="flex items-start justify-between mb-2">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl shrink-0"
                    style={{ background: `${unit.color}15`, border: `1.5px solid ${unit.color}40` }}>
                    {unit.emoji}
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-sm font-extrabold" style={{ color: unit.color }}>UNIT {unit.key}</div>
                    <div className="font-mono text-xs text-[var(--muted-foreground)]">{prog.done}/{prog.total} phases</div>
                  </div>
                </div>

                <div className="font-display text-base font-extrabold text-white mb-0.5">{unit.title}</div>
                <div className="font-body text-sm text-[var(--muted-foreground)] mb-2">{unit.subtitle}</div>

                {/* Concepts */}
                <div className="flex flex-wrap gap-1 mb-2">
                  {unit.concepts.slice(0, 3).map(c => (
                    <span key={c} className="font-mono text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ background: `${unit.color}18`, color: unit.color, border: `1px solid ${unit.color}35` }}>
                      {c}
                    </span>
                  ))}
                </div>

                {/* Progress bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs font-semibold text-[var(--muted-foreground)] mb-1">
                    <span>Progress</span><span>{Math.round((prog.done / prog.total) * 100)}%</span>
                  </div>
                  <div className="h-1.5 bg-[var(--muted)] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${(prog.done / prog.total) * 100}%`, background: `linear-gradient(90deg, ${unit.color}, ${unit.accentColor})` }} />
                  </div>
                </div>

                {/* Stats — directly below progress, no auto margin */}
                <div className="grid grid-cols-3 gap-1.5 mb-3">
                  {[
                    { label: 'Worlds', val: `${worldsDone}/10` },
                    { label: 'Sims', val: `${simsDone}/3` },
                    { label: 'Avg', val: worldsDone > 0 ? `${avgScore}%` : '—' },
                  ].map(s => (
                    <div key={s.label} className="text-center p-1.5 rounded-lg" style={{ background: `${unit.color}10` }}>
                      <div className="font-mono text-sm font-extrabold text-white">{s.val}</div>
                      <div className="font-mono text-xs text-[var(--muted-foreground)]">{s.label}</div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-end gap-1">
                  <span className="font-body text-sm font-bold" style={{ color: unit.color }}>
                    {prog.done === 0 ? 'Begin Mission' : prog.done === 5 ? 'Replay' : 'Continue'}
                  </span>
                  <span className="text-base font-bold" style={{ color: unit.color }}>→</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom row — badges & reset */}
      <div className="flex items-center justify-center gap-3 shrink-0">
        <button onClick={onOpenBadges}
          className="flex items-center gap-2 px-5 py-2 rounded-full font-body text-sm font-bold transition-all hover:scale-105"
          style={{ background: 'rgba(255,215,0,0.1)', border: '1.5px solid rgba(255,215,0,0.3)', color: 'var(--geo-gold)' }}
          data-testid="button-view-badges">
          🏅 Badges ({state.badges.length}/{BADGES.length})
        </button>
        <button onClick={onReset}
          className="flex items-center gap-2 px-5 py-2 rounded-full font-body text-sm font-semibold transition-all hover:scale-105"
          style={{ background: 'rgba(255,107,107,0.08)', border: '1.5px solid rgba(255,107,107,0.2)', color: 'var(--destructive-foreground)' }}
          data-testid="button-reset-progress">
          ↺ Reset
        </button>
      </div>
    </div>
  );
}


