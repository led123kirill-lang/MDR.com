'use client';

import NameInput from '@/components/NameInput';
import { useSite } from '@/lib/site';

const inputStyle: React.CSSProperties = {
  background: '#080a0d',
  borderRadius: 10,
  color: '#f2f4f7',
  fontSize: 15,
  padding: '15px 16px',
  outline: 'none',
};

export default function OrderModal() {
  const {
    orderOpen,
    closeOrder,
    sent,
    step,
    model,
    summary,
    totalPrice,
    sentNote,
    formHint,
    hintColor,
    qty,
    incQty,
    decQty,
    name,
    setName,
    phone,
    setPhone,
    email,
    setEmail,
    company,
    setCompany,
    note,
    setNote,
    toStep1,
    toStep2,
    submit,
    sending,
    borderFor,
    nameOk,
    phoneOk,
    emailOk,
  } = useSite();

  if (!orderOpen) return null;

  return (
    <div
      onClick={closeOrder}
      role="dialog"
      aria-modal="true"
      aria-label="Оформить предзаказ"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 90,
        background: 'rgba(4,5,7,.8)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 18,
        animation: 'mdrFade .22s ease',
        overflowY: 'auto',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 540,
          background: '#0d0f14',
          border: '1px solid rgba(255,255,255,.12)',
          borderRadius: 18,
          padding: 'clamp(20px,3vw,32px)',
        }}
      >
        {sent ? (
          <div style={{ textAlign: 'center', padding: '16px 0 6px' }}>
            <div
              style={{ fontFamily: 'var(--font-display)', fontSize: 25, marginBottom: 12 }}
            >
              Заявка отправлена
            </div>
            <p
              style={{
                margin: '0 0 22px',
                fontSize: 15,
                color: '#9aa3b1',
                lineHeight: 1.6,
                textWrap: 'pretty',
              }}
            >
              {sentNote}
            </p>
            <button
              onClick={closeOrder}
              style={{
                border: 0,
                cursor: 'pointer',
                background: '#fff',
                color: '#0a0b0e',
                fontSize: 15,
                padding: '15px 32px',
                borderRadius: 999,
              }}
            >
              Закрыть
            </button>
          </div>
        ) : (
          <>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: 14,
                marginBottom: 18,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 11,
                    letterSpacing: '.24em',
                    textTransform: 'uppercase',
                    color: '#7b8494',
                    marginBottom: 8,
                  }}
                >
                  {step === 1 ? 'Шаг 1 из 2 · контакты' : 'Шаг 2 из 2 · конфигурация'}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(19px,2.4vw,25px)',
                  }}
                >
                  {step === 1 ? 'Оформить предзаказ' : 'Проверьте сборку'}
                </div>
              </div>
              <button
                onClick={closeOrder}
                aria-label="Закрыть"
                style={{
                  flex: 'none',
                  cursor: 'pointer',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,.18)',
                  color: '#c9cfdb',
                  width: 34,
                  height: 34,
                  borderRadius: 999,
                  fontSize: 15,
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
              <span style={{ flex: 1, height: 3, borderRadius: 9, background: '#2f22d8' }} />
              <span
                style={{
                  flex: 1,
                  height: 3,
                  borderRadius: 9,
                  background: step === 2 ? '#2f22d8' : 'rgba(255,255,255,.14)',
                }}
              />
            </div>

            {step === 1 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
                <NameInput
                  className="mdr-input"
                  value={name}
                  onChange={setName}
                  placeholder="Имя и фамилия"
                  style={{ ...inputStyle, border: `1px solid ${borderFor(nameOk)}` }}
                />
                <input
                  className="mdr-input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  inputMode="tel"
                  placeholder="+7 (___) ___-__-__"
                  style={{ ...inputStyle, border: `1px solid ${borderFor(phoneOk)}` }}
                />
                <input
                  className="mdr-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  inputMode="email"
                  placeholder="E-mail для КП"
                  style={{ ...inputStyle, border: `1px solid ${borderFor(emailOk)}` }}
                />
                <input
                  className="mdr-input"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Компания (необязательно)"
                  style={{ ...inputStyle, border: '1px solid rgba(255,255,255,.14)' }}
                />
                <button
                  onClick={toStep2}
                  className="hv-indigo"
                  style={{
                    marginTop: 6,
                    border: 0,
                    cursor: 'pointer',
                    background: '#2f22d8',
                    color: '#fff',
                    fontSize: 15.5,
                    fontWeight: 500,
                    padding: '16px 20px',
                    borderRadius: 999,
                    transition: 'background .2s',
                  }}
                >
                  Далее — конфигурация
                </button>
                <div style={{ fontSize: 12.5, color: hintColor, lineHeight: 1.5 }}>{formHint}</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div
                  style={{
                    border: '1px solid rgba(255,255,255,.1)',
                    borderRadius: 12,
                    background: '#0b0d11',
                    padding: '16px 18px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 9,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      justifyContent: 'space-between',
                      gap: 12,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 17,
                        letterSpacing: '.04em',
                      }}
                    >
                      {model.name}
                    </span>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 17 }}>
                      {totalPrice}
                    </span>
                  </div>
                  {summary.map((s) => (
                    <div
                      key={s.label}
                      style={{
                        display: 'flex',
                        alignItems: 'baseline',
                        justifyContent: 'space-between',
                        gap: 12,
                        fontSize: 13,
                      }}
                    >
                      <span style={{ color: '#8a93a2' }}>{s.label}</span>
                      <span style={{ color: '#dfe3ea', textAlign: 'right' }}>{s.value}</span>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                    border: '1px solid rgba(255,255,255,.1)',
                    borderRadius: 12,
                    padding: '12px 16px',
                  }}
                >
                  <span style={{ fontSize: 14.5, color: '#c3c9d4' }}>Количество аппаратов</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <button
                      onClick={decQty}
                      aria-label="Меньше"
                      style={{
                        cursor: 'pointer',
                        width: 34,
                        height: 34,
                        borderRadius: 999,
                        background: 'transparent',
                        border: '1px solid rgba(255,255,255,.2)',
                        color: '#eef1f6',
                        fontSize: 16,
                      }}
                    >
                      −
                    </button>
                    <span
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 17,
                        minWidth: 26,
                        textAlign: 'center',
                      }}
                    >
                      {qty}
                    </span>
                    <button
                      onClick={incQty}
                      aria-label="Больше"
                      style={{
                        cursor: 'pointer',
                        width: 34,
                        height: 34,
                        borderRadius: 999,
                        background: 'transparent',
                        border: '1px solid rgba(255,255,255,.2)',
                        color: '#eef1f6',
                        fontSize: 16,
                      }}
                    >
                      +
                    </button>
                  </span>
                </div>

                <textarea
                  className="mdr-input"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Задача, сроки, особые требования"
                  rows={3}
                  style={{
                    ...inputStyle,
                    border: '1px solid rgba(255,255,255,.14)',
                    padding: '14px 16px',
                    resize: 'vertical',
                  }}
                />

                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <button
                    onClick={toStep1}
                    disabled={sending}
                    style={{
                      cursor: sending ? 'not-allowed' : 'pointer',
                      flex: '1 1 140px',
                      background: 'transparent',
                      border: '1px solid rgba(255,255,255,.22)',
                      color: '#eef1f6',
                      fontSize: 15,
                      padding: '15px 20px',
                      borderRadius: 999,
                    }}
                  >
                    Назад
                  </button>
                  <button
                    onClick={submit}
                    disabled={sending}
                    aria-busy={sending}
                    className={sending ? undefined : 'hv-indigo'}
                    style={{
                      flex: '2 1 200px',
                      border: 0,
                      cursor: sending ? 'progress' : 'pointer',
                      background: sending ? '#241ba0' : '#2f22d8',
                      color: '#fff',
                      fontSize: 15.5,
                      fontWeight: 500,
                      padding: '16px 20px',
                      borderRadius: 999,
                      transition: 'background .2s',
                      opacity: sending ? 0.75 : 1,
                    }}
                  >
                    {sending ? 'Отправляем…' : 'Отправить заявку'}
                  </button>
                </div>
                <div style={{ fontSize: 12.5, color: hintColor, lineHeight: 1.5 }}>{formHint}</div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
