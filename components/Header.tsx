'use client';

import { useSite } from '@/lib/site';

const NAV = [
  { id: 'catalog', label: 'Каталог' },
  { id: 'config', label: 'Конфигуратор' },
  { id: 'cases', label: 'Кейсы' },
  { id: 'about', label: 'О компании' },
  { id: 'contacts', label: 'Контакты' },
];

export default function Header() {
  const { narrow, menuOpen, toggleMenu, closeMenu, navTo, menuNavTo, openOrder } = useSite();

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 20,
          padding: '16px clamp(14px,3vw,52px)',
          background:
            'linear-gradient(180deg,rgba(8,9,12,.95),rgba(8,9,12,.64) 70%,rgba(8,9,12,0))',
          backdropFilter: 'blur(8px)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(14px,3vw,46px)',
            minWidth: 0,
          }}
        >
          <a
            href="#top"
            onClick={navTo('top')}
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              fontSize: 19,
              letterSpacing: '.16em',
              color: '#fff',
              flex: 'none',
            }}
          >
            MDR
          </a>

          {!narrow && (
            <nav
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 0,
                flexWrap: 'nowrap',
                overflowX: 'auto',
                minWidth: 0,
              }}
            >
              {NAV.map((item, n) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={navTo(item.id)}
                  style={{
                    fontSize: 14,
                    padding: '6px clamp(9px,1.1vw,17px)',
                    borderRight:
                      n < NAV.length - 1 ? '1px solid rgba(255,255,255,.14)' : undefined,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 'none' }}>
          <button
            onClick={openOrder}
            className="hv-cta"
            style={{
              flex: 'none',
              border: 0,
              cursor: 'pointer',
              background: '#2f22d8',
              color: '#fff',
              fontSize: 14.5,
              fontWeight: 500,
              padding: '14px clamp(18px,2.2vw,32px)',
              borderRadius: 999,
              transition: 'background .2s,transform .2s',
            }}
          >
            Приобрести
          </button>

          {narrow && (
            <button
              onClick={toggleMenu}
              aria-label="Меню"
              style={{
                flex: 'none',
                cursor: 'pointer',
                width: 46,
                height: 46,
                borderRadius: 999,
                background: 'transparent',
                border: '1px solid rgba(255,255,255,.22)',
                color: '#eef1f6',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
              }}
            >
              <span style={{ width: 16, height: 1.5, background: '#eef1f6' }} />
              <span style={{ width: 16, height: 1.5, background: '#eef1f6' }} />
              <span style={{ width: 16, height: 1.5, background: '#eef1f6' }} />
            </button>
          )}
        </div>
      </header>

      {menuOpen && (
        <div
          onClick={closeMenu}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 70,
            background: 'rgba(6,7,10,.88)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: 26,
            gap: 4,
            animation: 'mdrFade .2s ease',
          }}
        >
          <button
            onClick={closeMenu}
            aria-label="Закрыть меню"
            style={{
              position: 'absolute',
              top: 18,
              right: 20,
              cursor: 'pointer',
              width: 44,
              height: 44,
              borderRadius: 999,
              background: 'transparent',
              border: '1px solid rgba(255,255,255,.22)',
              color: '#eef1f6',
              fontSize: 16,
            }}
          >
            ✕
          </button>
          {NAV.map((item, n) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={menuNavTo(item.id)}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 26,
                color: '#f2f4f7',
                padding: '14px 0',
                borderBottom:
                  n < NAV.length - 1 ? '1px solid rgba(255,255,255,.1)' : undefined,
              }}
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </>
  );
}
