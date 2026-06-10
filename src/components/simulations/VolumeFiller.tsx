import { useState, useEffect, useRef } from 'react';

export default function VolumeFiller() {
  const [r, setR] = useState(4);
  const [h, setH] = useState(8);
  const [fillLevel, setFillLevel] = useState(0);
  const [filling, setFilling] = useState(false);
  const animRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const V = Math.PI * r * r * h;

  useEffect(() => {
    if (filling && fillLevel < 1) {
      animRef.current = setTimeout(() => {
        setFillLevel(l => Math.min(l + 0.018, 1));
      }, 30);
    } else if (fillLevel >= 1) {
      setFilling(false);
    }
    return () => { if (animRef.current) clearTimeout(animRef.current); };
  }, [filling, fillLevel]);

  const handleFill = () => { setFillLevel(0); setFilling(true); };
  const handleDrain = () => { setFilling(false); setFillLevel(0); };

  // Cylinder visual constants
  const W = 320, H = 230;
  const cylW = Math.min(120, r * 14);
  const maxH = 160;
  const cylH = Math.min(maxH, h * 16);
  const cx = W / 2;
  const top = (H - cylH) / 2;
  const fillH = cylH * fillLevel;
  const fillTop = top + cylH - fillH;
  const fillV = V * fillLevel;

  // Ellipse rx/ry for 3D look
  const eRx = cylW / 2;
  const eRy = 10;

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <p className="font-mono text-xs text-[var(--geo-green)] text-center">
        Adjust <span className="text-[var(--geo-gold)] font-bold">r</span> and{' '}
        <span className="text-[var(--geo-gold)] font-bold">h</span>, then fill to verify V = πr²h
      </p>

      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="sim-canvas rounded-xl">
        {/* Cylinder body */}
        <rect x={cx - eRx} y={top} width={cylW} height={cylH}
          fill="rgba(0,255,136,0.04)" stroke="rgba(0,255,136,0.35)" strokeWidth="2" />
        {/* Bottom ellipse */}
        <ellipse cx={cx} cy={top + cylH} rx={eRx} ry={eRy}
          fill="rgba(0,255,136,0.12)" stroke="rgba(0,255,136,0.5)" strokeWidth="1.5" />
        {/* Top ellipse */}
        <ellipse cx={cx} cy={top} rx={eRx} ry={eRy}
          fill="rgba(0,255,136,0.06)" stroke="rgba(0,255,136,0.3)" strokeWidth="1.5" />

        {/* Water fill */}
        {fillLevel > 0 && (
          <>
            <rect x={cx - eRx + 2} y={fillTop} width={cylW - 4} height={fillH}
              fill="rgba(0,212,255,0.35)" />
            <ellipse cx={cx} cy={fillTop} rx={eRx - 2} ry={eRy - 2}
              fill="rgba(0,212,255,0.5)" />
          </>
        )}

        {/* Radius arrow */}
        <line x1={cx} y1={top + cylH + eRy + 6} x2={cx + eRx} y2={top + cylH + eRy + 6}
          stroke="var(--geo-gold)" strokeWidth="2" markerEnd="url(#ar)" />
        <text x={cx + eRx / 2} y={top + cylH + eRy + 20} fill="var(--geo-gold)" fontSize="11" fontFamily="JetBrains Mono" textAnchor="middle">
          r={r}
        </text>

        {/* Height arrow */}
        <line x1={cx + eRx + 14} y1={top} x2={cx + eRx + 14} y2={top + cylH}
          stroke="var(--geo-magenta)" strokeWidth="2" />
        <text x={cx + eRx + 28} y={top + cylH / 2} fill="var(--geo-magenta)" fontSize="11" fontFamily="JetBrains Mono" dominantBaseline="central">
          h={h}
        </text>

        {/* Volume label inside */}
        <text x={cx} y={top + cylH / 2 - 8} fill="white" fontSize="11" fontFamily="JetBrains Mono" textAnchor="middle" opacity="0.9">
          V = πr²h
        </text>
        <text x={cx} y={top + cylH / 2 + 8} fill="var(--geo-green)" fontSize="12" fontFamily="JetBrains Mono" fontWeight="bold" textAnchor="middle">
          {fillV.toFixed(0)} u³
        </text>

        {fillLevel >= 1 && (
          <text x={cx} y={top - 14} fill="var(--geo-green)" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold" textAnchor="middle">
            Full! {V.toFixed(1)} u³ ✓
          </text>
        )}
      </svg>

      {/* Sliders */}
      <div className="grid grid-cols-1 gap-3 w-full max-w-xs">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-[var(--geo-gold)] w-12">r = {r}</span>
          <input type="range" min={2} max={7} value={r}
            onChange={e => { setR(+e.target.value); handleDrain(); }}
            className="flex-1 accent-[var(--geo-gold)]" />
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-[var(--geo-magenta)] w-12">h = {h}</span>
          <input type="range" min={3} max={12} value={h}
            onChange={e => { setH(+e.target.value); handleDrain(); }}
            className="flex-1 accent-[var(--geo-magenta)]" />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleFill}
          disabled={filling}
          className="px-6 py-2.5 rounded-xl font-display text-sm font-bold transition-all hover:scale-105 disabled:opacity-40"
          style={{ background: 'linear-gradient(135deg, var(--geo-green), var(--geo-cyan))', color: 'var(--geo-navy)' }}
        >
          💧 Fill Cylinder
        </button>
        <button
          onClick={handleDrain}
          className="px-5 py-2.5 rounded-xl font-body text-sm transition-all hover:scale-105"
          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', color: 'var(--muted-foreground)' }}
        >
          ↺ Drain
        </button>
      </div>

      <div className="formula-card text-xs text-center w-full max-w-xs">
        V = π × {r}² × {h} = π × {r * r} × {h} = {V.toFixed(2)} units³
      </div>
    </div>
  );
}


