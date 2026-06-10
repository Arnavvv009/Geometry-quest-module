export type UnitKey = 'A' | 'B' | 'C';
export type PhaseKey = 'intro' | 'wonder' | 'story' | 'simulate' | 'play' | 'reflect' | 'results';

export type QuestionType =
  // Unit A
  | 'complementary_angle' | 'supplementary_angle' | 'vertically_opposite'
  | 'corresponding_angle' | 'alternate_angle' | 'co_interior_angle'
  | 'angles_at_point' | 'angle_true_false' | 'algebraic_angle'
  | 'angle_word_problem'
  // Unit B
  | 'triangle_angle_sum' | 'exterior_angle' | 'isosceles_triangle'
  | 'sss_congruence' | 'sas_congruence' | 'asa_aas_congruence'
  | 'rhs_congruence' | 'polygon_angle_sum' | 'regular_polygon_angle'
  | 'polygon_word_problem'
  // Unit C
  | 'perimeter_compound' | 'area_triangle_quad' | 'area_parallelogram'
  | 'circle_circumference' | 'circle_area' | 'composite_2d_area'
  | 'volume_prism' | 'volume_cylinder' | 'surface_area'
  | 'mensuration_word_problem';

export type DiagramType =
  | 'angle_pair' | 'intersecting_lines' | 'parallel_transversal'
  | 'triangle_labelled' | 'congruent_pair' | 'polygon_general'
  | 'circle_diagram' | 'composite_2d' | 'cuboid_3d' | 'cylinder_3d' | null;

export type AnswerType = 'mcq' | 'numeric' | 'trueFalse' | 'multiSelect';

export interface GeoQuestion {
  id: string;
  unit: UnitKey;
  type: QuestionType;
  world: number;
  difficulty: 1 | 2 | 3;
  questionText: string;
  diagramType: DiagramType;
  diagramProps: Record<string, unknown>;
  answerType: AnswerType;
  options: (string | number)[] | null;
  correctAnswer: number | string | boolean;
  answerTolerance: number;
  unitLabel: string;
  hint1: string;
  hint2: string;
  explanation: string;
  formula: string;
  characterName?: string | null;
  locationName?: string | null;
  audioText?: string;
}

export interface Badge {
  id: string;
  unit: UnitKey | 'all';
  label: string;
  description: string;
  icon: string;
  color: string;
  condition: (state: AppState) => boolean;
}

export interface AppState {
  activeUnit: UnitKey | null;
  phase: PhaseKey;
  storyPanel: number;
  currentSimStation: number;
  simStationsComplete: Record<UnitKey, boolean[]>;
  simTaskIndex: number;
  questionSets: Record<UnitKey, GeoQuestion[]>;
  currentQuestion: number;
  currentWorld: number;
  worldScores: Record<UnitKey, (number | null)[]>;
  worldCorrect: Record<UnitKey, number[]>;
  hintsUsed: number;
  attemptCount: number;
  xp: number;
  totalXP: number;
  geoRank: string;
  stars: Record<UnitKey, number>;
  streak: number;
  maxStreak: number;
  badges: string[];
  phaseComplete: Record<UnitKey, Record<string, boolean>>;
  sessionId: string;
  sessionStart: number;
  audioEnabled: boolean;
  musicEnabled: boolean;
  reducedMotion: boolean;
  realWorldQsCorrect: number;
  lastAnswerCorrect: boolean | null;
  showFeedback: boolean;
  showBadgeModal: string | null;
  showHint: number;
}

export type AppAction =
  | { type: 'SELECT_UNIT'; unit: UnitKey }
  | { type: 'SET_PHASE'; phase: PhaseKey }
  | { type: 'ADVANCE_STORY_PANEL' }
  | { type: 'ADVANCE_SIM_STATION' }
  | { type: 'COMPLETE_SIM_STATION'; unit: UnitKey; station: number }
  | { type: 'ADVANCE_SIM_TASK' }
  | { type: 'LOAD_QUESTIONS'; unit: UnitKey; questions: GeoQuestion[] }
  | { type: 'ANSWER_CORRECT'; xpGained: number }
  | { type: 'ANSWER_INCORRECT' }
  | { type: 'USE_HINT' }
  | { type: 'NEXT_QUESTION' }
  | { type: 'COMPLETE_WORLD' }
  | { type: 'SET_WORLD'; world: number }
  | { type: 'ADD_XP'; amount: number }
  | { type: 'UPDATE_STREAK' }
  | { type: 'RESET_STREAK' }
  | { type: 'UNLOCK_BADGE'; badgeId: string }
  | { type: 'COMPLETE_PHASE'; unit: UnitKey; phase: string }
  | { type: 'UPDATE_GEO_RANK'; rank: string }
  | { type: 'TOGGLE_AUDIO' }
  | { type: 'TOGGLE_MUSIC' }
  | { type: 'RESET_UNIT'; unit: UnitKey }
  | { type: 'RESET_ALL' }
  | { type: 'RESTORE_SESSION'; state: Partial<AppState> }
  | { type: 'HIDE_FEEDBACK' }
  | { type: 'SHOW_BADGE_MODAL'; badgeId: string }
  | { type: 'HIDE_BADGE_MODAL' }
  | { type: 'SET_HINT'; level: number }
  | { type: 'SET_STORY_PANEL'; panel: number };
