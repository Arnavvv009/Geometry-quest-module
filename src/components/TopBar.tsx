import type { AppState, UnitKey } from '../types';
import { getGeoRank, getXPRankProgress } from '../utils/scoring';

const UNIT_NAMES: Record<UnitKey, string> = {
  A: 'Lines & Angles',
  B: 'Triangles & Polygons',
  C: 'Mensuration',
};

const PHASE_LABELS = ['Wonder', 'Story', 'Simulate', 'Play', 'Reflect'];
const PHASE_KEYS = ['wonder', 'story', 'simulate', 'play', 'reflect'];

interface Props {
  state: AppState;
  onToggleAudio: () => void;
  onHome: () => void;
}

export default function TopBar({ state, onToggleAudio, onHome }: Props) {
  const rank = getGeoRank(state.xp);
  const rankProgress = getXPRankProgress(state.xp);
  const currentPhaseIdx = PHASE_KEYS.indexOf(state.phase);

  return (
    <div className="topbar z-50 px-3 py-1.5 shrink-0">
      <div className="flex items-center gap-2 max-w-5xl mx-auto h-[52px]">
        {/* Logo */}
        <button
          onClick={onHome}
          className="flex items-center gap-2 group"
          data-testid="button-home"
          aria-label="Go to home"
        >
          <div className="relative w-9 h-9 flex items-center justify-center">
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[var(--geo-cyan)] to-[var(--geo-purple)] opacity-20 group-hover:opacity-40 transition-opacity" />
            <span className="text-2xl relative z-10">⬡</span>
          </div>
          <div className="hidden sm:block">
            <div className="font-display text-xs font-bold text-[var(--geo-cyan)] text-glow-cyan leading-none">GEO</div>
            <div className="font-display text-xs font-bold text-[var(--geo-magenta)] leading-none">QUEST</div>
          </div>
        </button>

        {/* Unit + phase breadcrumb */}
        {state.activeUnit && state.phase !== 'intro' && (
          <div className="flex-1 flex items-center gap-2 min-w-0">
            <span className="hidden sm:inline text-xs text-[var(--geo-cyan)] font-mono font-semibold shrink-0">
              Unit {state.activeUnit}
            </span>
            <span className="hidden sm:inline text-xs text-[var(--muted-foreground)]">·</span>

            {/* Phase progress dots */}
            <div className="flex items-center gap-1.5">
              {PHASE_LABELS.map((label, i) => {
                const phaseKey = PHASE_KEYS[i];
                const isDone = state.phaseComplete[state.activeUnit!]?.[phaseKey];
                const isActive = PHASE_KEYS.indexOf(state.phase) === i;
                return (
                  <div key={label} className="flex items-center">
                    <div
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        isDone
                          ? 'bg-[var(--geo-green)]'
                          : isActive
                          ? 'bg-[var(--geo-cyan)] animate-pulse-cyan'
                          : 'bg-[var(--muted)]'
                      }`}
                      title={label}
                    />
                    {i < PHASE_LABELS.length - 1 && (
                      <div className={`w-4 h-0.5 mx-0.5 ${isDone ? 'bg-[var(--geo-green)] opacity-60' : 'bg-[var(--muted)]'}`} />
                    )}
                  </div>
                );
              })}
            </div>

            <span className="hidden md:inline text-xs text-[var(--muted-foreground)] capitalize truncate">
              {state.phase}
            </span>
          </div>
        )}
        {(!state.activeUnit || state.phase === 'intro') && <div className="flex-1" />}

        {/* XP + Rank */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Streak */}
          {state.streak > 0 && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-[rgba(255,140,66,0.15)] border border-[rgba(255,140,66,0.3)]">
              <span className="streak-flame text-sm">🔥</span>
              <span className="font-mono text-xs font-bold text-[var(--geo-orange)]">{state.streak}</span>
            </div>
          )}

          {/* XP counter */}
          <div className="flex flex-col items-end gap-0.5">
            <div className="flex items-center gap-1">
              <span className="font-mono text-xs font-bold text-[var(--geo-gold)] text-glow-gold">
                {state.xp.toLocaleString()} XP
              </span>
            </div>
            <div className="w-20 h-1 bg-[var(--muted)] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[var(--geo-cyan)] to-[var(--geo-gold)] rounded-full transition-all duration-700"
                style={{ width: `${rankProgress}%` }}
              />
            </div>
          </div>

          {/* Rank badge */}
          <div className="geo-rank-badge hidden sm:flex">
            {rank}
          </div>

          {/* Audio toggle */}
          <button
            onClick={onToggleAudio}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--elevate-1)] transition-colors"
            data-testid="button-toggle-audio"
            aria-label="Toggle audio"
          >
            <span className="text-base">{state.audioEnabled ? '🔊' : '🔇'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}


