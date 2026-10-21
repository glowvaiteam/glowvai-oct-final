import React, { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const OtpScreen: React.FC = () => {
  const { navigate, goBack, verifyUserOtp, activeParams } = useApp();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [cooldown, setCooldown] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const phone = activeParams?.phone || '98480 12345';

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleDigitChange = (index: number, val: string) => {
    setError(null);
    const cleaned = val.replace(/\D/g, '');
    const newOtp = [...otp];
    newOtp[index] = cleaned.slice(-1);
    setOtp(newOtp);

    // Auto focus next input
    if (cleaned && index < 3) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = async (codeToVerify?: string) => {
    const finalOtp = codeToVerify || otp.join('');
    if (finalOtp.length < 4) {
      setError('Please enter the complete 4-digit OTP.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await verifyUserOtp(finalOtp);
      // After authentication, route to Facial Analysis Preparation per PRD flow
      navigate('face-prep');
    } catch (err: any) {
      setError(err?.message || 'Verification failed. Try demo code 1234.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    if (cooldown > 0) return;
    setCooldown(30);
    setError(null);
  };

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '24px 20px 32px 20px',
        backgroundColor: '#FFFFFF',
      }}
    >
      <div>
        {/* Back Button */}
        <button
          onClick={goBack}
          style={{
            padding: '6px',
            borderRadius: '8px',
            backgroundColor: '#F7F8FB',
            color: '#161A22',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ArrowLeft size={20} />
        </button>

        {/* Title */}
        <h1
          style={{
            fontSize: '24px',
            fontWeight: 800,
            color: '#161A22',
            fontFamily: 'var(--font-heading)',
            lineHeight: '30px',
            marginBottom: '8px',
          }}
        >
          Verify your number
        </h1>

        <p style={{ fontSize: '13px', color: '#687080', lineHeight: '20px', marginBottom: '24px' }}>
          Enter the 4-digit OTP sent to <strong style={{ color: '#161A22' }}>+91 {phone}</strong>
        </p>

        {/* 4-digit input fields */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '20px' }}>
          {otp.map((digit, idx) => (
            <input
              key={idx}
              id={`otp-input-${idx}`}
              type="tel"
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigitChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '12px',
                border: `1.5px solid ${digit ? '#2854C5' : '#CBD5E1'}`,
                backgroundColor: digit ? '#F0F7FF' : '#FFFFFF',
                textAlign: 'center',
                fontSize: '22px',
                fontWeight: 700,
                color: '#161A22',
                outline: 'none',
              }}
              autoFocus={idx === 0}
            />
          ))}
        </div>

        {/* Quick Demo Helper */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
          }}
        >
          <button
            onClick={() => {
              setOtp(['1', '2', '3', '4']);
              handleVerify('1234');
            }}
            style={{
              padding: '6px 12px',
              backgroundColor: '#EFF6FF',
              borderRadius: '999px',
              fontSize: '11px',
              fontWeight: 600,
              color: '#2854C5',
              border: '1px solid #BFDBFE',
            }}
          >
            Fill Demo Code: 1234
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              color: '#DC2626',
              fontSize: '12px',
              marginBottom: '16px',
            }}
          >
            <AlertCircle size={14} />
            <span>{error}</span>
          </div>
        )}

        {/* Verify CTA Button */}
        <button
          onClick={() => handleVerify()}
          disabled={loading || otp.join('').length < 4}
          style={{
            width: '100%',
            height: '50px',
            backgroundColor: otp.join('').length === 4 ? '#2854C5' : '#818896',
            color: '#FFFFFF',
            borderRadius: '12px',
            fontSize: '15px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: otp.join('').length === 4 ? 'pointer' : 'not-allowed',
          }}
        >
          {loading ? 'Verifying OTP...' : 'Verify & Continue'}
        </button>
      </div>

      {/* Resend Cooldown */}
      <div style={{ textAlign: 'center' }}>
        {cooldown > 0 ? (
          <span style={{ fontSize: '13px', color: '#687080' }}>
            Resend OTP in <strong style={{ color: '#161A22' }}>{cooldown}s</strong>
          </span>
        ) : (
          <button
            onClick={handleResend}
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: '#2854C5',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <RefreshCw size={14} />
            <span>Resend OTP via SMS</span>
          </button>
        )}
      </div>
    </div>
  );
};
