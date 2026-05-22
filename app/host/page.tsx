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

  // ── Password gate ────────────────────────────────────────────────────────
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-atmosphere flex flex-col items-center justify-center px-4">
        <div className="text-8xl mb-8 drop-shadow-lg">🏚️</div>
        <h1 className="text-5xl font-bold mb-2 text-center" style={{ color: '#d4af37', fontFamily: "'Playfair Display', serif" }}>
          Host Screen
        </h1>
        <p className="text-center mb-10 text-sm" style={{ color: '#a0a0a0' }}>
          For the TV — Enter the host password to proceed
        </p>
        <form onSubmit={handlePasswordSubmit} className="card-dark p-8 w-full max-w-md flex flex-col gap-5">
          <input
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            placeholder="Host password"
            autoFocus
            className="px-4 py-3 text-lg rounded-sm transition focus:outline-none"
            style={{
              background: 'rgba(26, 31, 46, 0.8)',
              border: '1px solid rgba(212, 175, 55, 0.2)',
              color: '#f0ead6',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'rgba(212, 175, 55, 0.5)';
              e.target.style.boxShadow = '0 0 12px rgba(212, 175, 55, 0.2)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(212, 175, 55, 0.2)';
              e.target.style.boxShadow = 'none';
            }}
          />
          {passwordError && (
            <p className="text-center text-sm" style={{ color: '#d4574d' }}>
              {passwordError}
            </p>
          )}
          <button
            type="submit"
            className="py-3 rounded-sm font-bold uppercase tracking-widest text-base transition hover:scale-105 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #8b1a1a 0%, #5c2e2e 100%)',
              color: '#f0ead6',
              border: '1px solid rgba(176, 34, 34, 0.3)',
            }}
          >
            Enter
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
      {/* ── Top bar / Header ── */}
      <div
        className="px-8 py-6 border-b separator-gold"
      >
        <div className="flex items-center justify-between gap-8 max-w-7xl mx-auto">
          <div>
            <h1 className="text-3xl font-bold mb-1" style={{ color: '#d4af37', fontFamily: "'Playfair Display', serif" }}>
              Sand, Secrets &amp; Sorrow
            </h1>
            <p className="text-sm italic" style={{ color: '#a0a0a0', fontFamily: "'Cormorant', serif" }}>
              A Cape May Mystery
            </p>
          </div>
          <div className="text-right">
            <div
              className="text-5xl font-bold mb-2"
              style={{ color: isReveal ? '#b02222' : '#d4af37', fontFamily: "'Playfair Display', serif" }}
            >
              Phase {phase}
            </div>
            <div className="text-base" style={{ color: '#c9a84c' }}>
              {PHASE_NAMES[phase]}
            </div>
            {lastPoll && (
              <div className="text-xs mt-2" style={{ color: '#707070' }}>
                ⟳ {lastPoll.toLocaleTimeString()}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-12 gap-10 max-w-6xl mx-auto w-full">

        {/* Phase message - DRAMATIC when reveal */}
        {isReveal ? (
          <RevealBlock text={phaseInfo.tvMessage} />
        ) : (
          <div className="card-dark p-12 text-center w-full">
            <p
              className="text-4xl leading-relaxed"
              style={{ color: '#f0ead6', lineHeight: 1.8, fontFamily: "'Cormorant', serif", fontWeight: 500 }}
            >
              {phaseInfo.tvMessage}
            </p>
          </div>
        )}

        {/* Public clues */}
        {publicClues.length > 0 && !isReveal && (
          <div className="w-full">
            <h3
              className="text-xs uppercase tracking-widest mb-5 text-center"
              style={{ color: '#d4af37' }}
            >
              📋 Evidence on Record
            </h3>
            <div className="space-y-3">
              {publicClues.map((clue, i) => (
                <div
                  key={i}
                  className="evidence-card"
                >
                  <p className="text-lg leading-relaxed" style={{ color: '#f0ead6' }}>
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

      {/* ── Bottom controls ── */}
      <div
        className="px-8 py-6 border-t separator-gold"
      >
        <div className="flex items-center justify-between gap-6 max-w-7xl mx-auto">
          <button
            onClick={handleReset}
            disabled={resetting}
            className="px-6 py-3 text-xs rounded-sm uppercase tracking-widest transition font-semibold"
            style={{
              background: 'rgba(92, 46, 46, 0.2)',
              border: '1px solid rgba(139, 26, 26, 0.3)',
              color: '#d4a574',
              opacity: resetting ? 0.6 : 1,
            }}
          >
            {resetting ? 'Resetting…' : '↺ Reset Game'}
          </button>

          <div className="text-center flex-1">
            <p className="text-xs" style={{ color: '#a0a0a0' }}>
              {phase < 5 ? `Next: ${PHASE_NAMES[phase + 1]}` : 'Game concluded'}
            </p>
          </div>

          <button
            onClick={handleAdvance}
            disabled={advancing || phase >= 5}
            className="px-10 py-4 rounded-sm font-bold text-lg uppercase tracking-widest transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: phase >= 5
                ? 'rgba(60, 60, 60, 0.3)'
                : 'linear-gradient(135deg, #8b1a1a 0%, #5c2e2e 100%)',
              color: phase >= 5 ? '#707070' : '#f0ead6',
              border: '1px solid rgba(212, 175, 55, 0.2)',
              minWidth: 300,
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
      className="w-full p-12 rounded-sm space-y-6 dramatic-reveal card-burgundy"
      style={{
        background: 'linear-gradient(135deg, rgba(92, 46, 46, 0.25) 0%, rgba(139, 26, 26, 0.15) 100%)',
        border: '2px solid rgba(176, 34, 34, 0.35)',
      }}
    >
      {lines.map((line, i) => {
        const killerMatch = line.match(/^([A-Z\s]+) DID IT/);
        if (killerMatch) {
          return (
            <h2
              key={i}
              className="text-6xl font-bold text-center mb-6"
              style={{
                color: '#b02222',
                letterSpacing: '0.15em',
                fontFamily: "'Playfair Display', serif",
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
              }}
            >
              {line}
            </h2>
          );
        }
        if (line.startsWith('THE EVIDENCE:')) {
          return (
            <h3 key={i} className="text-2xl font-bold mt-6 pt-4" style={{ color: '#d4af37', fontFamily: "'Playfair Display', serif" }}>
              {line}
            </h3>
          );
        }
        if (line.startsWith('•')) {
          return (
            <p key={i} className="text-lg pl-6 relative" style={{ color: '#c0d8d4' }}>
              <span className="absolute left-0" style={{ color: '#d4af37' }}>◆</span>
              {line.substring(1).trim()}
            </p>
          );
        }
        if (line.trim() === '') return <div key={i} className="h-4" />;
        return (
          <p key={i} className="text-xl leading-relaxed" style={{ color: '#f0ead6', fontFamily: "'Cormorant', serif" }}>
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
    <div className="w-full space-y-6">
      <h3
        className="text-sm uppercase tracking-widest text-center"
        style={{ color: '#d4af37' }}
      >
        {votesRevealed ? '🗳️ Final Vote Count' : `🗳️ Voting in Progress — ${totalVotes} vote${totalVotes !== 1 ? 's' : ''} cast`}
      </h3>

      {votesRevealed && sortedTally.length > 0 ? (
        <div className="space-y-3">
          {sortedTally.map(([name, count]) => (
            <div
              key={name}
              className="card-burgundy p-5 flex items-center gap-6"
            >
              <span className="text-4xl font-bold w-12 text-center" style={{ color: '#b02222' }}>{count}</span>
              <span className="text-2xl font-bold" style={{ color: '#f0ead6' }}>{name}</span>
              <div
                className="flex-1 h-4"
                style={{
                  background: 'rgba(26, 31, 46, 0.5)',
                  overflow: 'hidden',
                  borderRadius: '2px',
                }}
              >
                <div
                  className="h-full"
                  style={{
                    width: `${Math.min(100, (count / totalVotes) * 100)}%`,
                    background: 'linear-gradient(90deg, #8b1a1a 0%, #b02222 100%)',
                    transition: 'width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : !votesRevealed ? (
        <div className="card-dark p-6">
          <p className="text-center text-base mb-4" style={{ color: '#a0a0a0' }}>
            Votes are sealed until all required players have voted.
          </p>
          {notVotedYet.length > 0 && (
            <div className="text-center text-sm" style={{ color: '#c9a84c' }}>
              Awaiting: <span className="font-semibold">{notVotedYet.join(', ')}</span>
            </div>
          )}
        </div>
      ) : (
        <p className="text-center text-base" style={{ color: '#a0a0a0' }}>
          No votes cast yet.
        </p>
      )}
    </div>
  );
}
