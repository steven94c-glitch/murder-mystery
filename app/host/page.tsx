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
        <div className="text-6xl mb-6">📺</div>
        <h1 className="text-3xl font-serif font-bold mb-2" style={{ color: '#c9a84c' }}>
          Host Screen
        </h1>
        <p className="text-gray-400 mb-8 text-sm">For the TV — enter the host password</p>
        <form onSubmit={handlePasswordSubmit} className="card-dark p-6 w-full max-w-sm flex flex-col gap-4">
          <input
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            placeholder="Host password"
            autoFocus
            className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white text-lg focus:outline-none focus:border-yellow-500 transition"
          />
          {passwordError && (
            <p className="text-red-400 text-sm text-center">{passwordError}</p>
          )}
          <button
            type="submit"
            className="py-3 rounded-lg font-bold uppercase tracking-widest text-sm transition hover:scale-105 active:scale-95"
            style={{ background: '#8b1a1a', color: '#f8d5b0' }}
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
    <div
      className="min-h-screen bg-atmosphere flex flex-col"
      style={{ fontFamily: 'Georgia, serif' }}
    >
      {/* ── Top bar ── */}
      <div
        className="flex items-center justify-between px-8 py-4 border-b"
        style={{ borderColor: 'rgba(201,168,76,0.2)' }}
      >
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#c9a84c' }}>
            Sand, Secrets &amp; Sorrow
          </h1>
          <p className="text-sm text-gray-500 italic">A Cape May Mystery</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div
              className="text-3xl font-bold"
              style={{ color: isReveal ? '#b02222' : '#c9a84c' }}
            >
              Phase {phase}
            </div>
            <div className="text-sm text-gray-400">{PHASE_NAMES[phase]}</div>
          </div>
          {lastPoll && (
            <div className="text-xs text-gray-700 hidden sm:block">
              ⟳ {lastPoll.toLocaleTimeString()}
            </div>
          )}
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-8 gap-8 max-w-5xl mx-auto w-full">

        {/* Phase message */}
        {isReveal ? (
          <RevealBlock text={phaseInfo.tvMessage} />
        ) : (
          <div
            className="w-full card-dark p-8 text-center"
            style={{ borderColor: isReveal ? 'rgba(176,34,34,0.5)' : 'rgba(201,168,76,0.3)' }}
          >
            <p
              className="text-2xl leading-relaxed font-serif"
              style={{ color: '#e8dcc8', lineHeight: 1.7 }}
            >
              {phaseInfo.tvMessage}
            </p>
          </div>
        )}

        {/* Public clues */}
        {publicClues.length > 0 && !isReveal && (
          <div className="w-full">
            <h3
              className="text-xs uppercase tracking-widest mb-3 text-center"
              style={{ color: '#2d9e8d' }}
            >
              Evidence on Record
            </h3>
            <div className="space-y-2">
              {publicClues.map((clue, i) => (
                <div
                  key={i}
                  className="px-5 py-3 rounded-lg text-base"
                  style={{
                    background: 'rgba(45,158,141,0.08)',
                    border: '1px solid rgba(45,158,141,0.25)',
                    color: '#c0d8d4',
                  }}
                >
                  <span className="text-seafoam mr-2">◆</span>
                  {clue}
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
        className="flex items-center justify-between px-8 py-5 border-t gap-4"
        style={{ borderColor: 'rgba(201,168,76,0.15)' }}
      >
        <button
          onClick={handleReset}
          disabled={resetting}
          className="px-4 py-2 text-xs rounded-lg uppercase tracking-widest transition hover:opacity-80"
          style={{ background: 'rgba(60,20,20,0.5)', border: '1px solid rgba(120,40,40,0.4)', color: '#e08080' }}
        >
          {resetting ? 'Resetting…' : '↺ Reset Game'}
        </button>

        <div className="flex items-center gap-3">
          <div className="text-xs text-gray-600">
            {phase < 5 ? `Next: ${PHASE_NAMES[phase + 1]}` : 'Game complete'}
          </div>
          <button
            onClick={handleAdvance}
            disabled={advancing || phase >= 5}
            className="px-8 py-4 rounded-xl font-bold text-xl uppercase tracking-widest transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
            style={{
              background: phase >= 5 ? '#333' : '#8b1a1a',
              color: phase >= 5 ? '#666' : '#f8d5b0',
              border: '2px solid rgba(201,168,76,0.3)',
              minWidth: 280,
            }}
          >
            {advancing ? 'Advancing…' : phase >= 5 ? 'Game Over' : `▶ Advance to Phase ${phase + 1}`}
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
      className="w-full p-8 rounded-2xl space-y-3"
      style={{
        background: 'rgba(60,10,10,0.6)',
        border: '2px solid rgba(176,34,34,0.5)',
      }}
    >
      {lines.map((line, i) => {
        if (line.startsWith('EVAN DID IT')) {
          return (
            <h2
              key={i}
              className="text-5xl font-bold text-center mb-4"
              style={{ color: '#b02222', letterSpacing: 2 }}
            >
              {line}
            </h2>
          );
        }
        if (line.startsWith('THE EVIDENCE:')) {
          return (
            <h3 key={i} className="text-xl font-bold mt-4" style={{ color: '#c9a84c' }}>
              {line}
            </h3>
          );
        }
        if (line.startsWith('•')) {
          return (
            <p key={i} className="text-lg pl-4" style={{ color: '#c0d8d4' }}>
              {line}
            </p>
          );
        }
        if (line.trim() === '') return <div key={i} className="h-2" />;
        return (
          <p key={i} className="text-xl leading-relaxed" style={{ color: '#e8dcc8' }}>
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
    <div className="w-full space-y-4">
      <h3
        className="text-sm uppercase tracking-widest text-center"
        style={{ color: '#c9a84c' }}
      >
        {votesRevealed ? '🗳️ Final Vote Count' : `🗳️ Voting in Progress — ${totalVotes} vote${totalVotes !== 1 ? 's' : ''} cast`}
      </h3>

      {votesRevealed && sortedTally.length > 0 ? (
        <div className="space-y-2">
          {sortedTally.map(([name, count]) => (
            <div
              key={name}
              className="flex items-center gap-4 px-5 py-3 rounded-lg"
              style={{ background: 'rgba(139,26,26,0.15)', border: '1px solid rgba(176,34,34,0.3)' }}
            >
              <span className="text-2xl font-bold w-8 text-center" style={{ color: '#b02222' }}>{count}</span>
              <span className="text-xl font-bold" style={{ color: '#e8dcc8' }}>{name}</span>
              <div
                className="flex-1 rounded-full h-3"
                style={{
                  background: '#1a0808',
                  overflow: 'hidden',
                }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min(100, (count / totalVotes) * 100)}%`,
                    background: '#8b1a1a',
                    transition: 'width 0.8s ease',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : !votesRevealed ? (
        <div>
          <p className="text-center text-gray-500 text-sm mb-3">
            Votes are hidden until all required players have voted.
          </p>
          {notVotedYet.length > 0 && (
            <div className="text-center text-xs text-gray-600">
              Still waiting on: {notVotedYet.join(', ')}
            </div>
          )}
        </div>
      ) : (
        <p className="text-center text-gray-500">No votes cast yet.</p>
      )}
    </div>
  );
}
