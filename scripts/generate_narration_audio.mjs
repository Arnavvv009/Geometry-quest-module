/**
 * generate_narration_audio.mjs
 * ESM script — run with:  node scripts/generate_narration_audio.mjs
 *
 * Reads VITE_ELEVENLABS_API_KEY from .env.local
 * Generates all phase-narration mp3s into public/audio/narration/
 */
import fs   from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── load .env.local ──────────────────────────────────────────────────────────
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const eq = line.indexOf('=');
    if (eq === -1) return;
    const key = line.slice(0, eq).trim();
    const val = line.slice(eq + 1).trim();
    if (key && !key.startsWith('#')) process.env[key] = val;
  });
}

const API_KEY  = process.env.VITE_ELEVENLABS_API_KEY;
const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2';   // Alice
const MODEL    = 'eleven_multilingual_v2';
const OUT_DIR  = path.join(__dirname, '..', 'public', 'audio', 'narration');

if (!API_KEY || API_KEY === 'your_elevenlabs_api_key_here') {
  console.error('❌  Add VITE_ELEVENLABS_API_KEY to .env.local first.');
  process.exit(1);
}

fs.mkdirSync(OUT_DIR, { recursive: true });

// ── voice settings ────────────────────────────────────────────────────────────
const S = {
  statement:     { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true },
  instruction:   { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true },
  question:      { stability: 0.20, similarity_boost: 0.55, style: 0.55, use_speaker_boost: true },
  emphasis:      { stability: 0.16, similarity_boost: 0.50, style: 0.60, use_speaker_boost: true },
  thinking:      { stability: 0.24, similarity_boost: 0.60, style: 0.35, use_speaker_boost: true },
  celebration:   { stability: 0.12, similarity_boost: 0.45, style: 0.75, use_speaker_boost: true },
  encouragement: { stability: 0.16, similarity_boost: 0.50, style: 0.65, use_speaker_boost: true },
};

// ── phrases ───────────────────────────────────────────────────────────────────
const PHRASES = [
  // INTRO
  { f: 'intro-01', s: 'statement',   t: 'Welcome to GeoQuest! Your geometry adventure through Singapore starts here.' },
  { f: 'intro-02', s: 'instruction', t: 'Choose a unit below to begin — each one takes you deeper into the hidden geometry of the city.' },

  // WONDER A
  { f: 'wonder-A-01', s: 'statement', t: "Did you know that the Marina Bay Sands hotel uses precise angle calculations in its sky bridge? Every intersection, every tilt is a geometric secret waiting to be unlocked." },
  { f: 'wonder-A-02', s: 'thinking',  t: "Why do HDB blocks have windows at specific angles? To maximise airflow! Complementary angles of 30 and 60 degrees create the optimal cross-ventilation for Singapore's tropical climate." },
  { f: 'wonder-A-03', s: 'statement', t: "Engineers use the corresponding angles theorem to keep MRT tracks perfectly parallel for kilometres. When two parallel lines are cut by a transversal, corresponding angles are equal — allowing precision track alignment." },
  { f: 'wonder-A-04', s: 'question',  t: "Here is your real-world challenge. In Singapore, bus stops have shelters tilted at 15 degrees to the ground. What angle do they make with a vertical wall?" },

  // WONDER B
  { f: 'wonder-B-01', s: 'statement', t: "The triangle is the strongest shape in engineering. From the Esplanade's iconic rooftop to HDB corridor beams, triangles hold Singapore together — literally!" },
  { f: 'wonder-B-02', s: 'thinking',  t: "Why are rooftop trusses always triangular? Triangles are rigid — their shape cannot be changed without changing the length of a side. A triangle's angle sum of 180 degrees locks it in place, making it the ideal structural shape." },
  { f: 'wonder-B-03', s: 'statement', t: "Engineers verified the Cavenagh Bridge is symmetric by using congruence! By proving the two sides are congruent triangles using the SAS rule, they guaranteed perfect symmetry without measuring every angle individually." },
  { f: 'wonder-B-04', s: 'question',  t: "Here is your challenge. The equilateral triangular segments of a rooftop have angles 60, 60, 60 degrees. If one angle is increased to 80 degrees, what must happen to make it still a valid triangle?" },

  // WONDER C
  { f: 'wonder-C-01', s: 'statement', t: "Every tile in an HDB flat, every litre of water in the reservoirs, every square metre of green space in Gardens by the Bay — all require precise mensuration. This unit unlocks the maths behind Singapore's urban landscape." },
  { f: 'wonder-C-02', s: 'thinking',  t: "Bedok Reservoir holds about 10 million cubic metres of water. Engineers use volume formulas — plus complex composite shapes — to calculate water volume exactly. That is what you will master in this unit!" },
  { f: 'wonder-C-03', s: 'statement', t: "Cylinders maximise volume relative to surface area — meaning less material for more storage. A cylinder's formula V equals pi r squared h makes it mathematically optimal for tanks." },
  { f: 'wonder-C-04', s: 'question',  t: "Here is your challenge. Emma wants to know if her circular HDB balcony mat with radius 50 centimetres has more area than a square mat with side 90 centimetres. Which is larger?" },

  // STORY A
  { f: 'story-A-0-01', s: 'statement', t: 'Alex stares at the holographic display. The new MRT track expansion needs to cross three existing bus routes — all running parallel to each other. If he gets the angles wrong, the trains will collide.' },
  { f: 'story-A-0-02', s: 'emphasis',  t: 'When two parallel lines are crossed by a transversal, corresponding angles are equal — this is the key to designing safe intersections.' },
  { f: 'story-A-1-01', s: 'statement', t: 'These are supplementary angles, Emma explains to a group of students, pointing at the corridor junction. See how the two angles on that straight wall add up to exactly 180 degrees? The architect used this property to create perfect T-junctions throughout the building!' },
  { f: 'story-A-1-02', s: 'emphasis',  t: 'Supplementary angles are formed on a straight line. They always sum to 180 degrees. When you see a straight line with angles on one side, you instantly know their sum!' },
  { f: 'story-A-2-01', s: 'statement', t: "Scarlet is designing a new tile pattern for the Supertrees. She notices that when two of her design lines cross, four angles form. The opposite angles are always the same — the butterfly shape of her tiles is all vertically opposite angles!" },
  { f: 'story-A-2-02', s: 'emphasis',  t: 'Vertically opposite angles are always equal when two straight lines intersect. They form an X-pattern — the top and bottom angles are equal, and the left and right angles are equal.' },
  { f: 'story-A-3-01', s: 'statement', t: 'Co-interior angles! Alex exclaims, reviewing the blueprint. The two parallel service corridors, connected by a diagonal walkway, created exactly the C-shape pattern his geometry teacher had described. If one angle is 75 degrees, the other must be 105 degrees — they sum to 180!' },
  { f: 'story-A-3-02', s: 'emphasis',  t: 'Co-interior angles on parallel lines are supplementary — they add up to 180 degrees. Spot the C-shape between the parallel lines!' },
  { f: 'story-A-4-01', s: 'statement', t: 'Standing at Merlion Park, Emma counts the straight sight-lines radiating from the viewing platform — six of them, like the spokes of a wheel. Six angles, all around a point — they must sum to 360 degrees.' },
  { f: 'story-A-4-02', s: 'emphasis',  t: 'Angles at a point — all angles meeting at a single point complete a full revolution and therefore sum to 360 degrees. This is why a pie chart uses 360 degrees for the full circle!' },

  // STORY B
  { f: 'story-B-0-01', s: 'statement', t: 'Alex\'s robotic arms must form perfect triangles in their frame design. The angle sum theorem is everything, he tells his trainee. In any triangle — no matter how stretched, squashed, or twisted — the three angles always add up to exactly 180 degrees.' },
  { f: 'story-B-0-02', s: 'emphasis',  t: 'The interior angle sum of any triangle is always 180 degrees. This is one of the most fundamental and reliable facts in all of geometry — it works for every triangle ever drawn!' },
  { f: 'story-B-1-01', s: 'statement', t: "Scarlet admires the Esplanade's exterior spikes. Each spike is an isosceles triangle, she sketches. The two equal sides mean the base angles are equal — always! She measures: apex angle 36 degrees, base angles each 72 degrees. 36 plus 72 plus 72 equals 180. Perfect!" },
  { f: 'story-B-1-02', s: 'emphasis',  t: 'In an isosceles triangle, the two equal sides produce two equal base angles. If you know the apex angle, each base angle equals 180 degrees minus the apex, divided by 2.' },
  { f: 'story-B-2-01', s: 'statement', t: 'Congruent triangles! Emma explains to her class at the Science Centre exhibit. These two triangular panels look identical — let\'s prove it using SSS. Side 1: 5 centimetres each. Side 2: 8 centimetres each. Side 3: 6 centimetres each. All three pairs match — SSS congruence confirmed!' },
  { f: 'story-B-2-02', s: 'emphasis',  t: 'Congruence means same shape AND same size. SSS — Side-Side-Side — is one way to prove two triangles are congruent. If all three sides of one triangle equal all three sides of another, they are congruent.' },
  { f: 'story-B-3-01', s: 'statement', t: 'The hexagonal tiles in the food court ceiling form a perfect tessellation. Each hexagon has interior angle 120 degrees. Three meet at every vertex: 3 times 120 equals 360 degrees. That\'s why they fit together with no gaps!' },
  { f: 'story-B-3-02', s: 'emphasis',  t: 'The interior angle sum of a polygon with n sides equals n minus 2, times 180 degrees. For a regular hexagon, that is 120 degrees per angle. Three hexagons at a vertex give 360 degrees — perfect tessellation!' },
  { f: 'story-B-4-01', s: 'statement', t: 'The park\'s star-shaped flower beds use exterior angles, Scarlet discovers. Five points in a star. Each point is an exterior angle. And the sum of all exterior angles of any convex polygon — whatever the number of sides — is always 360 degrees!' },
  { f: 'story-B-4-02', s: 'emphasis',  t: 'The sum of exterior angles of any convex polygon is always 360 degrees. For a regular polygon with n sides, each exterior angle equals 360 degrees divided by n. This fact is truly universal!' },

  // STORY C
  { f: 'story-C-0-01', s: 'statement', t: 'Emma is renovating her Tampines HDB flat. Before I buy tiles, she explains to her daughter, I need to find the exact area of this L-shaped floor. I split it into two rectangles and add them up. Mensuration saves me from buying too many — or too few — tiles!' },
  { f: 'story-C-0-02', s: 'emphasis',  t: 'Composite shapes can be broken into simpler shapes. Add or subtract the areas of the components. Always sketch and label before calculating!' },
  { f: 'story-C-1-01', s: 'statement', t: 'The circular reservoir here holds millions of litres, Alex explains to school visitors. Every time it rains, engineers calculate the water gain using Area equals pi r squared. The beauty of pi is that it connects a circle\'s radius to its area — perfectly!' },
  { f: 'story-C-1-02', s: 'emphasis',  t: 'A circle\'s area formula — A equals pi r squared — means that if you double the radius, the area quadruples because r is squared. The circumference C equals 2 pi r grows linearly with radius.' },
  { f: 'story-C-2-01', s: 'statement', t: 'The supertrees are basically cylinders with decorations, Scarlet sketches. Volume equals pi r squared h. If I know the volume and the radius, I can find how tall a cylindrical water pipe needs to be. This is mensuration in real engineering!' },
  { f: 'story-C-2-02', s: 'emphasis',  t: 'Volume of a prism, including a cylinder, equals base area times height. For a cylinder: V equals pi r squared h. This formula powers everything from water tank design to pipe engineering.' },
  { f: 'story-C-3-01', s: 'statement', t: 'I love how the Rain Vortex at Jewel is a perfect cylinder, Emma says. Surface area equals 2 pi r times the sum of r and h. This determines how much material the architects needed for the structure\'s walls. Mensuration is not just maths — it\'s architecture, engineering, and cost management!' },
  { f: 'story-C-3-02', s: 'emphasis',  t: 'Total surface area of a cylinder equals 2 pi r squared plus 2 pi r h for the two circular ends and the curved surface. Combined: 2 pi r times the quantity r plus h.' },
  { f: 'story-C-4-01', s: 'statement', t: 'The eco-town of Tengah uses trapezoidal cross-section drainage channels. Volume equals one half of a plus b, times h, times length. Getting this wrong could mean flooding — mensuration literally keeps Singapore dry during monsoon season!' },
  { f: 'story-C-4-02', s: 'emphasis',  t: 'For a trapezoidal prism: first find the cross-sectional area — one half of a plus b, times h — then multiply by the length. This applies to drainage channels, pools, and many real structures.' },

  // SIMULATE
  { f: 'sim-A-0',      s: 'instruction', t: 'Welcome to the Angle Sculptor. Drag the handles to sculpt angles and discover complementary and supplementary relationships for yourself.' },
  { f: 'sim-A-1',      s: 'instruction', t: 'This is the Intersection Explorer. Cross two lines and watch the vertically opposite angle magic reveal itself in real time.' },
  { f: 'sim-A-2',      s: 'instruction', t: 'Welcome to the Parallel Street Builder. Build Singapore streets with parallel lines and unlock the F, Z, and C angle patterns hidden inside them.' },
  { f: 'sim-B-0',      s: 'instruction', t: 'This is the Triangle Angle Prover. Drag the triangle vertices and see for yourself — the angle sum never breaks 180 degrees.' },
  { f: 'sim-B-1',      s: 'instruction', t: 'Welcome to the Congruence Matcher. Your challenge is to identify which congruence rule — SSS, SAS, or ASA — proves that two triangles are identical.' },
  { f: 'sim-B-2',      s: 'instruction', t: 'This is the Polygon Builder. Grow a polygon side by side and watch the interior angle sum climb with every new side you add.' },
  { f: 'sim-C-0',      s: 'instruction', t: 'Welcome to the Area Painter. Paint shapes on the grid and compute their area interactively — see mensuration come alive!' },
  { f: 'sim-C-1',      s: 'instruction', t: 'This is the Circle Unroller. Watch a circle unroll into a straight line and discover exactly why the circumference formula C equals 2 pi r is true.' },
  { f: 'sim-C-2',      s: 'instruction', t: 'Welcome to the Volume Filler. Fill a cylinder with virtual water and verify for yourself that V equals pi r squared h.' },
  { f: 'sim-complete', s: 'celebration', t: 'Incredible work! You have completed all three simulation stations. You have earned 150 XP for mastering the simulation lab!' },
];

// ── generate one file ─────────────────────────────────────────────────────────
async function generateOne({ f, s, t }) {
  const outPath = path.join(OUT_DIR, `${f}.mp3`);
  if (fs.existsSync(outPath)) {
    console.log(`  ⏭  skip  ${f}.mp3`);
    return true;
  }

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
        text: t,
        model_id: MODEL,
        voice_settings: S[s] || S.statement,
      }),
    }
  );

  if (!res.ok) {
    const body = await res.text();
    console.error(`  ✗  ${f}  HTTP ${res.status}: ${body}`);
    return false;
  }

  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(outPath, buf);
  console.log(`  ✓  ${f}.mp3  (${buf.length} bytes)`);
  return true;
}

// ── main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log(`\n🎙  Generating ${PHRASES.length} narration mp3s`);
  console.log(`   Output → ${OUT_DIR}\n`);

  let ok = 0, skipped = 0, failed = 0;

  for (const phrase of PHRASES) {
    const outPath = path.join(OUT_DIR, `${phrase.f}.mp3`);
    if (fs.existsSync(outPath)) { skipped++; console.log(`  ⏭  skip  ${phrase.f}.mp3`); continue; }

    const success = await generateOne(phrase);
    if (success) ok++; else failed++;

    // 500 ms rate-limit between API calls
    await new Promise(r => setTimeout(r, 500));
  }

  console.log(`\n✅  Done — ${ok} generated, ${skipped} skipped, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

main().catch(e => { console.error(e); process.exit(1); });

