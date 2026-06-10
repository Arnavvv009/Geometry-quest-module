import { useReducer, useEffect, useCallback } from 'react';
import type { AppState, AppAction, UnitKey, GeoQuestion } from '../types';
import { getGeoRank } from '../utils/scoring';
import { checkBadges } from '../data/badges';

const STORAGE_KEY = 'geoquest_v1';

const makeEmptyWorldScores = () => ({
  A: Array(10).fill(null) as (number | null)[],
  B: Array(10).fill(null) as (number | null)[],
  C: Array(10).fill(null) as (number | null)[],
});

const makeEmptyWorldCorrect = () => ({
  A: Array(10).fill(0) as number[],
  B: Array(10).fill(0) as number[],
  C: Array(10).fill(0) as number[],
});

const makeEmptyPhaseComplete = () => ({
  A: { wonder: false, story: false, simulate: false, play: false, reflect: false },
  B: { wonder: false, story: false, simulate: false, play: false, reflect: false },
  C: { wonder: false, story: false, simulate: false, play: false, reflect: false },
});

const makeEmptySimStations = () => ({
  A: [false, false, false],
  B: [false, false, false],
  C: [false, false, false],
});

export const INITIAL_STATE: AppState = {
  activeUnit: null,
  phase: 'intro',
  storyPanel: 0,
  currentSimStation: 0,
  simStationsComplete: makeEmptySimStations(),
  simTaskIndex: 0,
  questionSets: { A: [], B: [], C: [] },
  currentQuestion: 0,
  currentWorld: 0,
  worldScores: makeEmptyWorldScores(),
  worldCorrect: makeEmptyWorldCorrect(),
  hintsUsed: 0,
  attemptCount: 0,
  xp: 0,
  totalXP: 0,
  geoRank: 'Angle Apprentice',
  stars: { A: 0, B: 0, C: 0 },
  streak: 0,
  maxStreak: 0,
  badges: [],
  phaseComplete: makeEmptyPhaseComplete(),
  sessionId: Math.random().toString(36).slice(2),
  sessionStart: Date.now(),
  audioEnabled: true,
  musicEnabled: false,
  reducedMotion: false,
  realWorldQsCorrect: 0,
  lastAnswerCorrect: null,
  showFeedback: false,
  showBadgeModal: null,
  showHint: 0,
};

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SELECT_UNIT':
      return { ...state, activeUnit: action.unit, phase: 'wonder' };

    case 'SET_PHASE':
      return {
        ...state,
        phase: action.phase,
        storyPanel: 0,
        currentSimStation: 0,
        simTaskIndex: 0,
        currentQuestion: 0,
        hintsUsed: 0,
        attemptCount: 0,
        showHint: 0,
        lastAnswerCorrect: null,
        showFeedback: false,
      };

    case 'ADVANCE_STORY_PANEL':
      return { ...state, storyPanel: state.storyPanel + 1 };

    case 'SET_STORY_PANEL':
      return { ...state, storyPanel: action.panel };

    case 'ADVANCE_SIM_STATION':
      return {
        ...state,
        currentSimStation: Math.min(state.currentSimStation + 1, 2),
        simTaskIndex: 0,
      };

    case 'COMPLETE_SIM_STATION': {
      const updated = {
        ...state.simStationsComplete,
        [action.unit]: state.simStationsComplete[action.unit].map((v, i) =>
          i === action.station ? true : v
        ),
      };
      return { ...state, simStationsComplete: updated };
    }

    case 'ADVANCE_SIM_TASK':
      return { ...state, simTaskIndex: state.simTaskIndex + 1 };

    case 'LOAD_QUESTIONS':
      return {
        ...state,
        questionSets: { ...state.questionSets, [action.unit]: action.questions },
        currentQuestion: 0,
        currentWorld: 0,
      };

    case 'ANSWER_CORRECT': {
      const unit = state.activeUnit!;
      const newStreak = state.streak + 1;
      const newMaxStreak = Math.max(state.maxStreak, newStreak);
      const qIdx = state.currentQuestion;
      const worldIdx = Math.floor(qIdx / 10);
      const worldCorrect = { ...state.worldCorrect };
      worldCorrect[unit] = [...worldCorrect[unit]];
      worldCorrect[unit][worldIdx] = (worldCorrect[unit][worldIdx] || 0) + 1;

      const isWordProblem = state.questionSets[unit][qIdx]?.type?.includes('word_problem');
      const realWorldQsCorrect = isWordProblem
        ? state.realWorldQsCorrect + 1
        : state.realWorldQsCorrect;

      return {
        ...state,
        xp: state.xp + action.xpGained,
        totalXP: state.totalXP + action.xpGained,
        streak: newStreak,
        maxStreak: newMaxStreak,
        worldCorrect,
        realWorldQsCorrect,
        lastAnswerCorrect: true,
        showFeedback: true,
        geoRank: getGeoRank(state.xp + action.xpGained),
        hintsUsed: 0,
        attemptCount: 0,
      };
    }

    case 'ANSWER_INCORRECT':
      return {
        ...state,
        streak: 0,
        lastAnswerCorrect: false,
        showFeedback: true,
        attemptCount: state.attemptCount + 1,
      };

    case 'USE_HINT':
      return {
        ...state,
        hintsUsed: state.hintsUsed + 1,
        showHint: Math.min(state.showHint + 1, 2),
      };

    case 'NEXT_QUESTION':
      return {
        ...state,
        currentQuestion: state.currentQuestion + 1,
        showFeedback: false,
        lastAnswerCorrect: null,
        hintsUsed: 0,
        attemptCount: 0,
        showHint: 0,
      };

    case 'COMPLETE_WORLD': {
      const unit = state.activeUnit!;
      const worldIdx = Math.floor(state.currentQuestion / 10);
      const correct = state.worldCorrect[unit][worldIdx] || 0;
      const worldScores = {
        ...state.worldScores,
        [unit]: state.worldScores[unit].map((v, i) =>
          i === worldIdx ? correct : v
        ),
      };
      const totalStars = Object.values(worldScores).flat().reduce((sum, s) => sum + (s !== null ? (s >= 9 ? 3 : s >= 7 ? 2 : s >= 6 ? 1 : 0) : 0), 0);
      return {
        ...state,
        worldScores,
        stars: {
          ...state.stars,
          [unit]: state.worldScores[unit].reduce((max, ws) => Math.max(max, ws !== null ? (ws >= 9 ? 3 : ws >= 7 ? 2 : ws >= 6 ? 1 : 0) : 0), 0),
        },
      };
    }

    case 'SET_WORLD':
      return {
        ...state,
        currentWorld: action.world,
        currentQuestion: action.world * 10,
        showFeedback: false,
        lastAnswerCorrect: null,
        hintsUsed: 0,
        attemptCount: 0,
        showHint: 0,
      };

    case 'ADD_XP': {
      const newXP = state.xp + action.amount;
      return { ...state, xp: newXP, totalXP: state.totalXP + action.amount, geoRank: getGeoRank(newXP) };
    }

    case 'UPDATE_STREAK':
      return { ...state, streak: state.streak + 1, maxStreak: Math.max(state.maxStreak, state.streak + 1) };

    case 'RESET_STREAK':
      return { ...state, streak: 0 };

    case 'UNLOCK_BADGE':
      if (state.badges.includes(action.badgeId)) return state;
      return {
        ...state,
        badges: [...state.badges, action.badgeId],
        showBadgeModal: action.badgeId,
      };

    case 'COMPLETE_PHASE': {
      const updated = {
        ...state.phaseComplete,
        [action.unit]: {
          ...state.phaseComplete[action.unit],
          [action.phase]: true,
        },
      };
      return { ...state, phaseComplete: updated };
    }

    case 'UPDATE_GEO_RANK':
      return { ...state, geoRank: action.rank };

    case 'TOGGLE_AUDIO':
      return { ...state, audioEnabled: !state.audioEnabled };

    case 'TOGGLE_MUSIC':
      return { ...state, musicEnabled: !state.musicEnabled };

    case 'RESET_ALL':
      return { ...INITIAL_STATE, sessionId: Math.random().toString(36).slice(2), sessionStart: Date.now() };

    case 'RESTORE_SESSION':
      return { ...state, ...action.state };

    case 'HIDE_FEEDBACK':
      return { ...state, showFeedback: false };

    case 'SHOW_BADGE_MODAL':
      return { ...state, showBadgeModal: action.badgeId };

    case 'HIDE_BADGE_MODAL':
      return { ...state, showBadgeModal: null };

    case 'SET_HINT':
      return { ...state, showHint: action.level };

    default:
      return state;
  }
}

export function useGameState() {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        dispatch({ type: 'RESTORE_SESSION', state: parsed });
      }
    } catch (_e) {
      // ignore
    }
  }, []);

  // Persist on every change
  useEffect(() => {
    try {
      const persist: Partial<AppState> = {
        xp: state.xp,
        totalXP: state.totalXP,
        geoRank: state.geoRank,
        streak: state.streak,
        maxStreak: state.maxStreak,
        badges: state.badges,
        worldScores: state.worldScores,
        worldCorrect: state.worldCorrect,
        stars: state.stars,
        phaseComplete: state.phaseComplete,
        simStationsComplete: state.simStationsComplete,
        audioEnabled: state.audioEnabled,
        musicEnabled: state.musicEnabled,
        realWorldQsCorrect: state.realWorldQsCorrect,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(persist));
    } catch (_e) {
      // ignore
    }
  }, [state.xp, state.badges, state.worldScores, state.phaseComplete, state.simStationsComplete]);

  // Check badges after state changes
  useEffect(() => {
    const newBadges = checkBadges(state);
    newBadges.forEach(badgeId => {
      dispatch({ type: 'UNLOCK_BADGE', badgeId });
    });
  }, [state.xp, state.worldScores, state.phaseComplete, state.simStationsComplete, state.maxStreak, state.realWorldQsCorrect]);

  const selectUnit = useCallback((unit: UnitKey) => dispatch({ type: 'SELECT_UNIT', unit }), []);
  const setPhase = useCallback((phase: AppState['phase']) => dispatch({ type: 'SET_PHASE', phase }), []);
  const advanceStory = useCallback(() => dispatch({ type: 'ADVANCE_STORY_PANEL' }), []);
  const goBackStory = useCallback((panel: number) => dispatch({ type: 'SET_STORY_PANEL', panel }), []);
  const advanceSimStation = useCallback(() => dispatch({ type: 'ADVANCE_SIM_STATION' }), []);
  const completeSimStation = useCallback((unit: UnitKey, station: number) =>
    dispatch({ type: 'COMPLETE_SIM_STATION', unit, station }), []);
  const advanceSimTask = useCallback(() => dispatch({ type: 'ADVANCE_SIM_TASK' }), []);
  const loadQuestions = useCallback((unit: UnitKey, questions: GeoQuestion[]) =>
    dispatch({ type: 'LOAD_QUESTIONS', unit, questions }), []);
  const answerCorrect = useCallback((xpGained: number) =>
    dispatch({ type: 'ANSWER_CORRECT', xpGained }), []);
  const answerIncorrect = useCallback(() => dispatch({ type: 'ANSWER_INCORRECT' }), []);
  const useHint = useCallback(() => dispatch({ type: 'USE_HINT' }), []);
  const nextQuestion = useCallback(() => dispatch({ type: 'NEXT_QUESTION' }), []);
  const completeWorld = useCallback(() => dispatch({ type: 'COMPLETE_WORLD' }), []);
  const setWorld = useCallback((world: number) => dispatch({ type: 'SET_WORLD', world }), []);
  const addXP = useCallback((amount: number) => dispatch({ type: 'ADD_XP', amount }), []);
  const completePhase = useCallback((unit: UnitKey, phase: string) =>
    dispatch({ type: 'COMPLETE_PHASE', unit, phase }), []);
  const toggleAudio = useCallback(() => dispatch({ type: 'TOGGLE_AUDIO' }), []);
  const hideFeedback = useCallback(() => dispatch({ type: 'HIDE_FEEDBACK' }), []);
  const hideBadgeModal = useCallback(() => dispatch({ type: 'HIDE_BADGE_MODAL' }), []);
  const setHint = useCallback((level: number) => dispatch({ type: 'SET_HINT', level }), []);
  const resetAll = useCallback(() => dispatch({ type: 'RESET_ALL' }), []);

  return {
    state,
    dispatch,
    selectUnit,
    setPhase,
    advanceStory,
    goBackStory,
    advanceSimStation,
    completeSimStation,
    advanceSimTask,
    loadQuestions,
    answerCorrect,
    answerIncorrect,
    useHint,
    nextQuestion,
    completeWorld,
    setWorld,
    addXP,
    completePhase,
    toggleAudio,
    hideFeedback,
    hideBadgeModal,
    setHint,
    resetAll,
  };
}
