import { useCallback, useRef } from 'react';
import type { NarrationSegment } from '../utils/narration';
import { audioMap } from '../utils/audioMap';

// ─── Web Audio SFX (synthesised tones — not speech) ──────────────────────────
const createAudioContext = () =>
  new (window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();

const playTones = (notes: [number, number][], duration = 80) => {
  try {
    const ctx = createAudioContext();
    notes.forEach(([freq, startMs]) => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'triangle';
      osc.frequency.value = freq;
      const t = ctx.currentTime + startMs / 1000;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.25, t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, t + duration / 1000 + 0.3);
      osc.start(t);
      osc.stop(t + duration / 1000 + 0.4);
    });
    setTimeout(() => ctx.close(), 3000);
  } catch (_e) { /* audio not available */ }
};

export const SFX = {
  correct:       () => playTones([[523.25, 0], [659.25, 80], [783.99, 160]], 100),
  wrong:         () => playTones([[392, 0], [311.13, 150]], 200),
  streak:        () => playTones([[523.25, 0], [659.25, 70], [783.99, 140], [1046.5, 210]], 90),
  badge:         () => playTones([[523.25, 0], [659.25, 60], [783.99, 120], [987.77, 180], [1046.5, 240]], 150),
  levelUp:       () => playTones([[261.63,0],[392,70],[523.25,140],[659.25,210],[783.99,280],[1046.5,350]], 120),
  worldComplete: () => playTones([[523.25,0],[659.25,0],[783.99,0],[1046.5,100]], 400),
  phaseComplete: () => playTones([[392,0],[523.25,100],[659.25,200],[783.99,300],[1046.5,400]], 200),
  simSuccess:    () => playTones([[1046.5,0],[1318.5,60],[1568,120]], 80),
  click:         () => playTones([[880, 0]], 40),
};

// ─── Audio resolution: local pre-generated mp3/wav ONLY ──────────────────────
// No runtime ElevenLabs API calls. No browser speech synthesis.
// Only plays files listed in audioMap (pre-generated with voice Xb7hH8MSUJpSbSDYk0k2).
// Missing key → silent.
function resolveLocalAudio(text: string): HTMLAudioElement | null {
  const path = audioMap[text];
  if (!path) return null;
  return new Audio(path);
}

// ─── Play one HTMLAudioElement, awaiting its end ──────────────────────────────
function playAudioElement(audio: HTMLAudioElement): Promise<void> {
  return new Promise(resolve => {
    audio.onended = () => resolve();
    audio.onerror = () => resolve(); // silent on missing/broken file — no fallback
    audio.play().catch(() => resolve());
  });
}

// ─── playQuestionAudio: used by QuizEngine for pre-generated question wavs ────
// Plays /audio/<questionId>.wav (pre-generated with voice Xb7hH8MSUJpSbSDYk0k2).
// Silent if the file is missing — no fallback to browser speech.
export async function playQuestionAudio(
  questionId: string,
  audioEnabled: boolean,
): Promise<void> {
  if (!audioEnabled) return;
  const audio = new Audio(`/audio/${questionId}.wav`);
  await playAudioElement(audio);
}

// ─── Main hook ────────────────────────────────────────────────────────────────
export function useAudio(audioEnabled: boolean) {
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const queueTokenRef   = useRef<symbol>(Symbol());

  /** Stop any in-flight audio immediately */
  const stopSpeech = useCallback(() => {
    queueTokenRef.current = Symbol();
    currentAudioRef.current?.pause();
    currentAudioRef.current = null;
  }, []);

  // When audioEnabled is toggled off, immediately stop whatever is playing
  const prevEnabledRef = useRef(audioEnabled);
  if (prevEnabledRef.current !== audioEnabled) {
    prevEnabledRef.current = audioEnabled;
    if (!audioEnabled) {
      queueTokenRef.current = Symbol();
      currentAudioRef.current?.pause();
      currentAudioRef.current = null;
    }
  }

  /**
   * Play a single narration segment from local file only.
   * Silent if no pre-generated file exists for this text.
   */
  const speakSegment = useCallback(async (
    text: string,
    _style?: NarrationSegment['style'],
  ) => {
    if (!audioEnabled) return;
    currentAudioRef.current?.pause();
    const audio = resolveLocalAudio(text);
    if (!audio) return;
    currentAudioRef.current = audio;
    await playAudioElement(audio);
  }, [audioEnabled]);

  /**
   * Play an array of NarrationSegments in sequence from local files only.
   * Segments with no local file are skipped silently.
   */
  const narrate = useCallback(async (segments: NarrationSegment[]) => {
    if (!audioEnabled || segments.length === 0) return;

    const token = Symbol();
    queueTokenRef.current = token;
    currentAudioRef.current?.pause();

    for (let i = 0; i < segments.length; i++) {
      if (queueTokenRef.current !== token) return;
      const audio = resolveLocalAudio(segments[i].text);
      if (audio) {
        currentAudioRef.current = audio;
        await playAudioElement(audio);
      }
      // no local file → skip silently
    }
  }, [audioEnabled]);

  // ── Convenience wrappers ──────────────────────────────────────────────────
  const speak          = useCallback((text: string) => speakSegment(text), [speakSegment]);
  const speakQuestion  = useCallback((text: string) => speakSegment(text), [speakSegment]);
  const speakHint      = useCallback((text: string) => speakSegment(text), [speakSegment]);
  const speakPraise    = useCallback(() => speakSegment('Excellent work!'),                [speakSegment]);
  const speakEncourage = useCallback(() => speakSegment('Good try! Review the formula.'), [speakSegment]);

  // Plays Alice voice (Xb7hH8MSUJpSbSDYk0k2) feedback from pre-generated local mp3
  const speakFeedback  = useCallback((correct: boolean) => {
    speakSegment(correct ? "That's correct!" : "Not quite, try again!");
  }, [speakSegment]);

  return { speak, speakQuestion, speakHint, speakPraise, speakEncourage, speakSegment, narrate, stopSpeech, speakFeedback };
}
