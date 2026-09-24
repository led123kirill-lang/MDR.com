import { CASES } from '@/lib/data';

export default function Cases() {
  return (
    <section
      id="cases"
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
            Практика
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
            Кейсы применения
          </h2>
        </div>

        <div
          data-reveal="1"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,270px),1fr))',
            gap: 1,
            background: 'rgba(255,255,255,.08)',
            border: '1px solid rgba(255,255,255,.08)',
            borderRadius: 16,
            overflow: 'hidden',
          }}
        >
          {CASES.map((c) => (
            <div
              key={c.title}
              style={{
                background: '#0d0f14',
                padding: '24px 22px',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
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
                {c.sector}
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, lineHeight: 1.25 }}>
                {c.title}
              </div>
              <div
                style={{ fontSize: 14.5, lineHeight: 1.6, color: '#9aa3b1', textWrap: 'pretty' }}
              >
                {c.body}
              </div>
              <div
                style={{
                  marginTop: 'auto',
                  paddingTop: 12,
                  borderTop: '1px solid rgba(255,255,255,.08)',
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 8,
                }}
              >
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 22 }}>{c.metric}</span>
                <span style={{ fontSize: 12.5, color: '#8a93a2', lineHeight: 1.4 }}>
                  {c.metricNote}
                </span>
              </div>
              <div style={{ fontSize: 12.5, color: '#7f8899' }}>Платформа: {c.model}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
