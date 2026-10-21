import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PRODUCTS } from '../data/products';

export const LoginScreen: React.FC = () => {
  const { navigate, loginUser } = useApp();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const valid = /^[6-9]\d{9}$/.test(phone);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!valid) {
      setError('Enter a valid 10-digit Indian mobile number.');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await loginUser(phone);
      navigate('otp', { phone });
    } catch (requestError: any) {
      setError(requestError?.message || 'We could not send the OTP. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const tileProducts = [...PRODUCTS, ...PRODUCTS].slice(0, 16);

  return (
    <main style={{ position: 'relative', flex: 1, overflowY: 'auto', background: '#0f5cf6' }}>
      <section style={{ position: 'relative', height: '58%', minHeight: 470, overflow: 'hidden', background: '#0f5cf6' }}>
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: 'repeat(4, 1fr)' }}>
          {tileProducts.map((product, index) => {
            const center = [5, 6, 9, 10].includes(index);
            return (
              <div key={`${product.id}-${index}`} style={{ display: 'grid', placeItems: 'center', overflow: 'hidden', borderRight: '1px solid rgba(255,255,255,.12)', borderBottom: '1px solid rgba(255,255,255,.12)', opacity: center ? 0 : 1 }}>
                {!center && <img src={product.images[0]} alt="" onError={(event) => { event.currentTarget.style.display = 'none'; }} style={{ width: '66%', height: '68%', objectFit: 'contain', borderRadius: 10, filter: 'saturate(.9) contrast(1.03)' }} />}
              </div>
            );
          })}
        </div>

        <div style={{ position: 'absolute', top: '44%', left: '50%', width: '54%', transform: 'translate(-50%,-50%)', color: '#fff', textAlign: 'center' }}>
          <span style={{ display: 'grid', width: 54, height: 54, placeItems: 'center', margin: '0 auto 10px', borderRadius: 16, background: '#fff', color: '#0f5cf6', fontFamily: 'var(--font-brand)', fontSize: 34, fontWeight: 700, lineHeight: 1 }}>g</span>
          <div className="brand-wordmark" style={{ fontSize: 47, lineHeight: .92 }}>glowvai</div>
          <p style={{ marginTop: 22, fontSize: 16, fontWeight: 600, lineHeight: 1.35 }}>Beauty delivered to<br />your doorstep</p>
        </div>
      </section>

      <section style={{ position: 'relative', zIndex: 2, minHeight: 'calc(42% + 24px)', marginTop: -24, padding: '31px 20px 25px', borderRadius: '26px 26px 0 0', background: '#fff' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, lineHeight: 1.25, letterSpacing: '-.45px' }}>Enter mobile number</h1>
        <p style={{ marginTop: 5, color: 'var(--text-secondary)', fontSize: 13 }}>Log in to manage your orders</p>

        <form onSubmit={submit} style={{ marginTop: 30 }}>
          <label htmlFor="mobile" className="sr-only">Mobile number</label>
          <div style={{ display: 'flex', alignItems: 'center', borderBottom: `1.5px solid ${error ? 'var(--error)' : '#2f66f5'}` }}>
            <span style={{ flex: '0 0 auto', padding: '12px 8px 12px 4px', color: '#5d6470', fontSize: 13, fontWeight: 700 }}>+91</span>
            <input
              id="mobile"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              maxLength={10}
              value={phone}
              onChange={(event) => { setError(null); setPhone(event.target.value.replace(/\D/g, '')); }}
              placeholder="Enter your 10 digit mobile number"
              style={{ width: '100%', minWidth: 0, padding: '12px 4px', border: 0, outline: 0, background: 'transparent', color: 'var(--text-primary)', fontSize: 13, fontWeight: 600 }}
            />
          </div>

          {error && <div role="alert" style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 9, color: 'var(--error)', fontSize: 11 }}><AlertCircle size={13} />{error}</div>}

          <button type="submit" disabled={!valid || loading} style={{ width: '100%', height: 54, marginTop: 39, borderRadius: 13, background: valid ? '#0f5cf6' : '#e4e5e9', color: valid ? '#fff' : '#777b84', fontSize: 13, fontWeight: 800, cursor: valid ? 'pointer' : 'not-allowed' }}>
            {loading ? 'SENDING OTP…' : valid ? 'CONTINUE' : 'ENTER PHONE NUMBER'}
          </button>
        </form>

        <p style={{ marginTop: 17, color: '#727782', fontSize: 10.5, fontWeight: 600, lineHeight: 1.55, textAlign: 'center' }}>
          By continuing, you accept the <span style={{ fontWeight: 800 }}>terms &amp; conditions</span> and <span style={{ fontWeight: 800 }}>privacy policy</span>
        </p>
      </section>
    </main>
  );
};
