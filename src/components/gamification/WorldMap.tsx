import type { UnitKey, AppState } from '../../types';

interface Props {
  unit: UnitKey;
  state: AppState;
  onSelectWorld: (world: number) => void;
  onStartPlay: () => void;
}

const WORLD_NAMES: Record<UnitKey, string[]> = {
  A: [
    'Complementary Cove', 'Supplementary Shore', 'Opposite Ocean', 'Corresponding Cape',
    'Alternate Atoll', 'Co-interior Cay', 'Angle Point', 'Algebraic Archipelago',
    'Equation Isle', 'Word Problem World',
  ],
  B: [
    'Triangle Summit', 'Exterior Peak', 'Isosceles Island', 'SSS Station',
    'SAS Summit', 'ASA/AAS Atoll', 'RHS Ridge', 'Polygon Plains',
    'Regular Region', 'Polygon Word World',
  ],
  C: [
    'Perimeter Port', 'Area Atoll', 'Parallelogram Peak', 'Circle Circumference Cove',
    'Circle Area Cay', 'Composite Coast', 'Volume Prism Point', 'Cylinder Summit',
    'Surface Area Shore', 'Mensuration Mega-World',
  ],
};

const UNIT_COLORS: Record<UnitKey, string> = {
  A: '#00D4FF',
  B: '#FF3D9A',
  C: '#00FF88',
};

function StarRating({ score }: { score: number | null }) {
  const stars = score === null ? 0 : score >= 9 ? 3 : score >= 7 ? 2 : score >= 6 ? 1 : 0;
  return (
    <div className="flex items-center justify-center gap-0.5">
      {[1, 2, 3].map(i => (
        <span key={i} className={`text-xs ${i <= stars ? 'text-[var(--geo-gold)]' : 'text-[var(--muted)]'}`}>
          ★
        </span>
      ))}
    </div>
  );
}

export default function WorldMap({ unit, state, onSelectWorld, onStartPlay }: Props) {
  const color = UNIT_COLORS[unit];
  const worlds = WORLD_NAMES[unit];
  const scores = state.worldScores[unit];

  // Find the first unlocked but not completed world
  const nextWorld = scores.findIndex(s => s === null);
  const allDone = scores.every(s => s !== null);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 font-mono text-xs font-bold"
          style={{ background: `${color}15`, border: `1px solid ${color}40`, color }}
        >
          🗺️ PLAY PHASE · WORLD MAP · Unit {unit}
        </div>
        <h2 className="font-display text-2xl font-bold text-white mb-2">
          Choose Your World
        </h2>
        <p className="font-body text-sm text-[var(--muted-foreground)]">
          Complete 10 questions per world · Score 6+ to unlock the next
        </p>
      </div>

      {/* World grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
        {worlds.map((name, i) => {
          const score = scores[i];
          const isLocked = i > 0 && scores[i - 1] === null;
          const isCompleted = score !== null;
          const isNext = i === nextWorld;
          const isActive = !isLocked;

          return (
            <button
              key={i}
              onClick={() => !isLocked && onSelectWorld(i)}
              disabled={isLocked}
              className={`world-node relative flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all duration-200 ${isLocked ? 'locked opacity-40 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}`}
              style={{
                background: isCompleted
                  ? `${color}20`
                  : isNext
                  ? `rgba(17,21,64,0.9)`
                  : 'rgba(17,21,64,0.6)',
                border: `1.5px solid ${isCompleted ? color : isNext ? `${color}60` : 'rgba(255,255,255,0.08)'}`,
                boxShadow: isNext ? `0 0 16px ${color}30` : isCompleted ? `0 0 8px ${color}20` : 'none',
              }}
              data-testid={`button-world-${i}`}
            >
              {/* World number */}
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center font-display text-sm font-bold"
                style={{
                  background: isCompleted ? `${color}40` : isNext ? `${color}20` : 'rgba(255,255,255,0.06)',
                  color: isCompleted ? color : isNext ? color : 'var(--muted-foreground)',
                }}
              >
                {isLocked ? '🔒' : isCompleted ? '✓' : i + 1}
              </div>

              {/* Stars */}
              <StarRating score={score} />

              {/* Score */}
              {isCompleted && (
                <div className="font-mono text-[10px]" style={{ color }}>
                  {score}/10
                </div>
              )}

              {/* Name truncated */}
              <div className="font-body text-[10px] text-center text-[var(--muted-foreground)] leading-tight line-clamp-2">
                {name.split(' ').slice(0, 2).join(' ')}
              </div>

              {/* Active pulse */}
              {isNext && !isLocked && (
                <div
                  className="absolute inset-0 rounded-2xl animate-pulse opacity-20"
                  style={{ background: color }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Summary */}
      <div
        className="rounded-2xl p-5 mb-6"
        style={{
          background: `${color}10`,
          border: `1px solid ${color}25`,
        }}
      >
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="font-display text-2xl font-bold" style={{ color }}>
              {scores.filter(s => s !== null).length}/10
            </div>
            <div className="font-mono text-xs text-[var(--muted-foreground)]">Worlds Done</div>
          </div>
          <div>
            <div className="font-display text-2xl font-bold text-[var(--geo-gold)]">
              {scores.reduce((sum, s) => sum + (s !== null ? (s >= 9 ? 3 : s >= 7 ? 2 : s >= 6 ? 1 : 0) : 0), 0)}
              <span className="text-lg"> ★</span>
            </div>
            <div className="font-mono text-xs text-[var(--muted-foreground)]">Total Stars</div>
          </div>
          <div>
            <div className="font-display text-2xl font-bold text-white">
              {scores.filter(s => s === 10).length}
            </div>
            <div className="font-mono text-xs text-[var(--muted-foreground)]">Perfect 10s</div>
          </div>
        </div>
      </div>

      {/* Start / Continue CTA */}
      <button
        onClick={onStartPlay}
        className="w-full py-4 rounded-2xl font-display text-base font-bold transition-all duration-200 hover:scale-105"
        style={{
          background: `linear-gradient(135deg, ${color}, ${color}aa)`,
          color: 'var(--geo-navy)',
        }}
        data-testid="button-start-quiz"
      >
        {nextWorld === -1 ? '🔄 Replay Worlds' : `▶ Start World ${nextWorld + 1}: ${worlds[nextWorld]}`}
      </button>
    </div>
  );
}


