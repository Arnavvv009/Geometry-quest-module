import { useState } from 'react';

type Shape = 'rectangle' | 'triangle' | 'trapezium';

const GRID = 10;
const CELL = 24;
const W = GRID * CELL;
const H = GRID * CELL;

interface Dims { base: number; height: number; base2?: number; }

function calcArea(shape: Shape, d: Dims) {
  if (shape === 'rectangle') return d.base * d.height;
  if (shape === 'triangle') return (d.base * d.height) / 2;
  return ((d.base + (d.base2 ?? d.base)) / 2) * d.height;
}

function ShapePolygon({ shape, d, color }: { shape: Shape; d: Dims; color: string }) {
  const b = d.base * CELL, h = d.height * CELL;
  const ox = (W - b) / 2, oy = (H - h) / 2;
  const b2 = (d.base2 ?? d.base) * CELL;
  const ox2 = (W - b2) / 2;

  if (shape === 'rectangle') {
    return (
      <rect x={ox} y={oy} width={b} height={h}
        fill={`${color}25`} stroke={color} strokeWidth="2.5" />
    );
  }
  if (shape === 'triangle') {
    const pts = `${ox + b / 2},${oy} ${ox},${oy + h} ${ox + b},${oy + h}`;
    return <polygon points={pts} fill={`${color}25`} stroke={color} strokeWidth="2.5" />;
  }
  // Trapezium
  const pts = `${ox2},${oy} ${ox2 + b2},${oy} ${ox + b},${oy + h} ${ox},${oy + h}`;
  return <polygon points={pts} fill={`${color}25`} stroke={color} strokeWidth="2.5" />;
}

export default function AreaPainter() {
  const [shape, setShape] = useState<Shape>('rectangle');
  const [dims, setDims] = useState<Dims>({ base: 5, height: 4 });

  const area = calcArea(shape, dims);
  const colors: Record<Shape, string> = {
    rectangle: '#00FF88',
    triangle: '#FF3D9A',
    trapezium: '#FFD700',
  };
  const color = colors[shape];

  const formula: Record<Shape, string> = {
    rectangle: `A = b × h = ${dims.base} × ${dims.height} = ${area} cm²`,
    triangle: `A = ½bh = ½ × ${dims.base} × ${dims.height} = ${area} cm²`,
    trapezium: `A = ½(a+b)h = ½(${dims.base}+${dims.base2 ?? dims.base})×${dims.height} = ${area} cm²`,
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      {/* Shape selector */}
      <div className="flex gap-2">
        {(['rectangle', 'triangle', 'trapezium'] as Shape[]).map(s => (
          <button
            key={s}
            onClick={() => setShape(s)}
            className="px-3 py-1 rounded-lg font-mono text-xs font-bold capitalize transition-all"
            style={{
              background: shape === s ? `${colors[s]}25` : 'rgba(255,255,255,0.05)',
              border: `1px solid ${shape === s ? colors[s] : 'rgba(255,255,255,0.1)'}`,
              color: shape === s ? colors[s] : 'var(--muted-foreground)',
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* SVG canvas */}
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="sim-canvas rounded-xl">
        {/* Grid lines */}
        {Array.from({ length: GRID + 1 }, (_, i) => (
          <g key={i}>
            <line x1={i * CELL} y1={0} x2={i * CELL} y2={H} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <line x1={0} y1={i * CELL} x2={W} y2={i * CELL} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          </g>
        ))}
        <ShapePolygon shape={shape} d={dims} color={color} />
        {/* Area label */}
        <text x={W / 2} y={H / 2 + 5} fill={color} fontSize="14" fontFamily="JetBrains Mono" fontWeight="bold" textAnchor="middle">
          {area} units²
        </text>
      </svg>

      {/* Sliders */}
      <div className="grid grid-cols-1 gap-3 w-full max-w-xs">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-[var(--muted-foreground)] w-16">Base: {dims.base}</span>
          <input type="range" min={2} max={9} value={dims.base}
            onChange={e => setDims(d => ({ ...d, base: +e.target.value }))}
            className="flex-1" style={{ accentColor: color }} />
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-[var(--muted-foreground)] w-16">Height: {dims.height}</span>
          <input type="range" min={2} max={9} value={dims.height}
            onChange={e => setDims(d => ({ ...d, height: +e.target.value }))}
            className="flex-1" style={{ accentColor: color }} />
        </div>
        {shape === 'trapezium' && (
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-[var(--muted-foreground)] w-16">Top: {dims.base2 ?? dims.base}</span>
            <input type="range" min={1} max={9} value={dims.base2 ?? dims.base}
              onChange={e => setDims(d => ({ ...d, base2: +e.target.value }))}
              className="flex-1" style={{ accentColor: color }} />
          </div>
        )}
      </div>

      <div className="formula-card text-xs text-center w-full max-w-xs" style={{ color }}>
        {formula[shape]}
      </div>
    </div>
  );
}


