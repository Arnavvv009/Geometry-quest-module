/**
 * generate_narration_audio.js
 *
 * Pre-generates all phase narration audio files using ElevenLabs TTS
 * and saves them to public/audio/narration/ as .mp3 files.
 *
 * Run once (or whenever narration scripts change):
 *   node scripts/generate_narration_audio.js
 *
 * Requires:
 *   .env.local  →  VITE_ELEVENLABS_API_KEY=your_key_here
 *
 * The output filenames match exactly what audioMap.ts references.
 */

const fs   = require('fs');
const path = require('path');

// ── Load env from .env.local ──────────────────────────────────────────────────
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8')
    .split('\n')
    .forEach(line => {
      const [k, ...rest] = line.split('=');
      if (k && rest.length) process.env[k.trim()] = rest.join('=').trim();
    });
}

const API_KEY  = process.env.VITE_ELEVENLABS_API_KEY;
const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2'; // Alice
const MODEL    = 'eleven_multilingual_v2';

if (!API_KEY || API_KEY === 'your_elevenlabs_api_key_here') {
  console.error('❌  Set VITE_ELEVENLABS_API_KEY in .env.local first.');
  process.exit(1);
}

const OUT_DIR = path.join(__dirname, '..', 'public', 'audio', 'narration');
fs.mkdirSync(OUT_DIR, { recursive: true });

// ── Voice settings per style ──────────────────────────────────────────────────
const STYLE_SETTINGS = {
  celebration:   { stability: 0.12, similarity_boost: 0.45, style: 0.75, use_speaker_boost: true },
  encouragement: { stability: 0.16, similarity_boost: 0.50, style: 0.65, use_speaker_boost: true },
  question:      { stability: 0.20, similarity_boost: 0.55, style: 0.55, use_speaker_boost: true },
  emphasis:      { stability: 0.16, similarity_boost: 0.50, style: 0.60, use_speaker_boost: true },
  thinking:      { stability: 0.24, similarity_boost: 0.60, style: 0.35, use_speaker_boost: true },
  statement:     { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true },
  instruction:   { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true },
};

// ── All phrases to generate — must match audioMap.ts values exactly ───────────
const PHRASES = [
  // INTRO
  { file: 'intro-01', style: 'statement',   text: 'Welcome to GeoQuest! Your geometry adventure through Singapore starts here.' },
  { file: 'intro-02', style: 'instruction', text: 'Choose a unit below to begin — each one takes you deeper into the hidden geometry of the city.' },

  // WONDER A
  { file: 'wonder-A-01', style: 'statement', text: "Did you know that the Marina Bay Sands hotel uses precise angle calculations in its sky bridge? Every intersection, every tilt is a geometric secret waiting to be unlocked." },
  { file: 'wonder-A-02', style: 'thinking',  text: "Why do HDB blocks have windows at specific angles? To maximise airflow! Complementary angles of 30° and 60° create the optimal cross-ventilation for Singapore's tropical climate." },
  { file: 'wonder-A-03', style: 'statement', text: "Engineers use the corresponding angles theorem to keep MRT tracks perfectly parallel for kilometres. When two parallel lines are cut by a transversal, corresponding angles are equal — allowing precision track alignment." },
  { file: 'wonder-A-04', style: 'question',  text: "Here is your real-world challenge. In Singapore, bus stops have shelters tilted at 15 degrees to the ground. What angle do they make with a vertical wall?" },

  // WONDER B
  { file: 'wonder-B-01', style: 'statement', text: "The triangle is the strongest shape in engineering. From the Esplanade's iconic rooftop to HDB corridor beams, triangles hold Singapore together — literally!" },
  { file: 'wonder-B-02', style: 'thinking',  text: "Why are rooftop trusses always triangular? Triangles are rigid — their shape cannot be changed without changing the length of a side. A triangle's angle sum of 180° locks it in place, making it the ideal structural shape." },
  { file: 'wonder-B-03', style: 'statement', text: "Engineers verified the Cavenagh Bridge is symmetric by using congruence! By proving the two sides are congruent triangles using the SAS rule, they guaranteed perfect symmetry without measuring every angle individually." },
  { file: 'wonder-B-04', style: 'question',  text: "Here is your challenge. The equilateral triangular segments of a rooftop have angles 60°, 60°, 60°. If one angle is increased to 80°, what must happen to make it still a valid triangle?" },

  // WONDER C
  { file: 'wonder-C-01', style: 'statement', text: "Every tile in an HDB flat, every litre of water in the reservoirs, every square metre of green space in Gardens by the Bay — all require precise mensuration. This unit unlocks the maths behind Singapore's urban landscape." },
  { file: 'wonder-C-02', style: 'thinking',  text: "Bedok Reservoir holds about 10 million cubic metres of water. Engineers use volume formulas — plus complex composite shapes — to calculate water volume exactly. That is what you will master in this unit!" },
  { file: 'wonder-C-03', style: 'statement', text: "Cylinders maximise volume relative to surface area — meaning less material for more storage. A cylinder's formula V equals π r squared h makes it mathematically optimal for tanks." },
  { file: 'wonder-C-04', style: 'question',  text: "Here is your challenge. Priya wants to know if her circular HDB balcony mat with radius 50 centimetres has more area than a square mat with side 90 centimetres. Which is larger?" },

  // STORY A
  { file: 'story-A-0-01', style: 'statement', text: 'Wei Kang stares at the holographic display. The new MRT track expansion needs to cross three existing bus routes — all running parallel to each other. "If I get the angles wrong," he mutters, "the trains will collide."' },
  { file: 'story-A-0-02', style: 'emphasis',  text: 'When two parallel lines are crossed by a transversal, corresponding angles are equal — this is the key to designing safe intersections.' },
  { file: 'story-A-1-01', style: 'statement', text: '"These are supplementary angles," Priya explains to a group of students, pointing at the corridor junction. "See how the two angles on that straight wall add up to exactly 180°? The architect used this property to create perfect T-junctions throughout the building!"' },
  { file: 'story-A-1-02', style: 'emphasis',  text: 'Supplementary angles are formed on a straight line. They always sum to 180°. When you see a straight line with angles on one side, you instantly know their sum!' },
  { file: 'story-A-2-01', style: 'statement', text: "Siti is designing a new tile pattern for the Supertrees. She notices that when two of her design lines cross, four angles form. \"Wait,\" she realises, \"the opposite angles are always the same! The butterfly shape of my tiles — it's all vertically opposite angles!\"" },
  { file: 'story-A-2-02', style: 'emphasis',  text: 'Vertically opposite angles are always equal when two straight lines intersect. They form an X-pattern — the top and bottom angles are equal, and the left and right angles are equal.' },
  { file: 'story-A-3-01', style: 'statement', text: '"Co-interior angles!" Wei Kang exclaims, reviewing the blueprint. The two parallel service corridors, connected by a diagonal walkway, created exactly the C-shape pattern his geometry teacher had described. "If one angle is 75°, the other must be 105°. They sum to 180°!"' },
  { file: 'story-A-3-02', style: 'emphasis',  text: 'Co-interior angles on parallel lines are supplementary — they add up to 180°. Spot the C-shape between the parallel lines!' },
  { file: 'story-A-4-01', style: 'statement', text: 'Standing at Merlion Park, Priya counts the straight sight-lines radiating from the viewing platform — six of them, like the spokes of a wheel. "Six angles, all around a point," she thinks. "They must sum to 360°."' },
  { file: 'story-A-4-02', style: 'emphasis',  text: 'Angles at a point — all angles meeting at a single point complete a full revolution and therefore sum to 360°. This is why a pie chart uses 360° for the full circle!' },

  // STORY B
  { file: 'story-B-0-01', style: 'statement', text: 'Wei Kang\'s robotic arms must form perfect triangles in their frame design. "The angle sum theorem is everything," he tells his trainee. "In any triangle — no matter how stretched, squashed, or twisted — the three angles always add up to exactly 180°."' },
  { file: 'story-B-0-02', style: 'emphasis',  text: 'The interior angle sum of any triangle is always 180°. This is one of the most fundamental and reliable facts in all of geometry — it works for every triangle ever drawn!' },
  { file: 'story-B-1-01', style: 'statement', text: "Siti admires the Esplanade's exterior spikes. \"Each spike is an isosceles triangle,\" she sketches. \"The two equal sides mean the base angles are equal — always!\" She measures: apex angle 36°, base angles each 72°. 36 plus 72 plus 72 equals 180. Perfect!" },
  { file: 'story-B-1-02', style: 'emphasis',  text: 'In an isosceles triangle, the two equal sides produce two equal base angles. If you know the apex angle, each base angle equals 180° minus the apex, divided by 2.' },
  { file: 'story-B-2-01', style: 'statement', text: '"Congruent triangles!" Priya explains to her class at the Science Centre exhibit. "These two triangular panels look identical — let\'s prove it using SSS. Side 1: 5cm each. Side 2: 8cm each. Side 3: 6cm each. All three pairs match — SSS congruence confirmed!"' },
  { file: 'story-B-2-02', style: 'emphasis',  text: 'Congruence means same shape AND same size. SSS — Side-Side-Side — is one way to prove two triangles are congruent. If all three sides of one triangle equal all three sides of another, they are congruent.' },
  { file: 'story-B-3-01', style: 'statement', text: '"The hexagonal tiles in the food court ceiling," Wei Kang points up, "form a perfect tessellation. Each hexagon has interior angle 120°. Three meet at every vertex: 3 times 120° equals 360°. That\'s why they fit together with no gaps!"' },
  { file: 'story-B-3-02', style: 'emphasis',  text: 'The interior angle sum of a polygon with n sides equals (n minus 2) times 180°. For a regular hexagon, that is 120° per angle. Three hexagons at a vertex give 3 times 120° equals 360° — perfect tessellation!' },
  { file: 'story-B-4-01', style: 'statement', text: '"The park\'s star-shaped flower beds use exterior angles," Siti discovers. "Five points in a star. Each point is an exterior angle. And the sum of all exterior angles of any convex polygon — whatever the number of sides — is always 360°!"' },
  { file: 'story-B-4-02', style: 'emphasis',  text: 'The sum of exterior angles of any convex polygon is always 360°. For a regular polygon with n sides, each exterior angle equals 360° divided by n. This fact is truly universal!' },

  // STORY C
  { file: 'story-C-0-01', style: 'statement', text: 'Priya is renovating her Tampines HDB flat. "Before I buy tiles," she explains to her daughter, "I need to find the exact area of this L-shaped floor. I split it into two rectangles and add them up. Mensuration saves me from buying too many — or too few — tiles!"' },
  { file: 'story-C-0-02', style: 'emphasis',  text: 'Composite shapes can be broken into simpler shapes. Add or subtract the areas of the components. Always sketch and label before calculating!' },
  { file: 'story-C-1-01', style: 'statement', text: '"The circular reservoir here," Wei Kang explains to school visitors, "holds millions of litres. Every time it rains, engineers calculate the water gain using Area equals π r squared. The beauty of π is that it connects a circle\'s radius to its area — perfectly!"' },
  { file: 'story-C-1-02', style: 'emphasis',  text: "A circle's area formula — A equals π r squared — means that if you double the radius, the area quadruples because r is squared. The circumference C equals 2 π r grows linearly with radius." },
  { file: 'story-C-2-01', style: 'statement', text: '"The supertrees," Siti sketches, "are basically cylinders with decorations. Volume equals π r squared h. If I know the volume and the radius, I can find how tall a cylindrical water pipe needs to be. This is mensuration in real engineering!"' },
  { file: 'story-C-2-02', style: 'emphasis',  text: 'Volume of a prism, including a cylinder, equals base area times height. For a cylinder: V equals π r squared h. This formula powers everything from water tank design to pipe engineering.' },
  { file: 'story-C-3-01', style: 'statement', text: '"I love how the Rain Vortex at Jewel is a perfect cylinder," Priya says. "Surface area equals 2 π r times the sum of r and h. This determines how much material the architects needed for the structure\'s walls. Mensuration isn\'t just maths — it\'s architecture, engineering, and cost management!"' },
  { file: 'story-C-3-02', style: 'emphasis',  text: 'Total surface area of a cylinder equals 2 π r squared plus 2 π r h for the two circular ends and the curved surface. Combined: 2 π r times the quantity r plus h.' },
  { file: 'story-C-4-01', style: 'statement', text: '"The eco-town of Tengah uses trapezoidal cross-section drainage channels. Volume equals one half of (a plus b) times h times length. Getting this wrong could mean flooding — mensuration literally keeps Singapore dry during monsoon season!"' },
  { file: 'story-C-4-02', style: 'emphasis',  text: 'For a trapezoidal prism: first find the cross-sectional area — one half of (a plus b) times h — then multiply by the length. This applies to drainage channels, pools, and many real structures.' },

  // SIMULATE
  { file: 'sim-A-0', style: 'instruction', text: 'Welcome to the Angle Sculptor. Drag the handles to sculpt angles and discover complementary and supplementary relationships for yourself.' },
  { file: 'sim-A-1', style: 'instruction', text: 'This is the Intersection Explorer. Cross two lines and watch the vertically opposite angle magic reveal itself in real time.' },
  { file: 'sim-A-2', style: 'instruction', text: 'Welcome to the Parallel Street Builder. Build Singapore streets with parallel lines and unlock the F, Z, and C angle patterns hidden inside them.' },
  { file: 'sim-B-0', style: 'instruction', text: 'This is the Triangle Angle Prover. Drag the triangle vertices and see for yourself — the angle sum never breaks 180°.' },
  { file: 'sim-B-1', style: 'instruction', text: 'Welcome to the Congruence Matcher. Your challenge is to identify which congruence rule — SSS, SAS, or ASA — proves that two triangles are identical.' },
  { file: 'sim-B-2', style: 'instruction', text: 'This is the Polygon Builder. Grow a polygon side by side and watch the interior angle sum climb with every new side you add.' },
  { file: 'sim-C-0', style: 'instruction', text: 'Welcome to the Area Painter. Paint shapes on the grid and compute their area interactively — see mensuration come alive!' },
  { file: 'sim-C-1', style: 'instruction', text: 'This is the Circle Unroller. Watch a circle unroll into a straight line and discover exactly why the circumference formula C equals 2 π r is true.' },
  { file: 'sim-C-2', style: 'instruction', text: 'Welcome to the Volume Filler. Fill a cylinder with virtual water and verify for yourself that V equals π r squared h.' },
  { file: 'sim-complete', style: 'celebration', text: 'Incredible work! You have completed all three simulation stations. You have earned 150 XP for mastering the simulation lab!' },
];

// ─── Generate ─────────────────────────────────────────────────────────────────
async function generateOne(phrase) {
  const outPath = path.join(OUT_DIR, `${phrase.file}.mp3`);

  if (fs.existsSync(outPath)) {
    console.log(`  ⏭  skip  ${phrase.file}.mp3  (already exists)`);
    return;
  }

  const settings = STYLE_SETTINGS[phrase.style] || STYLE_SETTINGS.statement;

  try {
    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': API_KEY,
          'Content-Type': 'application/json',
          Accept: 'audio/mpeg',
        },
        body: JSON.stringify({
          text: phrase.text,
          model_id: MODEL,
          voice_settings: settings,
        }),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      console.error(`  ✗  ${phrase.file}  →  HTTP ${res.status}: ${err}`);
      return;
    }

    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(outPath, buffer);
    console.log(`  ✓  ${phrase.file}.mp3`);
  } catch (e) {
    console.error(`  ✗  ${phrase.file}  →  ${e.message}`);
  }
}

async function main() {
  console.log(`\n🎙  Generating ${PHRASES.length} narration files → ${OUT_DIR}\n`);

  for (const phrase of PHRASES) {
    await generateOne(phrase);
    // 500 ms rate-limit between ElevenLabs calls
    await new Promise(r => setTimeout(r, 500));
  }

  console.log('\n✅  Done. Commit public/audio/narration/ to your repo.\n');
}

main().catch(e => { console.error(e); process.exit(1); });
