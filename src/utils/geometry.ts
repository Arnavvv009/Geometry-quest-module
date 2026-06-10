// ===== ANGLE CALCULATIONS =====
export const supplementary = (a: number) => 180 - a;
export const complementary = (a: number) => 90 - a;
export const isSupplementary = (a: number, b: number, tol = 2) => Math.abs(a + b - 180) <= tol;
export const isComplementary = (a: number, b: number, tol = 2) => Math.abs(a + b - 90) <= tol;
export const verticallyOpposite = (a: number) => a;
export const triangleThirdAngle = (a: number, b: number) => 180 - a - b;
export const exteriorAngle = (a: number, b: number) => a + b;

// ===== POLYGON CALCULATIONS =====
export const interiorAngleSum = (n: number) => (n - 2) * 180;
export const regularInteriorAngle = (n: number) => ((n - 2) * 180) / n;
export const exteriorAngleSum = () => 360;
export const regularExteriorAngle = (n: number) => 360 / n;
export const nSidesFromInteriorAngle = (angle: number) => 360 / (180 - angle);

// ===== AREA CALCULATIONS =====
export const areaRectangle = (l: number, w: number) => l * w;
export const areaTriangle = (b: number, h: number) => 0.5 * b * h;
export const areaParallelogram = (b: number, h: number) => b * h;
export const areaTrapezium = (a: number, b: number, h: number) => 0.5 * (a + b) * h;
export const areaCircle = (r: number) => Math.PI * r * r;
export const areaSector = (r: number, deg: number) => (deg / 360) * Math.PI * r * r;
export const circumference = (r: number) => 2 * Math.PI * r;
export const arcLength = (r: number, deg: number) => (deg / 360) * 2 * Math.PI * r;

// ===== PERIMETER =====
export const perimeterCircle = (r: number) => 2 * Math.PI * r;
export const perimeterRect = (l: number, w: number) => 2 * (l + w);

// ===== VOLUME =====
export const volumeCuboid = (l: number, w: number, h: number) => l * w * h;
export const volumePrism = (baseArea: number, length: number) => baseArea * length;
export const volumeCylinder = (r: number, h: number) => Math.PI * r * r * h;

// ===== SURFACE AREA =====
export const saCuboid = (l: number, w: number, h: number) => 2 * (l * w + l * h + w * h);
export const saCylinder = (r: number, h: number) => 2 * Math.PI * r * (r + h);

// ===== FORMAT =====
export const formatDecimal = (n: number, dp = 2) => Number(n.toFixed(dp));
export const formatPi = (n: number) => `${formatDecimal(n / Math.PI)}π`;
export const cm3ToLitres = (cm3: number) => cm3 / 1000;
export const m3ToLitres = (m3: number) => m3 * 1000;

// ===== SVG HELPERS =====
export const polarToCart = (angleDeg: number, r: number, cx = 0, cy = 0) => ({
  x: cx + r * Math.cos((angleDeg - 90) * Math.PI / 180),
  y: cy + r * Math.sin((angleDeg - 90) * Math.PI / 180),
});

export const arcPath = (cx: number, cy: number, r: number, startA: number, endA: number): string => {
  const s = polarToCart(startA, r, cx, cy);
  const e = polarToCart(endA, r, cx, cy);
  const large = (endA - startA) > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y} Z`;
};

export const calcAngleFromPoints = (p1: {x:number,y:number}, vertex: {x:number,y:number}, p2: {x:number,y:number}): number => {
  const v1 = { x: p1.x - vertex.x, y: p1.y - vertex.y };
  const v2 = { x: p2.x - vertex.x, y: p2.y - vertex.y };
  const dot = v1.x * v2.x + v1.y * v2.y;
  const mag1 = Math.sqrt(v1.x ** 2 + v1.y ** 2);
  const mag2 = Math.sqrt(v2.x ** 2 + v2.y ** 2);
  if (mag1 === 0 || mag2 === 0) return 0;
  const cosA = Math.min(1, Math.max(-1, dot / (mag1 * mag2)));
  return Math.round(Math.acos(cosA) * 180 / Math.PI);
};

export const degreesToRad = (deg: number) => deg * Math.PI / 180;

export const pointOnCircle = (cx: number, cy: number, r: number, angleDeg: number) => ({
  x: cx + r * Math.cos(degreesToRad(angleDeg)),
  y: cy - r * Math.sin(degreesToRad(angleDeg)),
});

export const smallArcPath = (cx: number, cy: number, r: number, startDeg: number, endDeg: number): string => {
  const s = pointOnCircle(cx, cy, r, startDeg);
  const e = pointOnCircle(cx, cy, r, endDeg);
  const diff = ((endDeg - startDeg) + 360) % 360;
  const large = diff > 180 ? 1 : 0;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 0 ${e.x} ${e.y}`;
};
