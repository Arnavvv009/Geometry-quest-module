import { useState, useRef, useCallback } from 'react';

const W = 320, H = 220;

interface Point { x: number; y: number; }

function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)); }

function angleDeg(o: Point, a: Point, b: Point) {
  const v1x = a.x - o.x, v1y = a.y - o.y;
  const v2x = b.x - o.x, v2y = b.y - o.y;
  const dot = v1x * v2x + v1y * v2y;
  const cross = Math.abs(v1x * v2y - v1y * v2x);
  return Math.round(Math.atan2(cross, dot) * 180 / Math.PI);
}

const INITIAL: [Point, Point, Point] = [
  { x: 160, y: 30 },
  { x: 60, y: 190 },
  { x: 260, y: 190 },
];

export default function TriangleAngleProver() {
  const [pts, setPts] = useState<[Point, Point, Point]>(INITIAL);
  const [dragging, setDragging] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const getSVGPos = useCallback((cx: number, cy: number): Point => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    return {
      x: clamp(cx - rect.left, 20, W - 20),
      y: clamp(cy - rect.top, 20, H - 20),
    };
  }, []);

  const onMouseMove = (e: React.MouseEvent) => {
    if (dragging === null) return;
    const pos = getSVGPos(e.clientX, e.clientY);
    setPts(p => p.map((pt, i) => i === dragging ? pos : pt) as [Point, Point, Point]);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (dragging === null) return;
    const pos = getSVGPos(e.touches[0].clientX, e.touches[0].clientY);
    setPts(p => p.map((pt, i) => i === dragging ? pos : pt) as [Point, Point, Point]);
  };

  const [A, B, C] = pts;
  const angA = angleDeg(A, B, C);
  const angB = angleDeg(B, A, C);
  const angC = 180 - angA - angB;
  const sum = angA + angB + Math.max(0, angC);

  const colors = ['var(--geo-cyan)', 'var(--geo-magenta)', 'var(--geo-green)'];
  const labels = ['A', 'B', 'C'];
  const angles = [angA, angB, angC];

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <p className="font-mono text-xs text-[var(--geo-cyan)] text-center">
        Drag any vertex — the three angles <span className="text-[var(--geo-gold)] font-bold">always sum to 180°</span>
      </p>

      <svg
        ref={svgRef}
        width={W} height={H}
        viewBox={`0 0 ${W} ${H}`}
        className="sim-canvas rounded-xl cursor-grab active:cursor-grabbing touch-none select-none"
        onMouseMove={onMouseMove}
        onMouseUp={() => setDragging(null)}
        onMouseLeave={() => setDragging(null)}
        onTouchMove={onTouchMove}
        onTouchEnd={() => setDragging(null)}
      >
        {/* Triangle fill */}
        <polygon
          points={pts.map(p => `${p.x},${p.y}`).join(' ')}
          fill="rgba(255,61,154,0.08)"
          stroke="var(--geo-magenta)"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Vertices */}
        {pts.map((p, i) => (
          <g key={i}>
            <circle
              cx={p.x} cy={p.y} r="14"
              fill={colors[i]}
              opacity="0.2"
              onMouseDown={() => setDragging(i)}
              onTouchStart={() => setDragging(i)}
              style={{ cursor: 'grab' }}
            />
            <circle
              cx={p.x} cy={p.y} r="8"
              fill={colors[i]}
              onMouseDown={() => setDragging(i)}
              onTouchStart={() => setDragging(i)}
              style={{ cursor: 'grab' }}
            />
            <text
              x={p.x + (p.x < W / 2 ? -22 : 14)}
              y={p.y + (p.y < H / 2 ? -10 : 18)}
              fill={colors[i]}
              fontSize="13"
              fontFamily="JetBrains Mono"
              fontWeight="bold"
            >
              {labels[i]}={angles[i]}°
            </text>
          </g>
        ))}

        {/* Sum label */}
        <text x={W / 2} y={H - 10} fill="rgba(255,215,0,0.8)" fontSize="12" fontFamily="JetBrains Mono" textAnchor="middle">
          {angA}° + {angB}° + {angC}° = {sum}°
        </text>
      </svg>

      <div
        className="flex items-center gap-3 px-5 py-2.5 rounded-full font-display text-base font-bold"
        style={{
          background: sum === 180 ? 'rgba(0,255,136,0.15)' : 'rgba(255,61,154,0.15)',
          border: `1.5px solid ${sum === 180 ? 'rgba(0,255,136,0.4)' : 'rgba(255,61,154,0.4)'}`,
          color: sum === 180 ? 'var(--geo-green)' : 'var(--geo-magenta)',
        }}
      >
        {angA}° + {angB}° + {angC}° = <span className="ml-2 text-xl">{sum}°</span>
        {sum === 180 && <span className="ml-2 text-sm">✓ Always!</span>}
      </div>

      <div className="formula-card text-xs text-center w-full max-w-xs">
        ∠A + ∠B + ∠C = 180° — this is true for EVERY triangle ever drawn
      </div>
    </div>
  );
}
