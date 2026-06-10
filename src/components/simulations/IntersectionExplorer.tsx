import { useState, useRef, useCallback } from 'react';

const CX = 160, CY = 130;
const R = 100;

function degToRad(d: number) { return (d * Math.PI) / 180; }

export default function IntersectionExplorer() {
  const [angle, setAngle] = useState(65);
  const svgRef = useRef<SVGSVGElement>(null);
  const dragging = useRef(false);

  const updateAngle = useCallback((cx: number, cy: number) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = cx - rect.left - CX;
    const y = -(cy - rect.top - CY);
    let deg = Math.round((Math.atan2(y, x) * 180) / Math.PI);
    if (deg < 0) deg += 360;
    if (deg > 180) deg = 360 - deg;
    deg = Math.max(10, Math.min(170, deg));
    setAngle(deg);
  }, []);

  const onMouseMove = (e: React.MouseEvent) => { if (dragging.current) updateAngle(e.clientX, e.clientY); };
  const onTouchMove = (e: React.TouchEvent) => { e.preventDefault(); if (dragging.current) updateAngle(e.touches[0].clientX, e.touches[0].clientY); };

  const a1 = angle;
  const a2 = 180 - angle;

  const cos = Math.cos(degToRad(angle));
  const sin = Math.sin(degToRad(angle));

  const p1 = { x: CX + R * cos, y: CY - R * sin };
  const p2 = { x: CX - R * cos, y: CY + R * sin };
  const p3 = { x: CX + R, y: CY };
  const p4 = { x: CX - R, y: CY };

  const arcR = 32;
  const arcPath = (startA: number, endA: number) => {
    const s = { x: CX + arcR * Math.cos(degToRad(startA)), y: CY - arcR * Math.sin(degToRad(startA)) };
    const e = { x: CX + arcR * Math.cos(degToRad(endA)), y: CY - arcR * Math.sin(degToRad(endA)) };
    const span = ((endA - startA) + 360) % 360;
    const large = span > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${arcR} ${arcR} 0 ${large} 0 ${e.x} ${e.y}`;
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <p className="font-mono text-xs text-[var(--geo-cyan)] text-center">
        Drag the <span className="text-[var(--geo-gold)] font-bold">gold line</span> — discover 4 angle relationships
      </p>

      <svg
        ref={svgRef}
        width="320" height="260"
        viewBox="0 0 320 260"
        className="sim-canvas rounded-xl cursor-crosshair touch-none select-none"
        onMouseDown={() => { dragging.current = true; }}
        onMouseUp={() => { dragging.current = false; }}
        onMouseLeave={() => { dragging.current = false; }}
        onMouseMove={onMouseMove}
        onTouchStart={() => { dragging.current = true; }}
        onTouchEnd={() => { dragging.current = false; }}
        onTouchMove={onTouchMove}
      >
        {/* Horizontal line (cyan) */}
        <line x1={p4.x} y1={p4.y} x2={p3.x} y2={p3.y} stroke="rgba(0,212,255,0.7)" strokeWidth="3" strokeLinecap="round" />
        {/* Diagonal line (gold) */}
        <line x1={p2.x} y1={p2.y} x2={p1.x} y2={p1.y} stroke="rgba(255,215,0,0.8)" strokeWidth="3" strokeLinecap="round" />

        {/* Vertex */}
        <circle cx={CX} cy={CY} r="5" fill="white" opacity="0.9" />

        {/* Arc — angle 1 (top, between lines) */}
        <path d={arcPath(0, angle)} fill="rgba(0,212,255,0.15)" stroke="var(--geo-cyan)" strokeWidth="1.5" />
        {/* Arc — angle 2 (left, supplementary) */}
        <path d={arcPath(angle, 180)} fill="rgba(255,61,154,0.15)" stroke="var(--geo-magenta)" strokeWidth="1.5" />
        {/* Arc — angle 3 (bottom, vertically opposite to 1) */}
        <path d={arcPath(180, 180 + angle)} fill="rgba(0,212,255,0.15)" stroke="var(--geo-cyan)" strokeWidth="1.5" />
        {/* Arc — angle 4 (right, supplementary) */}
        <path d={arcPath(180 + angle, 360)} fill="rgba(255,61,154,0.15)" stroke="var(--geo-magenta)" strokeWidth="1.5" />

        {/* Labels */}
        <text x={CX + 50 * Math.cos(degToRad(angle / 2))} y={CY - 50 * Math.sin(degToRad(angle / 2))}
          fill="var(--geo-cyan)" fontSize="13" fontFamily="JetBrains Mono" fontWeight="bold" textAnchor="middle" dominantBaseline="central">
          {a1}°
        </text>
        <text x={CX + 50 * Math.cos(degToRad(angle + a2 / 2))} y={CY - 50 * Math.sin(degToRad(angle + a2 / 2))}
          fill="var(--geo-magenta)" fontSize="13" fontFamily="JetBrains Mono" fontWeight="bold" textAnchor="middle" dominantBaseline="central">
          {a2}°
        </text>
        <text x={CX + 50 * Math.cos(degToRad(180 + angle / 2))} y={CY - 50 * Math.sin(degToRad(180 + angle / 2))}
          fill="var(--geo-cyan)" fontSize="13" fontFamily="JetBrains Mono" fontWeight="bold" textAnchor="middle" dominantBaseline="central">
          {a1}°
        </text>
        <text x={CX + 50 * Math.cos(degToRad(180 + angle + a2 / 2))} y={CY - 50 * Math.sin(degToRad(180 + angle + a2 / 2))}
          fill="var(--geo-magenta)" fontSize="13" fontFamily="JetBrains Mono" fontWeight="bold" textAnchor="middle" dominantBaseline="central">
          {a2}°
        </text>

        {/* Drag handle */}
        <circle cx={p1.x} cy={p1.y} r="10" fill="var(--geo-gold)" opacity="0.75" />
      </svg>

      <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
        <div className="p-3 rounded-xl text-center" style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.3)' }}>
          <div className="font-mono text-sm font-bold text-[var(--geo-cyan)]">{a1}° = {a1}°</div>
          <div className="font-mono text-[10px] text-[var(--muted-foreground)] mt-1">Vertically opposite (equal!)</div>
        </div>
        <div className="p-3 rounded-xl text-center" style={{ background: 'rgba(255,61,154,0.1)', border: '1px solid rgba(255,61,154,0.3)' }}>
          <div className="font-mono text-sm font-bold text-[var(--geo-magenta)]">{a1}° + {a2}° = 180°</div>
          <div className="font-mono text-[10px] text-[var(--muted-foreground)] mt-1">Supplementary (straight line)</div>
        </div>
      </div>

      <div className="formula-card text-xs text-center w-full max-w-xs">
        Vertically opp: ∠1 = ∠3 = {a1}° · Supplementary pairs sum to 180°
      </div>
    </div>
  );
}
