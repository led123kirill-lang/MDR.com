import Image from 'next/image';

/**
 * Статичный силуэт, который виден, пока грузится three.js
 * (и остаётся насовсем, если WebGL недоступен).
 */
export default function DronePlaceholder({ alt = 'Дрон MDR' }: { alt?: string }) {
  return (
    <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      <Image
        src="/drone-placeholder.svg"
        alt={alt}
        fill
        unoptimized
        priority
        style={{ objectFit: 'contain', padding: '4% 12%', opacity: 0.9 }}
      />
    </div>
  );
}
