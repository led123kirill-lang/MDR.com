'use client';

import { useEffect, useRef, useState } from 'react';
import DronePlaceholder from './DronePlaceholder';
import { createDroneStage, type DroneStageHandle } from './scene';

type Props = {
  /** id модели: heavy | light | fast */
  model: string;
  /** показывать подписи узлов */
  hotspots: boolean;
  alt?: string;
};

export default function DroneStage({ model, hotspots, alt }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<DroneStageHandle | null>(null);
  const [ready, setReady] = useState(false);

  // Сцена живёт вне React: создаётся один раз, дальше ею управляют через handle.
  // Свежие model/hotspots берутся из ref, чтобы эффект не пересоздавал сцену.
  const initial = useRef({ model, hotspots });

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const stage = createDroneStage(el, {
      model: initial.current.model,
      hotspots: initial.current.hotspots,
      onReady: () => setReady(true),
    });
    stageRef.current = stage;
    return () => {
      stage.dispose();
      stageRef.current = null;
      setReady(false);
    };
  }, []);

  useEffect(() => {
    stageRef.current?.show(model);
  }, [model]);

  useEffect(() => {
    stageRef.current?.setHotspots(hotspots);
  }, [hotspots]);

  return (
    <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      <div ref={hostRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
      {!ready && <DronePlaceholder alt={alt} />}
    </div>
  );
}
