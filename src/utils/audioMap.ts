/**
 * audioMap.ts — local pre-generated audio for phase narrations.
 *
 * Keys   : exact narration text strings (must match narration.ts 1:1)
 * Values : paths relative to /public  (served as static assets by Vite)
 *
 * To add a new entry:
 *  1. Add the text + path here.
 *  2. Run `node scripts/generate_narration_audio.js` to produce the mp3.
 *
 * File naming convention:  /audio/narration/<slug>.mp3
 * where <slug> = first 60 chars of text, lowercased, spaces→hyphens,
 *                non-alphanumeric stripped, prefixed with a stable index.
 *
 * This file is the SINGLE SOURCE OF TRUTH for what has been pre-generated.
 * The audio engine checks this map first — if a path is listed here the
 * local file is played immediately (zero network latency).
 * If the key is missing, ElevenLabs API is tried, then Web Speech fallback.
 */

export const audioMap: Record<string, string> = {
  // ── INTRO ─────────────────────────────────────────────────────────────────
  'Welcome to GeoQuest! Your geometry adventure through Singapore starts here.':
    '/audio/narration/intro-01.mp3',
  'Choose a unit below to begin — each one takes you deeper into the hidden geometry of the city.':
    '/audio/narration/intro-02.mp3',

  // ── WONDER · Unit A ───────────────────────────────────────────────────────
  'Did you know that the Marina Bay Sands hotel uses precise angle calculations in its sky bridge? Every intersection, every tilt is a geometric secret waiting to be unlocked.':
    '/audio/narration/wonder-A-01.mp3',
  'Why do HDB blocks have windows at specific angles? To maximise airflow! Complementary angles of 30° and 60° create the optimal cross-ventilation for Singapore\'s tropical climate.':
    '/audio/narration/wonder-A-02.mp3',
  'Engineers use the corresponding angles theorem to keep MRT tracks perfectly parallel for kilometres. When two parallel lines are cut by a transversal, corresponding angles are equal — allowing precision track alignment.':
    '/audio/narration/wonder-A-03.mp3',
  'Here is your real-world challenge. In Singapore, bus stops have shelters tilted at 15 degrees to the ground. What angle do they make with a vertical wall?':
    '/audio/narration/wonder-A-04.mp3',

  // ── WONDER · Unit B ───────────────────────────────────────────────────────
  'The triangle is the strongest shape in engineering. From the Esplanade\'s iconic rooftop to HDB corridor beams, triangles hold Singapore together — literally!':
    '/audio/narration/wonder-B-01.mp3',
  'Why are rooftop trusses always triangular? Triangles are rigid — their shape cannot be changed without changing the length of a side. A triangle\'s angle sum of 180° locks it in place, making it the ideal structural shape.':
    '/audio/narration/wonder-B-02.mp3',
  'Engineers verified the Cavenagh Bridge is symmetric by using congruence! By proving the two sides are congruent triangles using the SAS rule, they guaranteed perfect symmetry without measuring every angle individually.':
    '/audio/narration/wonder-B-03.mp3',
  'Here is your challenge. The equilateral triangular segments of a rooftop have angles 60°, 60°, 60°. If one angle is increased to 80°, what must happen to make it still a valid triangle?':
    '/audio/narration/wonder-B-04.mp3',

  // ── WONDER · Unit C ───────────────────────────────────────────────────────
  'Every tile in an HDB flat, every litre of water in the reservoirs, every square metre of green space in Gardens by the Bay — all require precise mensuration. This unit unlocks the maths behind Singapore\'s urban landscape.':
    '/audio/narration/wonder-C-01.mp3',
  'Bedok Reservoir holds about 10 million cubic metres of water. Engineers use volume formulas — plus complex composite shapes — to calculate water volume exactly. That is what you will master in this unit!':
    '/audio/narration/wonder-C-02.mp3',
  'Cylinders maximise volume relative to surface area — meaning less material for more storage. A cylinder\'s formula V equals π r squared h makes it mathematically optimal for tanks.':
    '/audio/narration/wonder-C-03.mp3',
  'Here is your challenge. Emma wants to know if her circular HDB balcony mat with radius 50 centimetres has more area than a square mat with side 90 centimetres. Which is larger?':
    '/audio/narration/wonder-C-04.mp3',

  // ── STORY · Unit A ────────────────────────────────────────────────────────
  'Alex stares at the holographic display. The new MRT track expansion needs to cross three existing bus routes — all running parallel to each other. "If I get the angles wrong," he mutters, "the trains will collide."':
    '/audio/narration/story-A-0-01.mp3',
  'When two parallel lines are crossed by a transversal, corresponding angles are equal — this is the key to designing safe intersections.':
    '/audio/narration/story-A-0-02.mp3',

  '"These are supplementary angles," Emma explains to a group of students, pointing at the corridor junction. "See how the two angles on that straight wall add up to exactly 180°? The architect used this property to create perfect T-junctions throughout the building!"':
    '/audio/narration/story-A-1-01.mp3',
  'Supplementary angles are formed on a straight line. They always sum to 180°. When you see a straight line with angles on one side, you instantly know their sum!':
    '/audio/narration/story-A-1-02.mp3',

  'Scarlet is designing a new tile pattern for the Supertrees. She notices that when two of her design lines cross, four angles form. "Wait," she realises, "the opposite angles are always the same! The butterfly shape of my tiles — it\'s all vertically opposite angles!"':
    '/audio/narration/story-A-2-01.mp3',
  'Vertically opposite angles are always equal when two straight lines intersect. They form an X-pattern — the top and bottom angles are equal, and the left and right angles are equal.':
    '/audio/narration/story-A-2-02.mp3',

  '"Co-interior angles!" Alex exclaims, reviewing the blueprint. The two parallel service corridors, connected by a diagonal walkway, created exactly the C-shape pattern his geometry teacher had described. "If one angle is 75°, the other must be 105°. They sum to 180°!"':
    '/audio/narration/story-A-3-01.mp3',
  'Co-interior angles on parallel lines are supplementary — they add up to 180°. Spot the C-shape between the parallel lines!':
    '/audio/narration/story-A-3-02.mp3',

  'Standing at Merlion Park, Emma counts the straight sight-lines radiating from the viewing platform — six of them, like the spokes of a wheel. "Six angles, all around a point," she thinks. "They must sum to 360°."':
    '/audio/narration/story-A-4-01.mp3',
  'Angles at a point — all angles meeting at a single point complete a full revolution and therefore sum to 360°. This is why a pie chart uses 360° for the full circle!':
    '/audio/narration/story-A-4-02.mp3',

  // ── STORY · Unit B ────────────────────────────────────────────────────────
  'Alex\'s robotic arms must form perfect triangles in their frame design. "The angle sum theorem is everything," he tells his trainee. "In any triangle — no matter how stretched, squashed, or twisted — the three angles always add up to exactly 180°."':
    '/audio/narration/story-B-0-01.mp3',
  'The interior angle sum of any triangle is always 180°. This is one of the most fundamental and reliable facts in all of geometry — it works for every triangle ever drawn!':
    '/audio/narration/story-B-0-02.mp3',

  'Scarlet admires the Esplanade\'s exterior spikes. "Each spike is an isosceles triangle," she sketches. "The two equal sides mean the base angles are equal — always!" She measures: apex angle 36°, base angles each 72°. 36 plus 72 plus 72 equals 180. Perfect!':
    '/audio/narration/story-B-1-01.mp3',
  'In an isosceles triangle, the two equal sides produce two equal base angles. If you know the apex angle, each base angle equals 180° minus the apex, divided by 2.':
    '/audio/narration/story-B-1-02.mp3',

  '"Congruent triangles!" Emma explains to her class at the Science Centre exhibit. "These two triangular panels look identical — let\'s prove it using SSS. Side 1: 5cm each. Side 2: 8cm each. Side 3: 6cm each. All three pairs match — SSS congruence confirmed!"':
    '/audio/narration/story-B-2-01.mp3',
  'Congruence means same shape AND same size. SSS — Side-Side-Side — is one way to prove two triangles are congruent. If all three sides of one triangle equal all three sides of another, they are congruent.':
    '/audio/narration/story-B-2-02.mp3',

  '"The hexagonal tiles in the food court ceiling," Alex points up, "form a perfect tessellation. Each hexagon has interior angle 120°. Three meet at every vertex: 3 times 120° equals 360°. That\'s why they fit together with no gaps!"':
    '/audio/narration/story-B-3-01.mp3',
  'The interior angle sum of a polygon with n sides equals (n minus 2) times 180°. For a regular hexagon, that is 120° per angle. Three hexagons at a vertex give 3 times 120° equals 360° — perfect tessellation!':
    '/audio/narration/story-B-3-02.mp3',

  '"The park\'s star-shaped flower beds use exterior angles," Scarlet discovers. "Five points in a star. Each point is an exterior angle. And the sum of all exterior angles of any convex polygon — whatever the number of sides — is always 360°!"':
    '/audio/narration/story-B-4-01.mp3',
  'The sum of exterior angles of any convex polygon is always 360°. For a regular polygon with n sides, each exterior angle equals 360° divided by n. This fact is truly universal!':
    '/audio/narration/story-B-4-02.mp3',

  // ── STORY · Unit C ────────────────────────────────────────────────────────
  'Emma is renovating her Tampines HDB flat. "Before I buy tiles," she explains to her daughter, "I need to find the exact area of this L-shaped floor. I split it into two rectangles and add them up. Mensuration saves me from buying too many — or too few — tiles!"':
    '/audio/narration/story-C-0-01.mp3',
  'Composite shapes can be broken into simpler shapes. Add or subtract the areas of the components. Always sketch and label before calculating!':
    '/audio/narration/story-C-0-02.mp3',

  '"The circular reservoir here," Alex explains to school visitors, "holds millions of litres. Every time it rains, engineers calculate the water gain using Area equals π r squared. The beauty of π is that it connects a circle\'s radius to its area — perfectly!"':
    '/audio/narration/story-C-1-01.mp3',
  'A circle\'s area formula — A equals π r squared — means that if you double the radius, the area quadruples because r is squared. The circumference C equals 2 π r grows linearly with radius.':
    '/audio/narration/story-C-1-02.mp3',

  '"The supertrees," Scarlet sketches, "are basically cylinders with decorations. Volume equals π r squared h. If I know the volume and the radius, I can find how tall a cylindrical water pipe needs to be. This is mensuration in real engineering!"':
    '/audio/narration/story-C-2-01.mp3',
  'Volume of a prism, including a cylinder, equals base area times height. For a cylinder: V equals π r squared h. This formula powers everything from water tank design to pipe engineering.':
    '/audio/narration/story-C-2-02.mp3',

  '"I love how the Rain Vortex at Jewel is a perfect cylinder," Emma says. "Surface area equals 2 π r times the sum of r and h. This determines how much material the architects needed for the structure\'s walls. Mensuration isn\'t just maths — it\'s architecture, engineering, and cost management!"':
    '/audio/narration/story-C-3-01.mp3',
  'Total surface area of a cylinder equals 2 π r squared plus 2 π r h for the two circular ends and the curved surface. Combined: 2 π r times the quantity r plus h.':
    '/audio/narration/story-C-3-02.mp3',

  '"The eco-town of Tengah uses trapezoidal cross-section drainage channels. Volume equals one half of (a plus b) times h times length. Getting this wrong could mean flooding — mensuration literally keeps Singapore dry during monsoon season!"':
    '/audio/narration/story-C-4-01.mp3',
  'For a trapezoidal prism: first find the cross-sectional area — one half of (a plus b) times h — then multiply by the length. This applies to drainage channels, pools, and many real structures.':
    '/audio/narration/story-C-4-02.mp3',

  // ── SIMULATE ──────────────────────────────────────────────────────────────
  'Welcome to the Angle Sculptor. Drag the handles to sculpt angles and discover complementary and supplementary relationships for yourself.':
    '/audio/narration/sim-A-0.mp3',
  'This is the Intersection Explorer. Cross two lines and watch the vertically opposite angle magic reveal itself in real time.':
    '/audio/narration/sim-A-1.mp3',
  'Welcome to the Parallel Street Builder. Build Singapore streets with parallel lines and unlock the F, Z, and C angle patterns hidden inside them.':
    '/audio/narration/sim-A-2.mp3',

  'This is the Triangle Angle Prover. Drag the triangle vertices and see for yourself — the angle sum never breaks 180°.':
    '/audio/narration/sim-B-0.mp3',

  // sim-B-1, sim-B-2, sim-C-0, sim-C-1, sim-C-2, sim-complete
  // were generated with Windows Speech (wrong voice) — removed from map.
  // These stations play silently until regenerated with ElevenLabs (quota reset needed).

  // ── QUIZ FEEDBACK ─────────────────────────────────────────────────────────
  'That\'s correct!':       '/audio/narration/feedback-correct.mp3',
  'Not quite, try again!':  '/audio/narration/feedback-wrong.mp3',
};


