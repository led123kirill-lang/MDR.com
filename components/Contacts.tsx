'use client';

import { useSite } from '@/lib/site';

export default function Contacts() {
  const { openOrder } = useSite();

  return (
    <section
      id="contacts"
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
          gap: 'clamp(26px,4vw,64px)',
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
            Связь
          </div>
          <h2
            style={{
              margin: '0 0 16px',
              fontFamily: 'var(--font-display)',
              fontWeight: 400,
              fontSize: 'clamp(23px,3.2vw,40px)',
              letterSpacing: '-.015em',
            }}
          >
            Контакты
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 16 }}>
            <a href="tel:+74951234567" style={{ color: '#eef1f6' }}>
              +7 495 123-45-67
            </a>
            <a href="mailto:sales@mdr.aero" style={{ color: '#eef1f6' }}>
              sales@mdr.aero
            </a>
            <span style={{ color: '#8a93a2', lineHeight: 1.55 }}>
              Москва, Дербеневская наб., 7с22 · пн–пт 10:00–19:00
            </span>
          </div>
        </div>

        <div
          data-reveal="1"
          style={{
            border: '1px solid rgba(255,255,255,.12)',
            borderRadius: 16,
            padding: 'clamp(20px,3vw,32px)',
            background: '#0e1017',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(19px,2.4vw,27px)',
              marginBottom: 10,
            }}
          >
            Предзаказ партии
          </div>
          <p
            style={{
              margin: '0 0 20px',
              fontSize: 15,
              lineHeight: 1.6,
              color: '#9aa3b1',
              textWrap: 'pretty',
            }}
          >
            Оставьте контакт — инженер свяжется в течение рабочего дня и подберёт конфигурацию.
          </p>
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
              padding: '16px 30px',
              borderRadius: 999,
              transition: 'background .2s',
            }}
          >
            Оставить заявку
          </button>
        </div>
      </div>
    </section>
  );
}
