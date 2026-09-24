// Три процедурные модели дронов + точки-хотспоты.
// Перенос из ассета прототипа `0a1f01ac-…js` (buildHeavy / buildLight / buildFast), 1:1.

import type * as THREE from 'three';
import type { Mats, T3 } from './materials';
import { antenna, bolts, cable, fins, foil, gimbal, grille, lathe, motor, rbox, rotor, seam } from './parts';

/* ---------- 1. HEAVY — гексакоптер ---------- */
export function buildHeavy(T: T3, m: Mats): THREE.Group {
  const root = new T.Group();
  const hull = new T.Mesh(
    lathe(
      T,
      [
        [0, -0.2],
        [0.5, -0.22],
        [0.72, -0.1],
        [0.76, 0.04],
        [0.66, 0.16],
        [0.46, 0.26],
        [0.24, 0.3],
        [0, 0.31],
      ],
      56,
    ),
    m.shell,
  );
  hull.castShadow = true;
  root.add(hull);
  const cap = new T.Mesh(
    lathe(
      T,
      [
        [0, 0.3],
        [0.3, 0.29],
        [0.44, 0.22],
        [0.46, 0.16],
        [0, 0.16],
      ],
      48,
    ),
    m.panel,
  );
  root.add(cap);
  root.add(seam(T, m, 0.455, 0.222, 0.009));
  root.add(seam(T, m, 0.62, 0.19, 0.008));
  root.add(bolts(T, m, 0.38, 8, 0.292, 0.016));
  const belt = new T.Mesh(new T.TorusGeometry(0.735, 0.034, 16, 90), m.carbon);
  belt.rotation.x = Math.PI / 2;
  belt.position.y = -0.02;
  root.add(belt);
  root.add(fins(T, m, 0.7, 0.06, 34, 0.09, 0.07));
  const label = new T.Mesh(new T.PlaneGeometry(0.4, 0.2), m.decal);
  label.rotation.x = -Math.PI / 2;
  label.position.set(0.02, 0.305, 0.06);
  root.add(label);
  for (const s of [-1, 1]) {
    const ant = antenna(T, m, 0.34);
    ant.position.set(s * 0.3, 0.28, -0.2);
    ant.rotation.z = s * 0.2;
    root.add(ant);
  }

  for (let i = 0; i < 6; i++) {
    const arm = new T.Group();
    const tube = new T.Mesh(new T.CapsuleGeometry(0.055, 1.2, 14, 28), m.carbon);
    tube.rotation.z = Math.PI / 2;
    tube.position.x = 1.0;
    tube.castShadow = true;
    arm.add(tube);
    const collar = new T.Mesh(new T.CylinderGeometry(0.086, 0.076, 0.13, 26), m.shellLite);
    collar.rotation.z = Math.PI / 2;
    collar.position.x = 0.52;
    arm.add(collar);
    const clamp = new T.Mesh(new T.TorusGeometry(0.062, 0.014, 8, 26), m.matte);
    clamp.rotation.y = Math.PI / 2;
    clamp.position.x = 1.3;
    arm.add(clamp);
    const loom = cable(
      T,
      m,
      new T.Vector3(0.6, -0.03, 0.03),
      new T.Vector3(1.55, -0.04, 0.02),
      0.05,
      0.011,
    );
    arm.add(loom);
    const mount = new T.Mesh(
      lathe(
        T,
        [
          [0, -0.02],
          [0.12, -0.03],
          [0.14, 0.05],
          [0.08, 0.09],
          [0, 0.09],
        ],
        28,
      ),
      m.shellLite,
    );
    mount.position.set(1.62, 0.02, 0);
    arm.add(mount);
    const esc = new T.Mesh(rbox(T, 0.16, 0.045, 0.1, 0.016), m.matte);
    esc.position.set(1.3, -0.075, 0);
    arm.add(esc);
    const mo = motor(T, m, 0.105, 0.19);
    mo.position.set(1.62, 0.16, 0);
    arm.add(mo);
    const rt = rotor(T, m, 0.92, 0.11, i % 2 ? 1 : -1);
    rt.position.set(1.62, 0.32, 0);
    arm.add(rt);
    const led = new T.Mesh(new T.CapsuleGeometry(0.026, 0.08, 8, 14), i < 3 ? m.led : m.ledB);
    led.rotation.x = Math.PI / 2;
    led.position.set(1.6, -0.05, 0.07);
    arm.add(led);
    arm.rotation.y = (i / 6) * Math.PI * 2 + Math.PI / 6;
    root.add(arm);
  }

  for (const s of [-1, 1]) {
    const leg = new T.Mesh(new T.TorusGeometry(0.62, 0.031, 12, 54, Math.PI * 0.55), m.shellLite);
    leg.rotation.set(0, s > 0 ? 0 : Math.PI, s > 0 ? -Math.PI * 0.78 : Math.PI * 0.78);
    leg.position.set(s * 0.34, -0.18, 0);
    root.add(leg);
    const skid = new T.Mesh(new T.CapsuleGeometry(0.035, 1.9, 12, 24), m.shell);
    skid.rotation.x = Math.PI / 2;
    skid.position.set(s * 0.78, -0.86, 0);
    root.add(skid);
    for (const z of [-0.86, 0.86]) {
      const shoe = new T.Mesh(new T.CapsuleGeometry(0.04, 0.16, 8, 16), m.rubber);
      shoe.rotation.x = Math.PI / 2;
      shoe.position.set(s * 0.78, -0.865, z);
      root.add(shoe);
    }
    for (const z of [-0.62, 0.62]) {
      const strut = new T.Mesh(new T.CapsuleGeometry(0.026, 0.5, 8, 16), m.shell);
      strut.position.set(s * 0.6, -0.62, z);
      strut.rotation.z = s * 0.34;
      root.add(strut);
      const joint = new T.Mesh(new T.SphereGeometry(0.035, 16, 12), m.shellLite);
      joint.position.set(s * 0.7, -0.845, z);
      root.add(joint);
    }
    const battery = new T.Mesh(rbox(T, 0.3, 0.14, 0.46, 0.04), m.matte);
    battery.position.set(s * 0.2, -0.26, -0.02);
    root.add(battery);
  }

  const neck = new T.Mesh(
    lathe(
      T,
      [
        [0, 0],
        [0.13, -0.01],
        [0.11, -0.14],
        [0.06, -0.2],
        [0, -0.2],
      ],
      30,
    ),
    m.dark,
  );
  neck.position.y = -0.18;
  root.add(neck);
  const damp = new T.Mesh(new T.TorusGeometry(0.1, 0.022, 10, 30), m.rubber);
  damp.rotation.x = Math.PI / 2;
  damp.position.y = -0.29;
  root.add(damp);
  const gb = gimbal(T, m, 0.26);
  gb.position.set(0, -0.52, 0.02);
  root.add(gb);
  root.userData.base = 1.0;
  return root;
}

/* ---------- 2. ULTRA LIGHT — складной квадрокоптер, строгая симметрия ---------- */
export function buildLight(T: T3, m: Mats): THREE.Group {
  const root = new T.Group();

  // фюзеляж: сужающийся корпус + отдельный верхний люк, всё зеркально по X и Z
  const body = new T.Mesh(rbox(T, 0.54, 0.19, 0.86, 0.075), m.shell);
  body.castShadow = true;
  root.add(body);
  const shoulder = new T.Mesh(rbox(T, 0.58, 0.1, 0.5, 0.05), m.shell);
  shoulder.position.y = 0.02;
  root.add(shoulder);
  const hatch = new T.Mesh(rbox(T, 0.42, 0.11, 0.56, 0.05), m.panel);
  hatch.position.y = 0.135;
  root.add(hatch);
  const hatchSeam = new T.Mesh(rbox(T, 0.44, 0.012, 0.58, 0.05), m.matte);
  hatchSeam.position.y = 0.085;
  root.add(hatchSeam);
  root.add(bolts(T, m, 0.2, 4, 0.19, 0.012));

  // нос: скошенный блок + камера в утопленной люльке
  const nose = new T.Mesh(rbox(T, 0.34, 0.19, 0.24, 0.085), m.matte);
  nose.position.set(0, -0.025, 0.44);
  root.add(nose);
  const cradle = new T.Mesh(new T.TorusGeometry(0.115, 0.016, 12, 36, Math.PI), m.shellLite);
  cradle.rotation.set(Math.PI / 2, 0, 0);
  cradle.position.set(0, -0.04, 0.5);
  root.add(cradle);
  const cam = gimbal(T, m, 0.112);
  cam.position.set(0, -0.045, 0.55);
  root.add(cam);

  const vent = grille(T, m, 0.26, 0.2, 5);
  vent.position.set(0, 0.192, -0.14);
  root.add(vent);
  const label = new T.Mesh(new T.PlaneGeometry(0.26, 0.13), m.decal);
  label.rotation.x = -Math.PI / 2;
  label.position.set(0, 0.196, 0.1);
  root.add(label);

  // аккумулятор вставляется с хвоста
  const batt = new T.Mesh(rbox(T, 0.4, 0.12, 0.34, 0.028), m.matte);
  batt.position.set(0, 0.0, -0.28);
  root.add(batt);
  const battFace = new T.Mesh(rbox(T, 0.38, 0.1, 0.02, 0.012), m.dark);
  battFace.position.set(0, 0.0, -0.455);
  root.add(battFace);
  for (const s of [-1, 1]) {
    const latch = new T.Mesh(rbox(T, 0.07, 0.028, 0.04, 0.01), m.shellLite);
    latch.position.set(s * 0.12, 0.055, -0.44);
    root.add(latch);
    const gauge = new T.Mesh(new T.BoxGeometry(0.02, 0.012, 0.008), m.ledB);
    gauge.position.set(s * 0.05, -0.02, -0.462);
    root.add(gauge);
  }
  const tailLed = new T.Mesh(new T.CapsuleGeometry(0.018, 0.09, 8, 14), m.ledB);
  tailLed.rotation.z = Math.PI / 2;
  tailLed.position.set(0, 0.062, -0.47);
  root.add(tailLed);

  // передние сенсоры обхода + нижнее зрение, симметричными парами
  for (const s of [-1, 1]) {
    const sensor = new T.Mesh(new T.SphereGeometry(0.03, 20, 14), m.glass);
    sensor.position.set(s * 0.115, 0.015, 0.545);
    root.add(sensor);
    const bezel = new T.Mesh(new T.TorusGeometry(0.034, 0.007, 8, 24), m.shellLite);
    bezel.position.set(s * 0.115, 0.015, 0.55);
    root.add(bezel);
    const down = new T.Mesh(new T.CylinderGeometry(0.022, 0.022, 0.016, 18), m.glass);
    down.position.set(s * 0.1, -0.098, 0.1);
    root.add(down);
    const ant = antenna(T, m, 0.18);
    ant.position.set(s * 0.16, 0.185, -0.3);
    ant.rotation.z = s * 0.3;
    root.add(ant);
  }

  // четыре одинаковых луча по настоящему квадрату: 45° / 135° / 225° / 315°
  const ANG = [Math.PI / 4, -Math.PI / 4, Math.PI * 0.75, -Math.PI * 0.75];
  ANG.forEach((ang, i) => {
    const arm = new T.Group();
    const hinge = new T.Mesh(new T.CylinderGeometry(0.062, 0.062, 0.125, 28), m.shellLite);
    hinge.position.x = 0.02;
    arm.add(hinge);
    const hingePin = new T.Mesh(new T.CylinderGeometry(0.016, 0.016, 0.145, 14), m.matte);
    hingePin.position.x = 0.02;
    arm.add(hingePin);
    const hingeCap = new T.Mesh(new T.CylinderGeometry(0.03, 0.03, 0.15, 14), m.dark);
    hingeCap.position.x = 0.02;
    arm.add(hingeCap);

    const bar = new T.Mesh(new T.CapsuleGeometry(0.04, 0.6, 12, 24), m.carbon);
    bar.rotation.z = Math.PI / 2;
    bar.position.x = 0.38;
    bar.castShadow = true;
    arm.add(bar);
    const sleeve = new T.Mesh(new T.CylinderGeometry(0.046, 0.044, 0.07, 22), m.shellLite);
    sleeve.rotation.z = Math.PI / 2;
    sleeve.position.x = 0.15;
    arm.add(sleeve);
    const wire = cable(
      T,
      m,
      new T.Vector3(0.1, -0.018, 0.016),
      new T.Vector3(0.68, -0.016, 0.01),
      0.026,
      0.006,
    );
    arm.add(wire);

    const pod = new T.Mesh(
      lathe(
        T,
        [
          [0, -0.045],
          [0.07, -0.055],
          [0.082, 0.028],
          [0.048, 0.068],
          [0, 0.07],
        ],
        30,
      ),
      m.shellLite,
    );
    pod.position.set(0.74, 0.0, 0);
    arm.add(pod);
    const mo = motor(T, m, 0.056, 0.098);
    mo.position.set(0.74, 0.098, 0);
    arm.add(mo);
    const rt = rotor(T, m, 0.58, 0.06, i % 2 ? 1 : -1);
    rt.position.set(0.74, 0.182, 0);
    arm.add(rt);

    const leg = new T.Mesh(
      lathe(
        T,
        [
          [0, 0],
          [0.042, -0.02],
          [0.028, -0.18],
          [0.046, -0.23],
          [0, -0.24],
        ],
        26,
      ),
      m.matte,
    );
    leg.position.set(0.7, -0.055, 0);
    arm.add(leg);
    const pad = new T.Mesh(new T.SphereGeometry(0.028, 18, 12), m.rubber);
    pad.scale.y = 0.5;
    pad.position.set(0.7, -0.295, 0);
    arm.add(pad);
    const led = new T.Mesh(new T.SphereGeometry(0.024, 18, 12), i < 2 ? m.ledB : m.led);
    led.position.set(0.76, -0.045, 0);
    arm.add(led);

    arm.rotation.y = ang;
    arm.position.set(Math.cos(ang) * 0.2, 0.025, -Math.sin(ang) * 0.2);
    root.add(arm);
  });

  root.userData.base = 1.32;
  root.scale.setScalar(1.32);
  return root;
}

/* ---------- 3. SUPERFAST — VTOL самолётного типа ---------- */
export function buildFast(T: T3, m: Mats): THREE.Group {
  const root = new T.Group();
  const fus = new T.Mesh(
    lathe(
      T,
      [
        [0, -1.15],
        [0.09, -1.06],
        [0.14, -0.78],
        [0.175, -0.3],
        [0.18, 0.25],
        [0.165, 0.62],
        [0.13, 0.86],
        [0.075, 1.0],
        [0, 1.06],
      ],
      54,
    ),
    m.shell,
  );
  fus.rotation.x = Math.PI / 2;
  fus.castShadow = true;
  root.add(fus);
  const canopy = new T.Mesh(
    lathe(
      T,
      [
        [0, 0.62],
        [0.1, 0.6],
        [0.15, 0.4],
        [0.155, 0.05],
        [0.1, -0.12],
        [0, -0.16],
      ],
      44,
    ),
    m.glass,
  );
  fus.add(canopy);
  for (const z of [0.42, -0.1, -0.62]) {
    const s = seam(T, m, z > 0 ? 0.168 : 0.177, 0, 0.007);
    s.rotation.x = 0;
    s.position.set(0, 0, z);
    root.add(s);
  }
  const spine = new T.Mesh(rbox(T, 0.15, 0.12, 0.8, 0.055), m.panel);
  spine.position.set(0, 0.15, -0.22);
  root.add(spine);
  const spineVent = grille(T, m, 0.1, 0.3, 5);
  spineVent.position.set(0, 0.212, -0.3);
  root.add(spineVent);
  const label = new T.Mesh(new T.PlaneGeometry(0.26, 0.13), m.decal);
  label.rotation.x = -Math.PI / 2;
  label.position.set(0, 0.214, 0.05);
  root.add(label);
  const pitot = new T.Mesh(new T.CylinderGeometry(0.008, 0.012, 0.24, 10), m.shellLite);
  pitot.rotation.x = Math.PI / 2;
  pitot.position.set(0.09, -0.03, 1.12);
  root.add(pitot);
  const ant = antenna(T, m, 0.22);
  ant.position.set(0, 0.2, -0.62);
  root.add(ant);

  const wingGeo = foil(T, 1.42, 0.56, 0.3, 0.075);
  const finGeo = foil(T, 0.42, 0.3, 0.15, 0.05);
  for (const s of [-1, 1]) {
    const wing = new T.Mesh(wingGeo, m.shell);
    wing.position.set(s * 0.14, 0.02, -0.02);
    wing.rotation.y = s > 0 ? -0.16 : Math.PI + 0.16;
    wing.rotation.z = s * 0.045;
    wing.castShadow = true;
    root.add(wing);
    for (const f of [0.55, 1.05]) {
      const flap = new T.Mesh(new T.BoxGeometry(0.34, 0.012, 0.14), m.matte);
      flap.position.set(s * f, 0.03, -0.2);
      flap.rotation.y = s * -0.16;
      root.add(flap);
    }
    const winglet = new T.Mesh(new T.TorusGeometry(0.2, 0.026, 10, 40, Math.PI * 0.45), m.carbon);
    winglet.rotation.set(Math.PI / 2, 0, s > 0 ? Math.PI * 0.05 : Math.PI * 0.95);
    winglet.position.set(s * 1.5, 0.1, -0.16);
    root.add(winglet);

    const boom = new T.Mesh(new T.CapsuleGeometry(0.048, 1.36, 14, 28), m.carbon);
    boom.rotation.x = Math.PI / 2;
    boom.position.set(s * 0.74, -0.01, -0.05);
    root.add(boom);
    const boomClamp = new T.Mesh(new T.TorusGeometry(0.055, 0.014, 8, 26), m.shellLite);
    boomClamp.rotation.x = Math.PI / 2;
    boomClamp.position.set(s * 0.74, -0.01, 0.0);
    root.add(boomClamp);
    [0.74, -0.8].forEach((z, i) => {
      const nac = new T.Mesh(
        lathe(
          T,
          [
            [0, -0.2],
            [0.055, -0.21],
            [0.08, -0.1],
            [0.082, 0.06],
            [0.06, 0.15],
            [0.03, 0.19],
            [0, 0.2],
          ],
          32,
        ),
        m.shellLite,
      );
      nac.position.set(s * 0.74, 0.02, z);
      root.add(nac);
      const tiltPin = new T.Mesh(new T.CylinderGeometry(0.014, 0.014, 0.16, 12), m.matte);
      tiltPin.rotation.z = Math.PI / 2;
      tiltPin.position.set(s * 0.74, 0.02, z);
      root.add(tiltPin);
      const rt = rotor(T, m, 0.48, 0.06, i ? 1 : -1, 3);
      rt.position.set(s * 0.74, 0.2, z);
      root.add(rt);
    });

    const fin = new T.Mesh(finGeo, m.shell);
    fin.position.set(s * 0.13, 0.12, -0.9);
    fin.rotation.z = s > 0 ? Math.PI * 0.34 : Math.PI * 0.66;
    fin.rotation.y = s > 0 ? 0 : Math.PI;
    root.add(fin);
    const led = new T.Mesh(new T.SphereGeometry(0.03, 18, 12), s > 0 ? m.ledB : m.led);
    led.position.set(s * 1.54, 0.03, -0.2);
    root.add(led);

    const strut = new T.Mesh(new T.CapsuleGeometry(0.022, 0.34, 10, 18), m.shell);
    strut.position.set(s * 0.3, -0.28, 0);
    strut.rotation.z = s * 0.3;
    root.add(strut);
    const skid = new T.Mesh(new T.CapsuleGeometry(0.024, 0.82, 10, 20), m.shell);
    skid.rotation.x = Math.PI / 2;
    skid.position.set(s * 0.36, -0.46, 0);
    root.add(skid);
    for (const z of [-0.38, 0.38]) {
      const shoe = new T.Mesh(new T.CapsuleGeometry(0.028, 0.1, 8, 14), m.rubber);
      shoe.rotation.x = Math.PI / 2;
      shoe.position.set(s * 0.36, -0.465, z);
      root.add(shoe);
    }
  }
  const cone = new T.Mesh(
    lathe(
      T,
      [
        [0, 0],
        [0.07, -0.02],
        [0.05, -0.12],
        [0, -0.16],
      ],
      28,
    ),
    m.shellLite,
  );
  cone.rotation.x = Math.PI / 2;
  cone.position.set(0, 0.02, -1.05);
  root.add(cone);
  const pusher = rotor(T, m, 0.4, 0.062, 1, 2);
  pusher.rotation.x = Math.PI / 2;
  pusher.position.set(0, 0.02, -1.12);
  pusher.userData.spin = 5.2; // толкающий винт крутится заметно быстрее несущих
  root.add(pusher);

  root.userData.base = 1.05;
  root.scale.setScalar(1.05);
  root.rotation.y = -0.32;
  return root;
}

export type Hotspot = {
  /** Позиция в локальных координатах модели. */
  p: [number, number, number];
  t: string;
  s: string;
};

export const HOTSPOTS: Record<string, Hotspot[]> = {
  heavy: [
    { p: [0, -0.62, 0.3], t: '3-осевой подвес', s: 'сменные камеры и LiDAR' },
    { p: [1.62, 0.22, 0], t: 'Мотор 6215', s: 'тяга 5,2 кг на луч' },
    { p: [0.2, -0.3, 0.24], t: 'Двойная АКБ', s: 'горячая замена' },
    { p: [-0.75, -0.9, 0], t: 'Карбоновое шасси', s: 'демпферы на посадке' },
  ],
  light: [
    { p: [0, -0.07, 0.75], t: 'Камера 20 Мп', s: 'механический затвор' },
    { p: [0.66, 0.24, -0.66], t: 'Складной луч', s: 'раскрытие за 8 сек' },
    { p: [0, 0.02, -0.62], t: 'АКБ 5200 мА·ч', s: '38 минут полёта' },
    { p: [0.15, 0.02, 0.72], t: 'Сенсоры обхода', s: 'шесть направлений' },
  ],
  fast: [
    { p: [0.9, 0.05, 0.1], t: 'Крыло', s: 'крейсер 145 км/ч' },
    { p: [0.78, 0.24, 0.78], t: 'Тилт-ротор', s: 'вертикальный старт' },
    { p: [0, 0.0, 0.95], t: 'Отсек нагрузки', s: 'до 3 кг' },
    { p: [0, 0.05, -1.15], t: 'Толкающий винт', s: 'маршевый режим' },
  ],
};

export const BUILDERS: Record<string, (T: T3, m: Mats) => THREE.Group> = {
  heavy: buildHeavy,
  light: buildLight,
  fast: buildFast,
};

export const ORDER = ['heavy', 'light', 'fast'];
