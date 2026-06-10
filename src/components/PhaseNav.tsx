import type { AppState, UnitKey } from '../types';

interface Props {
  state: AppState;
  unit: UnitKey;
  onNavigate: (phase: AppState['phase']) => void;
}

const PHASES: { key: AppState['phase']; label: string; shortLabel: string; icon: string }[] = [
  { key: 'wonder',   label: 'Wonder',   shortLabel: 'Wonder',   icon: '🌟' },
  { key: 'story',    label: 'Story',    shortLabel: 'Story',    icon: '📖' },
  { key: 'simulate', label: 'Simulate', shortLabel: 'Sim',      icon: '⚗️' },
  { key: 'play',     label: 'Play',     shortLabel: 'Play',     icon: '🎮' },
  { key: 'reflect',  label: 'Reflect',  shortLabel: 'Reflect',  icon: '🪞' },
];

const UNIT_ACCENT: Record<UnitKey, string> = {
  A: '#00D4FF',
  B: '#FF3D9A',
  C: '#00FF88',
};

export default function PhaseNav({ state, unit, onNavigate }: Props) {
  const accent = UNIT_ACCENT[unit];
  const currentIdx = PHASES.findIndex(p => p.key === state.phase);
  const phaseComplete = state.phaseComplete[unit];

  return (
    <div className="z-40 w-full shrink-0">
      <div
        className="flex items-center justify-center gap-0 overflow-x-auto scrollbar-hide h-[44px]"
        style={{
          background: 'rgba(10, 14, 39, 0.92)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {PHASES.map((phase, idx) => {
          const isDone      = phaseComplete?.[phase.key] ?? false;
          const isActive    = state.phase === phase.key;
          // Can navigate backward freely; forward only if that phase is complete OR it's already the active one
          const prevIdx     = idx - 1;
          // A phase is reachable if:
          //  - it's to the left of current (backward navigation — always allowed)
          //  - it IS the current phase
          //  - it's to the right AND already completed (re-visit)
          const isReachable = idx <= currentIdx || isDone;
          const isLocked    = !isReachable;

          return (
            <button
              key={phase.key}
              onClick={() => !isLocked && onNavigate(phase.key)}
              disabled={isLocked}
              aria-label={`${phase.label}${isDone ? ' (complete)' : isLocked ? ' (locked)' : ''}`}
              className={`
                relative flex flex-col items-center gap-0.5 px-3 sm:px-5 py-1.5
                font-mono text-[10px] sm:text-xs font-semibold h-full
                transition-all duration-200 select-none shrink-0
                ${isActive
                  ? 'text-white'
                  : isDone
                  ? 'text-[var(--geo-green)] hover:text-white hover:bg-white/5 cursor-pointer'
                  : isLocked
                  ? 'text-[var(--muted-foreground)] opacity-40 cursor-not-allowed'
                  : 'text-[var(--muted-foreground)] hover:text-white hover:bg-white/5 cursor-pointer'
                }
              `}
              style={isActive ? { color: accent } : undefined}
            >
              {/* Active underline */}
              {isActive && (
                <span
                  className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full"
                  style={{ background: accent }}
                />
              )}

              {/* Done check overlay */}
              <span className="relative text-base leading-none">
                {phase.icon}
                {isDone && (
                  <span
                    className="absolute -top-1 -right-1.5 text-[9px] font-bold leading-none"
                    style={{ color: 'var(--geo-green)' }}
                  >
                    ✓
                  </span>
                )}
                {isLocked && (
                  <span className="absolute -top-1 -right-1.5 text-[9px] leading-none opacity-70">
                    🔒
                  </span>
                )}
              </span>

              {/* Label */}
              <span className="hidden xs:inline sm:inline leading-none">
                <span className="sm:hidden">{phase.shortLabel}</span>
                <span className="hidden sm:inline">{phase.label}</span>
              </span>

              {/* Connector line between steps */}
              {idx < PHASES.length - 1 && (
                <span
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-4 opacity-20"
                  style={{ background: 'rgba(255,255,255,0.3)' }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}


