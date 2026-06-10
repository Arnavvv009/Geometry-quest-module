import { useMemo } from 'react';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacityMin: number;
  opacityMax: number;
  dur: number;
  delay: number;
}

export default function StarField({ count = 80 }: { count?: number }) {
  const stars = useMemo<Star[]>(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.5 + 0.5,
      opacityMin: Math.random() * 0.2 + 0.05,
      opacityMax: Math.random() * 0.5 + 0.3,
      dur: Math.random() * 4 + 2,
      delay: Math.random() * 5,
    }));
  }, [count]);

  return (
    <div className="starfield" aria-hidden="true">
      {stars.map(s => (
        <div
          key={s.id}
          className="star"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            ['--opacity-min' as string]: s.opacityMin,
            ['--opacity-max' as string]: s.opacityMax,
            ['--twinkle-dur' as string]: `${s.dur}s`,
            ['--twinkle-delay' as string]: `${s.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
