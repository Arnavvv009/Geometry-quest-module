import { BADGES } from '../../data/badges';
import type { AppState } from '../../types';

interface Props {
  state: AppState;
  onClose: () => void;
}

export default function BadgePanel({ state, onClose }: Props) {
  const unlockedCount = state.badges.length;
  const totalCount = BADGES.length;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-white">Badge Collection</h2>
          <p className="font-mono text-xs text-[var(--muted-foreground)] mt-1">
            {unlockedCount}/{totalCount} unlocked
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-[var(--elevate-1)] transition-colors text-[var(--muted-foreground)] hover:text-white"
          data-testid="button-close-badges"
        >
          ✕
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-[var(--muted)] rounded-full overflow-hidden mb-8">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${(unlockedCount / totalCount) * 100}%`,
            background: 'linear-gradient(90deg, var(--geo-gold), var(--geo-orange))',
          }}
        />
      </div>

      {/* Badge grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {BADGES.map(badge => {
          const isUnlocked = state.badges.includes(badge.id);
          return (
            <div
              key={badge.id}
              className={`badge-card p-4 rounded-2xl ${isUnlocked ? 'unlocked' : 'opacity-40'}`}
              style={{
                background: isUnlocked
                  ? `radial-gradient(ellipse at 30% 30%, ${badge.color}15 0%, rgba(17,21,64,0.9) 100%)`
                  : 'rgba(17,21,64,0.6)',
                border: `1.5px solid ${isUnlocked ? badge.color + '50' : 'rgba(255,255,255,0.07)'}`,
              }}
              data-testid={`badge-${badge.id}`}
            >
              {/* Icon */}
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-3"
                style={{
                  background: isUnlocked ? `${badge.color}20` : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${isUnlocked ? badge.color + '40' : 'rgba(255,255,255,0.08)'}`,
                  filter: isUnlocked ? 'none' : 'grayscale(100%)',
                }}
              >
                {badge.icon}
              </div>

              {/* Info */}
              <div
                className="font-mono text-[10px] font-bold mb-1"
                style={{ color: isUnlocked ? badge.color : 'var(--muted-foreground)' }}
              >
                {isUnlocked ? '✓ UNLOCKED' : '🔒 LOCKED'}
              </div>
              <div className="font-display text-sm font-bold text-white mb-1">
                {badge.label}
              </div>
              <p className="font-body text-xs text-[var(--muted-foreground)] leading-tight">
                {badge.description}
              </p>

              {/* Unit tag */}
              <div
                className="mt-2 inline-flex font-mono text-[9px] px-2 py-0.5 rounded-full"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  color: 'var(--muted-foreground)',
                }}
              >
                {badge.unit === 'all' ? 'ALL UNITS' : `UNIT ${badge.unit}`}
              </div>
            </div>
          );
        })}
      </div>

      {unlockedCount === totalCount && (
        <div
          className="mt-8 p-6 rounded-2xl text-center animate-bounce-in"
          style={{
            background: 'linear-gradient(135deg, rgba(255,215,0,0.15) 0%, rgba(255,140,66,0.1) 100%)',
            border: '2px solid rgba(255,215,0,0.4)',
          }}
        >
          <div className="text-4xl mb-3">👑</div>
          <div className="font-display text-xl font-bold text-[var(--geo-gold)]">
            GeoQuest Legend Achieved!
          </div>
          <p className="font-body text-sm text-[var(--muted-foreground)] mt-2">
            You have unlocked all {totalCount} badges. Truly a Geometry Master!
          </p>
        </div>
      )}
    </div>
  );
}


