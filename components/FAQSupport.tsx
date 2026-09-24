'use client';

import { FAQ, SUPPORT } from '@/lib/data';
import { useSite } from '@/lib/site';

export default function FAQSupport() {
  const { faqOpen, toggleFaq, navTo } = useSite();

  return (
    <section
      id="faq"
      style={{
        padding: 'clamp(52px,7vw,104px) clamp(14px,3vw,52px)',
        borderTop: '1px solid rgba(255,255,255,.08)',
      }}
    >
      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,300px),1fr))',
          gap: 'clamp(26px,4vw,56px)',
          alignItems: 'start',
        }}
      >
        <div data-reveal="1">
          <div
            style={{
              fontSize: 11,
              letterSpacing: '.3em',
              textTransform: 'uppercase',
              color: '#7b8494',
              marginBottom: 12,
            }}
          >
            Вопросы
          </div>
          <h2
            style={{
              margin: '0 0 20px',
              fontFamily: 'var(--font-display)',
              fontWeight: 400,
              fontSize: 'clamp(23px,3.2vw,40px)',
              letterSpacing: '-.015em',
            }}
          >
            Частые вопросы
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {FAQ.map((q, n) => {
              const open = faqOpen === n;
              return (
                <div
                  key={q.q}
                  style={{
                    border: '1px solid rgba(255,255,255,.1)',
                    borderRadius: 12,
                    background: '#0d0f14',
                    overflow: 'hidden',
                  }}
                >
                  <button
                    onClick={() => toggleFaq(n)}
                    aria-expanded={open}
                    style={{
                      width: '100%',
                      cursor: 'pointer',
                      background: 'transparent',
                      border: 0,
                      color: '#eef1f6',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 14,
                      padding: '17px 18px',
                      fontSize: 15,
                      lineHeight: 1.4,
                    }}
                  >
                    {q.q}
                    <span
                      style={{
                        flex: 'none',
                        color: '#8a93a2',
                        fontSize: 18,
                        transform: open ? 'rotate(45deg)' : 'none',
                        transition: 'transform .25s',
                      }}
                    >
                      +
                    </span>
                  </button>
                  <div
                    style={{
                      maxHeight: open ? '260px' : '0px',
                      opacity: open ? 1 : 0,
                      overflow: 'hidden',
                      transition: 'max-height .32s ease,opacity .25s ease',
                    }}
                  >
                    <div
                      style={{
                        padding: '0 18px 18px',
                        fontSize: 14.5,
                        lineHeight: 1.65,
                        color: '#9aa3b1',
                        textWrap: 'pretty',
                      }}
                    >
                      {q.a}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div data-reveal="1" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div
            style={{
              fontSize: 11,
              letterSpacing: '.3em',
              textTransform: 'uppercase',
              color: '#7b8494',
              marginBottom: 0,
            }}
          >
            Сервис
          </div>
          <h2
            style={{
              margin: '0 0 4px',
              fontFamily: 'var(--font-display)',
              fontWeight: 400,
              fontSize: 'clamp(23px,3.2vw,40px)',
              letterSpacing: '-.015em',
            }}
          >
            Техподдержка
          </h2>

          {SUPPORT.map((s) => (
            <div
              key={s.n}
              style={{
                border: '1px solid rgba(255,255,255,.1)',
                borderRadius: 12,
                background: '#0d0f14',
                padding: '18px 20px',
                display: 'flex',
                gap: 16,
                alignItems: 'baseline',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 15,
                  color: '#7f8899',
                  flex: 'none',
                  width: 34,
                }}
              >
                {s.n}
              </span>
              <span style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <span style={{ fontSize: 15, color: '#eef1f6' }}>{s.title}</span>
                <span style={{ fontSize: 13.5, color: '#8a93a2', lineHeight: 1.55 }}>{s.body}</span>
              </span>
            </div>
          ))}

          <div
            style={{
              border: '1px solid rgba(255,255,255,.12)',
              borderRadius: 12,
              background: '#0e1017',
              padding: 20,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            <span style={{ fontSize: 14.5, color: '#c3c9d4', lineHeight: 1.55 }}>
              Дежурный инженер на линии в рабочие дни с 9:00 до 21:00 МСК.
            </span>
            <button
              onClick={navTo('contacts')}
              className="hv-invert"
              style={{
                cursor: 'pointer',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,.26)',
                color: '#eef1f6',
                fontSize: 14,
                padding: '12px 20px',
                borderRadius: 999,
                transition: 'background .2s,color .2s',
              }}
            >
              Связаться
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
