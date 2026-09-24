import type { Metadata } from 'next';
import { Archivo, Manrope } from 'next/font/google';
import './globals.css';

// Archivo — дисплейная гарнитура (у неё на Google Fonts нет кириллицы,
// поэтому в `--font-display` вторым номером стоит Manrope).
const archivo = Archivo({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-archivo',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin', 'latin-ext', 'cyrillic'],
  variable: '--font-manrope',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'MDR Aero — беспилотные платформы для съёмки и мониторинга',
  description:
    'MDR проектирует и собирает беспилотные платформы: MDR Heavy, MDR Ultra Light и MDR Superfast. Конфигуратор, характеристики и предзаказ.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${archivo.variable} ${manrope.variable}`}>
      <body>{children}</body>
    </html>
  );
}
