'use client';

import { MODELS } from '@/lib/data';
import { useSite } from '@/lib/site';

export default function Catalog() {
  const { i, pick, scrollTo } = useSite();

  return (
    <section
      id="catalog"
      style={{
        padding: 'clamp(52px,7vw,104px) clamp(14px,3vw,52px)',
        borderTop: '1px solid rgba(255,255,255,.08)',
      }}
    >
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        <div data-reveal="1" style={{ marginBottom: 32 }}>
          <div
            style={{
              fontSize: 11,
              letterSpacing: '.3em',
              textTransform: 'uppercase',
              color: '#7b8494',
              marginBottom: 12,
            }}
          >
            Модельный ряд
          </div>
          <h2
            style={{
              margin: '0 0 10px',
              fontFamily: 'var(--font-display)',
              fontWeight: 400,
              fontSize: 'clamp(23px,3.2vw,40px)',
              letterSpacing: '-.015em',
            }}
          >
            Каталог
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: 15.5,
              color: '#8a93a2',
              maxWidth: 620,
              lineHeight: 1.6,
              textWrap: 'pretty',
            }}
          >
            Три платформы на общей системе управления. Выберите модель — сцена и характеристики
            переключатся автоматически.
          </p>
        </div>

        <div
          data-reveal="1"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,280px),1fr))',
            gap: 18,
          }}
        >
          {MODELS.map((c, n) => (
            <div
              key={c.id}
              className="hv-card"
              style={{
                border: `1px solid ${n === i ? 'rgba(255,255,255,.34)' : 'rgba(255,255,255,.1)'}`,
                borderRadius: 16,
                padding: 24,
                background: '#0d0f14',
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
                transition: 'border-color .25s,transform .25s',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 18,
                    letterSpacing: '.05em',
                  }}
                >
                  {c.name}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    letterSpacing: '.14em',
                    textTransform: 'uppercase',
                    color: '#8a93a2',
                    border: '1px solid rgba(255,255,255,.16)',
                    borderRadius: 999,
                    padding: '5px 11px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {c.tag}
                </span>
              </div>

              <div
                style={{ fontSize: 14.5, lineHeight: 1.6, color: '#9aa3b1', textWrap: 'pretty' }}
              >
                {c.desc}
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 8,
                  flexWrap: 'wrap',
                  marginTop: 'auto',
                }}
              >
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 21 }}>{c.price}</span>
                <span style={{ fontSize: 13, color: '#7b8494' }}>{c.lead}</span>
              </div>

              <button
                onClick={() => {
                  pick(n);
                  scrollTo('top');
                }}
                className="hv-invert"
                style={{
                  cursor: 'pointer',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,.26)',
                  color: '#eef1f6',
                  fontSize: 14.5,
                  padding: '13px 20px',
                  borderRadius: 999,
                  transition: 'background .2s,border-color .2s,color .2s',
                }}
              >
                Смотреть в 3D
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
