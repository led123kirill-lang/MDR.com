export default function Footer() {
  return (
    <footer
      style={{
        padding: '26px clamp(14px,3vw,52px)',
        borderTop: '1px solid rgba(255,255,255,.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        flexWrap: 'wrap',
        fontSize: 13,
        color: '#7f8899',
      }}
    >
      <span
        style={{ fontFamily: 'var(--font-display)', letterSpacing: '.16em', color: '#c9cfdb' }}
      >
        MDR
      </span>
      <span>© 2026 MDR Aero. Все права защищены.</span>
    </footer>
  );
}
