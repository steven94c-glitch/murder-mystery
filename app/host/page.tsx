'use client';

import { useEffect, useState, useCallback } from 'react';
import type { GameState } from '@/lib/types';
import { PHASES, KILLER_REVEAL_TEXT, HOST_PASSWORD, getCumulativePublicClues, getPhaseInfo, CHARACTERS } from '@/lib/game-data';

const PHASE_NAMES = [
  "Welcome to Grammy's",
  'The Discovery',
  'The Investigation',
  'Confrontations',
  'The Final Vote',
  'The Revelation',
];

export default function HostPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [state, setState] = useState<GameState | null>(null);
  const [advancing, setAdvancing] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [lastPoll, setLastPoll] = useState<Date | null>(null);

  const fetchState = useCallback(async () => {
    try {
      const res = await fetch('/api/state');
      const data = await res.json();
      setState(data);
      setLastPoll(new Date());
    } catch {
      // silently ignore transient fetch errors
    }
  }, []);

  useEffect(() => {
    if (!authenticated) return;
    fetchState();
    const interval = setInterval(fetchState, 3000);
    return () => clearInterval(interval);
  }, [authenticated, fetchState]);

  function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (passwordInput === HOST_PASSWORD) {
      setAuthenticated(true);
      setPasswordError('');
    } else {
      setPasswordError('Incorrect password. Try again.');
    }
  }

  async function handleAdvance() {
    if (!state || state.phase >= 5) return;
    setAdvancing(true);
    try {
      const res = await fetch('/api/advance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: HOST_PASSWORD }),
      });
      const data = await res.json();
      if (data.phase !== undefined) setState(data);
    } finally {
      setAdvancing(false);
    }
  }

  async function handleReset() {
    if (!window.confirm('Reset the game to Phase 0? This clears all votes and notes.')) return;
    setResetting(true);
    try {
      const res = await fetch('/api/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: HOST_PASSWORD }),
      });
      const data = await res.json();
      if (data.phase !== undefined) setState(data);
    } finally {
      setResetting(false);
    }
  }

  // ── Password gate - Theater Ticket Booth ────────────────────────────────────────────────────────
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-atmosphere flex flex-col items-center justify-center px-4">
        {/* Marquee decoration */}
        <div className="mb-12 text-center">
          <div style={{ fontSize: '3rem', marginBottom: '1rem', filter: 'drop-shadow(0 0 10px rgba(212, 175, 55, 0.4))' }}>
            🎭
          </div>
          <div className="divider-marquee mb-6">
            <div />
            <span className="divider-marquee-text">Ticket Booth</span>
            <div />
          </div>
        </div>

        <h1 className="art-deco-title text-5xl mb-3 text-center" style={{
          color: '#d4af37',
          textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
        }}>
          Host Control
        </h1>
        <p className="text-center mb-12 text-sm" style={{ color: '#d4a574', fontFamily: "'Cormorant', serif" }}>
          Director&apos;s Access Only — Enter your credentials
        </p>

        <form onSubmit={handlePasswordSubmit} className="card-dark p-10 w-full max-w-md flex flex-col gap-6">
          <input
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            placeholder="Password"
            autoFocus
            className="px-4 py-4 text-lg transition focus:outline-none"
            style={{
              background: 'rgba(42, 42, 42, 0.7)',
              border: '2px solid rgba(212, 175, 55, 0.25)',
              color: '#f5ede0',
              fontFamily: "'Cormorant', serif",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'rgba(212, 175, 55, 0.5)';
              e.target.style.boxShadow = '0 0 16px rgba(212, 175, 55, 0.25)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(212, 175, 55, 0.25)';
              e.target.style.boxShadow = 'none';
            }}
          />
          {passwordError && (
            <p className="text-center text-sm" style={{ color: '#f4a090' }}>
              ⚠️ {passwordError}
            </p>
          )}
          <button
            type="submit"
            className="py-4 font-bold uppercase tracking-widest text-base transition hover:scale-105 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #8b1a1a 0%, #6b2c2c 100%)',
              color: '#f5ede0',
              border: '2px solid rgba(212, 175, 55, 0.3)',
              boxShadow: '0 6px 16px rgba(0, 0, 0, 0.6)',
              fontFamily: "'Bebas Neue', sans-serif",
              letterSpacing: '0.12em'
            }}
          >
            ENTER
          </button>
        </form>
      </div>
    );
  }

  if (!state) {
    return (
      <div className="min-h-screen bg-atmosphere flex items-center justify-center">
        <p className="text-gray-400 text-xl animate-pulse">Loading game state…</p>
      </div>
    );
  }

  const phase = state.phase;
  const phaseInfo = getPhaseInfo(phase);
  const publicClues = getCumulativePublicClues(phase);
  const isReveal = phase === 5;
  const isVotePhase = phase === 4;

  // Vote tally
  const allSuspectNames = CHARACTERS.filter((c) => !c.isVictim).map((c) => c.name);
  const voteEntries = Object.entries(state.votes); // [voter, suspect]
  const voteTally: Record<string, number> = {};
  allSuspectNames.forEach((n) => (voteTally[n] = 0));
  voteEntries.forEach(([, suspect]) => {
    if (voteTally[suspect] !== undefined) voteTally[suspect]++;
    else voteTally[suspect] = 1;
  });
  const sortedTally = Object.entries(voteTally)
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1]);

  // Who hasn't voted yet
  const requiredVoters = CHARACTERS.filter((c) => !c.isVictim && !c.isOptional).map((c) => c.name);
  const notVotedYet = requiredVoters.filter((name) => !state.votes[name]);

  return (
    <div className="min-h-screen bg-atmosphere flex flex-col">
      {/* ── Top bar / Theater Stage Header ── */}
      <div className="px-8 py-8 border-b separator-gold" style={{ background: 'rgba(26, 26, 26, 0.6)' }}>
        <div className="flex items-center justify-between gap-8 max-w-7xl mx-auto">
          <div>
            <h1 className="art-deco-title text-3xl mb-2" style={{ color: '#f4d03f' }}>
              Sand, Secrets &amp; Sorrow
            </h1>
            <p className="text-sm" style={{ color: '#d4a574', fontFamily: "'Cormorant', serif" }}>
              A Cape May Mystery
            </p>
          </div>
          <div className="text-right">
            <div
              className="art-deco-title text-6xl mb-1"
              style={{ color: isReveal ? '#f4a090' : '#f4d03f', textShadow: isReveal ? '0 0 20px rgba(244, 160, 144, 0.4)' : 'none' }}
            >
              {phase}
            </div>
            <div className="text-sm font-semibold" style={{ color: '#d4a574', fontFamily: "'Cormorant', serif", letterSpacing: '0.05em' }}>
              {PHASE_NAMES[phase]}
            </div>
            {lastPoll && (
              <div className="text-xs mt-2" style={{ color: '#8b5a3c' }}>
                ⟳ {lastPoll.toLocaleTimeString()}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-12 gap-12 max-w-6xl mx-auto w-full">

        {/* Phase message - DRAMATIC when reveal */}
        {isReveal ? (
          <RevealBlock text={phaseInfo.tvMessage} />
        ) : (
          <div className="card-dark p-12 text-center w-full">
            <p
              className="text-4xl leading-relaxed"
              style={{ color: '#f5ede0', lineHeight: 1.9, fontFamily: "'Cormorant', serif", fontWeight: 500, letterSpacing: '0.02em' }}
            >
              {phaseInfo.tvMessage}
            </p>
          </div>
        )}

        {/* Public clues - Vintage Newspaper Style */}
        {publicClues.length > 0 && !isReveal && (
          <div className="w-full">
            <div className="divider-marquee mb-6">
              <div />
              <span className="divider-marquee-text">Evidence</span>
              <div />
            </div>
            <div className="space-y-4">
              {publicClues.map((clue, i) => (
                <div
                  key={i}
                  className="evidence-card"
                >
                  <p className="text-lg leading-relaxed" style={{ color: '#f5ede0', fontFamily: "'Cormorant', serif" }}>
                    {clue}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Vote phase tally */}
        {isVotePhase && (
          <VoteTally
            sortedTally={sortedTally}
            notVotedYet={notVotedYet}
            votesRevealed={state.votesRevealed}
            totalVotes={voteEntries.length}
          />
        )}
      </div>

      {/* ── Bottom controls - Theater Stage Controls ── */}
      <div className="px-8 py-8 border-t separator-gold" style={{ background: 'rgba(26, 26, 26, 0.6)' }}>
        <div className="flex items-center justify-between gap-6 max-w-7xl mx-auto">
          <button
            onClick={handleReset}
            disabled={resetting}
            className="px-8 py-3 text-xs uppercase tracking-widest transition font-semibold"
            style={{
              background: 'rgba(107, 44, 44, 0.25)',
              border: '2px solid rgba(212, 175, 55, 0.2)',
              color: '#d4a574',
              opacity: resetting ? 0.6 : 1,
              fontFamily: "'Bebas Neue', sans-serif",
              letterSpacing: '0.1em'
            }}
          >
            {resetting ? 'Resetting…' : '↺ Reset'}
          </button>

          <div className="text-center flex-1">
            <p className="text-xs" style={{ color: '#8b5a3c', fontFamily: "'Cormorant', serif" }}>
              {phase < 5 ? `Next: ${PHASE_NAMES[phase + 1]}` : 'Game concluded'}
            </p>
          </div>

          <button
            onClick={handleAdvance}
            disabled={advancing || phase >= 5}
            className="px-12 py-5 font-bold text-lg uppercase tracking-widest transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: phase >= 5
                ? 'rgba(60, 60, 60, 0.3)'
                : 'linear-gradient(135deg, #8b1a1a 0%, #6b2c2c 100%)',
              color: phase >= 5 ? '#707070' : '#f5ede0',
              border: '2px solid rgba(212, 175, 55, 0.3)',
              boxShadow: phase >= 5 ? 'none' : '0 8px 24px rgba(0, 0, 0, 0.6)',
              minWidth: 320,
              fontFamily: "'Bebas Neue', sans-serif",
              letterSpacing: '0.12em'
            }}
          >
            {advancing ? 'Advancing…' : phase >= 5 ? 'Game Over' : `▶ Phase ${phase + 1}`}
          </button>
        </div>
      </div>
    </div>
  );
}

function RevealBlock({ text }: { text: string }) {
  const lines = text.split('\n');
  return (
    <div
      className="w-full p-16 space-y-8 dramatic-reveal card-burgundy"
      style={{
        background: 'linear-gradient(135deg, rgba(107, 44, 44, 0.25) 0%, rgba(139, 26, 26, 0.15) 100%)',
        border: '3px solid rgba(212, 175, 55, 0.4)',
        boxShadow: '0 0 40px rgba(212, 175, 55, 0.2), inset 0 0 40px rgba(139, 26, 26, 0.1)',
      }}
    >
      {lines.map((line, i) => {
        const killerMatch = line.match(/^([A-Z\s]+) DID IT/);
        if (killerMatch) {
          return (
            <h2
              key={i}
              className="text-7xl font-bold text-center mb-8 art-deco-title"
              style={{
                color: '#f4a090',
                letterSpacing: '0.2em',
                fontFamily: "'Bebas Neue', sans-serif",
                textShadow: '0 4px 16px rgba(244, 160, 144, 0.5), 2px 2px 8px rgba(0, 0, 0, 0.8)',
              }}
            >
              {line}
            </h2>
          );
        }
        if (line.startsWith('THE EVIDENCE:')) {
          return (
            <h3 key={i} className="text-3xl font-bold mt-8 pt-6 art-deco-title" style={{ color: '#f4d03f', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.1em' }}>
              {line}
            </h3>
          );
        }
        if (line.startsWith('•')) {
          return (
            <p key={i} className="text-lg pl-8 relative" style={{ color: '#f5ede0', fontFamily: "'Cormorant', serif", lineHeight: 1.8 }}>
              <span className="absolute left-0" style={{ color: '#f4d03f', fontSize: '1.2em' }}>◆</span>
              {line.substring(1).trim()}
            </p>
          );
        }
        if (line.trim() === '') return <div key={i} className="h-6" />;
        return (
          <p key={i} className="text-2xl leading-relaxed" style={{ color: '#f5ede0', fontFamily: "'Cormorant', serif", lineHeight: 1.8 }}>
            {line}
          </p>
        );
      })}
    </div>
  );
}

function VoteTally({
  sortedTally,
  notVotedYet,
  votesRevealed,
  totalVotes,
}: {
  sortedTally: [string, number][];
  notVotedYet: string[];
  votesRevealed: boolean;
  totalVotes: number;
}) {
  return (
    <div className="w-full space-y-8">
      <div className="text-center">
        <h3 className="art-deco-title text-lg" style={{ color: '#f4d03f', letterSpacing: '0.15em' }}>
          {votesRevealed ? '🗳️ FINAL BALLOT' : `🗳️ VOTES CASTING — ${totalVotes} CAST`}
        </h3>
      </div>

      {votesRevealed && sortedTally.length > 0 ? (
        <div className="space-y-4">
          {sortedTally.map(([name, count]) => (
            <div
              key={name}
              className="card-burgundy p-6 flex items-center gap-8"
              style={{
                background: 'linear-gradient(90deg, rgba(139, 26, 26, 0.2) 0%, rgba(107, 44, 44, 0.15) 100%)',
              }}
            >
              <span className="art-deco-title text-5xl w-16 text-center" style={{ color: '#f4a090' }}>{count}</span>
              <span className="text-2xl font-semibold flex-1" style={{ color: '#f5ede0', fontFamily: "'Playfair Display', serif" }}>{name}</span>
              <div
                className="w-32 h-5"
                style={{
                  background: 'rgba(26, 26, 26, 0.7)',
                  overflow: 'hidden',
                  border: '1px solid rgba(212, 175, 55, 0.2)',
                }}
              >
                <div
                  className="h-full"
                  style={{
                    width: `${Math.min(100, (count / totalVotes) * 100)}%`,
                    background: 'linear-gradient(90deg, #8b1a1a 0%, #f4a090 100%)',
                    transition: 'width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : !votesRevealed ? (
        <div className="card-dark p-8">
          <p className="text-center text-base mb-6" style={{ color: '#d4a574', fontFamily: "'Cormorant', serif" }}>
            Ballots are sealed until all required players have cast their votes.
          </p>
          {notVotedYet.length > 0 && (
            <div className="text-center text-sm" style={{ color: '#f4d03f', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.1em' }}>
              Awaiting: <span className="font-semibold">{notVotedYet.join(', ')}</span>
            </div>
          )}
        </div>
      ) : (
        <p className="text-center text-base" style={{ color: '#8b5a3c' }}>
          No votes cast yet.
        </p>
      )}
    </div>
  );
}
