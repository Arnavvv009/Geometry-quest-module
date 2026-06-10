import { useState, useRef, useCallback } from 'react';

const CX = 160, CY = 160, R = 110;

function degToRad(d: number) { return (d * Math.PI) / 180; }
function radToDeg(r: number) { return (r * 180) / Math.PI; }

function rayEnd(angleDeg: number) {
  return {
    x: CX + R * Math.cos(degToRad(angleDeg)),
    y: CY - R * Math.sin(degToRad(angleDeg)),
  };
}

function arcPath(startDeg: number, endDeg: number, r: number) {
  const s = { x: CX + r * Math.cos(degToRad(startDeg)), y: CY - r * Math.sin(degToRad(startDeg)) };
  const e = { x: CX + r * Math.cos(degToRad(endDeg)), y: CY - r * Math.sin(degToRad(endDeg)) };
  let span = endDeg - startDeg;
  if (span < 0) span += 360;
  const large = span > 180 ? 1 : 0;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 0 ${e.x} ${e.y}`;
}

function angleLabel(angle: number) {
  if (Math.abs(angle - 90) < 2) return 'Right angle!';
  if (Math.abs(angle - 0) < 2 || Math.abs(angle - 180) < 2) return 'Straight line';
  if (angle < 90) return `Acute (${angle}°)`;
  return `Obtuse (${angle}°)`;
}

export default function AngleSculptor() {
  const [angleDeg, setAngleDeg] = useState(55);
  const svgRef = useRef<SVGSVGElement>(null);
  const dragging = useRef(false);

  const updateAngle = useCallback((clientX: number, clientY: number) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = clientX - rect.left - CX;
    const y = -(clientY - rect.top - CY);
    let deg = radToDeg(Math.atan2(y, x));
    if (deg < 0) deg += 360;
    if (deg > 180) deg = 180;
    setAngleDeg(Math.round(deg));
  }, []);

  const onMouseMove = (e: React.MouseEvent) => { if (dragging.current) updateAngle(e.clientX, e.clientY); };
  const onTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (dragging.current) updateAngle(e.touches[0].clientX, e.touches[0].clientY);
  };

  const comp = 90 - angleDeg;
  const supp = 180 - angleDeg;
  const baseRay = rayEnd(0);
  const movRay = rayEnd(angleDeg);

  const insight = angleDeg === 90
    ? 'Perfect right angle! Complementary pair with itself.'
    : angleDeg < 90
    ? `Complementary partner: ${comp}° (together = 90°)`
    : `Supplementary partner: ${supp}° (together = 180°)`;

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <p className="font-mono text-xs text-[var(--geo-cyan)] text-center">
        Drag the <span className="text-[var(--geo-magenta)] font-bold">pink ray</span> to sculpt any angle
      </p>

      <svg
        ref={svgRef}
        width="320" height="220"
        viewBox="0 0 320 220"
        className="sim-canvas rounded-xl cursor-crosshair touch-none select-none"
        onMouseDown={() => { dragging.current = true; }}
        onMouseUp={() => { dragging.current = false; }}
        onMouseLeave={() => { dragging.current = false; }}
        onMouseMove={onMouseMove}
        onTouchStart={() => { dragging.current = true; }}
        onTouchEnd={() => { dragging.current = false; }}
        onTouchMove={onTouchMove}
      >
        {/* Base ray (fixed at 0°) */}
        <line x1={CX} y1={CY} x2={baseRay.x} y2={baseRay.y} stroke="rgba(0,212,255,0.7)" strokeWidth="3" strokeLinecap="round" />
        {/* Moving ray */}
        <line x1={CX} y1={CY} x2={movRay.x} y2={movRay.y} stroke="var(--geo-magenta)" strokeWidth="3" strokeLinecap="round" />
        {/* Vertex dot */}
        <circle cx={CX} cy={CY} r="6" fill="white" opacity="0.9" />

        {/* Arc showing the angle */}
        <path d={arcPath(0, angleDeg, 45)} fill="none" stroke="rgba(255,215,0,0.7)" strokeWidth="2.5" />

        {/* Angle label */}
        {angleDeg > 5 && (
          <text
            x={CX + 58 * Math.cos(degToRad(angleDeg / 2))}
            y={CY - 58 * Math.sin(degToRad(angleDeg / 2))}
            fill="var(--geo-gold)"
            fontSize="14"
            fontFamily="JetBrains Mono"
            fontWeight="bold"
            textAnchor="middle"
            dominantBaseline="central"
          >
            {angleDeg}°
          </text>
        )}

        {/* Right-angle box indicator */}
        {Math.abs(angleDeg - 90) < 3 && (
          <rect x={CX + 2} y={CY - 22} width="18" height="18" fill="none" stroke="var(--geo-green)" strokeWidth="2" />
        )}

        {/* Drag handle on moving ray */}
        <circle cx={movRay.x} cy={movRay.y} r="10" fill="var(--geo-magenta)" opacity="0.7" />
        <text x={movRay.x} y={movRay.y + 1} textAnchor="middle" dominantBaseline="central" fill="white" fontSize="10">↔</text>
      </svg>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
        {[
          { label: 'Your angle', val: `${angleDeg}°`, color: 'var(--geo-gold)' },
          { label: 'Complement', val: angleDeg <= 90 ? `${comp}°` : '—', color: 'var(--geo-cyan)' },
          { label: 'Supplement', val: `${supp}°`, color: 'var(--geo-magenta)' },
        ].map(s => (
          <div key={s.label} className="text-center p-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <div className="font-mono text-base font-bold" style={{ color: s.color }}>{s.val}</div>
            <div className="font-mono text-[10px] text-[var(--muted-foreground)]">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="formula-card text-xs text-center w-full max-w-xs">
        {angleLabel(angleDeg)} · {insight}
      </div>
    </div>
  );
}
