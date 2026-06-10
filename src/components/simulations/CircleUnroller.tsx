import { useState, useEffect, useRef } from 'react';

export default function CircleUnroller() {
  const [radius, setRadius] = useState(50);
  const [unrolled, setUnrolled] = useState(0);
  const [running, setRunning] = useState(false);
  const animRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const C = 2 * Math.PI * radius;
  const pct = unrolled / C;
  const W = 320, H = 220;
  const CX = 80, CY = 110;

  useEffect(() => {
    if (running && unrolled < C) {
      animRef.current = setTimeout(() => {
        setUnrolled(u => Math.min(u + C / 60, C));
      }, 20);
    } else if (unrolled >= C) {
      setRunning(false);
    }
    return () => { if (animRef.current) clearTimeout(animRef.current); };
  }, [running, unrolled, C]);

  const handleStart = () => {
    setUnrolled(0);
    setRunning(true);
  };

  const handleReset = () => {
    setRunning(false);
    setUnrolled(0);
  };

  // Unrolled line starts at right of circle, goes right
  const lineStartX = CX + radius + 10;
  const lineEndX = lineStartX + unrolled * 1.3;
  const maxLineX = lineStartX + C * 1.3;

  // Circle stroke-dasharray for "unrolling" effect
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - pct);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <p className="font-mono text-xs text-[var(--geo-cyan)] text-center">
        Watch the <span className="text-[var(--geo-magenta)] font-bold">circumference unroll</span> into a straight line = 2πr
      </p>

      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="sim-canvas rounded-xl overflow-visible">
        {/* Circle outline (full) */}
        <circle cx={CX} cy={CY} r={radius} fill="rgba(0,212,255,0.05)" stroke="rgba(0,212,255,0.3)" strokeWidth="2" />
        {/* Unrolling arc */}
        <circle
          cx={CX} cy={CY} r={radius}
          fill="none"
          stroke="var(--geo-magenta)"
          strokeWidth="3.5"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          style={{ transformOrigin: `${CX}px ${CY}px`, transform: 'rotate(-90deg)', transition: 'stroke-dashoffset 0.02s linear' }}
        />
        {/* Radius line */}
        <line x1={CX} y1={CY} x2={CX + radius} y2={CY} stroke="var(--geo-gold)" strokeWidth="2" strokeDasharray="4 3" />
        <text x={CX + radius / 2} y={CY - 7} fill="var(--geo-gold)" fontSize="11" fontFamily="JetBrains Mono" textAnchor="middle">r={radius}</text>

        {/* Unrolled line */}
        {unrolled > 0 && (
          <>
            <line
              x1={lineStartX} y1={CY}
              x2={Math.min(lineEndX, W - 10)} y2={CY}
              stroke="var(--geo-magenta)" strokeWidth="4" strokeLinecap="round"
            />
            <text
              x={(lineStartX + Math.min(lineEndX, W - 10)) / 2}
              y={CY + 20}
              fill="var(--geo-magenta)" fontSize="11" fontFamily="JetBrains Mono" textAnchor="middle"
            >
              {unrolled < C ? `${(unrolled).toFixed(0)}...` : `C = ${C.toFixed(1)}`}
            </text>
          </>
        )}

        {/* Max line indicator */}
        {unrolled >= C && (
          <text x={lineStartX + C * 0.65} y={CY - 12} fill="var(--geo-green)" fontSize="10" fontFamily="JetBrains Mono" textAnchor="middle">
            = 2π×{radius} = {C.toFixed(1)}
          </text>
        )}
      </svg>

      {/* Radius slider */}
      <div className="flex items-center gap-3 w-full max-w-xs">
        <span className="font-mono text-xs text-[var(--muted-foreground)] w-20">r = {radius} px</span>
        <input type="range" min={30} max={70} value={radius}
          onChange={e => { setRadius(+e.target.value); handleReset(); }}
          className="flex-1 accent-[var(--geo-cyan)]" />
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleStart}
          disabled={running}
          className="px-6 py-2.5 rounded-xl font-display text-sm font-bold transition-all hover:scale-105 disabled:opacity-40"
          style={{ background: 'linear-gradient(135deg, var(--geo-magenta), var(--geo-cyan))', color: 'var(--geo-navy)' }}
        >
          ▶ Unroll!
        </button>
        <button
          onClick={handleReset}
          className="px-5 py-2.5 rounded-xl font-body text-sm transition-all hover:scale-105"
          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', color: 'var(--muted-foreground)' }}
        >
          ↺ Reset
        </button>
      </div>

      <div className="formula-card text-xs text-center w-full max-w-xs">
        C = 2πr = 2 × 3.14159… × {radius} = {C.toFixed(2)} units
      </div>
    </div>
  );
}


