import React, { useState } from 'react';
import { ArrowLeft, ShieldCheck, Camera, CheckCircle2, AlertTriangle, Clock, Award, HelpCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const StreakTrackingScreen: React.FC = () => {
  const { goBack, navigate, streaks, activeStreak, logStreakEvidence, reportAdverseReaction, submitClaim } = useApp();

  const streak = activeStreak || streaks[0];

  const [uploading, setUploading] = useState(false);
  const [adverseModalOpen, setAdverseModalOpen] = useState(false);
  const [reactionDescription, setReactionDescription] = useState('');
  const [claimFeedback, setClaimFeedback] = useState('');

  if (!streak) {
    return (
      <div style={{ flex: 1, padding: '24px', textAlign: 'center', backgroundColor: '#FFFFFF' }}>
        <button onClick={goBack} style={{ padding: '6px' }}><ArrowLeft size={20} /></button>
        <p style={{ marginTop: '20px', color: '#687080' }}>No active Beauty Insurance streak found.</p>
      </div>
    );
  }

  const isCompleted = streak.completedDays >= streak.totalDaysRequired;
  const progressPercent = Math.round((streak.completedDays / streak.totalDaysRequired) * 100);

  const handleQuickDailyLog = () => {
    setUploading(true);
    setTimeout(() => {
      logStreakEvidence(
        streak.trackingId,
        'photo',
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80'
      );
      setUploading(false);
    }, 1200);
  };

  const handleReportReaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reactionDescription.trim()) return;
    await reportAdverseReaction(streak.trackingId, reactionDescription);
    setAdverseModalOpen(false);
    setReactionDescription('');
  };

  const handleSubmitSuitabilityClaim = async () => {
    await submitClaim(streak.trackingId, claimFeedback || 'Routine completed; unsuitable results.');
  };

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#F7F8FB',
        overflowY: 'auto',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '12px 16px',
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #ECEEF2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 30,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button onClick={goBack} style={{ padding: '6px' }}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 style={{ fontSize: '15px', fontWeight: 700, color: '#161A22' }}>
              Beauty Insurance Streak
            </h1>
            <span style={{ fontSize: '11px', color: '#2854C5', fontWeight: 600 }}>
              Policy: {streak.policyVersion}
            </span>
          </div>
        </div>

        <button
          onClick={() => setAdverseModalOpen(true)}
          style={{
            fontSize: '11px',
            color: '#DC2626',
            fontWeight: 700,
            padding: '4px 8px',
            backgroundColor: '#FEF2F2',
            borderRadius: '6px',
            border: '1px solid #FECACA',
          }}
        >
          Report Reaction
        </button>
      </div>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '32px' }}>
        {/* Product & Policy Overview Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '16px',
            border: '1px solid #E2E5EB',
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
          }}
        >
          <img
            src={streak.productImage}
            alt={streak.productName}
            style={{ width: '64px', height: '64px', borderRadius: '10px', objectFit: 'cover' }}
          />
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#2854C5', backgroundColor: '#EFF6FF', padding: '2px 6px', borderRadius: '4px' }}>
              PROTECTED REGIMEN
            </span>
            <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#161A22', marginTop: '4px', lineHeight: '18px' }}>
              {streak.productName}
            </h2>
            <div style={{ fontSize: '11px', color: '#687080', marginTop: '2px' }}>
              Tracking: {streak.startDate} — {streak.endDate}
            </div>
          </div>
        </div>

        {/* Progress Metric Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '18px',
            border: '1px solid #E2E5EB',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
            <div>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#687080' }}>
                STREAK COMPLETION
              </span>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#161A22', marginTop: '2px' }}>
                Day {streak.completedDays} of {streak.totalDaysRequired} Completed
              </div>
            </div>
            <span style={{ fontSize: '16px', fontWeight: 800, color: '#2854C5' }}>
              {progressPercent}%
            </span>
          </div>

          {/* Progress Bar */}
          <div
            style={{
              width: '100%',
              height: '8px',
              backgroundColor: '#F0F2F6',
              borderRadius: '999px',
              overflow: 'hidden',
              marginBottom: '16px',
            }}
          >
            <div
              style={{
                width: `${progressPercent}%`,
                height: '100%',
                backgroundColor: progressPercent === 100 ? '#19734F' : '#2854C5',
                borderRadius: '999px',
                transition: 'width 0.3s ease',
              }}
            />
          </div>

          {/* Daily Action Status */}
          {isCompleted ? (
            <div
              style={{
                padding: '12px 14px',
                backgroundColor: '#F0FDF4',
                borderRadius: '10px',
                border: '1px solid #BBF7D0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Award size={20} color="#19734F" />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#166534' }}>
                  14-Day Routine Completed!
                </div>
                <div style={{ fontSize: '11px', color: '#15803D' }}>
                  You are now eligible to submit a suitability review or claim.
                </div>
              </div>
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px',
                backgroundColor: '#EDF2FF',
                borderRadius: '10px',
                border: '1px solid #BAE6FD',
              }}
            >
              <div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#0369A1' }}>
                  Today's Daily Photo Log
                </div>
                <div style={{ fontSize: '11px', color: '#2854C5' }}>
                  Capture face in natural light after applying product
                </div>
              </div>

              <button
                onClick={handleQuickDailyLog}
                disabled={uploading}
                style={{
                  padding: '8px 14px',
                  backgroundColor: '#2854C5',
                  color: '#FFFFFF',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Camera size={14} />
                <span>{uploading ? 'Uploading...' : 'Log Day'}</span>
              </button>
            </div>
          )}
        </div>

        {/* 14-Day Calendar Grid */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '18px',
            border: '1px solid #E2E5EB',
          }}
        >
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#161A22', marginBottom: '12px' }}>
            Daily Verification Log
          </h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '6px',
            }}
          >
            {streak.days.map((d) => (
              <div
                key={d.day}
                style={{
                  height: '48px',
                  borderRadius: '8px',
                  backgroundColor: d.completed ? '#F0FDF4' : '#F7F8FB',
                  border: `1px solid ${d.completed ? '#BBF7D0' : '#E2E5EB'}`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '2px',
                }}
              >
                <span style={{ fontSize: '10px', color: '#687080' }}>D{d.day}</span>
                {d.completed ? (
                  <CheckCircle2 size={13} color="#19734F" />
                ) : (
                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#CBD5E1' }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Outcome / Claim Section */}
        {streak.claimOutcome ? (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '18px',
              border: '1.5px solid #BBF7D0',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <CheckCircle2 size={20} color="#19734F" />
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#166534' }}>
                Suitability Claim Approved
              </h3>
            </div>
            <p style={{ fontSize: '12px', color: '#374151', lineHeight: '18px', marginBottom: '12px' }}>
              Refund of <strong>₹{streak.claimOutcome.amount}</strong> has been credited back to your original payment method. Under our approved suitability policy, you do not need to return the product.
            </p>
            <div style={{ fontSize: '11px', color: '#687080' }}>
              Decision Date: {streak.claimOutcome.decisionDate} • Reason: {streak.claimOutcome.reason}
            </div>
          </div>
        ) : isCompleted ? (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '18px',
              border: '1px solid #E2E5EB',
            }}
          >
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#161A22', marginBottom: '8px' }}>
              Submit Suitability Claim
            </h3>
            <p style={{ fontSize: '12px', color: '#687080', lineHeight: '18px', marginBottom: '12px' }}>
              Did this formulation cause breakouts, excessive dryness, or prove unsuitable for your skin?
            </p>
            <textarea
              placeholder="Describe your skin experience (e.g., T-Zone became excessively dry)..."
              value={claimFeedback}
              onChange={(e) => setClaimFeedback(e.target.value)}
              style={{
                width: '100%',
                height: '70px',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                fontSize: '12px',
                marginBottom: '12px',
                resize: 'none',
              }}
            />
            <button
              onClick={handleSubmitSuitabilityClaim}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#2854C5',
                color: '#FFFFFF',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: 700,
              }}
            >
              Submit Policy Review & Claim
            </button>
          </div>
        ) : null}

        {/* Safety Warning (PRD Section 20.10) */}
        <div
          style={{
            padding: '12px 14px',
            backgroundColor: '#FFFBEB',
            borderRadius: '12px',
            border: '1px solid #FDE68A',
            display: 'flex',
            gap: '10px',
            alignItems: 'flex-start',
          }}
        >
          <AlertTriangle size={16} color="#A76516" style={{ marginTop: '2px', flexShrink: 0 }} />
          <p style={{ fontSize: '11px', color: '#92400E', lineHeight: '16px' }}>
            <strong>Safety Warning:</strong> If you experience severe redness, burning, swelling, or allergic irritation, discontinue product use immediately and consult a certified medical dermatologist.
          </p>
        </div>
      </div>

      {/* Adverse Reaction Modal */}
      {adverseModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '380px',
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '20px',
            }}
          >
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#DC2626', marginBottom: '8px' }}>
              Report Adverse Reaction
            </h3>
            <p style={{ fontSize: '12px', color: '#545B69', lineHeight: '18px', marginBottom: '14px' }}>
              Please immediately pause using this product. Submit details below to initiate safety review with our clinical team.
            </p>
            <form onSubmit={handleReportReaction}>
              <textarea
                required
                placeholder="Describe your symptoms (itching, rash, burning, etc.)..."
                value={reactionDescription}
                onChange={(e) => setReactionDescription(e.target.value)}
                style={{
                  width: '100%',
                  height: '80px',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  fontSize: '12px',
                  marginBottom: '14px',
                  resize: 'none',
                }}
              />
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setAdverseModalOpen(false)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid #E2E5EB',
                    color: '#687080',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 2,
                    padding: '10px',
                    borderRadius: '8px',
                    backgroundColor: '#DC2626',
                    color: '#FFFFFF',
                    fontSize: '12px',
                    fontWeight: 700,
                  }}
                >
                  Submit Safety Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
