import { BufferAttribute, BufferGeometry, Color, MeshBasicMaterial } from "three";
import { MarchingCubes } from "three/examples/jsm/objects/MarchingCubes.js";

/**
 * Geometria do dente 3D (issue #73), gerada no navegador a partir de uma
 * funcao de distancia (SDF): um molar estilizado, coroa com quatro cuspides e
 * duas raizes. Nada de arquivo de modelo para baixar: o formato e codigo,
 * leve e com licenca propria.
 *
 * Como funciona: a SDF diz, para cada ponto do espaco, a distancia ate a
 * superficie do dente (negativa por dentro). Ela e amostrada numa grade e o
 * `MarchingCubes` do three.js extrai a superficie. As formas se juntam com
 * uniao suave (`smin`), por isso o dente sai organico, sem emendas.
 *
 * Coordenadas: y para cima, dente dentro do cubo [-1, 1]. Coroa em cima
 * (y > 0), raizes para baixo.
 */

type Vec3 = [number, number, number];

function length3(x: number, y: number, z: number) {
  return Math.sqrt(x * x + y * y + z * z);
}

/** Uniao suave (Inigo Quilez): junta duas formas com um "filete" de raio k. */
function smin(a: number, b: number, k: number) {
  const h = Math.max(k - Math.abs(a - b), 0) / k;
  return Math.min(a, b) - h * h * k * 0.25;
}

/** Subtracao suave: tira b de a, com borda arredondada. */
function smax(a: number, b: number, k: number) {
  return -smin(-a, -b, k);
}

function sdSphere(px: number, py: number, pz: number, c: Vec3, r: number) {
  return length3(px - c[0], py - c[1], pz - c[2]) - r;
}

/** Caixa arredondada centrada em c, meia-medida b, raio de canto r. */
function sdRoundBox(px: number, py: number, pz: number, c: Vec3, b: Vec3, r: number) {
  const qx = Math.abs(px - c[0]) - b[0];
  const qy = Math.abs(py - c[1]) - b[1];
  const qz = Math.abs(pz - c[2]) - b[2];
  const outside = length3(Math.max(qx, 0), Math.max(qy, 0), Math.max(qz, 0));
  const inside = Math.min(Math.max(qx, Math.max(qy, qz)), 0);
  return outside + inside - r;
}

/** Cone de pontas arredondadas de a (raio r1) ate b (raio r2): a raiz. */
function sdRoundCone(px: number, py: number, pz: number, a: Vec3, b: Vec3, r1: number, r2: number) {
  const bax = b[0] - a[0];
  const bay = b[1] - a[1];
  const baz = b[2] - a[2];
  const l2 = bax * bax + bay * bay + baz * baz;
  const rr = r1 - r2;
  const a2 = l2 - rr * rr;
  const il2 = 1 / l2;

  const pax = px - a[0];
  const pay = py - a[1];
  const paz = pz - a[2];
  const y = pax * bax + pay * bay + paz * baz;
  const z = y - l2;
  const cx = pax * l2 - bax * y;
  const cy = pay * l2 - bay * y;
  const cz = paz * l2 - baz * y;
  const x2 = cx * cx + cy * cy + cz * cz;
  const y2 = y * y * l2;
  const z2 = z * z * l2;

  const k = Math.sign(rr) * rr * rr * x2;
  if (Math.sign(z) * a2 * z2 > k) return Math.sqrt(x2 + z2) * il2 - r2;
  if (Math.sign(y) * a2 * y2 < k) return Math.sqrt(x2 + y2) * il2 - r1;
  return (Math.sqrt(x2 * a2 * il2) + y * rr) * il2 - r1;
}

/** Elipsoide centrado em c com raios r (aproximacao de Inigo Quilez). */
function sdEllipsoid(px: number, py: number, pz: number, c: Vec3, r: Vec3) {
  const x = px - c[0];
  const y = py - c[1];
  const z = pz - c[2];
  const k0 = length3(x / r[0], y / r[1], z / r[2]);
  const k1 = length3(x / (r[0] * r[0]), y / (r[1] * r[1]), z / (r[2] * r[2]));
  return (k0 * (k0 - 1)) / k1;
}

/** Raiz em dois trechos (colo -> meio -> ponta), para ela curvar de leve. */
interface Root {
  neck: Vec3;
  mid: Vec3;
  tip: Vec3;
  radius: [number, number, number];
}

// Molar superior: duas raizes vestibulares (frente) e a palatina (tras), longas,
// afinando e curvando um pouco, como no modelo de referencia enviado pelo usuario.
const ROOTS: Root[] = [
  { neck: [-0.24, 0.05, 0.14], mid: [-0.3, -0.42, 0.18], tip: [-0.25, -0.86, 0.15], radius: [0.19, 0.13, 0.045] },
  { neck: [0.24, 0.05, 0.14], mid: [0.26, -0.45, 0.2], tip: [0.16, -0.92, 0.16], radius: [0.19, 0.13, 0.045] },
  { neck: [0, 0.05, -0.18], mid: [0.05, -0.42, -0.3], tip: [0.11, -0.84, -0.33], radius: [0.21, 0.14, 0.05] },
];

const CUSPS: Vec3[] = [
  [-0.25, 0.73, -0.23],
  [0.25, 0.74, -0.23],
  [-0.25, 0.72, 0.23],
  [0.25, 0.73, 0.23],
];

/** Rampa suave (max(0, x) sem quina): evita vinco na superficie onde a coroa afina. */
function softRamp(x: number) {
  return 0.5 * (x + Math.sqrt(x * x + 0.03));
}

/** Distancia ate a superficie do molar. */
export function toothSdf(px: number, py: number, pz: number) {
  // Coroa bojuda: mais larga no meio, afinando para o colo.
  const taper = 1 + softRamp(0.5 - py) * 0.5;
  let d = sdRoundBox(px * taper, py, pz * taper, [0, 0.46, 0], [0.3, 0.18, 0.26], 0.25);

  // Quatro cuspides macias no topo.
  for (const cusp of CUSPS) {
    d = smin(d, sdSphere(px, py, pz, cusp, 0.2), 0.24);
  }

  // Fossa central: a "covinha" entre as cuspides.
  d = smax(d, -sdSphere(px, py, pz, [0, 1.0, 0], 0.27), 0.2);

  // Colo do dente (tronco das raizes), liga a coroa as raizes sem degrau.
  d = smin(d, sdEllipsoid(px, py, pz, [0, 0.05, 0], [0.42, 0.2, 0.36]), 0.12);

  let roots = Infinity;
  for (const root of ROOTS) {
    const upper = sdRoundCone(px, py, pz, root.neck, root.mid, root.radius[0], root.radius[1]);
    const lower = sdRoundCone(px, py, pz, root.mid, root.tip, root.radius[1], root.radius[2]);
    roots = smin(roots, smin(upper, lower, 0.08), 0.1);
  }
  return smin(d, roots, 0.18);
}

/** Limites do dente (com folga): fora deles nem calcula a SDF. */
const BOUNDS = { x: 0.66, zMin: -0.62, zMax: 0.62, yMin: -1.03, yMax: 1.02 };

/** Cores por altura: esmalte branco na coroa, raiz marfim (como no modelo de referencia). */
const ENAMEL = new Color("#f3f6f9");
const ROOT = new Color("#ecd9ab");

/**
 * Amostra a SDF e devolve uma `BufferGeometry` compacta (so os triangulos
 * gerados, com normais e cor por vertice). `resolution` alto = mais
 * detalhe e mais tempo de geracao; 64 fica abaixo de 60 ms num celular medio.
 */
export function createToothGeometry(resolution = 84) {
  const placeholder = new MeshBasicMaterial();
  const cubes = new MarchingCubes(resolution, placeholder, false, false, 80000);
  cubes.isolation = 0;

  const size = cubes.size;
  const half = size / 2;
  // O dente ocupa ~88% do cubo: sobra margem para a superficie fechar.
  const scale = 1.12;
  const offsetY = -0.01;
  const field = cubes.field;
  for (let z = 0; z < size; z++) {
    const fz = ((z - half) / half) * scale;
    for (let y = 0; y < size; y++) {
      const fy = ((y - half) / half) * scale + offsetY;
      for (let x = 0; x < size; x++) {
        const fx = ((x - half) / half) * scale;
        const outside =
          Math.abs(fx) > BOUNDS.x || fz < BOUNDS.zMin || fz > BOUNDS.zMax || fy < BOUNDS.yMin || fy > BOUNDS.yMax;
        field[x + y * size + z * size * size] = outside ? -0.2 : -toothSdf(fx, fy, fz);
      }
    }
  }
  cubes.update();

  const count = cubes.count;
  const positions = cubes.positionArray.slice(0, count * 3);
  const normals = cubes.normalArray.slice(0, count * 3);
  const colors = new Float32Array(count * 3);
  const mixed = new Color();

  for (let i = 0; i < count; i++) {
    const nx = normals[i * 3];
    const ny = normals[i * 3 + 1];
    const nz = normals[i * 3 + 2];
    const inv = 1 / (Math.hypot(nx, ny, nz) || 1);
    normals[i * 3] = nx * inv;
    normals[i * 3 + 1] = ny * inv;
    normals[i * 3 + 2] = nz * inv;

    // Transicao esmalte -> raiz a partir do colo do dente, suave (y em unidades da SDF).
    const y = positions[i * 3 + 1] * scale + offsetY;
    const t = Math.min(1, Math.max(0, (0.1 - y) / 0.45));
    const smooth = t * t * (3 - 2 * t);
    mixed.copy(ENAMEL).lerp(ROOT, smooth);
    colors[i * 3] = mixed.r;
    colors[i * 3 + 1] = mixed.g;
    colors[i * 3 + 2] = mixed.b;
  }

  cubes.geometry.dispose();
  placeholder.dispose();

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(positions, 3));
  geometry.setAttribute("normal", new BufferAttribute(normals, 3));
  geometry.setAttribute("color", new BufferAttribute(colors, 3));
  // Centraliza: o giro acontece em torno do meio do dente, nao da origem da grade.
  geometry.center();
  geometry.computeBoundingSphere();
  return geometry;
}
