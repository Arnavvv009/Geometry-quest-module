import { useEffect, useRef } from 'react';
import type { UnitKey, AppState } from '../../types';
import { useAudio } from '../../hooks/useAudio';
import { simulateNarration, simulateCompleteNarration } from '../../utils/narration';
import AngleSculptor from '../simulations/AngleSculptor';
import IntersectionExplorer from '../simulations/IntersectionExplorer';
import ParallelStreetBuilder from '../simulations/ParallelStreetBuilder';
import TriangleAngleProver from '../simulations/TriangleAngleProver';
import CongruenceMatcher from '../simulations/CongruenceMatcher';
import PolygonBuilder from '../simulations/PolygonBuilder';
import AreaPainter from '../simulations/AreaPainter';
import CircleUnroller from '../simulations/CircleUnroller';
import VolumeFiller from '../simulations/VolumeFiller';

interface Props {
  unit: UnitKey;
  state: AppState;
  onCompleteStation: (unit: UnitKey, station: number) => void;
  onAdvanceStation: () => void;
  onComplete: () => void;
  onAddXP: (amount: number) => void;
}

interface StationMeta {
  title: string;
  subtitle: string;
  icon: string;
  xp: number;
}

const STATION_META: Record<UnitKey, StationMeta[]> = {
  A: [
    { title: 'Angle Sculptor', subtitle: 'Drag to sculpt angles — discover complementary & supplementary relationships', icon: '📐', xp: 50 },
    { title: 'Intersection Explorer', subtitle: 'Cross two lines and reveal vertically opposite angle magic', icon: '✚', xp: 50 },
    { title: 'Parallel Street Builder', subtitle: 'Build Singapore streets and unlock F, Z, and C angle patterns', icon: '🛣️', xp: 50 },
  ],
  B: [
    { title: 'Triangle Angle Prover', subtitle: 'Drag triangle vertices — the 180° truth never breaks', icon: '🔺', xp: 50 },
    { title: 'Congruence Matcher', subtitle: 'Identify which congruence rule proves the triangles identical', icon: '⚖️', xp: 50 },
    { title: 'Polygon Builder', subtitle: 'Grow a polygon side by side — watch the angle sum grow', icon: '⬡', xp: 50 },
  ],
  C: [
    { title: 'Area Painter', subtitle: 'Paint shapes on the grid and compute area interactively', icon: '🎨', xp: 50 },
    { title: 'Circle Unroller', subtitle: 'Unroll a circle to see why C = 2πr is exact', icon: '⭕', xp: 50 },
    { title: 'Volume Filler', subtitle: 'Fill a cylinder with water and verify V = πr²h', icon: '🧪', xp: 50 },
  ],
};

const UNIT_COLORS: Record<UnitKey, string> = {
  A: '#00D4FF',
  B: '#FF3D9A',
  C: '#00FF88',
};

function getSimulation(unit: UnitKey, station: number): JSX.Element {
  if (unit === 'A') {
    if (station === 0) return <AngleSculptor />;
    if (station === 1) return <IntersectionExplorer />;
    return <ParallelStreetBuilder />;
  }
  if (unit === 'B') {
    if (station === 0) return <TriangleAngleProver />;
    if (station === 1) return <CongruenceMatcher />;
    return <PolygonBuilder />;
  }
  // C
  if (station === 0) return <AreaPainter />;
  if (station === 1) return <CircleUnroller />;
  return <VolumeFiller />;
}

export default function SimulatePhase({ unit, state, onCompleteStation, onAdvanceStation, onComplete, onAddXP }: Props) {
  const color = UNIT_COLORS[unit];
  const metas = STATION_META[unit];
  const station = state.currentSimStation;
  const stationsComplete = state.simStationsComplete[unit];
  const currentMeta = metas[station];
  const allComplete = stationsComplete.every(Boolean);

  const { narrate, stopSpeech } = useAudio(state.audioEnabled);

  // Track whether allComplete was already true when this component mounted.
  // We only want to narrate the completion message when the user JUST completed
  // the last station in this session — not when they navigate back to a unit
  // where all stations were already done in a previous session.
  const mountedAllComplete = useRef(allComplete);

  // Narrate station intro whenever the station changes
  useEffect(() => {
    const segments = simulateNarration(unit, station);
    narrate(segments);
    return () => stopSpeech();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit, station]);

  // Narrate completion ONLY when allComplete transitions false → true this session
  useEffect(() => {
    if (allComplete && !mountedAllComplete.current) {
      narrate(simulateCompleteNarration());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allComplete]);

  const handleMarkComplete = () => {
    if (!stationsComplete[station]) {
      onCompleteStation(unit, station);
      onAddXP(currentMeta.xp);
    }
  };

  const handleNext = () => {
    if (station < 2) {
      onAdvanceStation();
    } else {
      onComplete();
    }
  };

  return (
    <div className="h-full flex flex-col max-w-3xl mx-auto px-4 py-3 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-2 shrink-0">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-2 font-mono text-xs font-bold"
          style={{ background: `${color}15`, border: `1px solid ${color}40`, color }}>
          ⚗️ SIMULATION LAB · Unit {unit}
        </div>
        <h2 className="font-display text-2xl font-extrabold text-white mb-0.5">{currentMeta.icon} {currentMeta.title}</h2>
        <p className="font-body text-sm font-semibold text-[var(--muted-foreground)]">{currentMeta.subtitle}</p>
      </div>

      {/* Station tabs */}
      <div className="flex items-center gap-2 justify-center mb-2 shrink-0">
        {metas.map((m, i) => (
          <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-xs font-bold transition-all"
            style={{
              background: i === station ? `${color}25` : 'transparent',
              border: `1px solid ${i === station ? color : stationsComplete[i] ? color + '60' : 'rgba(255,255,255,0.1)'}`,
              color: i === station ? color : stationsComplete[i] ? color + 'cc' : 'var(--muted-foreground)',
            }}>
            {stationsComplete[i] ? '✓' : i + 1} {m.title.split(' ')[0]}
          </div>
        ))}
      </div>

      {/* Simulation canvas — flex-1 */}
      <div className="flex-1 min-h-0 rounded-2xl overflow-hidden mb-2"
        style={{ border: `1.5px solid ${color}30`, background: 'rgba(10,14,39,0.9)' }}>
        <div className="h-full p-1">
          {getSimulation(unit, station)}
        </div>
      </div>

      {/* Action row */}
      <div className="shrink-0">
        <div className="flex items-center justify-center mb-2">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-mono text-sm font-bold"
            style={{ background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.3)', color: 'var(--geo-gold)' }}>
            ⭐ +{currentMeta.xp} XP for completing this station
          </div>
        </div>

        <div className="flex gap-2">
          {!stationsComplete[station] ? (
            <button onClick={handleMarkComplete}
              className="flex-1 py-3 rounded-xl font-display text-sm font-extrabold transition-all hover:scale-105"
              style={{ background: `linear-gradient(135deg, ${color}, ${color}aa)`, color: 'var(--geo-navy)' }}
              data-testid="button-sim-complete">
              ✓ Mark Station Complete
            </button>
          ) : (
            <div className="flex-1 py-3 rounded-xl font-display text-sm font-extrabold text-center"
              style={{ background: `${color}20`, border: `1.5px solid ${color}50`, color }}>
              ✓ Station Complete! +{currentMeta.xp} XP
            </div>
          )}
          {stationsComplete[station] && (
            <button onClick={handleNext}
              className="flex-1 py-3 rounded-xl font-display text-sm font-extrabold transition-all hover:scale-105"
              style={{
                background: station === 2 ? 'linear-gradient(135deg, var(--geo-gold), var(--geo-orange))' : 'linear-gradient(135deg, var(--geo-cyan), var(--geo-purple))',
                color: 'var(--geo-navy)',
              }}
              data-testid="button-sim-next">
              {station === 2 ? '🚀 Enter Quiz World →' : 'Next Station →'}
            </button>
          )}
        </div>

        {allComplete && station === 2 && (
          <div className="mt-2 p-3 rounded-xl text-center animate-bounce-in"
            style={{ background: 'rgba(0,255,136,0.1)', border: '1.5px solid rgba(0,255,136,0.4)' }}>
            <div className="font-display text-sm font-extrabold text-[var(--geo-green)]">
              🎉 All 3 Stations Complete! +150 XP · Simulation Lab Mastered
            </div>
          </div>
        )}
      </div>
    </div>
  );

}



