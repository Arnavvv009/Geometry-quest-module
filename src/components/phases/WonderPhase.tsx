import { useEffect } from 'react';
import type { UnitKey } from '../../types';
import { useAudio } from '../../hooks/useAudio';
import { wonderNarration } from '../../utils/narration';

interface Props {
  unit: UnitKey;
  onComplete: () => void;
  audioEnabled: boolean;
}

const WONDER_DATA: Record<UnitKey, {
  title: string;
  subtitle: string;
  realWorldHook: string;
  emoji: string;
  color: string;
  mysteries: Array<{ question: string; reveal: string; icon: string }>;
  challenge: { text: string; answer: string };
}> = {
  A: {
    title: 'Lines & Angles',
    subtitle: 'The hidden geometry of Singapore',
    realWorldHook: 'Did you know that the Marina Bay Sands hotel uses precise angle calculations in its sky bridge? Every intersection, every tilt is a geometric secret waiting to be unlocked.',
    emoji: '📐',
    color: '#00D4FF',
    mysteries: [
      {
        question: '🌆 Why do HDB blocks have windows at specific angles?',
        reveal: 'To maximise airflow! Complementary angles of 30° and 60° create the optimal cross-ventilation for Singapore\'s tropical climate.',
        icon: '💨',
      },
      {
        question: '🚆 How do MRT tracks stay perfectly parallel for kilometres?',
        reveal: 'Engineers use the corresponding angles theorem — when two parallel lines are cut by a transversal, corresponding angles are equal, allowing precision track alignment.',
        icon: '⚡',
      },
      {
        question: '🏗️ What secret angle does the Esplanade use?',
        reveal: 'The durian-shaped Esplanade theatres use supplementary angles of 120° and 60° in their triangular spikes, creating structural strength AND the iconic silhouette!',
        icon: '🎭',
      },
    ],
    challenge: {
      text: 'In Singapore, bus stops have shelters tilted at 15° to the ground. What angle do they make with a vertical wall?',
      answer: '75° (complementary to 15°, since 15° + 75° = 90°)',
    },
  },
  B: {
    title: 'Triangles & Polygons',
    subtitle: 'The strongest shapes in Singapore\'s skyline',
    realWorldHook: 'The triangle is the strongest shape in engineering. From the Esplanade\'s iconic rooftop to HDB corridor beams, triangles hold Singapore together — literally!',
    emoji: '🔷',
    color: '#FF3D9A',
    mysteries: [
      {
        question: '🏠 Why are rooftop trusses always triangular?',
        reveal: 'Triangles are rigid — their shape cannot be changed without changing the length of a side. A triangle\'s angle sum (180°) locks it in place, making it the ideal structural shape.',
        icon: '🏗️',
      },
      {
        question: '🌉 How did engineers verify the Cavenagh Bridge is symmetric?',
        reveal: 'They used congruence! By proving the two sides are congruent triangles (SAS), they guaranteed perfect symmetry without measuring every angle individually.',
        icon: '⚖️',
      },
      {
        question: '⬡ Why do hexagons appear in Jewel Changi\'s skylight?',
        reveal: 'Regular hexagons (interior angle 120°) tessellate perfectly — 3 × 120° = 360° at each vertex. They also have the highest area-to-perimeter ratio of any polygon that can tile a plane.',
        icon: '💎',
      },
    ],
    challenge: {
      text: 'The equilateral triangular segments of a rooftop have angles 60°, 60°, 60°. If one angle is increased to 80°, what must happen to make it still a triangle?',
      answer: 'The other two angles must sum to 100° (180° − 80° = 100°)',
    },
  },
  C: {
    title: 'Mensuration',
    subtitle: 'Measuring Singapore from the ground up',
    realWorldHook: 'Every tile in an HDB flat, every litre of water in the reservoirs, every square metre of green space in Gardens by the Bay — all require precise mensuration. This unit unlocks the maths behind Singapore\'s urban landscape.',
    emoji: '🌊',
    color: '#00FF88',
    mysteries: [
      {
        question: '💧 How much water does Singapore\'s Bedok Reservoir hold?',
        reveal: 'Bedok Reservoir holds about 10 million m³ of water. Engineers use V = l × w × h (plus complex composite shapes) to calculate water volume — exactly what you\'ll master in this unit!',
        icon: '🏞️',
      },
      {
        question: '🌿 How is the surface area of supertrees calculated?',
        reveal: 'The Gardens by the Bay supertrees use composite surface area calculations — cylindrical trunks plus branching structures. Engineers sum the curved surface area of each cylinder section.',
        icon: '🌳',
      },
      {
        question: '🛢️ Why do oil tankers use cylinders?',
        reveal: 'Cylinders maximise volume relative to surface area — meaning less material (cheaper) for more storage. A cylinder\'s V = πr²h makes it mathematically optimal for tanks!',
        icon: '⚓',
      },
    ],
    challenge: {
      text: 'Emma wants to know if her circular HDB balcony mat (radius 50cm) has more area than a square mat (side 90cm). Which is larger?',
      answer: 'Square mat! Circle: π×50²≈7854cm². Square: 90²=8100cm². Square is larger by ~246cm².',
    },
  },
};

export default function WonderPhase({ unit, onComplete, audioEnabled }: Props) {
  const data = WONDER_DATA[unit];
  const { narrate, stopSpeech } = useAudio(audioEnabled);

  useEffect(() => {
    narrate(wonderNarration(unit));
    return () => stopSpeech();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit]);

  return (
    <div className="h-full flex flex-col max-w-3xl mx-auto px-4 py-3 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-3 shrink-0">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-2 font-mono text-xs font-bold uppercase tracking-widest"
          style={{ background: `${data.color}15`, border: `1px solid ${data.color}40`, color: data.color }}>
          ✦ WONDER PHASE · Unit {unit}
        </div>
        <h2 className="font-display text-2xl font-extrabold text-white mb-0.5">{data.title}</h2>
        <p className="font-body text-sm font-semibold text-[var(--muted-foreground)]">{data.subtitle}</p>
      </div>

      {/* Real-world hook */}
      <div className="wonder-card p-4 mb-3 relative overflow-hidden shrink-0">
        <div className="absolute top-0 left-0 w-1.5 h-full rounded-l-xl" style={{ background: data.color }} />
        <div className="pl-4 flex items-start gap-3">
          <span className="text-2xl shrink-0 mt-0.5">{data.emoji}</span>
          <p className="font-body text-sm font-semibold text-[#E8F4FF] leading-relaxed">{data.realWorldHook}</p>
        </div>
      </div>

      {/* Mystery cards — flex-1 scrollable */}
      <div className="flex-1 min-h-0 overflow-y-auto mb-3 space-y-2 pr-1">
        <div className="font-display text-xs font-extrabold text-[var(--muted-foreground)] uppercase tracking-widest mb-2">
          🌟 Geometry Mysteries
        </div>
        {data.mysteries.map((m, i) => (
          <details key={i} className="wonder-card group">
            <summary className="px-4 py-3 cursor-pointer flex items-center gap-3 select-none list-none">
              <span className="text-lg shrink-0">{m.icon}</span>
              <span className="font-body text-sm font-bold text-white flex-1">{m.question}</span>
              <span className="font-mono text-xs text-[var(--geo-cyan)] shrink-0 group-open:rotate-90 transition-transform">▶</span>
            </summary>
            <div className="px-4 pb-4 pt-1 font-body text-sm text-[var(--muted-foreground)] leading-relaxed border-t"
              style={{ borderColor: `${data.color}20` }}>
              <span style={{ color: data.color }}>→ </span>{m.reveal}
            </div>
          </details>
        ))}

        {/* Challenge card */}
        <div className="p-4 rounded-xl" style={{ background: `${data.color}10`, border: `1.5px solid ${data.color}30` }}>
          <div className="font-mono text-xs font-extrabold uppercase tracking-widest mb-2" style={{ color: data.color }}>
            🧩 Real-World Challenge
          </div>
          <p className="font-body text-sm font-semibold text-white mb-2 leading-relaxed">{data.challenge.text}</p>
          <details>
            <summary className="font-body text-sm font-bold text-[var(--geo-gold)] cursor-pointer select-none list-none hover:underline">
              💡 Reveal the answer
            </summary>
            <div className="formula-card mt-2 text-sm font-bold">{data.challenge.answer}</div>
          </details>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center shrink-0">
        <button onClick={onComplete}
          className="px-10 py-3 rounded-2xl font-display text-sm font-extrabold text-[var(--geo-navy)] transition-all hover:scale-105 animate-pulse-cyan"
          style={{ background: `linear-gradient(135deg, ${data.color}, ${data.color}cc)` }}
          data-testid="button-wonder-complete">
          ✦ Enter the Story Lab →
        </button>
      </div>
    </div>
  );
}


