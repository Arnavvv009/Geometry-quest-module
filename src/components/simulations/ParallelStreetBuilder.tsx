import { useState, useRef, useCallback } from 'react';

const W = 320, H = 240;
const Y1 = 80, Y2 = 160;

export default function ParallelStreetBuilder() {
  const [transAngle, setTransAngle] = useState(55);
  const [mode, setMode] = useState<'F' | 'Z' | 'C'>('F');
  const svgRef = useRef<SVGSVGElement>(null);
  const dragging = useRef(false);

  const updateAngle = useCallback((cx: number, cy: number) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const dx = cx - rect.left - W / 2;
    const dy = -(cy - rect.top - Y1);
    let deg = Math.round((Math.atan2(dy, dx) * 180) / Math.PI);
    if (deg < 0) deg += 360;
    if (deg > 180) deg = 360 - deg;
    deg = Math.max(15, Math.min(165, deg));
    setTransAngle(deg);
  }, []);

  const onMouseMove = (e: React.MouseEvent) => { if (dragging.current) updateAngle(e.clientX, e.clientY); };
  const onTouchMove = (e: React.TouchEvent) => { e.preventDefault(); if (dragging.current) updateAngle(e.touches[0].clientX, e.touches[0].clientY); };

  const a = transAngle;
  const suppA = 180 - a;

  // Transversal line through X=160
  const slope = Math.tan(((90 - a) * Math.PI) / 180);
  const x1 = W / 2 - (Y1 - 10) / slope;
  const x2 = W / 2 + (Y2 + 30 - Y1) / slope;

  // Intersection points
  const ix1 = W / 2 - (Y1 - Y1) / slope; // = W/2
  const ix2 = W / 2 + (Y2 - Y1) / slope;

  const MODES = [
    { key: 'F' as const, label: 'Corresponding (F)', color: '#00D4FF', desc: `∠F₁ = ∠F₂ = ${a}°` },
    { key: 'Z' as const, label: 'Alternate (Z)', color: '#00FF88', desc: `∠Z₁ = ∠Z₂ = ${a}°` },
    { key: 'C' as const, label: 'Co-interior (C)', color: '#FF3D9A', desc: `∠C₁ + ∠C₂ = ${a}° + ${suppA}° = 180°` },
  ];

  const currentMode = MODES.find(m => m.key === mode)!;

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      {/* Mode tabs */}
      <div className="flex gap-2">
        {MODES.map(m => (
          <button
            key={m.key}
            onClick={() => setMode(m.key)}
            className="px-3 py-1 rounded-lg font-mono text-xs font-bold transition-all"
            style={{
              background: mode === m.key ? `${m.color}25` : 'rgba(255,255,255,0.05)',
              border: `1px solid ${mode === m.key ? m.color : 'rgba(255,255,255,0.1)'}`,
              color: mode === m.key ? m.color : 'var(--muted-foreground)',
            }}
          >
            {m.key}-angles
          </button>
        ))}
      </div>

      <svg
        ref={svgRef}
        width={W} height={H}
        viewBox={`0 0 ${W} ${H}`}
        className="sim-canvas rounded-xl cursor-crosshair touch-none select-none"
        onMouseDown={() => { dragging.current = true; }}
        onMouseUp={() => { dragging.current = false; }}
        onMouseLeave={() => { dragging.current = false; }}
        onMouseMove={onMouseMove}
        onTouchStart={() => { dragging.current = true; }}
        onTouchEnd={() => { dragging.current = false; }}
        onTouchMove={onTouchMove}
      >
        {/* Parallel streets */}
        <line x1={0} y1={Y1} x2={W} y2={Y1} stroke="rgba(0,212,255,0.7)" strokeWidth="3" />
        <line x1={0} y1={Y2} x2={W} y2={Y2} stroke="rgba(0,212,255,0.7)" strokeWidth="3" />
        <text x="6" y={Y1 - 6} fill="rgba(0,212,255,0.7)" fontSize="10" fontFamily="JetBrains Mono">AB</text>
        <text x="6" y={Y2 - 6} fill="rgba(0,212,255,0.7)" fontSize="10" fontFamily="JetBrains Mono">CD</text>
        <text x={W - 30} y={Y1 - 6} fill="rgba(0,212,255,0.5)" fontSize="9">∥</text>

        {/* Transversal */}
        <line x1={x1} y1={10} x2={x2} y2={H - 10} stroke="rgba(255,215,0,0.75)" strokeWidth="3" strokeLinecap="round" />

        {/* Mode-specific highlights */}
        {mode === 'F' && (
          <>
            {/* F-shape: angle above line 1 (right) + angle above line 2 (right) */}
            <text x={ix1 + 10} y={Y1 - 14} fill="#00D4FF" fontSize="14" fontFamily="JetBrains Mono" fontWeight="bold">{a}°</text>
            <text x={ix2 + 10} y={Y2 - 14} fill="#00D4FF" fontSize="14" fontFamily="JetBrains Mono" fontWeight="bold">{a}°</text>
            <text x={W / 2 - 40} y={H - 10} fill="#00D4FF" fontSize="10" fontFamily="JetBrains Mono" fontStyle="italic">F-shape · equal!</text>
          </>
        )}
        {mode === 'Z' && (
          <>
            {/* Z-shape: below line 1 left, above line 2 right */}
            <text x={ix1 - 40} y={Y1 + 20} fill="#00FF88" fontSize="14" fontFamily="JetBrains Mono" fontWeight="bold">{a}°</text>
            <text x={ix2 + 10} y={Y2 - 14} fill="#00FF88" fontSize="14" fontFamily="JetBrains Mono" fontWeight="bold">{a}°</text>
            <text x={W / 2 - 40} y={H - 10} fill="#00FF88" fontSize="10" fontFamily="JetBrains Mono" fontStyle="italic">Z-shape · equal!</text>
          </>
        )}
        {mode === 'C' && (
          <>
            {/* C-shape: below line 1, above line 2 — same side, sum to 180 */}
            <text x={ix1 - 45} y={Y1 + 20} fill="#FF3D9A" fontSize="13" fontFamily="JetBrains Mono" fontWeight="bold">{suppA}°</text>
            <text x={ix2 - 45} y={Y2 - 14} fill="#FF3D9A" fontSize="13" fontFamily="JetBrains Mono" fontWeight="bold">{a}°</text>
            <text x={W / 2 - 55} y={H - 10} fill="#FF3D9A" fontSize="10" fontFamily="JetBrains Mono" fontStyle="italic">C-shape · sum 180°!</text>
          </>
        )}

        {/* Drag handle */}
        <circle cx={x1} cy={10} r="10" fill="var(--geo-gold)" opacity="0.75" />
      </svg>

      <div
        className="w-full max-w-xs p-3 rounded-xl text-center font-mono text-sm font-bold"
        style={{
          background: `${currentMode.color}15`,
          border: `1px solid ${currentMode.color}40`,
          color: currentMode.color,
        }}
      >
        {currentMode.desc}
      </div>

      <div className="formula-card text-xs text-center w-full max-w-xs">
        Drag the transversal · tap tabs to see F, Z, and C-shape rules
      </div>
    </div>
  );
}


