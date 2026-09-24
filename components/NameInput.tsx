'use client';

import { useLayoutEffect, useRef, type CSSProperties } from 'react';
import { maskName } from '@/lib/format';

type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  style?: CSSProperties;
  className?: string;
};

/**
 * Поле имени: цифры и символы отсеиваются прямо на вводе.
 *
 * Отдельный компонент нужен из-за каретки. Когда маска выбрасывает символ,
 * управляемый input получает строку короче той, что в DOM, и браузер
 * переставляет курсор в конец — редактировать середину имени становится
 * невозможно. Поэтому считаем, сколько разрешённых символов было слева от
 * курсора, и после рендера возвращаем каретку на это место.
 */
export default function NameInput({ value, onChange, placeholder, style, className }: Props) {
  const ref = useRef<HTMLInputElement>(null);
  const caret = useRef<number | null>(null);

  // Восстанавливаем каретку после каждого рендера — на случай, когда значение
  // изменилось и React переписал DOM.
  useLayoutEffect(() => {
    const el = ref.current;
    if (el && caret.current !== null && document.activeElement === el) {
      el.setSelectionRange(caret.current, caret.current);
    }
    caret.current = null;
  });

  return (
    <input
      ref={ref}
      className={className}
      value={value}
      placeholder={placeholder}
      style={style}
      autoComplete="name"
      onChange={(e) => {
        const el = e.target;
        const raw = el.value;
        const pos = el.selectionStart ?? raw.length;
        // позиция в очищенной строке = длина очищенного «хвоста» слева от курсора
        const next = maskName(raw);
        const at = maskName(raw.slice(0, pos)).length;
        caret.current = at;
        // Если символ отклонён, значение в state не меняется → рендера не будет
        // и useLayoutEffect не сработает. Возвращаем DOM и каретку руками.
        if (next === value) {
          el.value = value;
          el.setSelectionRange(at, at);
          caret.current = null;
        }
        onChange(raw);
      }}
    />
  );
}
