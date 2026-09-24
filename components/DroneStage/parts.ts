// Геометрические примитивы и узлы дронов (винт, мотор, подвес, крепёж).
// Перенос из ассета прототипа `0a1f01ac-…js`, раздел «geometry helpers», 1:1.

import type * as THREE from 'three';
import type { Mats, T3 } from './materials';

/** Профиль лопасти / крыла: замкнутый контур, выдавленный со скруглением. */
export function foil(T: T3, len: number, rootC: number, tipC: number, thick: number) {
  const s = new T.Shape();
  s.moveTo(0, -rootC * 0.42);
  s.quadraticCurveTo(len * 0.55, -rootC * 0.5, len * 0.94, -tipC * 0.45);
  s.quadraticCurveTo(len * 1.03, 0, len * 0.94, tipC * 0.55);
  s.quadraticCurveTo(len * 0.5, rootC * 0.62, 0, rootC * 0.58);
  s.quadraticCurveTo(-len * 0.03, 0, 0, -rootC * 0.42);
  const b = Math.min(thick * 0.45, 0.026);
  const g = new T.ExtrudeGeometry(s, {
    depth: Math.max(thick - b * 2, 0.004),
    bevelEnabled: true,
    bevelSegments: 5,
    bevelThickness: b,
    bevelSize: b,
    curveSegments: 26,
  });
  g.translate(0, 0, -thick / 2 + b);
  g.rotateX(-Math.PI / 2);
  return g;
}

/** Параллелепипед со скруглёнными рёбрами. */
export function rbox(T: T3, w: number, h: number, d: number, r: number) {
  const rr = Math.min(r, w / 2.2, h / 2.2, d / 2.2);
  const s = new T.Shape();
  const x = w / 2 - rr,
    y = h / 2 - rr;
  s.moveTo(-x, -y - rr);
  s.lineTo(x, -y - rr);
  s.quadraticCurveTo(x + rr, -y - rr, x + rr, -y);
  s.lineTo(x + rr, y);
  s.quadraticCurveTo(x + rr, y + rr, x, y + rr);
  s.lineTo(-x, y + rr);
  s.quadraticCurveTo(-x - rr, y + rr, -x - rr, y);
  s.lineTo(-x - rr, -y);
  s.quadraticCurveTo(-x - rr, -y - rr, -x, -y - rr);
  const g = new T.ExtrudeGeometry(s, {
    depth: d - rr * 2,
    bevelEnabled: true,
    bevelSegments: 6,
    bevelThickness: rr,
    bevelSize: rr,
    curveSegments: 18,
  });
  g.translate(0, 0, -(d / 2 - rr));
  return g;
}

export const lathe = (T: T3, pts: [number, number][], seg?: number) =>
  new T.LatheGeometry(
    pts.map((p) => new T.Vector2(p[0], p[1])),
    seg || 40,
  );

/* ---- мелкий крепёж и обвес ---- */

export function bolts(T: T3, m: Mats, radius: number, count: number, y: number, size: number) {
  const g = new T.Group();
  const geo = new T.CylinderGeometry(size, size * 1.15, size * 0.9, 6);
  for (let i = 0; i < count; i++) {
    const b = new T.Mesh(geo, m.shellLite);
    const a = (i / count) * Math.PI * 2;
    b.position.set(Math.cos(a) * radius, y, Math.sin(a) * radius);
    g.add(b);
  }
  return g;
}

export function seam(T: T3, m: Mats, r: number, y: number, th?: number) {
  const s = new T.Mesh(new T.TorusGeometry(r, th || 0.008, 6, 90), m.matte);
  s.rotation.x = Math.PI / 2;
  s.position.y = y;
  return s;
}

export function fins(T: T3, m: Mats, r: number, y: number, count: number, h: number, len: number) {
  const g = new T.Group();
  const geo = new T.BoxGeometry(len, h, 0.012);
  for (let i = 0; i < count; i++) {
    const f = new T.Mesh(geo, m.dark);
    const a = (i / count) * Math.PI * 2;
    f.position.set(Math.cos(a) * r, y, Math.sin(a) * r);
    f.rotation.y = -a;
    g.add(f);
  }
  return g;
}

export function grille(T: T3, m: Mats, w: number, d: number, rows: number) {
  const g = new T.Group();
  const geo = new T.BoxGeometry(w, 0.014, d / (rows * 2.1));
  for (let i = 0; i < rows; i++) {
    const s = new T.Mesh(geo, m.dark);
    s.position.z = (i / (rows - 1) - 0.5) * d;
    g.add(s);
  }
  return g;
}

export function antenna(T: T3, m: Mats, len: number) {
  const g = new T.Group();
  const rod = new T.Mesh(new T.CylinderGeometry(0.009, 0.007, len, 10), m.matte);
  rod.position.y = len / 2;
  g.add(rod);
  const tip = new T.Mesh(new T.SphereGeometry(0.014, 12, 10), m.shellLite);
  tip.position.y = len;
  g.add(tip);
  const base = new T.Mesh(new T.CylinderGeometry(0.02, 0.024, 0.03, 12), m.shellLite);
  g.add(base);
  return g;
}

export function cable(
  T: T3,
  m: Mats,
  a: THREE.Vector3,
  b: THREE.Vector3,
  sag: number,
  rad?: number,
) {
  const mid = a.clone().add(b).multiplyScalar(0.5);
  mid.y -= sag;
  const curve = new T.CatmullRomCurve3([a, mid, b]);
  return new T.Mesh(new T.TubeGeometry(curve, 16, rad || 0.009, 8, false), m.rubber);
}

/** Винт. `userData.spin` читает цикл анимации — именно он крутит лопасти. */
export function rotor(
  T: T3,
  m: Mats,
  bladeLen: number,
  chord: number,
  dir: number,
  blades?: number,
) {
  const g = new T.Group();
  const n = blades || 2;
  const hub = new T.Mesh(
    lathe(
      T,
      [
        [0, chord * 0.5],
        [chord * 0.4, chord * 0.54],
        [chord * 0.56, chord * 0.34],
        [chord * 0.64, chord * 0.18],
        [chord * 0.58, -chord * 0.3],
        [chord * 0.24, -chord * 0.42],
        [0, -chord * 0.42],
      ],
      30,
    ),
    m.shellLite,
  );
  g.add(hub);
  const nut = new T.Mesh(new T.CylinderGeometry(chord * 0.2, chord * 0.24, chord * 0.24, 6), m.shell);
  nut.position.y = chord * 0.6;
  g.add(nut);
  g.add(bolts(T, m, chord * 0.42, n, chord * 0.42, chord * 0.055));

  const geo = foil(T, bladeLen, chord, chord * 0.6, chord * 0.15);
  for (let i = 0; i < n; i++) {
    const holder = new T.Group();
    const b = new T.Mesh(geo, m.blade);
    b.position.x = chord * 0.4;
    b.rotation.x = 0.17;
    b.castShadow = true;
    holder.add(b);
    const stripe = new T.Mesh(new T.BoxGeometry(bladeLen * 0.1, 0.006, chord * 0.5), m.led);
    stripe.position.set(bladeLen * 0.9, 0.012, 0);
    stripe.rotation.x = 0.17;
    holder.add(stripe);
    const root = new T.Mesh(
      new T.CylinderGeometry(chord * 0.14, chord * 0.16, chord * 0.3, 12),
      m.shell,
    );
    root.rotation.z = Math.PI / 2;
    root.position.x = chord * 0.42;
    holder.add(root);
    holder.rotation.y = (i / n) * Math.PI * 2;
    g.add(holder);
  }
  g.userData.spin = 2.4 * (dir || 1);
  return g;
}

export function motor(T: T3, m: Mats, r: number, h: number) {
  const g = new T.Group();
  const bell = new T.Mesh(
    lathe(
      T,
      [
        [0, -h * 0.5],
        [r * 0.86, -h * 0.52],
        [r, -h * 0.3],
        [r * 0.99, -h * 0.02],
        [r, h * 0.26],
        [r * 0.9, h * 0.5],
        [r * 0.5, h * 0.56],
        [r * 0.22, h * 0.58],
        [0, h * 0.58],
      ],
      36,
    ),
    m.shellLite,
  );
  bell.castShadow = true;
  g.add(bell);
  g.add(fins(T, m, r * 0.99, 0, 22, h * 0.5, r * 0.1));
  const vent = new T.Mesh(new T.TorusGeometry(r * 0.78, r * 0.085, 10, 34), m.dark);
  vent.rotation.x = Math.PI / 2;
  vent.position.y = -h * 0.34;
  g.add(vent);
  const windings = new T.Mesh(
    new T.CylinderGeometry(r * 0.62, r * 0.62, h * 0.34, 26, 1, true),
    m.copper,
  );
  windings.position.y = -h * 0.3;
  g.add(windings);
  g.add(bolts(T, m, r * 0.5, 4, h * 0.56, r * 0.09));
  const shaft = new T.Mesh(new T.CylinderGeometry(r * 0.15, r * 0.15, h * 0.95, 16), m.shellLite);
  shaft.position.y = h * 0.62;
  g.add(shaft);
  const wires = new T.Mesh(new T.TorusGeometry(r * 0.34, r * 0.07, 8, 20, Math.PI), m.rubber);
  wires.rotation.set(Math.PI / 2, 0, 0);
  wires.position.y = -h * 0.52;
  g.add(wires);
  return g;
}

export function gimbal(T: T3, m: Mats, r: number) {
  const g = new T.Group();
  const yoke = new T.Mesh(new T.TorusGeometry(r * 1.2, r * 0.09, 14, 56, Math.PI * 1.25), m.shellLite);
  yoke.rotation.set(Math.PI / 2, 0, Math.PI * 0.62);
  g.add(yoke);
  const axis = new T.Mesh(new T.CylinderGeometry(r * 0.12, r * 0.12, r * 2.5, 16), m.shellLite);
  axis.rotation.z = Math.PI / 2;
  g.add(axis);
  const body = new T.Mesh(
    lathe(
      T,
      [
        [0, -r * 0.9],
        [r * 0.72, -r * 0.92],
        [r * 0.95, -r * 0.55],
        [r * 0.98, r * 0.4],
        [r * 0.72, r * 0.85],
        [r * 0.3, r * 0.95],
        [0, r * 0.95],
      ],
      36,
    ),
    m.shell,
  );
  body.rotation.x = Math.PI / 2;
  body.castShadow = true;
  g.add(body);
  const barrel = new T.Mesh(
    lathe(
      T,
      [
        [0, 0],
        [r * 0.62, 0],
        [r * 0.68, r * 0.18],
        [r * 0.6, r * 0.26],
        [r * 0.63, r * 0.46],
        [r * 0.52, r * 0.54],
        [0, r * 0.56],
      ],
      36,
    ),
    m.matte,
  );
  barrel.rotation.x = Math.PI / 2;
  barrel.position.z = r * 0.75;
  g.add(barrel);
  const trim = new T.Mesh(new T.TorusGeometry(r * 0.6, r * 0.045, 10, 40), m.shellLite);
  trim.position.z = r * 1.0;
  g.add(trim);
  const lens = new T.Mesh(
    new T.SphereGeometry(r * 0.5, 32, 22, 0, Math.PI * 2, 0, Math.PI / 2),
    m.glass,
  );
  lens.rotation.x = Math.PI / 2;
  lens.position.z = r * 1.24;
  lens.scale.y = 0.42;
  g.add(lens);
  const iris = new T.Mesh(new T.RingGeometry(r * 0.2, r * 0.42, 40), m.dark);
  iris.position.z = r * 1.14;
  g.add(iris);
  return g;
}
