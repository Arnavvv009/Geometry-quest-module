import { useState } from 'react';
import type { UnitKey, AppState } from '../../types';

interface Props {
  unit: UnitKey;
  state: AppState;
  onComplete: () => void;
}

const REFLECT_DATA: Record<UnitKey, {
  color: string;
  title: string;
  prompts: string[];
  keyFormulas: Array<{ label: string; formula: string; description: string }>;
  realWorldConnection: string;
}> = {
  A: {
    color: '#00D4FF',
    title: 'Lines & Angles — Your Journey Complete',
    prompts: [
      'Describe in your own words what "co-interior angles on parallel lines" means. Use a real-world example from Singapore.',
      'What was the most surprising angle relationship you discovered? Why did it surprise you?',
      'If you were an architect designing an HDB flat, which angle properties would you use most often? Explain why.',
    ],
    keyFormulas: [
      { label: 'Complementary', formula: '∠A + ∠B = 90°', description: 'Two angles summing to a right angle' },
      { label: 'Supplementary', formula: '∠A + ∠B = 180°', description: 'Two angles on a straight line' },
      { label: 'Vertically Opposite', formula: '∠1 = ∠3, ∠2 = ∠4', description: 'Equal angles across from each other' },
      { label: 'Angles at Point', formula: 'Sum = 360°', description: 'All angles around a point' },
      { label: 'Corresponding', formula: '∠F₁ = ∠F₂', description: 'F-shape on parallel lines: equal' },
      { label: 'Alternate', formula: '∠Z₁ = ∠Z₂', description: 'Z-shape on parallel lines: equal' },
      { label: 'Co-interior', formula: '∠C₁ + ∠C₂ = 180°', description: 'C-shape on parallel lines: supplementary' },
    ],
    realWorldConnection: 'Every pair of parallel streets in Singapore connected by a side road creates angle relationships. The next time you are on an MRT and see the tracks cross a road bridge — look for the Z-shape of alternate angles!',
  },
  B: {
    color: '#FF3D9A',
    title: 'Triangles & Polygons — Your Journey Complete',
    prompts: [
      'Explain the difference between SSS, SAS, ASA, and RHS congruence. Make up a memory trick to remember each one.',
      'Why is the triangle considered the strongest shape in engineering? Connect your answer to angle and side properties.',
      'You are designing the roof of a Singapore community centre using triangular trusses. Which congruence criterion would you use to ensure both halves are identical? Why?',
    ],
    keyFormulas: [
      { label: 'Triangle Sum', formula: '∠A + ∠B + ∠C = 180°', description: 'Interior angles of any triangle' },
      { label: 'Exterior Angle', formula: 'Ext ∠ = ∠A + ∠B', description: 'Equal to sum of non-adjacent interior angles' },
      { label: 'Isosceles', formula: 'Base ∠ = (180° − apex) ÷ 2', description: 'Equal base angles' },
      { label: 'Interior Sum', formula: '(n−2) × 180°', description: 'Sum of interior angles of n-gon' },
      { label: 'Regular Polygon', formula: '(n−2) × 180° ÷ n', description: 'Each interior angle of regular n-gon' },
      { label: 'Exterior Sum', formula: '360°', description: 'Sum of exterior angles of any convex polygon' },
    ],
    realWorldConnection: 'The congruence theorems you mastered are used daily by engineers at HDB, JTC, and in aerospace. When Alex designs symmetric robotic arms, he uses SAS. When Scarlet tilers her garden, she uses SSS to cut identical triangular pieces!',
  },
  C: {
    color: '#00FF88',
    title: 'Mensuration — Your Journey Complete',
    prompts: [
      'Describe three real situations in Singapore where volume calculations are critically important. What could go wrong without accurate mensuration?',
      'Explain in your own words why the formula for the area of a trapezium is ½(a+b)h. Draw a diagram to support your explanation.',
      'If you were designing a water tank for an HDB block, what dimensions would you choose for a cylinder that holds 10,000 litres? Show your working.',
    ],
    keyFormulas: [
      { label: 'Triangle Area', formula: 'A = ½bh', description: 'Half base times perpendicular height' },
      { label: 'Trapezium Area', formula: 'A = ½(a+b)h', description: 'Average of parallel sides times height' },
      { label: 'Circle Area', formula: 'A = πr²', description: 'Pi times radius squared' },
      { label: 'Circumference', formula: 'C = 2πr', description: 'Perimeter of a circle' },
      { label: 'Sector Area', formula: 'A = (θ/360)πr²', description: 'Fraction of circle based on angle' },
      { label: 'Cuboid Volume', formula: 'V = lwh', description: 'Length times width times height' },
      { label: 'Cylinder Volume', formula: 'V = πr²h', description: 'Circle area times height' },
      { label: 'Cylinder TSA', formula: 'TSA = 2πr(r+h)', description: 'Total surface area of closed cylinder' },
    ],
    realWorldConnection: 'Mensuration is the backbone of Singapore\'s infrastructure. Every new HDB block, every reservoir expansion, every MRT tunnel cross-section — all require the volume and surface area formulas you have now mastered!',
  },
};

export default function ReflectPhase({ unit, state, onComplete }: Props) {
  const data = REFLECT_DATA[unit];
  const [journalText, setJournalText] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const worldScores = state.worldScores[unit].filter(s => s !== null) as number[];
  const totalCorrect = worldScores.reduce((a, b) => a + b, 0);
  const avgScore = worldScores.length > 0 ? Math.round(totalCorrect / worldScores.length * 10) : 0;
  const simsDone = state.simStationsComplete[unit].filter(Boolean).length;

  const handleSubmit = () => {
    if (journalText.trim().length > 10) {
      setSubmitted(true);
    }
  };

  return (
    <div className="h-full flex flex-col max-w-2xl mx-auto px-4 py-3 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-2 shrink-0">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-1 font-mono text-xs font-bold"
          style={{ background: `${data.color}15`, border: `1px solid ${data.color}40`, color: data.color }}>
          ✨ REFLECT PHASE
        </div>
        <h2 className="font-display text-xl font-extrabold text-white">{data.title}</h2>
      </div>

      {/* Performance summary */}
      <div className="rounded-xl p-3 mb-2 shrink-0"
        style={{ background: `linear-gradient(135deg, ${data.color}15 0%, rgba(17,21,64,0.9) 100%)`, border: `1.5px solid ${data.color}30` }}>
        <div className="font-mono text-xs font-extrabold uppercase tracking-widest mb-2" style={{ color: data.color }}>
          📊 Your Unit {unit} Performance
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Questions', val: `${totalCorrect}/${worldScores.length * 10}`, icon: '✅' },
            { label: 'Accuracy', val: `${avgScore}%`, icon: '🎯' },
            { label: 'Sims Done', val: `${simsDone}/3`, icon: '⚗️' },
          ].map(s => (
            <div key={s.label} className="text-center p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <div className="text-lg mb-0.5">{s.icon}</div>
              <div className="font-display text-base font-extrabold text-white">{s.val}</div>
              <div className="font-mono text-xs font-semibold text-[var(--muted-foreground)]">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 min-h-0 overflow-y-auto space-y-2 pr-1 mb-2">

        {/* Formula cheatsheet */}
        <div>
          <div className="font-display text-xs font-extrabold text-[var(--muted-foreground)] uppercase tracking-widest mb-2">
            🔬 Formula Cheatsheet
          </div>
          <div className="space-y-1.5">
            {data.keyFormulas.map(f => (
              <div key={f.label} className="flex items-center gap-3 p-2.5 rounded-lg"
                style={{ background: 'rgba(17,21,64,0.8)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="font-mono text-sm font-extrabold px-2 py-1 rounded-lg shrink-0 min-w-[100px] text-center"
                  style={{ background: `${data.color}20`, color: data.color }}>
                  {f.formula}
                </div>
                <div>
                  <div className="font-body text-sm font-bold text-white">{f.label}</div>
                  <div className="font-body text-xs font-semibold text-[var(--muted-foreground)]">{f.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Journal */}
        {!submitted ? (
          <div>
            <div className="font-display text-xs font-extrabold text-[var(--muted-foreground)] uppercase tracking-widest mb-2">
              ✍️ GeoQuest Journal
            </div>
            <div className="space-y-1.5 mb-2">
              {data.prompts.map((p, i) => (
                <button key={i} onClick={() => setSelectedPrompt(i)}
                  className={`w-full text-left p-3 rounded-lg font-body text-sm font-semibold transition-all ${selectedPrompt === i ? 'text-white' : 'text-[var(--muted-foreground)]'}`}
                  style={{ background: selectedPrompt === i ? `${data.color}20` : 'rgba(17,21,64,0.6)', border: `1px solid ${selectedPrompt === i ? data.color + '50' : 'rgba(255,255,255,0.06)'}` }}>
                  <span className="font-mono text-xs font-extrabold mr-1.5" style={{ color: data.color }}>Q{i + 1}.</span>{p}
                </button>
              ))}
            </div>
            <textarea className="journal-textarea w-full p-3 text-sm font-semibold" style={{ minHeight: '80px' }}
              placeholder="Write your reflection here... (minimum 10 characters)"
              value={journalText} onChange={e => setJournalText(e.target.value)}
              data-testid="textarea-journal" />
          </div>
        ) : (
          <div className="p-4 rounded-xl text-center animate-bounce-in"
            style={{ background: `${data.color}15`, border: `1.5px solid ${data.color}40` }}>
            <div className="text-3xl mb-2">🌟</div>
            <div className="font-display text-base font-extrabold text-white mb-1">Reflection Recorded!</div>
            <p className="font-body text-sm font-semibold text-[var(--muted-foreground)]">Your insights are saved in your GeoQuest Journal.</p>
          </div>
        )}

        {/* Real world connection */}
        <div className="p-3 rounded-xl" style={{ background: 'rgba(17,21,64,0.8)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="font-mono text-xs font-extrabold uppercase tracking-widest mb-1.5 text-[var(--geo-gold)]">🌏 Real World Connection</div>
          <p className="font-body text-sm font-semibold text-[var(--muted-foreground)] leading-relaxed">{data.realWorldConnection}</p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="shrink-0 flex flex-col gap-2">
        {!submitted && (
          <button onClick={handleSubmit} disabled={journalText.trim().length < 10}
            className="w-full py-3 rounded-xl font-display text-sm font-extrabold transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105"
            style={{ background: journalText.trim().length >= 10 ? `linear-gradient(135deg, ${data.color}, ${data.color}cc)` : 'var(--muted)', color: journalText.trim().length >= 10 ? 'var(--geo-navy)' : 'var(--muted-foreground)' }}
            data-testid="button-journal-submit">
            Submit Reflection →
          </button>
        )}
        <button onClick={onComplete}
          className="w-full py-3 rounded-xl font-display text-sm font-extrabold transition-all hover:scale-105 animate-pulse-gold"
          style={{ background: `linear-gradient(135deg, var(--geo-gold), var(--geo-orange))`, color: 'var(--geo-navy)' }}
          data-testid="button-unit-complete">
          🏆 Complete Unit {unit} Mission →
        </button>
      </div>
    </div>
  );

}




