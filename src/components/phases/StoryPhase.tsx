import { useEffect } from 'react';
import type { UnitKey } from '../../types';
import { useAudio } from '../../hooks/useAudio';
import { storyNarration } from '../../utils/narration';

interface Props {
  unit: UnitKey;
  panel: number;
  onAdvance: () => void;
  onBack: () => void;
  onComplete: () => void;
  audioEnabled: boolean;
}

interface StoryPanel {
  character: string;
  characterEmoji: string;
  location: string;
  locationEmoji: string;
  color: string;
  text: string;
  mathNote: string;
  formula?: string;
}

const STORIES: Record<UnitKey, StoryPanel[]> = {
  A: [
    {
      character: 'Alex',
      characterEmoji: '👨‍💻',
      location: 'MRT Control Room, Bishan',
      locationEmoji: '🚆',
      color: '#00D4FF',
      text: 'Alex stares at the holographic display. The new MRT track expansion needs to cross three existing bus routes — all running parallel to each other. "If I get the angles wrong," he mutters, "the trains will collide."',
      mathNote: 'When two parallel lines (bus routes) are crossed by a transversal (MRT track), corresponding angles are equal — this is the key to designing safe intersections!',
      formula: 'Corresponding ∠s (parallel lines): ∠1 = ∠2',
    },
    {
      character: 'Emma',
      characterEmoji: '👩‍🏫',
      location: 'Tampines Community Library',
      locationEmoji: '📚',
      color: '#9B59F5',
      text: '"These are supplementary angles," Emma explains to a group of Sec 1 students, pointing at the corridor junction. "See how the two angles on that straight wall add up to exactly 180°? The architect used this property to create perfect T-junctions throughout the building!"',
      mathNote: 'Supplementary angles are formed on a straight line. They always sum to 180°. When you see a straight line with angles on one side, you instantly know their sum!',
      formula: '∠AOB + ∠BOC = 180° (angles on straight line)',
    },
    {
      character: 'Scarlet',
      characterEmoji: '👩‍🎨',
      location: 'Gardens by the Bay, Studio',
      locationEmoji: '🌿',
      color: '#00FF88',
      text: 'Scarlet is designing a new tile pattern for the Supertrees. She notices that when two of her design lines cross, four angles form. "Wait," she realises, "the opposite angles are always the same! The butterfly shape of my tiles — it\'s all vertically opposite angles!"',
      mathNote: 'Vertically opposite angles are always equal when two straight lines intersect. They form an X-pattern — the top and bottom angles are equal, and the left and right angles are equal.',
      formula: 'Vertically opposite ∠s: ∠1 = ∠3, ∠2 = ∠4',
    },
    {
      character: 'Alex',
      characterEmoji: '👨‍💻',
      location: 'Jurong East Hub',
      locationEmoji: '🏗️',
      color: '#FF8C42',
      text: '"Co-interior angles!" Alex exclaims, reviewing the blueprint. The two parallel service corridors, connected by a diagonal walkway, created exactly the C-shape pattern his geometry teacher had described. "If one angle is 75°, the other must be 105°. They sum to 180°!"',
      mathNote: 'Co-interior angles (also called same-side interior or C-angles) on parallel lines are supplementary — they add up to 180°. Spot the C-shape between the parallel lines!',
      formula: 'Co-interior ∠s (parallel lines): ∠1 + ∠2 = 180°',
    },
    {
      character: 'Emma',
      characterEmoji: '👩‍🏫',
      location: 'Merlion Park',
      locationEmoji: '🦁',
      color: '#00D4FF',
      text: 'Standing at Merlion Park, Emma counts the straight sight-lines radiating from the viewing platform — six of them, like the spokes of a wheel. "Six angles, all around a point," she thinks. "They must sum to 360°." She calculates each angle — a perfect geometric star over Marina Bay.',
      mathNote: 'Angles at a point — all angles meeting at a single point complete a full revolution and therefore sum to 360°. This is why a pie chart uses 360° for the full circle!',
      formula: 'Angles at a point: sum = 360°',
    },
  ],
  B: [
    {
      character: 'Alex',
      characterEmoji: '👨‍💻',
      location: 'Changi Airport Engineering Bay',
      locationEmoji: '✈️',
      color: '#FF3D9A',
      text: 'Alex\'s robotic arms must form perfect triangles in their frame design. "The angle sum theorem is everything," he tells his trainee. "In any triangle — no matter how stretched, squashed, or twisted — the three angles always add up to exactly 180°."',
      mathNote: 'The interior angle sum of any triangle is always 180°. This is one of the most fundamental and reliable facts in all of geometry — it works for every triangle ever drawn!',
      formula: '∠A + ∠B + ∠C = 180°',
    },
    {
      character: 'Scarlet',
      characterEmoji: '👩‍🎨',
      location: 'Esplanade Theatre Lobby',
      locationEmoji: '🎭',
      color: '#9B59F5',
      text: 'Scarlet admires the Esplanade\'s exterior spikes. "Each spike is an isosceles triangle," she sketches. "The two equal sides mean the base angles are equal — always!" She measures: apex angle 36°, base angles each 72°. "36 + 72 + 72 = 180. Perfect!"',
      mathNote: 'In an isosceles triangle, the two equal sides produce two equal BASE ANGLES. If you know the apex angle, each base angle = (180° − apex) ÷ 2.',
      formula: 'Base ∠ = (180° − apex) ÷ 2',
    },
    {
      character: 'Emma',
      characterEmoji: '👩‍🏫',
      location: 'Science Centre Singapore',
      locationEmoji: '🔬',
      text: '"Congruent triangles!" Emma explains to her class at the Science Centre exhibit. "These two triangular panels look identical — let\'s prove it using SSS. Side 1: 5cm each. Side 2: 8cm each. Side 3: 6cm each. All three pairs match — SSS congruence confirmed!"',
      mathNote: 'Congruence means same shape AND same size. SSS (Side-Side-Side) is one way to prove two triangles are congruent — if all three sides of one triangle equal all three sides of another, they are congruent.',
      formula: 'SSS: If AB=DE, BC=EF, AC=DF → △ABC ≅ △DEF',
    },
    {
      character: 'Alex',
      characterEmoji: '👨‍💻',
      location: 'Tampines Town Hub',
      locationEmoji: '🏛️',
      color: '#00D4FF',
      text: '"The hexagonal tiles in the food court ceiling," Alex points up, "form a perfect tessellation. Each hexagon has interior angle 120°. Three meet at every vertex: 3 × 120° = 360°. That\'s why they fit together with no gaps!"',
      mathNote: 'The interior angle sum of a polygon with n sides = (n−2) × 180°. For a regular hexagon: (6−2)×180°÷6 = 120°. Three hexagons at a vertex: 3×120°=360° — perfect tessellation!',
      formula: 'Interior ∠ sum = (n−2) × 180°',
    },
    {
      character: 'Scarlet',
      characterEmoji: '👩‍🎨',
      location: 'Bishan-Ang Mo Kio Park',
      locationEmoji: '🌳',
      color: '#FF8C42',
      text: '"The park\'s star-shaped flower beds use exterior angles," Scarlet discovers while designing the layout. "Five points in a star. Each point is an exterior angle. And the sum of ALL exterior angles of any convex polygon — whatever the number of sides — is always 360°!"',
      mathNote: 'The sum of exterior angles of ANY convex polygon is always 360°. For a regular polygon with n sides, each exterior angle = 360°÷n. This fact is truly universal!',
      formula: 'Exterior ∠ sum (any convex polygon) = 360°',
    },
  ],
  C: [
    {
      character: 'Emma',
      characterEmoji: '👩‍🏫',
      location: 'Tampines HDB renovation',
      locationEmoji: '🏠',
      color: '#00FF88',
      text: 'Emma is renovating her Tampines HDB flat. "Before I buy tiles," she explains to her daughter, "I need to find the exact area of this L-shaped floor. I split it into two rectangles and add them up. Mensuration saves me from buying too many — or too few — tiles!"',
      mathNote: 'Composite shapes can be broken into simpler shapes. Add (or subtract) the areas of the components. Always sketch and label before calculating!',
      formula: 'Composite A = A₁ + A₂ (or A₁ − A₂ for holes)',
    },
    {
      character: 'Alex',
      characterEmoji: '👨‍💻',
      location: 'Marina Barrage rooftop',
      locationEmoji: '🌊',
      color: '#00D4FF',
      text: '"The circular reservoir here," Alex explains to school visitors, "holds millions of litres. Every time it rains, engineers calculate the water gain using Area = πr². The beauty of π is that it connects a circle\'s radius to its area — perfectly!"',
      mathNote: 'A circle\'s area formula A = πr² means that if you double the radius, the area QUADRUPLES (because r is squared). The circumference C = 2πr grows linearly with radius.',
      formula: 'A = πr²; C = 2πr',
    },
    {
      character: 'Scarlet',
      characterEmoji: '👩‍🎨',
      location: 'Gardens by the Bay',
      locationEmoji: '🌿',
      color: '#9B59F5',
      text: '"The supertrees," Scarlet sketches, "are basically cylinders with decorations. Volume = πr²h. If I know the volume and the radius, I can find how tall a cylindrical water pipe needs to be. This is mensuration in real engineering!"',
      mathNote: 'Volume of a prism (including cylinder) = base area × height. For a cylinder: V = πr²h. This formula powers everything from water tank design to pipe engineering.',
      formula: 'Cylinder V = πr²h; Prism V = base area × h',
    },
    {
      character: 'Emma',
      characterEmoji: '👩‍🏫',
      location: 'Jewel Changi Airport',
      locationEmoji: '✈️',
      color: '#FFD700',
      text: '"I love how the Rain Vortex at Jewel is a perfect cylinder," Emma says. "Surface area = 2πr(r + h). This determines how much material the architects needed for the structure\'s walls. Mensuration isn\'t just maths — it\'s architecture, engineering, and cost management!"',
      mathNote: 'Total surface area of a cylinder = 2πr² (two circular ends) + 2πrh (curved surface). Combined: 2πr(r+h). For open containers, remove one circular end: πr² + 2πrh.',
      formula: 'Cylinder TSA = 2πr(r+h)',
    },
    {
      character: 'Alex',
      characterEmoji: '👨‍💻',
      location: 'HDB Building site, Tengah',
      locationEmoji: '🏗️',
      color: '#00FF88',
      text: '"The eco-town of Tengah," Alex tells the class, "uses trapezoidal cross-section drainage channels. Volume = ½(a+b)×h×length. Getting this wrong could mean flooding — mensuration literally keeps Singapore dry during monsoon season!"',
      mathNote: 'Trapezoid/trapezoidal prism volume: first find the cross-sectional area = ½(a+b)×h, then multiply by the length. This applies to drainage channels, pools, and many real structures.',
      formula: 'Trapezoidal prism V = ½(a+b) × h × l',
    },
  ],
};

export default function StoryPhase({ unit, panel, onAdvance, onBack, onComplete, audioEnabled }: Props) {
  const panels = STORIES[unit];
  const current = panels[panel];
  const isLast = panel >= panels.length - 1;
  const { narrate, stopSpeech } = useAudio(audioEnabled);

  // Re-narrate whenever the panel changes
  useEffect(() => {
    const segments = storyNarration(unit, panel);
    narrate(segments);
    return () => stopSpeech();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit, panel]);

  return (
    <div className="h-full flex flex-col max-w-2xl mx-auto px-4 py-3 animate-fade-in">
      {/* Progress dots */}
      <div className="flex items-center gap-1.5 justify-center mb-2 shrink-0">
        {panels.map((_, i) => (
          <div key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${i < panel ? 'bg-[var(--geo-green)]' : i === panel ? 'bg-[var(--geo-cyan)] animate-pulse-cyan' : 'bg-[var(--muted)]'}`}
            style={{ width: i === panel ? '24px' : '8px' }} />
        ))}
        <span className="ml-2 font-mono text-xs font-bold text-[var(--muted-foreground)]">{panel + 1}/{panels.length}</span>
      </div>

      {/* Story card — flex-1 scrollable */}
      <div key={panel} className="story-panel px-5 py-4 flex-1 min-h-0 overflow-y-auto animate-slide-up mb-3">
        {/* Character + location */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl"
              style={{ background: `${current.color}20`, border: `1.5px solid ${current.color}50` }}>
              {current.characterEmoji}
            </div>
            <div>
              <div className="font-display text-sm font-extrabold" style={{ color: current.color }}>{current.character}</div>
              <div className="font-body text-xs font-semibold text-[var(--muted-foreground)]">{current.locationEmoji} {current.location}</div>
            </div>
          </div>
          <div className="font-mono text-xs font-bold text-[var(--muted-foreground)] bg-[var(--muted)] px-2 py-1 rounded-lg">
            Scene {panel + 1}
          </div>
        </div>

        {/* Panel image — Unit A story illustrations */}
        {unit === 'A' && panel === 0 && (
          <div className="mb-4 rounded-xl overflow-hidden" style={{ border: `1.5px solid ${current.color}30` }}>
            <img src="/story-A-0-alex.png" alt="Alex at the MRT Control Room studying parallel bus routes"
              className="w-full object-cover" style={{ maxHeight: '200px' }} />
          </div>
        )}
        {unit === 'A' && panel === 1 && (
          <div className="mb-4 rounded-xl overflow-hidden" style={{ border: `1.5px solid ${current.color}30` }}>
            <img src="/story-A-1-emma.png" alt="Emma explaining supplementary angles to students at the corridor"
              className="w-full object-cover" style={{ maxHeight: '200px' }} />
          </div>
        )}
        {unit === 'A' && panel === 2 && (
          <div className="mb-4 rounded-xl overflow-hidden" style={{ border: `1.5px solid ${current.color}30` }}>
            <img src="/story-A-2-scarlet.png" alt="Scarlet designing vertically opposite angle tile patterns for the Supertrees"
              className="w-full object-cover" style={{ maxHeight: '200px' }} />
          </div>
        )}
        {unit === 'A' && panel === 3 && (
          <div className="mb-4 rounded-xl overflow-hidden" style={{ border: `1.5px solid ${current.color}30` }}>
            <img src="/story-A-3-alex.png" alt="Alex discovering co-interior angles in the Jurong East blueprint"
              className="w-full object-cover" style={{ maxHeight: '200px' }} />
          </div>
        )}
        {unit === 'A' && panel === 4 && (
          <div className="mb-4 rounded-xl overflow-hidden" style={{ border: `1.5px solid ${current.color}30` }}>
            <img src="/story-A-4-emma.png" alt="Emma counting sight-lines at Merlion Park — angles summing to 360°"
              className="w-full object-cover" style={{ maxHeight: '200px' }} />
          </div>
        )}

        {/* Panel images — Unit B: Triangles & Polygons */}
        {unit === 'B' && panel === 0 && (
          <div className="mb-4 rounded-xl overflow-hidden" style={{ border: `1.5px solid ${current.color}30` }}>
            <img src="/story-B-2-emma.png" alt="Alex and his trainee with robotic arm — angle sum theorem 180°"
              className="w-full object-cover" style={{ maxHeight: '200px' }} />
          </div>
        )}
        {unit === 'B' && panel === 1 && (
          <div className="mb-4 rounded-xl overflow-hidden" style={{ border: `1.5px solid ${current.color}30` }}>
            <img src="/story-B-3-alex.png" alt="Scarlet sketching isosceles triangle spikes at the Esplanade"
              className="w-full object-cover" style={{ maxHeight: '200px' }} />
          </div>
        )}
        {unit === 'B' && panel === 2 && (
          <div className="mb-4 rounded-xl overflow-hidden" style={{ border: `1.5px solid ${current.color}30` }}>
            <img src="/story-B-1-scarlet.png" alt="Emma proving SSS congruence with triangular panels at the Science Centre"
              className="w-full object-cover" style={{ maxHeight: '200px' }} />
          </div>
        )}
        {unit === 'B' && panel === 3 && (
          <div className="mb-4 rounded-xl overflow-hidden" style={{ border: `1.5px solid ${current.color}30` }}>
            <img src="/story-B-0-alex.png" alt="Alex pointing at hexagonal ceiling tessellation — 3×120°=360°"
              className="w-full object-cover" style={{ maxHeight: '200px' }} />
          </div>
        )}
        {unit === 'B' && panel === 4 && (
          <div className="mb-4 rounded-xl overflow-hidden" style={{ border: `1.5px solid ${current.color}30` }}>
            <img src="/story-B-4-scarlet.png" alt="Scarlet discovering exterior angles sum 360° in star-shaped flower beds"
              className="w-full object-cover" style={{ maxHeight: '200px' }} />
          </div>
        )}

        {/* Panel images — Unit C: Mensuration */}
        {unit === 'C' && panel === 0 && (
          <div className="mb-4 rounded-xl overflow-hidden" style={{ border: `1.5px solid ${current.color}30` }}>
            <img src="/story-C-4-alex.png" alt="Alex teaching trapezoidal drainage channel volume at Tengah eco-town"
              className="w-full object-cover" style={{ maxHeight: '200px' }} />
          </div>
        )}
        {unit === 'C' && panel === 1 && (
          <div className="mb-4 rounded-xl overflow-hidden" style={{ border: `1.5px solid ${current.color}30` }}>
            <img src="/story-C-3-emma.png" alt="Emma calculating cylinder surface area for the Rain Vortex at Jewel"
              className="w-full object-cover" style={{ maxHeight: '200px' }} />
          </div>
        )}
        {unit === 'C' && panel === 2 && (
          <div className="mb-4 rounded-xl overflow-hidden" style={{ border: `1.5px solid ${current.color}30` }}>
            <img src="/story-C-2-scarlet.png" alt="Scarlet sketching supertree cylinder volume at Gardens by the Bay"
              className="w-full object-cover" style={{ maxHeight: '200px' }} />
          </div>
        )}
        {unit === 'C' && panel === 3 && (
          <div className="mb-4 rounded-xl overflow-hidden" style={{ border: `1.5px solid ${current.color}30` }}>
            <img src="/story-C-1-alex.png" alt="Alex explaining circle area A=πr² to school visitors at Tampines Reservoir"
              className="w-full object-cover" style={{ maxHeight: '200px' }} />
          </div>
        )}
        {unit === 'C' && panel === 4 && (
          <div className="mb-4 rounded-xl overflow-hidden" style={{ border: `1.5px solid ${current.color}30` }}>
            <img src="/story-C-0-emma.png" alt="Emma and daughter measuring L-shaped floor area at Tampines HDB flat"
              className="w-full object-cover" style={{ maxHeight: '200px' }} />
          </div>
        )}

        {/* Story text */}
        <blockquote className="font-body text-sm font-semibold text-[#E8F4FF] leading-relaxed mb-4 border-l-2 pl-4 italic"
          style={{ borderColor: current.color }}>
          {current.text}
        </blockquote>

        {/* Math insight */}
        <div className="rounded-xl p-4 mb-3" style={{ background: `${current.color}12`, border: `1.5px solid ${current.color}30` }}>
          <div className="font-mono text-xs font-extrabold mb-1.5" style={{ color: current.color }}>🧠 Math Insight</div>
          <p className="font-body text-sm font-semibold text-[var(--muted-foreground)] leading-relaxed">{current.mathNote}</p>
        </div>

        {current.formula && <div className="formula-card text-sm font-extrabold">{current.formula}</div>}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between shrink-0">
        {/* Back button — only visible when not on first panel */}
        {panel > 0 ? (
          <button onClick={onBack}
            className="px-5 py-3 rounded-xl font-display text-sm font-extrabold transition-all hover:scale-105"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1.5px solid rgba(255,255,255,0.12)',
              color: 'var(--muted-foreground)',
            }}>
            ← Back
          </button>
        ) : (
          <div className="font-body text-xs font-semibold text-[var(--muted-foreground)]">Tap to continue...</div>
        )}

        <button onClick={isLast ? onComplete : onAdvance}
          className="px-7 py-3 rounded-xl font-display text-sm font-extrabold transition-all hover:scale-105"
          style={{
            background: isLast ? `linear-gradient(135deg, var(--geo-green), var(--geo-cyan))` : `linear-gradient(135deg, ${current.color}cc, ${current.color})`,
            color: 'var(--geo-navy)',
          }}
          data-testid="button-story-advance">
          {isLast ? '🚀 Enter Simulation Lab →' : 'Next Scene →'}
        </button>
      </div>
    </div>
  );

}




