'use client';

import dynamic from 'next/dynamic';
import DronePlaceholder from '@/components/DroneStage/DronePlaceholder';
import { MODELS } from '@/lib/data';
import { useSite } from '@/lib/site';

// three.js весит немало, поэтому сцена грузится отдельным чанком и только в
// браузере; до её появления в герое виден тот же SVG-силуэт.
const DroneStage = dynamic(() => import('@/components/DroneStage'), {
  ssr: false,
  loading: () => <DronePlaceholder />,
});

const THUMBS = ['HVY', 'ULT', 'FST'];

export default function Hero() {
  const { i, model, animKey, pick, stepModel, navTo, openOrder, hot, toggleHot } = useSite();

  const col = (n: number) => (n === i ? '#ffffff' : '#7f8899');
  const bar = (n: number) => (n === i ? '#ffffff' : 'rgba(255,255,255,.14)');
  const size = (n: number) => (n === i ? '20px' : '14px');

  return (
    <section
      id="top"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        paddingTop: 96,
      }}
    >
      <div
        style={{
          textAlign: 'center',
          padding: 'clamp(6px,2vh,26px) 20px 0',
          position: 'relative',
          zIndex: 20,
          pointerEvents: 'none',
        }}
      >
        {/* key меняется вместе с моделью — так перезапускается анимация подмены */}
        <div key={animKey} style={{ animation: 'mdrSwap .62s cubic-bezier(.16,.84,.3,1) both' }}>
          <div
            style={{
              fontSize: 11,
              letterSpacing: '.34em',
              color: '#7b8494',
              textTransform: 'uppercase',
              marginBottom: 16,
            }}
          >
            {model.kicker}
          </div>
          <h1
            style={{
              margin: 0,
              fontFamily: 'var(--font-display)',
              fontWeight: 400,
              fontSize: 'clamp(32px,6.2vw,82px)',
              lineHeight: 1.02,
              letterSpacing: '-.025em',
            }}
          >
            {model.titleA} <span style={{ color: '#5d6472' }}>{model.titleB}</span>
          </h1>
          <p
            style={{
              margin: '14px auto 0',
              maxWidth: 620,
              fontSize: 'clamp(14px,1.3vw,18px)',
              lineHeight: 1.5,
              color: '#b6bdc9',
              textWrap: 'pretty',
            }}
          >
            {model.tagline}
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: 12,
            marginTop: 24,
            pointerEvents: 'auto',
          }}
        >
          <button
            onClick={openOrder}
            className="hv-white"
            style={{
              border: 0,
              cursor: 'pointer',
              background: '#fff',
              color: '#0a0b0e',
              fontSize: 15,
              fontWeight: 500,
              padding: '16px 34px',
              borderRadius: 999,
              transition: 'transform .2s,box-shadow .2s',
            }}
          >
            Оформить предзаказ
          </button>
          <button
            onClick={navTo('config')}
            className="hv-ghost"
            style={{
              cursor: 'pointer',
              background: 'transparent',
              color: '#e8ebf1',
              border: '1px solid rgba(255,255,255,.26)',
              fontSize: 15,
              padding: '16px 30px',
              borderRadius: 999,
              transition: 'border-color .2s,background .2s',
            }}
          >
            Собрать конфигурацию
          </button>
        </div>
      </div>

      <div
        style={{
          position: 'relative',
          flex: 1,
          minHeight: 'clamp(380px,56vh,660px)',
          marginTop: -8,
          overflow: 'hidden',
        }}
      >
        {/*
          Три процедурные модели на three.js — перенос <drone-stage> из прототипа.
          Круг под дроном (диск + ободок + импульс при смене модели), тени,
          вращение винтов, парение, drag/zoom и подписи узлов живут внутри.
        */}
        <DroneStage
          model={model.id}
          hotspots={hot}
          alt={`${model.name} — интерактивная 3D-модель`}
        />

        <button
          onClick={() => stepModel(-1)}
          aria-label="Предыдущая модель"
          className="hv-arrow"
          style={{
            position: 'absolute',
            left: 'clamp(10px,2.4vw,44px)',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 30,
            width: 50,
            height: 50,
            borderRadius: 999,
            border: 0,
            cursor: 'pointer',
            background: '#e9ecf1',
            color: '#0a0b0e',
            fontSize: 19,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background .2s,transform .2s',
          }}
        >
          ←
        </button>
        <button
          onClick={() => stepModel(1)}
          aria-label="Следующая модель"
          className="hv-arrow"
          style={{
            position: 'absolute',
            right: 'clamp(10px,2.4vw,44px)',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 30,
            width: 50,
            height: 50,
            borderRadius: 999,
            border: 0,
            cursor: 'pointer',
            background: '#e9ecf1',
            color: '#0a0b0e',
            fontSize: 19,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background .2s,transform .2s',
          }}
        >
          →
        </button>

        <button
          onClick={toggleHot}
          aria-pressed={hot}
          style={{
            position: 'absolute',
            top: 14,
            right: 'clamp(10px,2.4vw,44px)',
            zIndex: 30,
            cursor: 'pointer',
            background: hot ? '#fff' : 'rgba(10,12,16,.6)',
            color: hot ? '#0a0b0e' : '#c9cfdb',
            border: `1px solid ${hot ? '#fff' : 'rgba(255,255,255,.22)'}`,
            fontSize: 13,
            padding: '10px 16px',
            borderRadius: 999,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            transition: 'background .2s,color .2s,border-color .2s',
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: 99,
              background: hot ? '#2f22d8' : '#7f8899',
            }}
          />
          Детали узлов
        </button>

        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 30,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: 20,
            flexWrap: 'wrap',
            padding: '0 clamp(14px,3vw,52px) clamp(16px,3vh,32px)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {MODELS.map((m, n) => (
              <button
                key={m.id}
                onClick={() => pick(n)}
                style={{
                  cursor: 'pointer',
                  background: 'transparent',
                  border: 0,
                  borderLeft: `2px solid ${bar(n)}`,
                  padding: '5px 0 5px 14px',
                  textAlign: 'left',
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '.06em',
                  fontSize: size(n),
                  color: col(n),
                  transition: 'color .2s,font-size .25s',
                }}
              >
                {m.name}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {MODELS.map((m, n) => (
              <button
                key={m.id}
                onClick={() => pick(n)}
                aria-label={m.name}
                style={{
                  cursor: 'pointer',
                  width: 72,
                  height: 54,
                  borderRadius: 8,
                  background: '#12151b',
                  border: `1px solid ${bar(n)}`,
                  color: '#cdd3de',
                  fontFamily: 'var(--font-display)',
                  fontSize: 11,
                  letterSpacing: '.12em',
                  transition: 'border-color .2s',
                }}
              >
                {THUMBS[n]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          padding: '0 20px 20px',
          fontSize: 11,
          letterSpacing: '.2em',
          color: '#5f6774',
          textTransform: 'uppercase',
          textAlign: 'center',
        }}
      >
        <span style={{ width: 24, height: 1, background: '#3a4150' }} />
        Перетащите модель · колесо — зум · двойной клик — сброс
        <span style={{ width: 24, height: 1, background: '#3a4150' }} />
      </div>
    </section>
  );
}
