/** Форматирование суммы: `2480000` → `2 480 000 ₽` (разделитель — NBSP, как в прототипе). */
export const fmt = (n: number): string =>
  n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₽';

// Буквы, допустимые в имени: кириллица (вкл. ё/Ё), латиница и расширенная
// латиница для фамилий вроде Müller или Łukasz. Диапазоны выписаны явно —
// `\p{L}` требует ES2018, а в tsconfig target: ES2017.
const NAME_LETTERS = 'A-Za-z\\u00C0-\\u024F\\u0400-\\u04FF';
const NOT_NAME = new RegExp(`[^${NAME_LETTERS} '’-]`, 'g');
const NAME_HAS_LETTERS = new RegExp(`[${NAME_LETTERS}]`, 'g');

/**
 * Имя: пропускаем только буквы, пробел, дефис и апостроф — цифры и прочие
 * символы в поле просто не появляются. Разделители не дают ни идти подряд,
 * ни открывать строку, чтобы «--» или « » не проходили за имя.
 */
export function maskName(raw: string): string {
  return String(raw)
    .replace(NOT_NAME, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/([-'’])\1+/g, '$1')
    .replace(/^[\s'’-]+/, '');
}

/** В имени должно быть не меньше двух букв — одни дефисы с пробелами не считаются. */
export function nameIsValid(value: string): boolean {
  return (value.match(NAME_HAS_LETTERS) || []).length >= 2;
}

/**
 * Маска российского номера: любой ввод приводится к `+7 (999) 123-45-67`.
 * `prev` нужен, чтобы backspace на служебном символе стирал цифру, а не залипал.
 */
export function maskPhone(raw: string, prev: string): string {
  let d = String(raw).replace(/\D/g, '');
  if (d.startsWith('8')) d = '7' + d.slice(1);
  if (!d.startsWith('7')) d = '7' + d;
  d = d.slice(0, 11);
  if (String(raw).replace(/\D/g, '').length === 0) return '';
  let out = '+7';
  if (d.length > 1) out += ' (' + d.slice(1, 4);
  if (d.length >= 5) out += ') ' + d.slice(4, 7);
  if (d.length >= 8) out += '-' + d.slice(7, 9);
  if (d.length >= 10) out += '-' + d.slice(9, 11);
  if (prev && prev.length > out.length && /[)\-\s]$/.test(prev)) return out;
  return out;
}
