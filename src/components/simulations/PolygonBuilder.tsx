import { useState } from 'react';

const W = 320, H = 200, CX = 160, CY = 100, R = 78;

function polyPoints(n: number): string {
  return Array.from({ length: n }, (_, i) => {
    const ang = (i * 2 * Math.PI) / n - Math.PI / 2;
    return `${CX + R * Math.cos(ang)},${CY + R * Math.sin(ang)}`;
  }).join(' ');
}

const POLY_NAMES: Record<number, string> = {
  3: 'Triangle', 4: 'Square', 5: 'Pentagon',
  6: 'Hexagon', 7: 'Heptagon', 8: 'Octagon',
  9: 'Nonagon', 10: 'Decagon', 12: 'Dodecagon',
};

const UNIT_COLORS = ['#00D4FF', '#FF3D9A', '#00FF88', '#FFD700', '#FF8C42', '#9B59F5', '#FF3D9A'];

export default function PolygonBuilder() {
  const [sides, setSides] = useState(6);

  const angleSum = (sides - 2) * 180;
  const eachAngle = Math.round(angleSum / sides);
  const extAngle = Math.round(360 / sides);
  const color = UNIT_COLORS[(sides - 3) % UNIT_COLORS.length];

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <p className="font-mono text-xs text-[var(--geo-magenta)] text-center">
        Slide to add sides — watch the angle sum grow
      </p>

      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="sim-canvas rounded-xl">
        <polygon
          points={polyPoints(sides)}
          fill={`${color}12`}
          stroke={color}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Angle arcs at each vertex */}
        {Array.from({ length: sides }, (_, i) => {
          const ang = (i * 2 * Math.PI) / sides - Math.PI / 2;
          const vx = CX + R * Math.cos(ang);
          const vy = CY + R * Math.sin(ang);
          return (
            <circle key={i} cx={vx} cy={vy} r="5" fill={color} opacity="0.8" />
          );
        })}
        {/* Label in center */}
        <text x={CX} y={CY - 8} fill="white" fontSize="14" fontFamily="JetBrains Mono" fontWeight="bold" textAnchor="middle">
          {POLY_NAMES[sides] || `${sides}-gon`}
        </text>
        <text x={CX} y={CY + 12} fill={color} fontSize="12" fontFamily="JetBrains Mono" textAnchor="middle">
          {angleSum}°
        </text>
      </svg>

      {/* Slider */}
      <div className="flex items-center gap-3 w-full max-w-xs">
        <span className="font-mono text-xs text-[var(--muted-foreground)]">3</span>
        <input
          type="range" min={3} max={12} value={sides}
          onChange={e => setSides(Number(e.target.value))}
          className="flex-1 accent-[var(--geo-magenta)]"
          data-testid="slider-sides"
        />
        <span className="font-mono text-xs text-[var(--muted-foreground)]">12</span>
      </div>

      <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
        {[
          { label: 'Sides (n)', val: sides, color },
          { label: 'Interior sum', val: `${angleSum}°`, color: 'var(--geo-gold)' },
          { label: 'Each angle', val: `${eachAngle}°`, color: 'var(--geo-cyan)' },
        ].map(s => (
          <div key={s.label} className="text-center p-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <div className="font-mono text-sm font-bold" style={{ color: s.color }}>{s.val}</div>
            <div className="font-mono text-[9px] text-[var(--muted-foreground)] mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="formula-card text-xs text-center w-full max-w-xs">
        Interior sum = ({sides}−2)×180° = {angleSum}° · Each exterior angle = {extAngle}°
      </div>
    </div>
  );
}
