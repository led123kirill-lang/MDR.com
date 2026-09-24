// Процедурные текстуры и материалы 3D-сцены.
// Перенос из ассета прототипа `0a1f01ac-…js` (функции `maps` и `mats`), 1:1.

import type * as THREE from 'three';

/** Пространство имён three, полученное динамическим import(). */
export type T3 = typeof THREE;

export type Maps = {
  bump: THREE.CanvasTexture;
  bumpFine: THREE.CanvasTexture;
  weave: THREE.CanvasTexture;
  weaveR: THREE.CanvasTexture;
  scratch: THREE.CanvasTexture;
  scratchFine: THREE.CanvasTexture;
  brushed: THREE.CanvasTexture;
  brushedR: THREE.CanvasTexture;
  panel: THREE.CanvasTexture;
  decal: THREE.CanvasTexture;
};

export type Mats = {
  shell: THREE.MeshPhysicalMaterial;
  shellLite: THREE.MeshPhysicalMaterial;
  panel: THREE.MeshPhysicalMaterial;
  matte: THREE.MeshPhysicalMaterial;
  rubber: THREE.MeshStandardMaterial;
  dark: THREE.MeshPhysicalMaterial;
  carbon: THREE.MeshPhysicalMaterial;
  blade: THREE.MeshPhysicalMaterial;
  glass: THREE.MeshPhysicalMaterial;
  copper: THREE.MeshStandardMaterial;
  decal: THREE.MeshStandardMaterial;
  led: THREE.MeshStandardMaterial;
  ledB: THREE.MeshStandardMaterial;
};

const cv = (w: number, h: number, paint: (g: CanvasRenderingContext2D, w: number, h: number) => void) => {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  paint(c.getContext('2d')!, w, h);
  return c;
};

// Текстуры общие для всех моделей и переживают перемонтирование компонента.
let MAPS: Maps | null = null;

export function maps(T: T3): Maps {
  if (MAPS) return MAPS;

  const mk = (c: HTMLCanvasElement, rx: number, ry: number, srgb?: boolean) => {
    const t = new T.CanvasTexture(c);
    t.wrapS = t.wrapT = T.RepeatWrapping;
    t.repeat.set(rx, ry);
    t.anisotropy = 8;
    if (srgb) t.colorSpace = T.SRGBColorSpace;
    return t;
  };

  // карбоновый твил
  const weave = cv(256, 256, (g, w) => {
    g.fillStyle = '#15181c';
    g.fillRect(0, 0, w, w);
    const cell = w / 8;
    for (let y = 0; y < 8; y++)
      for (let x = 0; x < 8; x++) {
        const horiz = (x + y) % 2 === 0;
        const lg = horiz
          ? g.createLinearGradient(x * cell, 0, (x + 1) * cell, 0)
          : g.createLinearGradient(0, y * cell, 0, (y + 1) * cell);
        lg.addColorStop(0, '#0e1013');
        lg.addColorStop(0.45, '#2b3037');
        lg.addColorStop(1, '#101216');
        g.fillStyle = lg;
        g.fillRect(x * cell, y * cell, cell, cell);
      }
    g.globalAlpha = 0.12;
    for (let i = 0; i < 900; i++) {
      g.fillStyle = Math.random() > 0.5 ? '#fff' : '#000';
      g.fillRect(Math.random() * w, Math.random() * w, 1, 1);
    }
    g.globalAlpha = 1;
  });

  // микроцарапины — вариация шероховатости
  const scratch = cv(512, 512, (g, w) => {
    g.fillStyle = '#8c8c8c';
    g.fillRect(0, 0, w, w);
    for (let i = 0; i < 340; i++) {
      g.strokeStyle = 'rgba(255,255,255,' + (0.02 + Math.random() * 0.07) + ')';
      g.lineWidth = Math.random() * 1.4;
      const x = Math.random() * w,
        y = Math.random() * w,
        a = Math.random() * Math.PI,
        l = 10 + Math.random() * 110;
      g.beginPath();
      g.moveTo(x, y);
      g.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l);
      g.stroke();
    }
    for (let i = 0; i < 2200; i++) {
      g.fillStyle = 'rgba(0,0,0,' + Math.random() * 0.16 + ')';
      g.fillRect(Math.random() * w, Math.random() * w, 2, 2);
    }
  });

  // шлифованный анодированный металл
  const brushed = cv(512, 64, (g, w, h) => {
    g.fillStyle = '#464d55';
    g.fillRect(0, 0, w, h);
    for (let i = 0; i < 1400; i++) {
      g.strokeStyle = 'rgba(255,255,255,' + Math.random() * 0.12 + ')';
      g.lineWidth = Math.random() * 1.2;
      const y = Math.random() * h;
      g.beginPath();
      g.moveTo(Math.random() * w, y);
      g.lineTo(Math.random() * w, y);
      g.stroke();
    }
  });

  // стыки панелей и контуры люков для верхних крышек
  const panel = cv(512, 512, (g, w) => {
    g.fillStyle = '#d8dbe0';
    g.fillRect(0, 0, w, w);
    g.strokeStyle = '#3d424a';
    g.lineWidth = 3;
    g.strokeRect(w * 0.18, w * 0.2, w * 0.64, w * 0.3);
    g.strokeRect(w * 0.26, w * 0.58, w * 0.48, w * 0.24);
    g.lineWidth = 2;
    for (let i = 0; i < 6; i++) {
      g.beginPath();
      g.moveTo(w * 0.3, w * 0.62 + i * 8);
      g.lineTo(w * 0.7, w * 0.62 + i * 8);
      g.stroke();
    }
    g.fillStyle = '#2f343b';
    (
      [
        [0.2, 0.22],
        [0.8, 0.22],
        [0.2, 0.48],
        [0.8, 0.48],
      ] as const
    ).forEach(([x, y]) => {
      g.beginPath();
      g.arc(w * x, w * y, 4, 0, 7);
      g.fill();
    });
  });

  const decal = cv(512, 256, (g, w, h) => {
    g.clearRect(0, 0, w, h);
    g.fillStyle = '#e8ebf1';
    g.font = '600 74px Archivo, Helvetica, sans-serif';
    g.fillText('MDR', 26, 96);
    g.fillStyle = '#8d96a3';
    g.font = '400 34px Manrope, Helvetica, sans-serif';
    g.fillText('AERO · SERIES', 28, 146);
    g.fillStyle = '#ff5a48';
    g.fillRect(26, 168, 120, 8);
  });

  const bump = cv(512, 512, (g, w) => {
    g.fillStyle = '#808080';
    g.fillRect(0, 0, w, w);
    for (let i = 0; i < 5200; i++) {
      const v = 128 + (Math.random() - 0.5) * 46;
      g.fillStyle = 'rgb(' + v + ',' + v + ',' + v + ')';
      g.fillRect(Math.random() * w, Math.random() * w, 2, 2);
    }
    g.strokeStyle = 'rgba(60,60,60,0.5)';
    g.lineWidth = 2;
    for (let i = 0; i < 26; i++) {
      const y = Math.random() * w;
      g.beginPath();
      g.moveTo(0, y);
      g.lineTo(w, y + (Math.random() - 0.5) * 40);
      g.stroke();
    }
  });

  MAPS = {
    bump: mk(bump, 4, 4),
    bumpFine: mk(bump, 12, 12),
    weave: mk(weave, 5, 5, true),
    weaveR: mk(weave, 5, 5),
    scratch: mk(scratch, 2, 2),
    scratchFine: mk(scratch, 6, 6),
    brushed: mk(brushed, 3, 1, true),
    brushedR: mk(brushed, 3, 1),
    panel: mk(panel, 1, 1),
    decal: mk(decal, 1, 1, true),
  };
  return MAPS;
}

/**
 * Свежий набор материалов на каждую модель — это важно: кроссфейд при
 * переключении гоняет `material.opacity`, и общий набор «засветил» бы
 * прозрачность сразу на всех трёх дронах.
 */
export function mats(T: T3): Mats {
  const M = maps(T);
  const painted = (color: number, rough: number) =>
    new T.MeshPhysicalMaterial({
      color,
      metalness: 0.5,
      roughness: rough,
      roughnessMap: M.scratch,
      bumpMap: M.bumpFine,
      bumpScale: 0.035,
      clearcoat: 0.55,
      clearcoatRoughness: 0.22,
      sheen: 0.3,
      sheenColor: new T.Color(0x9fb0c8),
      transparent: true,
      envMapIntensity: 1.5,
    });

  return {
    shell: painted(0x353c45, 0.38),
    shellLite: new T.MeshPhysicalMaterial({
      color: 0x8d959f,
      metalness: 1.0,
      roughness: 0.32,
      map: M.brushed,
      roughnessMap: M.brushedR,
      bumpMap: M.bumpFine,
      bumpScale: 0.02,
      clearcoat: 0.2,
      clearcoatRoughness: 0.35,
      transparent: true,
      envMapIntensity: 1.7,
    }),
    panel: new T.MeshPhysicalMaterial({
      color: 0x3d444d,
      metalness: 0.55,
      roughness: 0.42,
      roughnessMap: M.panel,
      bumpMap: M.panel,
      bumpScale: 0.05,
      clearcoat: 0.4,
      clearcoatRoughness: 0.3,
      transparent: true,
      envMapIntensity: 1.35,
    }),
    matte: new T.MeshPhysicalMaterial({
      color: 0x1d2227,
      metalness: 0.3,
      roughness: 0.74,
      roughnessMap: M.scratchFine,
      bumpMap: M.bumpFine,
      bumpScale: 0.05,
      transparent: true,
      envMapIntensity: 0.95,
    }),
    rubber: new T.MeshStandardMaterial({
      color: 0x0c0e11,
      metalness: 0.05,
      roughness: 0.95,
      roughnessMap: M.scratchFine,
      bumpMap: M.bumpFine,
      bumpScale: 0.06,
      transparent: true,
    }),
    dark: new T.MeshPhysicalMaterial({
      color: 0x14171b,
      metalness: 0.6,
      roughness: 0.45,
      roughnessMap: M.scratch,
      clearcoat: 0.3,
      transparent: true,
      envMapIntensity: 0.9,
    }),
    carbon: new T.MeshPhysicalMaterial({
      color: 0xc4cad2,
      map: M.weave,
      metalness: 0.7,
      roughness: 0.32,
      roughnessMap: M.weaveR,
      bumpMap: M.weaveR,
      bumpScale: 0.03,
      clearcoat: 0.85,
      clearcoatRoughness: 0.12,
      transparent: true,
      envMapIntensity: 1.55,
    }),
    blade: new T.MeshPhysicalMaterial({
      color: 0x767e88,
      map: M.weave,
      metalness: 0.7,
      roughness: 0.28,
      roughnessMap: M.weaveR,
      clearcoat: 0.9,
      clearcoatRoughness: 0.1,
      transparent: true,
      envMapIntensity: 1.5,
      side: T.DoubleSide,
    }),
    glass: new T.MeshPhysicalMaterial({
      color: 0x0a0d12,
      metalness: 0.0,
      roughness: 0.03,
      clearcoat: 1,
      clearcoatRoughness: 0.02,
      reflectivity: 1,
      transparent: true,
      envMapIntensity: 2.2,
    }),
    copper: new T.MeshStandardMaterial({
      color: 0xb08152,
      metalness: 1,
      roughness: 0.28,
      transparent: true,
    }),
    decal: new T.MeshStandardMaterial({
      map: M.decal,
      transparent: true,
      roughness: 0.5,
      metalness: 0.1,
      depthWrite: false,
    }),
    led: new T.MeshStandardMaterial({
      color: 0xff6a56,
      emissive: 0xff2a17,
      emissiveIntensity: 3.2,
      transparent: true,
    }),
    ledB: new T.MeshStandardMaterial({
      color: 0x7d92ff,
      emissive: 0x3a55ff,
      emissiveIntensity: 3.2,
      transparent: true,
    }),
  };
}

/** Студийное окружение для PMREM — замена RoomEnvironment без внешнего модуля. */
export function studioEnv(T: T3): THREE.Scene {
  const s = new T.Scene();
  const room = new T.Mesh(
    new T.BoxGeometry(12, 8, 12),
    new T.MeshStandardMaterial({ color: 0x1b1f26, roughness: 1, side: T.BackSide }),
  );
  s.add(room);

  const panel = (
    w: number,
    h: number,
    col: number,
    int: number,
    pos: [number, number, number],
    rot: [number, number, number],
  ) => {
    const m = new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshBasicMaterial({ color: col }));
    m.material.color.multiplyScalar(int);
    m.position.set(pos[0], pos[1], pos[2]);
    m.rotation.set(rot[0], rot[1], rot[2]);
    s.add(m);
  };

  panel(9, 9, 0xffffff, 3.4, [0, 3.9, 0], [Math.PI / 2, 0, 0]);
  panel(6, 4, 0xdfe8ff, 2.2, [-5.9, 0.6, 0], [0, Math.PI / 2, 0]);
  panel(6, 4, 0xcfd9ff, 1.7, [5.9, 0.4, 0], [0, -Math.PI / 2, 0]);
  panel(7, 3, 0xffffff, 1.4, [0, 0.8, -5.9], [0, 0, 0]);
  panel(5, 2.4, 0x9fb0c8, 0.8, [0, -1.2, 5.9], [0, Math.PI, 0]);
  return s;
}
