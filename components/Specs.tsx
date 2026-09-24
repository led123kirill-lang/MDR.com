'use client';

import { useSite } from '@/lib/site';

export default function Specs() {
  const { model, animKey, navTo } = useSite();

  return (
    <section
      id="specs"
      style={{
        padding: 'clamp(52px,7vw,104px) clamp(14px,3vw,52px)',
        borderTop: '1px solid rgba(255,255,255,.08)',
      }}
    >
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        <div
          data-reveal="1"
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            gap: 16,
            flexWrap: 'wrap',
            marginBottom: 32,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 11,
                letterSpacing: '.3em',
                textTransform: 'uppercase',
                color: '#7b8494',
                marginBottom: 12,
              }}
            >
              Технические данные
            </div>
            <h2
              style={{
                margin: 0,
                fontFamily: 'var(--font-display)',
                fontWeight: 400,
                fontSize: 'clamp(23px,3.2vw,40px)',
                letterSpacing: '-.015em',
              }}
            >
              Характеристики <span style={{ color: '#5d6472' }}>{model.short}</span>
            </h2>
          </div>
          <div style={{ fontSize: 13, color: '#7b8494' }}>Обновляется при переключении модели</div>
        </div>

        <div
          key={animKey}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,200px),1fr))',
            gap: 1,
            background: 'rgba(255,255,255,.08)',
            border: '1px solid rgba(255,255,255,.08)',
            borderRadius: 14,
            overflow: 'hidden',
            animation: 'mdrSwapUp .5s ease both',
          }}
        >
          {model.specs.map((s) => (
            <div
              key={s.label}
              style={{
                background: '#0d0f14',
                padding: '24px 22px',
                display: 'flex',
                flexDirection: 'column',
                gap: 9,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  letterSpacing: '.2em',
                  textTransform: 'uppercase',
                  color: '#7b8494',
                }}
              >
                {s.label}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(25px,3vw,36px)',
                  fontWeight: 400,
                  lineHeight: 1,
                }}
              >
                {s.value}
                <span style={{ fontSize: 15, color: '#8a93a2', marginLeft: 6 }}>{s.unit}</span>
              </div>
              <div style={{ fontSize: 13, color: '#8a93a2', lineHeight: 1.45 }}>{s.note}</div>
            </div>
          ))}
        </div>

        <div
          data-reveal="1"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,260px),1fr))',
            gap: 18,
            marginTop: 18,
          }}
        >
          <div
            style={{
              border: '1px solid rgba(255,255,255,.08)',
              borderRadius: 14,
              padding: 22,
              background: '#0d0f14',
            }}
          >
            <div
              style={{
                fontSize: 11,
                letterSpacing: '.2em',
                textTransform: 'uppercase',
                color: '#7b8494',
                marginBottom: 12,
              }}
            >
              Назначение
            </div>
            <div
              style={{ fontSize: 15.5, lineHeight: 1.6, color: '#dfe3ea', textWrap: 'pretty' }}
            >
              {model.use}
            </div>
          </div>

          <div
            style={{
              border: '1px solid rgba(255,255,255,.08)',
              borderRadius: 14,
              padding: 22,
              background: '#0d0f14',
            }}
          >
            <div
              style={{
                fontSize: 11,
                letterSpacing: '.2em',
                textTransform: 'uppercase',
                color: '#7b8494',
                marginBottom: 12,
              }}
            >
              Комплектация
            </div>
            <div
              style={{ fontSize: 15.5, lineHeight: 1.6, color: '#dfe3ea', textWrap: 'pretty' }}
            >
              {model.kit}
            </div>
          </div>

          <div
            style={{
              border: '1px solid rgba(255,255,255,.08)',
              borderRadius: 14,
              padding: 22,
              background: '#0e1017',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 16,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 11,
                  letterSpacing: '.2em',
                  textTransform: 'uppercase',
                  color: '#7b8494',
                  marginBottom: 12,
                }}
              >
                Базовая цена
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 29 }}>{model.price}</div>
            </div>
            <button
              onClick={navTo('config')}
              className="hv-indigo"
              style={{
                border: 0,
                cursor: 'pointer',
                background: '#2f22d8',
                color: '#fff',
                fontSize: 15,
                fontWeight: 500,
                padding: '14px 24px',
                borderRadius: 999,
                transition: 'background .2s',
              }}
            >
              Собрать конфигурацию
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
