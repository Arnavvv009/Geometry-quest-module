
import { useState, useEffect, useCallback } from 'react';
import { useGameState } from './hooks/useGameState';
import StarField from './components/StarField';
import TopBar from './components/TopBar';
import PhaseNav from './components/PhaseNav';
import IntroScreen from './components/IntroScreen';
import WonderPhase from './components/phases/WonderPhase';
import StoryPhase from './components/phases/StoryPhase';
import SimulatePhase from './components/phases/SimulatePhase';
import WorldMap from './components/gamification/WorldMap';
import QuizEngine from './components/quiz/QuizEngine';
import ReflectPhase from './components/phases/ReflectPhase';
import BadgePanel from './components/gamification/BadgePanel';
import BadgeUnlockModal from './components/BadgeUnlockModal';
import questionsA from './data/questionBank_unitA';
import questionsB from './data/questionBank_unitB';
import questionsC from './data/questionBank_unitC';
import { shuffleArray } from './utils/shuffle';
import type { UnitKey } from './types';

type AppView = 'module' | 'badges';
type PlaySubPhase = 'map' | 'quiz';

const ALL_QUESTIONS = { A: questionsA, B: questionsB, C: questionsC };

export default function App() {
  const g = useGameState();
  const { state, dispatch } = g;

  const [view, setView] = useState<AppView>('module');
  const [playSubPhase, setPlaySubPhase] = useState<PlaySubPhase>('map');

  // Load & shuffle questions when a unit is selected
  useEffect(() => {
    if (state.activeUnit && state.questionSets[state.activeUnit].length === 0) {
      const raw = ALL_QUESTIONS[state.activeUnit];
      const shuffled = shuffleArray([...raw]);
      g.loadQuestions(state.activeUnit, shuffled);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.activeUnit]);

  // Badge modal auto-dismiss after 4 s
  useEffect(() => {
    if (state.showBadgeModal) {
      const t = setTimeout(() => g.hideBadgeModal(), 4000);
      return () => clearTimeout(t);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.showBadgeModal]);

  const handleSelectUnit = useCallback((unit: UnitKey) => {
    g.selectUnit(unit);
    setPlaySubPhase('map');
    setView('module');
  }, [g]);

  const handleWonderComplete = useCallback(() => {
    if (!state.activeUnit) return;
    g.completePhase(state.activeUnit, 'wonder');
    g.addXP(50);
    g.setPhase('story');
  }, [state.activeUnit, g]);

  const handleStoryComplete = useCallback(() => {
    if (!state.activeUnit) return;
    g.completePhase(state.activeUnit, 'story');
    g.addXP(75);
    g.setPhase('simulate');
  }, [state.activeUnit, g]);

  const handleSimulateComplete = useCallback(() => {
    if (!state.activeUnit) return;
    g.completePhase(state.activeUnit, 'simulate');
    g.addXP(150);
    g.setPhase('play');
    setPlaySubPhase('map');
  }, [state.activeUnit, g]);

  const handleSelectWorld = useCallback((world: number) => {
    g.setWorld(world);
    setPlaySubPhase('quiz');
  }, [g]);

  const handleStartPlay = useCallback(() => {
    const unit = state.activeUnit!;
    const next = state.worldScores[unit].findIndex(s => s === null);
    g.setWorld(next === -1 ? 0 : next);
    setPlaySubPhase('quiz');
  }, [state.activeUnit, state.worldScores, g]);

  const handleQuizCorrect = useCallback((xp: number) => {
    g.answerCorrect(xp);
  }, [g]);

  const handleQuizNext = useCallback(() => {
    const unit = state.activeUnit!;
    const qIdx = state.currentQuestion;
    const posInWorld = qIdx % 10;
    const worldIdx = Math.floor(qIdx / 10);

    if (posInWorld >= 9) {
      // Last question of this world
      g.completeWorld();
      g.nextQuestion();

      // Check if all 10 worlds done
      const afterScores = state.worldScores[unit].map((s, i) =>
        i === worldIdx ? (state.worldCorrect[unit][worldIdx] || 0) : s
      );
      const allDone = afterScores.every(s => s !== null);

      if (allDone) {
        g.completePhase(unit, 'play');
        g.addXP(200);
        setTimeout(() => g.setPhase('reflect'), 400);
      } else {
        setPlaySubPhase('map');
      }
    } else {
      g.nextQuestion();
    }
  }, [state, g]);

  const handleReflectComplete = useCallback(() => {
    if (!state.activeUnit) return;
    g.completePhase(state.activeUnit, 'reflect');
    g.addXP(100);
    g.setPhase('intro');
  }, [state.activeUnit, g]);

  const goHome = useCallback(() => {
    g.setPhase('intro');
    setPlaySubPhase('map');
    setView('module');
  }, [g]);

  const unit = state.activeUnit;
  const currentQ = unit ? (state.questionSets[unit][state.currentQuestion] ?? null) : null;
  const worldIdx = state.currentQuestion ? Math.floor(state.currentQuestion / 10) : 0;
  const posInWorld = state.currentQuestion % 10;

  // Phase nav — backward always allowed; forward only if phase already complete
  const handlePhaseNav = useCallback((phase: typeof state.phase) => {
    if (!unit) return;
    g.setPhase(phase);
    setPlaySubPhase('map');
    setView('module');
  }, [unit, g]);

  const renderPhase = () => {
    if (view === 'badges') {
      return <BadgePanel state={state} onClose={() => setView('module')} />;
    }

    if (!unit || state.phase === 'intro') {
      return (
        <IntroScreen
          state={state}
          onSelectUnit={handleSelectUnit}
          onOpenBadges={() => setView('badges')}
          onReset={g.resetAll}
        />
      );
    }

    if (state.phase === 'wonder') {
      return <WonderPhase unit={unit} onComplete={handleWonderComplete} audioEnabled={state.audioEnabled} />;
    }

    if (state.phase === 'story') {
      return (
        <StoryPhase
          unit={unit}
          panel={state.storyPanel}
          onAdvance={g.advanceStory}
          onBack={() => g.goBackStory(state.storyPanel - 1)}
          onComplete={handleStoryComplete}
          audioEnabled={state.audioEnabled}
        />
      );
    }

    if (state.phase === 'simulate') {
      return (
        <SimulatePhase
          unit={unit}
          state={state}
          onCompleteStation={g.completeSimStation}
          onAdvanceStation={g.advanceSimStation}
          onComplete={handleSimulateComplete}
          onAddXP={g.addXP}
        />
      );
    }

    if (state.phase === 'play') {
      if (playSubPhase === 'map' || !currentQ) {
        return (
          <WorldMap
            unit={unit}
            state={state}
            onSelectWorld={handleSelectWorld}
            onStartPlay={handleStartPlay}
          />
        );
      }
      return (
        <QuizEngine
          key={currentQ.id}
          question={currentQ}
          questionIndex={posInWorld}
          totalInWorld={10}
          state={state}
          onCorrect={handleQuizCorrect}
          onIncorrect={g.answerIncorrect}
          onHint={g.useHint}
          onNext={handleQuizNext}
        />
      );
    }

    if (state.phase === 'reflect') {
      return (
        <ReflectPhase
          unit={unit}
          state={state}
          onComplete={handleReflectComplete}
        />
      );
    }

    return null;
  };

  return (
    <div className="fixed inset-0 bg-[var(--geo-navy)] text-white overflow-hidden flex flex-col">
      <StarField />

      <TopBar
        state={state}
        onHome={goHome}
        onToggleAudio={g.toggleAudio}
      />

      {/* Phase nav — only shown when a unit is active and not on badges view */}
      {unit && state.phase !== 'intro' && view !== 'badges' && (
        <PhaseNav
          state={state}
          unit={unit}
          onNavigate={handlePhaseNav}
        />
      )}

      <main className="relative z-10 flex-1 min-h-0 overflow-y-auto">
        <div className="h-full flex flex-col">
          {renderPhase()}
        </div>
      </main>

      {state.showBadgeModal && (
        <BadgeUnlockModal
          badgeId={state.showBadgeModal}
          audioEnabled={state.audioEnabled}
          onClose={g.hideBadgeModal}
        />
      )}
    </div>
  );
}
