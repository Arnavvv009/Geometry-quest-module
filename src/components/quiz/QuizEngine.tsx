import { useState, useEffect, useCallback, useRef } from 'react';
import type { GeoQuestion, AppState } from '../../types';
import { calcXP } from '../../utils/scoring';
import { SFX, playQuestionAudio, useAudio } from '../../hooks/useAudio';

interface Props {
  question: GeoQuestion;
  questionIndex: number;
  totalInWorld: number;
  state: AppState;
  onCorrect: (xp: number) => void;
  onIncorrect: () => void;
  onHint: () => void;
  onNext: () => void;
}

function AngleDiagram({ q }: { q: GeoQuestion }) {
  if (!q.diagramType) return null;

  const props = q.diagramProps as Record<string, number | string | boolean>;

  if (q.diagramType === 'angle_pair') {
    const angle1 = Number(props.angle1) || 60;
    const angle2 = 180 - angle1;
    return (
      <svg width="200" height="80" viewBox="0 0 200 80" className="sim-canvas rounded-xl mx-auto block">
        <line x1="10" y1="60" x2="190" y2="60" stroke="rgba(0,212,255,0.5)" strokeWidth="2" />
        <line x1="100" y1="60" x2={100 + 60 * Math.cos((angle1 * Math.PI) / 180 - Math.PI / 2)} y2={60 - 60 * Math.abs(Math.sin((angle1 * Math.PI) / 180))} stroke="var(--geo-magenta)" strokeWidth="2.5" />
        <text x="72" y="48" fill="var(--geo-cyan)" fontSize="11" fontFamily="JetBrains Mono">{angle1}°</text>
        <text x="118" y="48" fill="var(--geo-gold)" fontSize="11" fontFamily="JetBrains Mono">{angle2}°</text>
        <text x="95" y="58" fill="rgba(255,255,255,0.5)" fontSize="8">x</text>
      </svg>
    );
  }

  if (q.diagramType === 'intersecting_lines') {
    const angle1 = Number(props.angle1) || 65;
    const angle2 = 180 - angle1;
    return (
      <svg width="200" height="100" viewBox="0 0 200 100" className="sim-canvas rounded-xl mx-auto block">
        <line x1="10" y1="50" x2="190" y2="50" stroke="rgba(0,212,255,0.4)" strokeWidth="2" />
        <line x1="100" y1="10" x2="100" y2="90" stroke="rgba(255,61,154,0.4)" strokeWidth="2" />
        <text x="58" y="38" fill="var(--geo-cyan)" fontSize="11" fontFamily="JetBrains Mono">{angle1}°</text>
        <text x="118" y="38" fill="var(--geo-gold)" fontSize="11" fontFamily="JetBrains Mono">{angle2}°</text>
        <text x="58" y="70" fill="var(--geo-gold)" fontSize="11" fontFamily="JetBrains Mono">{angle1}°</text>
        <text x="118" y="70" fill="var(--geo-cyan)" fontSize="11" fontFamily="JetBrains Mono">{angle2}°</text>
        <circle cx="100" cy="50" r="4" fill="white" opacity="0.6" />
      </svg>
    );
  }

  if (q.diagramType === 'parallel_transversal') {
    const angle = Number(props.angle) || 70;
    return (
      <svg width="220" height="120" viewBox="0 0 220 120" className="sim-canvas rounded-xl mx-auto block">
        <line x1="10" y1="35" x2="210" y2="35" stroke="rgba(0,212,255,0.5)" strokeWidth="2.5" />
        <line x1="10" y1="85" x2="210" y2="85" stroke="rgba(0,212,255,0.5)" strokeWidth="2.5" />
        <text x="5" y="32" fill="var(--geo-cyan)" fontSize="9" fontFamily="JetBrains Mono">AB</text>
        <text x="5" y="82" fill="var(--geo-cyan)" fontSize="9" fontFamily="JetBrains Mono">CD</text>
        <line x1="80" y1="10" x2="140" y2="110" stroke="rgba(255,215,0,0.6)" strokeWidth="2.5" />
        <text x="90" y="30" fill="var(--geo-gold)" fontSize="11" fontFamily="JetBrains Mono">{angle}°</text>
        <text x="105" y="80" fill="var(--geo-magenta)" fontSize="11" fontFamily="JetBrains Mono">?°</text>
        <text x="170" y="20" fill="rgba(0,212,255,0.5)" fontSize="9">∥</text>
      </svg>
    );
  }

  if (q.diagramType === 'triangle_labelled') {
    const A = Number(props.A) || 60;
    const B = Number(props.B) || 60;
    const C = 180 - A - B;
    return (
      <svg width="200" height="120" viewBox="0 0 200 120" className="sim-canvas rounded-xl mx-auto block">
        <polygon points="100,15 20,100 180,100" fill="rgba(255,61,154,0.08)" stroke="var(--geo-magenta)" strokeWidth="2" />
        <text x="88" y="13" fill="var(--geo-cyan)" fontSize="11" fontFamily="JetBrains Mono">{A}°</text>
        <text x="8" y="115" fill="var(--geo-gold)" fontSize="11" fontFamily="JetBrains Mono">{B}°</text>
        <text x="170" y="115" fill="var(--geo-green)" fontSize="11" fontFamily="JetBrains Mono">{C}°</text>
        <text x="92" y="68" fill="rgba(255,255,255,0.3)" fontSize="9">△</text>
      </svg>
    );
  }

  if (q.diagramType === 'circle_diagram') {
    const r = Math.min(Number(props.r) || 40, 45);
    const sectorAngle = Number(props.sectorAngle) || 0;
    const cx = 100, cy = 60;
    return (
      <svg width="200" height="120" viewBox="0 0 200 120" className="sim-canvas rounded-xl mx-auto block">
        <circle cx={cx} cy={cy} r={r} fill="rgba(0,212,255,0.08)" stroke="var(--geo-cyan)" strokeWidth="2" />
        {sectorAngle > 0 && (
          <path
            d={`M ${cx} ${cy} L ${cx} ${cy - r} A ${r} ${r} 0 ${sectorAngle > 180 ? 1 : 0} 1 ${cx + r * Math.sin((sectorAngle * Math.PI) / 180)} ${cy - r * Math.cos((sectorAngle * Math.PI) / 180)} Z`}
            fill="rgba(255,61,154,0.2)"
            stroke="var(--geo-magenta)"
            strokeWidth="1.5"
          />
        )}
        <text x={cx - 5} y={cy + 5} fill="white" fontSize="8" fontFamily="JetBrains Mono">r={r}</text>
        <text x={cx + r + 5} y={cy - 5} fill="var(--geo-cyan)" fontSize="9" fontFamily="JetBrains Mono">C=2πr</text>
      </svg>
    );
  }

  return null;
}

export default function QuizEngine({
  question,
  questionIndex,
  totalInWorld,
  state,
  onCorrect,
  onIncorrect,
  onHint,
  onNext,
}: Props) {
  const [selected, setSelected] = useState<string | number | boolean | null>(null);
  const [numInput, setNumInput] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [shaking, setShaking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const alreadyCorrect = state.lastAnswerCorrect === true;
  const alreadyWrong = state.lastAnswerCorrect === false;
  const showFeedback = state.showFeedback;

  const { speakFeedback } = useAudio(state.audioEnabled);

  useEffect(() => {
    setSelected(null);
    setNumInput('');
    setRevealed(false);
    setShaking(false);
  }, [question.id]);
  useEffect(() => {
    playQuestionAudio(question.id, state.audioEnabled);
  }, [question.id, state.audioEnabled]);

  const checkNumeric = useCallback((val: string) => {
    const num = parseFloat(val);
    if (isNaN(num)) return false;
    const correct = Number(question.correctAnswer);
    return Math.abs(num - correct) <= question.answerTolerance;
  }, [question]);

  const handleMCQ = (option: string | number | boolean) => {
    if (showFeedback) return;
    setSelected(option);
    const correct = option === question.correctAnswer;
    if (correct) {
      const xp = calcXP(state.attemptCount + 1, state.hintsUsed, state.streak);
      if (state.audioEnabled) SFX.correct();
      speakFeedback(true);
      onCorrect(xp);
    } else {
      if (state.audioEnabled) SFX.wrong();
      speakFeedback(false);
      setShaking(true);
      setTimeout(() => setShaking(false), 600);
      onIncorrect();
    }
  };

  const handleNumericSubmit = () => {
    if (showFeedback || !numInput.trim()) return;
    const correct = checkNumeric(numInput);
    if (correct) {
      const xp = calcXP(state.attemptCount + 1, state.hintsUsed, state.streak);
      if (state.audioEnabled) SFX.correct();
      speakFeedback(true);
      onCorrect(xp);
    } else {
      if (state.audioEnabled) SFX.wrong();
      speakFeedback(false);
      setShaking(true);
      setTimeout(() => setShaking(false), 600);
      onIncorrect();
    }
  };

  const progressPct = Math.round((questionIndex / totalInWorld) * 100);

  const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

  return (
    <div className={`max-w-2xl mx-auto px-4 py-6 animate-fade-in ${shaking ? 'animate-shake' : ''}`}>
      {/* Progress bar */}
      <div className="mb-5">
        <div className="flex justify-between text-xs text-[var(--muted-foreground)] mb-2">
          <span className="font-mono">Q{questionIndex + 1} of {totalInWorld}</span>
          <span className="font-mono">{progressPct}% complete</span>
        </div>
        <div className="h-2 bg-[var(--muted)] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progressPct}%`,
              background: 'linear-gradient(90deg, var(--geo-cyan), var(--geo-magenta))',
            }}
          />
        </div>
      </div>

      {/* Question meta */}
      <div className="flex items-center gap-2 mb-4">
        <span
          className="font-mono text-xs px-2 py-0.5 rounded-full"
          style={{
            background: `rgba(0,212,255,0.15)`,
            color: 'var(--geo-cyan)',
            border: '1px solid rgba(0,212,255,0.3)',
          }}
        >
          {question.type.replace(/_/g, ' ')}
        </span>
        {Array.from({ length: question.difficulty }, (_, i) => (
          <span key={i} className="text-[var(--geo-gold)] text-sm">★</span>
        ))}
        {question.characterName && (
          <span className="font-body text-xs text-[var(--muted-foreground)]">
            with {question.characterName}
          </span>
        )}
      </div>

      {/* Diagram */}
      {question.diagramType && (
        <div className="mb-4">
          <AngleDiagram q={question} />
        </div>
      )}

      {/* Question text */}
      <div
        className="p-5 rounded-2xl mb-5"
        style={{
          background: 'rgba(17,21,64,0.9)',
          border: '1.5px solid rgba(0,212,255,0.2)',
        }}
      >
        <p className="font-body text-base text-white leading-relaxed">
          {question.questionText}
        </p>
        {question.formula && (
          <div className="formula-card text-xs mt-3">
            Recall: {question.formula}
          </div>
        )}
      </div>

      {/* Hint buttons */}
      {!showFeedback && (
        <div className="flex gap-2 mb-4">
          <button
            onClick={onHint}
            disabled={state.showHint >= 2}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-body text-xs font-semibold transition-all duration-150 disabled:opacity-30"
            style={{
              background: 'rgba(255,215,0,0.12)',
              border: '1px solid rgba(255,215,0,0.35)',
              color: 'var(--geo-gold)',
            }}
            data-testid="button-use-hint"
          >
            💡 Hint {state.showHint}/2
          </button>
          {state.showHint > 0 && (
            <div className="hint-overlay px-3 py-1.5 text-xs font-body text-[var(--geo-gold)] flex-1 animate-fade-in">
              {state.showHint === 1 ? question.hint1 : question.hint2}
            </div>
          )}
        </div>
      )}

      {/* Answer area */}
      {question.answerType === 'mcq' && question.options && (
        <div className="space-y-3 mb-4">
          {question.options.map((opt, i) => {
            let cls = 'mcq-btn';
            if (showFeedback) {
              if (opt === question.correctAnswer) cls += ' correct';
              else if (opt === selected && opt !== question.correctAnswer) cls += ' wrong';
            }
            return (
              <button
                key={i}
                className={`${cls} w-full px-4 py-3 rounded-xl font-body text-sm text-left flex items-center gap-3 transition-all duration-200`}
                onClick={() => handleMCQ(opt)}
                disabled={showFeedback}
                data-testid={`button-option-${i}`}
              >
                <span
                  className="font-mono text-xs font-bold w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                  style={{
                    background: showFeedback && opt === question.correctAnswer
                      ? 'rgba(0,255,136,0.3)'
                      : 'rgba(0,212,255,0.15)',
                    color: showFeedback && opt === question.correctAnswer
                      ? 'var(--geo-green)'
                      : 'var(--geo-cyan)',
                  }}
                >
                  {OPTION_LETTERS[i]}
                </span>
                <span className={showFeedback && opt === question.correctAnswer ? 'text-[var(--geo-green)]' : ''}>
                  {String(opt)}
                </span>
                {showFeedback && opt === question.correctAnswer && (
                  <span className="ml-auto text-[var(--geo-green)]">✓</span>
                )}
                {showFeedback && opt === selected && opt !== question.correctAnswer && (
                  <span className="ml-auto text-[var(--geo-wrong)]">✗</span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {question.answerType === 'trueFalse' && (
        <div className="flex gap-4 mb-4">
          {['True', 'False'].map(opt => {
            let cls = 'mcq-btn flex-1 py-4 rounded-xl text-center font-display text-base font-bold';
            if (showFeedback && opt === question.correctAnswer) cls += ' correct';
            else if (showFeedback && opt === selected && opt !== question.correctAnswer) cls += ' wrong';
            return (
              <button
                key={opt}
                className={cls}
                onClick={() => handleMCQ(opt)}
                disabled={showFeedback}
                data-testid={`button-tf-${opt.toLowerCase()}`}
              >
                {opt === 'True' ? '✓ True' : '✗ False'}
              </button>
            );
          })}
        </div>
      )}

      {question.answerType === 'numeric' && (
        <div className="mb-4">
          <div className="flex gap-3">
            <input
              ref={inputRef}
              type="number"
              value={numInput}
              onChange={e => setNumInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleNumericSubmit()}
              placeholder={`Enter your answer (${question.unitLabel || 'number'})`}
              disabled={showFeedback}
              className="flex-1 px-4 py-3 rounded-xl font-mono text-base text-white bg-[var(--muted)] border border-[rgba(0,212,255,0.2)] focus:border-[var(--geo-cyan)] focus:outline-none transition-colors disabled:opacity-50"
              data-testid="input-numeric-answer"
            />
            {!showFeedback && (
              <button
                onClick={handleNumericSubmit}
                disabled={!numInput.trim()}
                className="px-6 py-3 rounded-xl font-display text-sm font-bold disabled:opacity-40 transition-all hover:scale-105"
                style={{ background: 'linear-gradient(135deg, var(--geo-cyan), var(--geo-purple))', color: 'var(--geo-navy)' }}
                data-testid="button-submit-numeric"
              >
                Check
              </button>
            )}
          </div>
          {question.unitLabel && (
            <p className="font-mono text-xs text-[var(--muted-foreground)] mt-1 pl-1">
              Unit: {question.unitLabel}
            </p>
          )}
        </div>
      )}

      {/* Feedback panel */}
      {showFeedback && (
        <div
          className={`p-4 rounded-2xl mb-4 animate-slide-up ${alreadyCorrect ? 'feedback-correct' : 'feedback-wrong'}`}
        >
          <div className={`font-display text-base font-bold mb-2 ${alreadyCorrect ? 'text-[var(--geo-green)]' : 'text-[var(--geo-wrong)]'}`}>
            {alreadyCorrect ? '✅ Correct! +XP earned' : '❌ Not quite right'}
          </div>
          <p className="font-body text-sm text-[var(--muted-foreground)] leading-relaxed mb-2">
            {question.explanation}
          </p>
          {alreadyCorrect && state.streak >= 3 && (
            <div className="flex items-center gap-2 mt-2">
              <span className="streak-flame">🔥</span>
              <span className="font-mono text-xs text-[var(--geo-orange)]">
                {state.streak} streak! Keep going!
              </span>
            </div>
          )}
        </div>
      )}

      {/* Next button */}
      {showFeedback && (
        <button
          onClick={onNext}
          className="w-full py-4 rounded-2xl font-display text-base font-bold transition-all duration-200 hover:scale-[1.02] animate-bounce-in"
          style={{
            background: alreadyCorrect
              ? 'linear-gradient(135deg, var(--geo-green), var(--geo-cyan))'
              : 'linear-gradient(135deg, var(--geo-cyan), var(--geo-purple))',
            color: 'var(--geo-navy)',
          }}
          data-testid="button-next-question"
        >
          {questionIndex + 1 >= totalInWorld ? '🏆 Complete World!' : 'Next Question →'}
        </button>
      )}
    </div>
  );
}


