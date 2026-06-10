import { useState } from 'react';

interface Puzzle {
  rule: string;
  desc: string;
  t1: string;
  t2: string;
  given: string;
  options: string[];
  correct: string;
}

const PUZZLES: Puzzle[] = [
  {
    rule: 'SSS',
    desc: 'Side-Side-Side: all three sides equal',
    t1: '5, 8, 6',
    t2: '5, 8, 6',
    given: 'AB=DE=5, BC=EF=8, AC=DF=6',
    options: ['SSS', 'SAS', 'ASA', 'RHS'],
    correct: 'SSS',
  },
  {
    rule: 'SAS',
    desc: 'Side-Angle-Side: two sides and the included angle equal',
    t1: '7, 50°, 9',
    t2: '7, 50°, 9',
    given: 'AB=DE=7, ∠B=∠E=50°, BC=EF=9',
    options: ['SSS', 'SAS', 'ASA', 'AAS'],
    correct: 'SAS',
  },
  {
    rule: 'ASA',
    desc: 'Angle-Side-Angle: two angles and the included side equal',
    t1: '40°, 8, 60°',
    t2: '40°, 8, 60°',
    given: '∠A=∠D=40°, AB=DE=8, ∠B=∠E=60°',
    options: ['SSS', 'SAS', 'ASA', 'RHS'],
    correct: 'ASA',
  },
  {
    rule: 'RHS',
    desc: 'Right Hypotenuse Side: right angle, hypotenuse, and one side equal',
    t1: '90°, hyp=10, 6',
    t2: '90°, hyp=10, 6',
    given: '∠C=∠F=90°, AB=DE=10 (hyp), BC=EF=6',
    options: ['SSS', 'SAS', 'RHS', 'AAS'],
    correct: 'RHS',
  },
];

function TriSVG({ label, color }: { label: string; color: string }) {
  return (
    <svg width="130" height="110" viewBox="0 0 130 110">
      <polygon points="65,10 15,95 115,95" fill={`${color}15`} stroke={color} strokeWidth="2.5" strokeLinejoin="round" />
      <text x="62" y="8" fill={color} fontSize="11" fontFamily="JetBrains Mono" textAnchor="middle">A</text>
      <text x="8" y="108" fill={color} fontSize="11" fontFamily="JetBrains Mono">B</text>
      <text x="108" y="108" fill={color} fontSize="11" fontFamily="JetBrains Mono">C</text>
      <text x="65" y="65" fill={color} fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle" opacity="0.7">{label}</text>
    </svg>
  );
}

export default function CongruenceMatcher() {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);

  const puzzle = PUZZLES[idx];
  const correct = selected === puzzle.correct;

  const handleNext = () => {
    setIdx((idx + 1) % PUZZLES.length);
    setSelected(null);
    setAnswered(false);
  };

  const handleSelect = (opt: string) => {
    if (answered) return;
    setSelected(opt);
    setAnswered(true);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <p className="font-mono text-xs text-[var(--geo-magenta)] text-center uppercase tracking-widest">
        Puzzle {idx + 1}/{PUZZLES.length} · Which congruence rule?
      </p>

      {/* Two triangles */}
      <div className="flex items-center gap-4">
        <TriSVG label={puzzle.t1} color="#FF3D9A" />
        <div className="flex flex-col items-center gap-1">
          <span className="font-display text-2xl text-[var(--geo-gold)]">≅</span>
          <span className="font-mono text-[10px] text-[var(--muted-foreground)]">?</span>
        </div>
        <TriSVG label={puzzle.t2} color="#00D4FF" />
      </div>

      {/* Given info */}
      <div className="formula-card text-xs text-center w-full max-w-xs">
        Given: {puzzle.given}
      </div>

      {/* Option buttons */}
      <div className="grid grid-cols-4 gap-2 w-full max-w-xs">
        {puzzle.options.map(opt => {
          let bg = 'rgba(255,255,255,0.05)';
          let border = 'rgba(255,255,255,0.1)';
          let color = 'var(--muted-foreground)';
          if (answered) {
            if (opt === puzzle.correct) { bg = 'rgba(0,255,136,0.2)'; border = 'rgba(0,255,136,0.5)'; color = 'var(--geo-green)'; }
            else if (opt === selected) { bg = 'rgba(255,61,154,0.15)'; border = 'rgba(255,61,154,0.4)'; color = 'var(--geo-magenta)'; }
          } else if (opt === selected) {
            border = 'var(--geo-cyan)'; color = 'var(--geo-cyan)';
          }
          return (
            <button
              key={opt}
              onClick={() => handleSelect(opt)}
              className="py-2.5 rounded-xl font-display text-sm font-bold transition-all hover:scale-105 disabled:cursor-default"
              style={{ background: bg, border: `1.5px solid ${border}`, color }}
              disabled={answered}
              data-testid={`congruence-opt-${opt}`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {answered && (
        <div
          className="w-full max-w-xs p-3 rounded-xl text-center animate-fade-in"
          style={{
            background: correct ? 'rgba(0,255,136,0.1)' : 'rgba(255,61,154,0.1)',
            border: `1px solid ${correct ? 'rgba(0,255,136,0.4)' : 'rgba(255,61,154,0.4)'}`,
          }}
        >
          <div className={`font-display text-sm font-bold mb-1 ${correct ? 'text-[var(--geo-green)]' : 'text-[var(--geo-magenta)]'}`}>
            {correct ? '✓ Correct!' : `✗ Answer: ${puzzle.correct}`}
          </div>
          <p className="font-body text-xs text-[var(--muted-foreground)]">{puzzle.desc}</p>
          <button
            onClick={handleNext}
            className="mt-2 px-5 py-1.5 rounded-lg font-display text-xs font-bold"
            style={{ background: 'var(--geo-cyan)', color: 'var(--geo-navy)' }}
          >
            Next Puzzle →
          </button>
        </div>
      )}
    </div>
  );
}


