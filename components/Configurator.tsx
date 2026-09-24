'use client';

import { fmt } from '@/lib/format';
import { useSite } from '@/lib/site';

export default function Configurator() {
  const { model, config, setOption, resetConfig, summary, totalPrice, openOrder } = useSite();

  return (
    <section
      id="config"
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
            Конфигуратор
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
            Соберите {model.short} под задачу
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
            Цена пересчитывается сразу. Выбранная сборка переносится в заявку.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0,1.7fr) minmax(0,1fr)',
            gap: 18,
            alignItems: 'start',
          }}
        >
          <div data-reveal="1" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {model.groups.map((g) => (
              <div
                key={g.key}
                style={{
                  border: '1px solid rgba(255,255,255,.1)',
                  borderRadius: 14,
                  background: '#0d0f14',
                  padding: '20px 20px 18px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    justifyContent: 'space-between',
                    gap: 12,
                    marginBottom: 14,
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
                    {g.label}
                  </div>
                  <div style={{ fontSize: 12.5, color: '#7f8899' }}>{g.hint}</div>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,190px),1fr))',
                    gap: 10,
                  }}
                >
                  {g.options.map((o) => {
                    const on = config[g.key] === o.id;
                    return (
                      <button
                        key={o.id}
                        onClick={() => setOption(g.key, o.id)}
                        aria-pressed={on}
                        style={{
                          cursor: 'pointer',
                          textAlign: 'left',
                          background: on ? '#15181f' : 'transparent',
                          border: `1px solid ${on ? '#ffffff' : 'rgba(255,255,255,.14)'}`,
                          borderRadius: 12,
                          padding: '14px 15px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 6,
                          transition: 'border-color .2s,background .2s',
                        }}
                      >
                        <span
                          style={{
                            fontSize: 14.5,
                            color: on ? '#ffffff' : '#c9cfdb',
                            fontWeight: 500,
                          }}
                        >
                          {o.name}
                        </span>
                        <span style={{ fontSize: 12.5, color: '#8a93a2', lineHeight: 1.4 }}>
                          {o.note}
                        </span>
                        <span
                          style={{
                            fontSize: 12.5,
                            color: on ? '#8f9dff' : '#7f8899',
                            marginTop: 2,
                          }}
                        >
                          {o.delta ? '+ ' + fmt(o.delta) : 'включено'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div
            data-reveal="1"
            style={{
              position: 'sticky',
              top: 96,
              border: '1px solid rgba(255,255,255,.12)',
              borderRadius: 16,
              background: '#0e1017',
              padding: 22,
              display: 'flex',
              flexDirection: 'column',
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
                  marginBottom: 10,
                }}
              >
                Ваша сборка
              </div>
              <div
                style={{ fontFamily: 'var(--font-display)', fontSize: 20, letterSpacing: '.04em' }}
              >
                {model.name}
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 9,
                borderTop: '1px solid rgba(255,255,255,.1)',
                borderBottom: '1px solid rgba(255,255,255,.1)',
                padding: '14px 0',
              }}
            >
              {summary.map((s) => (
                <div
                  key={s.label}
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    justifyContent: 'space-between',
                    gap: 12,
                    fontSize: 13.5,
                  }}
                >
                  <span style={{ color: '#8a93a2' }}>{s.label}</span>
                  <span style={{ color: '#e8ebf1', textAlign: 'right' }}>{s.value}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div
                style={{
                  fontSize: 11,
                  letterSpacing: '.2em',
                  textTransform: 'uppercase',
                  color: '#7b8494',
                }}
              >
                Итого
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(24px,2.6vw,32px)',
                  lineHeight: 1.05,
                  whiteSpace: 'nowrap',
                }}
              >
                {totalPrice}
              </div>
              <div style={{ fontSize: 12.5, color: '#7f8899', lineHeight: 1.4 }}>{model.lead}</div>
            </div>

            <button
              onClick={openOrder}
              className="hv-indigo"
              style={{
                border: 0,
                cursor: 'pointer',
                background: '#2f22d8',
                color: '#fff',
                fontSize: 15,
                fontWeight: 500,
                padding: '16px 24px',
                borderRadius: 999,
                transition: 'background .2s',
              }}
            >
              Отправить на расчёт
            </button>
            <button
              onClick={resetConfig}
              className="hv-outline-white"
              style={{
                cursor: 'pointer',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,.18)',
                color: '#c9cfdb',
                fontSize: 13.5,
                padding: '12px 20px',
                borderRadius: 999,
                transition: 'border-color .2s,color .2s',
              }}
            >
              Сбросить к базовой
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
