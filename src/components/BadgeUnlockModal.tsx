import { useEffect } from 'react';
import { getBadgeById } from '../data/badges';
import { SFX } from '../hooks/useAudio';

interface Props {
  badgeId: string | null;
  audioEnabled: boolean;
  onClose: () => void;
}

export default function BadgeUnlockModal({ badgeId, audioEnabled, onClose }: Props) {
  const badge = badgeId ? getBadgeById(badgeId) : null;

  useEffect(() => {
    if (badge && audioEnabled) {
      SFX.badge();
    }
  }, [badge, audioEnabled]);

  useEffect(() => {
    if (!badge) return;
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [badge, onClose]);

  if (!badge) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Badge unlocked: ${badge.label}`}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative z-10 animate-bounce-in px-8 py-8 rounded-3xl text-center max-w-sm w-full mx-4"
        style={{
          background: `linear-gradient(135deg, rgba(17,21,64,0.98) 0%, rgba(26,32,64,0.98) 100%)`,
          border: `2px solid ${badge.color}`,
          boxShadow: `0 0 40px ${badge.color}60, 0 0 80px ${badge.color}20`,
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Glow ring */}
        <div
          className="absolute inset-0 rounded-3xl opacity-10"
          style={{ background: `radial-gradient(ellipse at 50% 30%, ${badge.color} 0%, transparent 70%)` }}
        />

        <div className="relative">
          {/* Badge icon */}
          <div
            className="badge-unlock-icon mx-auto mb-4 w-24 h-24 rounded-full flex items-center justify-center text-5xl"
            style={{
              background: `radial-gradient(circle, ${badge.color}30 0%, ${badge.color}10 60%, transparent 100%)`,
              border: `3px solid ${badge.color}`,
              boxShadow: `0 0 30px ${badge.color}80`,
            }}
          >
            {badge.icon}
          </div>

          {/* Header */}
          <div
            className="font-mono text-xs font-bold uppercase tracking-widest mb-2"
            style={{ color: badge.color }}
          >
            🏅 Badge Unlocked!
          </div>

          {/* Name */}
          <div className="font-display text-xl font-bold text-white mb-2">
            {badge.label}
          </div>

          {/* Description */}
          <p className="text-sm text-[var(--muted-foreground)] font-body leading-relaxed mb-6">
            {badge.description}
          </p>

          {/* Confetti particles */}
          <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
            {Array.from({ length: 12 }, (_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-sm opacity-80"
                style={{
                  left: `${10 + i * 7}%`,
                  top: '-10px',
                  background: [badge.color, '#00FF88', '#FFD700', '#FF3D9A'][i % 4],
                  animation: `confetti-fall ${1.5 + Math.random()}s ease-in ${i * 0.1}s forwards`,
                }}
              />
            ))}
          </div>

          {/* Close hint */}
          <p className="text-xs text-[var(--muted-foreground)] opacity-50">
            Tap anywhere to continue
          </p>
        </div>
      </div>
    </div>
  );
}
