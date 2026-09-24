import { FACTS } from '@/lib/data';

export default function About() {
  return (
    <section
      id="about"
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
          gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,320px),1fr))',
          gap: 'clamp(26px,4vw,64px)',
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
            Производство
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
            О компании
          </h2>
          <p
            style={{
              margin: '0 0 14px',
              fontSize: 16,
              lineHeight: 1.7,
              color: '#c3c9d4',
              textWrap: 'pretty',
            }}
          >
            MDR проектирует и собирает беспилотные платформы для съёмки, мониторинга и логистики.
            Собственная разработка полётного контроллера, сборка и сервис — в одном контуре.
          </p>
          <p
            style={{
              margin: 0,
              fontSize: 16,
              lineHeight: 1.7,
              color: '#8a93a2',
              textWrap: 'pretty',
            }}
          >
            Каждый аппарат проходит 40 часов стендовых испытаний и калибровку камеры перед
            отправкой.
          </p>
        </div>

        <div
          data-reveal="1"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))',
            gap: 1,
            background: 'rgba(255,255,255,.08)',
            border: '1px solid rgba(255,255,255,.08)',
            borderRadius: 14,
            overflow: 'hidden',
          }}
        >
          {FACTS.map((f) => (
            <div key={f.n} style={{ background: '#0d0f14', padding: '22px 20px' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 29 }}>{f.n}</div>
              <div style={{ fontSize: 13, color: '#8a93a2', marginTop: 6, lineHeight: 1.4 }}>
                {f.t}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
