// Императивный контроллер сцены: рендерер, свет, пол/ободок/пульс,
// управление мышью, переходы между моделями и подписи узлов.
// Перенос класса `DroneStage extends HTMLElement` из ассета прототипа
// `0a1f01ac-…js` на обычный объект с явным dispose() под React.

import type * as THREE from 'three';
import { mats, studioEnv, type T3 } from './materials';
import { BUILDERS, HOTSPOTS, ORDER } from './models';

const ease = (x: number) => 1 - Math.pow(1 - x, 3);

export type DroneStageHandle = {
  show: (model: string) => void;
  setHotspots: (on: boolean) => void;
  dispose: () => void;
};

type Options = {
  model: string;
  hotspots: boolean;
  /** Вызывается, когда первый кадр отрисован — по нему прячется плейсхолдер. */
  onReady?: () => void;
};

type Pin = {
  el: HTMLDivElement;
  v: THREE.Vector3;
  hidden?: boolean;
  x: number;
  y: number;
  left: boolean;
};

export function createDroneStage(el: HTMLElement, opts: Options): DroneStageHandle {
  let disposed = false;
  let inner: { show: (m: string) => void; setHot: (on: boolean) => void; teardown: () => void } | null =
    null;
  const pending = { model: opts.model, hotspots: opts.hotspots };

  const boot = async () => {
    const T = (await import('three')) as unknown as T3;
    if (disposed) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new T.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch {
      return; // нет WebGL — остаётся плейсхолдер
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = T.SRGBColorSpace;
    renderer.toneMapping = T.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = T.PCFSoftShadowMap;
    Object.assign(renderer.domElement.style, {
      width: '100%',
      height: '100%',
      display: 'block',
      cursor: 'grab',
    });
    el.appendChild(renderer.domElement);

    /* ---------- оверлей с подписями узлов ---------- */
    const overlay = document.createElement('div');
    Object.assign(overlay.style, {
      position: 'absolute',
      inset: '0',
      pointerEvents: 'none',
      overflow: 'hidden',
    });
    el.appendChild(overlay);

    let hotOn = pending.hotspots;
    const pins: Pin[] = [];

    const buildPins = (id: string) => {
      pins.length = 0;
      overlay.replaceChildren();
      (HOTSPOTS[id] || []).forEach((h) => {
        const dot = document.createElement('span');
        Object.assign(dot.style, {
          flex: 'none',
          width: '8px',
          height: '8px',
          borderRadius: '99px',
          background: '#fff',
          boxShadow: '0 0 0 4px rgba(255,255,255,.14)',
        });

        const line = document.createElement('span');
        Object.assign(line.style, {
          flex: 'none',
          width: '26px',
          height: '1px',
          background: 'rgba(255,255,255,.34)',
        });

        const card = document.createElement('span');
        Object.assign(card.style, {
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
          background: 'rgba(9,11,15,.88)',
          border: '1px solid rgba(255,255,255,.16)',
          borderRadius: '10px',
          padding: '7px 11px',
          backdropFilter: 'blur(6px)',
        });
        const title = document.createElement('span');
        title.textContent = h.t;
        Object.assign(title.style, {
          font: '500 12.5px var(--font-manrope), sans-serif',
          color: '#fff',
          letterSpacing: '.01em',
        });
        const sub = document.createElement('span');
        sub.textContent = h.s;
        Object.assign(sub.style, {
          font: '400 11.5px var(--font-manrope), sans-serif',
          color: '#9aa3b1',
        });
        card.append(title, sub);

        const left = h.p[0] < 0 || (h.p[0] === 0 && h.p[2] < 0);
        const d = document.createElement('div');
        Object.assign(d.style, {
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          gap: '0px',
          opacity: '0',
          transition: 'opacity .3s ease',
          whiteSpace: 'nowrap',
          transform: left ? 'translate(-100%,-50%)' : 'translate(0,-50%)',
        });
        d.append(...(left ? [card, line, dot] : [dot, line, card]));
        overlay.appendChild(d);
        pins.push({ el: d, v: new T.Vector3(h.p[0], h.p[1], h.p[2]), x: 0, y: 0, left });
      });
    };

    const setHot = (on: boolean) => {
      hotOn = on;
      if (!on) pins.forEach((p) => (p.el.style.opacity = '0'));
    };

    /* ---------- сцена, окружение, свет ---------- */
    const scene = new T.Scene();
    try {
      const pmrem = new T.PMREMGenerator(renderer);
      scene.environment = pmrem.fromScene(studioEnv(T), 0.02).texture;
      scene.environmentIntensity = 0.8;
      pmrem.dispose();
    } catch {
      /* одного только света тоже достаточно */
    }

    const camera = new T.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 0.78, 5.4);
    camera.lookAt(0, -0.06, 0);

    scene.add(new T.HemisphereLight(0x46536e, 0x05060a, 0.42));
    const key = new T.DirectionalLight(0xffffff, 2.4);
    key.position.set(0.9, 6.0, 1.2);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.radius = 7;
    key.shadow.bias = -0.0012;
    key.shadow.normalBias = 0.02;
    const sc = key.shadow.camera;
    sc.left = -4;
    sc.right = 4;
    sc.top = 4;
    sc.bottom = -4;
    sc.near = 0.5;
    sc.far = 16;
    sc.updateProjectionMatrix();
    scene.add(key);

    const keyTop = new T.DirectionalLight(0xf2f6ff, 0.75);
    keyTop.position.set(-1.4, 4.6, -1.0);
    scene.add(keyTop);
    const rimL = new T.DirectionalLight(0xe6edff, 1.7);
    rimL.position.set(-5.5, 1.8, -3.2);
    scene.add(rimL);
    const rimR = new T.DirectionalLight(0xd6dfff, 1.4);
    rimR.position.set(5.5, 1.4, -3.6);
    scene.add(rimR);
    const spec = new T.PointLight(0xffffff, 9, 12, 2);
    spec.position.set(1.6, 2.2, 2.6);
    scene.add(spec);
    const spec2 = new T.PointLight(0xc9d6ff, 5, 12, 2);
    spec2.position.set(-2.2, 1.3, -1.4);
    scene.add(spec2);
    const fill = new T.DirectionalLight(0xbfcbe0, 0.5);
    fill.position.set(-1.2, 0.6, 5);
    scene.add(fill);
    const under = new T.PointLight(0xdfe6f5, 3.4, 7);
    under.position.set(0, -0.72, 1.4);
    scene.add(under);

    const tex = (w: number, h: number, paint: (g: CanvasRenderingContext2D, w: number, h: number) => void) => {
      const cvs = document.createElement('canvas');
      cvs.width = w;
      cvs.height = h;
      paint(cvs.getContext('2d')!, w, h);
      const t2 = new T.CanvasTexture(cvs);
      t2.colorSpace = T.SRGBColorSpace;
      return t2;
    };

    /* ---------- круг под дроном: диск + ободок + импульс ---------- */

    // 1. диск студийного пола, растворяющийся к краям; на него падает тень
    const floorAlpha = tex(512, 512, (g, w) => {
      g.fillStyle = '#000';
      g.fillRect(0, 0, w, w);
      const r = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2);
      r.addColorStop(0, '#ffffff');
      r.addColorStop(0.42, '#f2f2f2');
      r.addColorStop(0.7, '#8a8a8a');
      r.addColorStop(0.9, '#2a2a2a');
      r.addColorStop(1, '#000000');
      g.fillStyle = r;
      g.beginPath();
      g.arc(w / 2, w / 2, w / 2, 0, Math.PI * 2);
      g.fill();
    });
    const floorMat = new T.MeshStandardMaterial({
      color: 0x20242b,
      roughness: 0.7,
      metalness: 0.0,
      alphaMap: floorAlpha,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
    });
    const floorGeo = new T.CircleGeometry(1.85, 128);
    const floor = new T.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.78;
    floor.position.z = -0.45;
    floor.receiveShadow = true;
    scene.add(floor);

    // 2. тонкий светящийся ободок по краю диска
    const ringGrad = tex(512, 512, (g, w) => {
      g.clearRect(0, 0, w, w);
      const lg = g.createLinearGradient(0, 0, 0, w);
      lg.addColorStop(0, '#5a6068');
      lg.addColorStop(0.42, '#9aa1ab');
      lg.addColorStop(0.8, '#ffffff');
      lg.addColorStop(1, '#ffffff');
      g.fillStyle = lg;
      g.fillRect(0, 0, w, w);
    });
    const ringMat = new T.MeshBasicMaterial({
      map: ringGrad,
      transparent: true,
      opacity: 0.95,
      side: T.DoubleSide,
      depthWrite: false,
    });
    const ringGeo = new T.RingGeometry(1.8, 1.832, 220);
    const ring = new T.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = -0.775;
    ring.position.z = -0.45;
    scene.add(ring);

    // 3. импульс — расходится только в момент смены модели
    const pulseMat = new T.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
      side: T.DoubleSide,
    });
    const pulseGeo = new T.RingGeometry(1.2, 1.26, 140);
    const pulse = new T.Mesh(pulseGeo, pulseMat);
    pulse.rotation.x = -Math.PI / 2;
    pulse.position.y = -0.77;
    pulse.position.z = -0.45;
    scene.add(pulse);

    /* ---------- модели и переключение ---------- */
    const pivot = new T.Group();
    scene.add(pivot);
    const cache: Record<string, THREE.Group> = {};
    let current: THREE.Group | null = null;
    let outgoing: THREE.Group | null = null;
    let tr = 0;
    let dir = 1;

    const get = (id: string) => {
      if (!cache[id]) {
        const g = BUILDERS[id](T, mats(T));
        g.traverse((o) => {
          const mesh = o as THREE.Mesh;
          if (mesh.isMesh) {
            mesh.castShadow = true;
            mesh.receiveShadow = true;
          }
        });
        g.userData.id = id;
        g.userData.baseYaw = g.rotation.y;
        cache[id] = g;
      }
      return cache[id];
    };

    const setOpacity = (g: THREE.Group, v: number) =>
      g.traverse((o) => {
        const mat = (o as THREE.Mesh).material as THREE.Material | undefined;
        if (mat) {
          mat.opacity = v;
          mat.depthWrite = v > 0.75;
        }
      });

    const show = (name: string) => {
      const id = BUILDERS[name] ? name : 'light';
      if (current && current.userData.id === id) return;
      const prevI = current ? ORDER.indexOf(current.userData.id) : -1;
      const nextI = ORDER.indexOf(id);
      dir = prevI < 0 ? 1 : (nextI - prevI + 3) % 3 === 1 ? 1 : -1;
      if (outgoing) pivot.remove(outgoing);
      outgoing = current;
      current = get(id);
      pivot.add(current);
      buildPins(id);
      tr = !outgoing ? 1 : 0;
      if (!outgoing) {
        setOpacity(current, 1);
        current.scale.setScalar(current.userData.base);
      }
      pulseMat.opacity = 0.0;
    };

    show(pending.model);
    setOpacity(current!, 1);
    setHot(pending.hotspots);

    /* ---------- управление: перетаскивание, зум, сброс ---------- */
    let drag = false,
      px = 0,
      py = 0,
      yaw = 0,
      pitch = 0,
      vel = 0,
      idle = 0;
    let zoom = 1,
      zoomT = 1;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      zoomT = Math.max(0.62, Math.min(1.5, zoomT * (1 + Math.sign(e.deltaY) * 0.08)));
    };
    const onDblClick = () => {
      zoomT = 1;
      pitch = 0;
    };
    const onPointerDown = (e: PointerEvent) => {
      drag = true;
      px = e.clientX;
      py = e.clientY;
      renderer.domElement.style.cursor = 'grabbing';
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!drag) return;
      const dx = (e.clientX - px) / 220,
        dy = (e.clientY - py) / 320;
      yaw += dx;
      vel = dx * 0.6;
      pitch = Math.max(-0.35, Math.min(0.5, pitch + dy));
      px = e.clientX;
      py = e.clientY;
      idle = 0;
    };
    const onPointerUp = () => {
      drag = false;
      renderer.domElement.style.cursor = 'grab';
    };

    renderer.domElement.addEventListener('wheel', onWheel, { passive: false });
    renderer.domElement.addEventListener('dblclick', onDblClick);
    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    const baseZ = 5.4,
      baseY = 0.78,
      lookY = -0.06;
    const resize = () => {
      const w = el.clientWidth || 1,
        h = el.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      const ar = w / h;
      camera.position.set(0, ar < 1.2 ? 0.9 : 0.7, ar < 1.0 ? 7.6 : ar < 1.5 ? 6.4 : 5.4);
      camera.lookAt(0, ar < 1.2 ? -0.02 : -0.06, 0);
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    /* ---------- цикл ---------- */
    const ray = new T.Raycaster();
    let frame = 0;
    let raf = 0;
    let ready = false;
    const clock = new T.Clock();

    const tick = () => {
      if (disposed) return;
      raf = requestAnimationFrame(tick);
      const dt = Math.min(clock.getDelta(), 0.05),
        t = clock.elapsedTime;

      // инерция после перетаскивания, затем медленный автоповорот
      if (!drag) {
        idle += dt;
        vel *= 0.94;
        yaw += vel + (idle > 1.2 ? dt * 0.16 : 0);
      }
      zoom += (zoomT - zoom) * Math.min(1, dt * 7);
      camera.position.set(0, baseY * zoom, baseZ * zoom);
      camera.lookAt(0, lookY, 0);
      pivot.rotation.y = yaw;
      pivot.rotation.x = pitch * 0.42;
      pivot.position.y = 0.42 + Math.sin(t * 0.9) * 0.04; // парение

      let boost = 1;
      if (tr < 1 && current) {
        tr = Math.min(1, tr + dt * 1.25);
        const e = ease(tr),
          inv = 1 - e;
        boost = 1 + 5.5 * inv; // на входе винты раскручиваются

        current.position.set(dir * 2.9 * inv, 0.55 * inv, -1.6 * inv);
        current.rotation.y = current.userData.baseYaw + dir * 1.35 * inv;
        current.rotation.z = -dir * 0.34 * inv;
        current.scale.setScalar(current.userData.base * (0.82 + 0.18 * e));
        setOpacity(current, Math.min(1, Math.max(0, (e - 0.12) / 0.62)));

        if (outgoing) {
          const o = ease(Math.min(1, tr * 1.45));
          outgoing.position.set(-dir * 3.2 * o, 0.5 * o, -1.9 * o);
          outgoing.rotation.y = outgoing.userData.baseYaw - dir * 1.5 * o;
          outgoing.rotation.z = dir * 0.4 * o;
          outgoing.scale.setScalar(outgoing.userData.base * (1 - 0.24 * o));
          setOpacity(outgoing, Math.max(0, 1 - o * 1.25));
        }

        const p = Math.sin(Math.PI * Math.min(1, tr * 1.15));
        pulseMat.opacity = 0.42 * p;
        pulse.scale.set(0.5 + tr * 1.55, 0.5 + tr * 1.55, 1);
        ringMat.opacity = 0.95;

        if (tr >= 1) {
          if (outgoing) {
            pivot.remove(outgoing);
            setOpacity(outgoing, 1);
            outgoing = null;
          }
          current.position.set(0, 0, 0);
          current.rotation.set(0, current.userData.baseYaw, 0);
          current.scale.setScalar(current.userData.base);
          setOpacity(current, 1);
          pulseMat.opacity = 0;
          ringMat.opacity = 0.95;
        }
      }

      const spinAll = (g: THREE.Group) =>
        g.traverse((o) => {
          if (o.userData.spin) o.rotation.y += o.userData.spin * dt * 6 * boost;
        });
      if (current) spinAll(current);
      if (outgoing) spinAll(outgoing);
      renderer.render(scene, camera);

      if (!ready) {
        ready = true;
        opts.onReady?.();
      }

      /* ---- подписи узлов: проекция 3D → экран ---- */
      if (pins.length && current) {
        const w = el.clientWidth,
          h = el.clientHeight;
        frame++;
        const live: Pin[] = [];
        for (const p of pins) {
          if (!hotOn || tr < 1) {
            p.el.style.opacity = '0';
            continue;
          }
          const world = current.localToWorld(p.v.clone());
          const sp = world.clone().project(camera);
          // луч раз в 6 кадров: точка за корпусом прячется
          if (frame % 6 === 0) {
            const dirv = world.clone().sub(camera.position);
            const dist = dirv.length();
            ray.set(camera.position, dirv.normalize());
            const hits = ray.intersectObject(current, true);
            p.hidden = !!(hits.length && hits[0].distance < dist - 0.14);
          }
          if (p.hidden || sp.z > 1) {
            p.el.style.opacity = '0';
            continue;
          }
          p.x = (sp.x * 0.5 + 0.5) * w;
          p.y = (-sp.y * 0.5 + 0.5) * h;
          p.left = p.v.x < 0 || (p.v.x === 0 && p.v.z < 0);
          live.push(p);
        }
        // разводим карточки по вертикали внутри каждой стороны, чтобы не наезжали
        const GAP = 54;
        [true, false].forEach((side) => {
          const col = live.filter((p) => p.left === side).sort((a, b) => a.y - b.y);
          for (let k = 1; k < col.length; k++) {
            if (col[k].y - col[k - 1].y < GAP) col[k].y = col[k - 1].y + GAP;
          }
          const over = col.length ? col[col.length - 1].y - (h - 26) : 0;
          if (over > 0) col.forEach((p) => (p.y -= over));
        });
        for (const p of live) {
          p.el.style.left = p.x.toFixed(1) + 'px';
          p.el.style.top = Math.max(18, p.y).toFixed(1) + 'px';
          p.el.style.opacity = '1';
        }
      }
    };
    tick();

    const teardown = () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      renderer.domElement.removeEventListener('wheel', onWheel);
      renderer.domElement.removeEventListener('dblclick', onDblClick);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);

      // геометрия и материалы моделей — свои на каждый инстанс сцены;
      // canvas-текстуры из maps() общие и переживают перемонтирование.
      Object.values(cache).forEach((g) =>
        g.traverse((o) => {
          const mesh = o as THREE.Mesh;
          if (!mesh.isMesh) return;
          mesh.geometry?.dispose();
          const mat = mesh.material;
          if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
          else mat?.dispose();
        }),
      );
      [floorGeo, ringGeo, pulseGeo].forEach((g) => g.dispose());
      [floorMat, ringMat, pulseMat].forEach((m) => m.dispose());
      [floorAlpha, ringGrad].forEach((t) => t.dispose());
      scene.environment?.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      overlay.remove();
    };

    inner = { show, setHot, teardown };
  };

  void boot().catch((err) => console.error('[drone-stage] boot failed', err));

  return {
    show(model) {
      pending.model = model;
      inner?.show(model);
    },
    setHotspots(on) {
      pending.hotspots = on;
      inner?.setHot(on);
    },
    dispose() {
      disposed = true;
      inner?.teardown();
      inner = null;
    },
  };
}
