'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { GameState, Note } from '@/lib/types';
import {
  CHARACTERS,
  getCumulativePublicClues,
  getPhaseInfo,
} from '@/lib/game-data';

const PHASE_HELP: Record<number, string> = {
  0: 'Phase 0: Read your character carefully and get into character.',
  1: "Phase 1: Grammy is dead — start investigating. Share what's relevant.",
  2: 'Phase 2: New evidence has surfaced. Share your clues with others.',
  3: 'Phase 3: Make formal accusations. The accused must respond.',
  4: 'Phase 4: Cast your vote for the killer.',
  5: 'Phase 5: The truth is revealed.',
};

const SUSPECT_NAMES = CHARACTERS.filter((c) => !c.isVictim).map((c) => c.name);

type TabId = 'secret' | 'clues' | 'evidence' | 'notes' | 'vote';

export default function PlayerPage() {
  const params = useParams();
  const router = useRouter();
  const rawCharName = typeof params.character === 'string' ? params.character : '';

  const character = CHARACTERS.find(
    (c) => c.name.toLowerCase() === rawCharName.toLowerCase()
  );

  const [state, setState] = useState<GameState | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('secret');
  const [showHelp, setShowHelp] = useState(false);
  const [noteRecipient, setNoteRecipient] = useState('');
  const [noteMessage, setNoteMessage] = useState('');
  const [noteSending, setNoteSending] = useState(false);
  const [noteSent, setNoteSent] = useState(false);
  const [myNotes, setMyNotes] = useState<Note[]>([]);
  const [selectedVote, setSelectedVote] = useState('');
  const [voteSubmitted, setVoteSubmitted] = useState(false);
  const [voteError, setVoteError] = useState('');

  // Redirect if character not found
  useEffect(() => {
    if (!character) router.replace('/');
  }, [character, router]);

  const fetchState = useCallback(async () => {
    try {
      const [stateRes, notesRes] = await Promise.all([
        fetch('/api/state'),
        character ? fetch(`/api/note?character=${encodeURIComponent(character.name)}`) : Promise.resolve(null),
      ]);
      const stateData = await stateRes.json();
      setState(stateData);
      if (notesRes) {
        const notesData = await notesRes.json();
        setMyNotes(notesData.notes ?? []);
      }
    } catch {
      // silently ignore
    }
  }, [character]);

  useEffect(() => {
    if (!character) return;
    fetchState();
    const interval = setInterval(fetchState, 3000);
    return () => clearInterval(interval);
  }, [character, fetchState]);

  // Switch to vote tab when phase 4 hits
  useEffect(() => {
    if (state?.phase === 4 && activeTab !== 'vote') {
      // subtle notification, don't force tab switch
    }
  }, [state?.phase, activeTab]);

  if (!character) return null;
  if (!state) {
    return (
      <div className="min-h-screen bg-atmosphere flex items-center justify-center">
        <p className="text-gray-400 animate-pulse">Loading…</p>
      </div>
    );
  }

  const phase = state.phase;
  const phaseInfo = getPhaseInfo(phase);
  const publicClues = getCumulativePublicClues(phase);
  const unlockedClues = Object.entries(character.phaseClues)
    .filter(([p]) => Number(p) <= phase)
    .sort((a, b) => Number(a[0]) - Number(b[0]));

  const unreadCount = myNotes.filter((n) => !n.read).length;
  const isVotePhase = phase === 4;
  const alreadyVoted = !!(state.votes[character.name]);
  const myVote = state.votes[character.name];

  const tabs: { id: TabId; label: string; badge?: number }[] = [
    { id: 'secret', label: 'My Secret' },
    { id: 'clues', label: 'My Clues', badge: unlockedClues.length > 0 ? unlockedClues.length : undefined },
    { id: 'evidence', label: 'Evidence', badge: publicClues.length > 0 ? publicClues.length : undefined },
    { id: 'notes', label: 'Notes', badge: unreadCount > 0 ? unreadCount : undefined },
    ...(isVotePhase ? [{ id: 'vote' as TabId, label: 'Vote' }] : []),
  ];

  async function handleSendNote(e: React.FormEvent) {
    e.preventDefault();
    if (!noteRecipient || !noteMessage.trim()) return;
    setNoteSending(true);
    setNoteSent(false);
    try {
      await fetch('/api/note', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: character!.name, to: noteRecipient, message: noteMessage.trim() }),
      });
      setNoteMessage('');
      setNoteRecipient('');
      setNoteSent(true);
      setTimeout(() => setNoteSent(false), 3000);
      fetchState();
    } finally {
      setNoteSending(false);
    }
  }

  async function handleVote(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedVote) return;
    setVoteError('');
    try {
      const res = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voter: character!.name, suspect: selectedVote }),
      });
      const data = await res.json();
      if (data.error) {
        setVoteError(data.error);
      } else {
        setVoteSubmitted(true);
        fetchState();
      }
    } catch {
      setVoteError('Failed to submit vote. Try again.');
    }
  }

  const roleColor =
    character.isVictim
      ? '#8b1a1a'
      : character.role === 'Key Witness'
      ? '#2d9e8d'
      : character.role === 'Observer'
      ? '#6b7280'
      : '#c9a84c';

  return (
    <div className="min-h-screen bg-atmosphere flex flex-col max-w-xl mx-auto">
      {/* ── Character header / Case file opener ── */}
      <div
        className="px-5 pt-6 pb-6 border-b separator-gold relative"
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-start gap-4">
            <span className="text-5xl">{character.emoji}</span>
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-1" style={{ color: '#d4af37', fontFamily: "'Playfair Display', serif" }}>
                {character.name}
              </h1>
              <span
                className="text-xs uppercase tracking-widest font-semibold inline-block"
                style={{ color: roleColor }}
              >
                {character.role}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <div
              className="text-xs px-3 py-2 rounded-sm font-semibold"
              style={{
                background: 'rgba(212, 175, 55, 0.15)',
                color: '#d4af37',
                border: '1px solid rgba(212, 175, 55, 0.3)',
              }}
            >
              Phase {phase}
            </div>
            <button
              onClick={() => setShowHelp((v) => !v)}
              className="w-8 h-8 rounded-sm text-sm font-bold flex items-center justify-center transition"
              style={{
                background: 'rgba(45, 122, 110, 0.2)',
                border: '1px solid rgba(45, 122, 110, 0.4)',
                color: '#3ab8a5',
              }}
              aria-label="Help"
            >
              ?
            </button>
          </div>
        </div>

        {/* Help panel */}
        {showHelp && (
          <div
            className="p-4 rounded-sm text-sm"
            style={{
              background: 'rgba(45, 122, 110, 0.1)',
              border: '1px solid rgba(45, 122, 110, 0.3)',
              color: '#a0ccc8',
            }}
          >
            {PHASE_HELP[phase] ?? 'Follow the host screen for instructions.'}
          </div>
        )}
      </div>

      {/* ── Tabs ── */}
      <div
        className="flex overflow-x-auto border-b separator-gold bg-opacity-20"
        style={{ background: 'rgba(26, 31, 46, 0.5)' }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex-shrink-0 px-5 py-3 text-sm font-semibold transition-all relative whitespace-nowrap"
            style={{
              color: activeTab === tab.id ? '#d4af37' : '#707070',
              borderBottom: activeTab === tab.id ? '3px solid #d4af37' : '3px solid transparent',
              background: 'transparent',
            }}
          >
            {tab.label}
            {tab.badge ? (
              <span
                className="ml-2 text-xs rounded-full px-2 py-0.5 font-bold"
                style={{
                  background: tab.id === 'notes' ? 'rgba(139, 26, 26, 0.4)' : 'rgba(212, 175, 55, 0.25)',
                  color: tab.id === 'notes' ? '#f8d5b0' : '#d4af37',
                }}
              >
                {tab.badge}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {/* ── Tab content ── */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">

        {/* MY SECRET */}
        {activeTab === 'secret' && (
          <div className="space-y-5">
            {character.isVictim ? (
              <div className="card-burgundy p-7 text-center space-y-3">
                <div className="text-5xl">☠️</div>
                <p className="text-xl font-bold" style={{ color: '#d4a574' }}>You are the Victim</p>
                <p className="text-sm leading-relaxed" style={{ color: '#c0a0a0' }}>
                  Dorothy &quot;Grammy&quot; Keating has been found dead. You play the victim — act as a ghost or silent observer. You may not share your secret.
                </p>
              </div>
            ) : null}

            <div className="card-dark p-6 space-y-3">
              <h2 className="text-xs uppercase tracking-widest font-semibold" style={{ color: '#d4af37' }}>
                About You
              </h2>
              <p className="text-base leading-relaxed" style={{ color: '#d8d0c0' }}>
                {character.bio}
              </p>
            </div>

            {!character.isVictim && (
              <div className="card-burgundy p-6 space-y-4 border-l-4" style={{ borderLeftColor: '#b02222' }}>
                <h2 className="text-xs uppercase tracking-widest font-semibold flex items-center gap-2" style={{ color: '#d4a574' }}>
                  <span>🔒</span> Your Secret
                </h2>
                <p className="text-sm leading-relaxed italic" style={{ color: '#f0d0d0' }}>
                  (Private — do not read aloud)
                </p>
                <p className="text-base leading-relaxed border-l-2 border-burgundy pl-4" style={{ color: '#f0c8c8', borderLeftColor: 'rgba(176, 34, 34, 0.4)' }}>
                  {character.secret}
                </p>
              </div>
            )}

            <div className="card-teal p-6 space-y-3">
              <h2 className="text-xs uppercase tracking-widest font-semibold" style={{ color: '#3ab8a5' }}>
                Your Alibi
              </h2>
              <p className="text-base leading-relaxed italic" style={{ color: '#c8e0dc' }}>
                &ldquo;{character.alibi}&rdquo;
              </p>
            </div>
          </div>
        )}

        {/* MY CLUES */}
        {activeTab === 'clues' && (
          <div className="space-y-4">
            {character.isVictim ? (
              <p className="text-center text-base pt-8" style={{ color: '#707070' }}>
                Victims don&apos;t receive phase clues.
              </p>
            ) : unlockedClues.length === 0 ? (
              <div className="text-center pt-10 space-y-3">
                <p className="text-base" style={{ color: '#a0a0a0' }}>
                  No clues yet.
                </p>
                <p className="text-xs" style={{ color: '#707070' }}>
                  Clues unlock as phases advance.
                </p>
              </div>
            ) : (
              unlockedClues.map(([phaseNum, clue]) => (
                <div
                  key={phaseNum}
                  className="evidence-card"
                >
                  <div className="text-xs uppercase tracking-widest mb-3 font-semibold" style={{ color: '#d4af37' }}>
                    📌 Phase {phaseNum} Discovery
                  </div>
                  <p className="text-base leading-relaxed" style={{ color: '#d8d0c0' }}>
                    {clue}
                  </p>
                </div>
              ))
            )}
          </div>
        )}

        {/* EVIDENCE BOARD */}
        {activeTab === 'evidence' && (
          <div className="space-y-5">
            <h2 className="text-xs uppercase tracking-widest text-center font-semibold" style={{ color: '#d4af37' }}>
              📋 Public Evidence
            </h2>
            {publicClues.length === 0 ? (
              <div className="text-center pt-10 space-y-2">
                <p className="text-base" style={{ color: '#a0a0a0' }}>
                  No public evidence yet.
                </p>
                <p className="text-xs" style={{ color: '#707070' }}>
                  Evidence will be revealed as the game progresses.
                </p>
              </div>
            ) : (
              publicClues.map((clue, i) => (
                <div key={i} className="evidence-card">
                  <p className="text-base leading-relaxed" style={{ color: '#d8d0c0' }}>
                    {clue}
                  </p>
                </div>
              ))
            )}
          </div>
        )}

        {/* NOTES */}
        {activeTab === 'notes' && (
          <div className="space-y-6">
            {/* Send a note form */}
            <div className="card-dark p-6 space-y-4">
              <h2 className="text-xs uppercase tracking-widest font-semibold" style={{ color: '#d4af37' }}>
                ✉️ Send a Message
              </h2>
              <form onSubmit={handleSendNote} className="space-y-4">
                <select
                  value={noteRecipient}
                  onChange={(e) => setNoteRecipient(e.target.value)}
                  className="w-full px-4 py-3 text-sm rounded-sm focus:outline-none transition"
                  style={{
                    background: 'rgba(26, 31, 46, 0.8)',
                    border: '1px solid rgba(212, 175, 55, 0.2)',
                    color: '#f0ead6',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(212, 175, 55, 0.5)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(212, 175, 55, 0.2)';
                  }}
                >
                  <option value="">Select recipient…</option>
                  {CHARACTERS.filter((c) => c.name !== character.name).map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.emoji} {c.name}
                    </option>
                  ))}
                </select>
                <textarea
                  value={noteMessage}
                  onChange={(e) => setNoteMessage(e.target.value)}
                  placeholder="Your message…"
                  rows={3}
                  maxLength={500}
                  className="w-full px-4 py-3 text-sm rounded-sm resize-none focus:outline-none transition"
                  style={{
                    background: 'rgba(26, 31, 46, 0.8)',
                    border: '1px solid rgba(212, 175, 55, 0.2)',
                    color: '#f0ead6',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(212, 175, 55, 0.5)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(212, 175, 55, 0.2)';
                  }}
                />
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: '#707070' }}>
                    {noteMessage.length}/500
                  </span>
                  <button
                    type="submit"
                    disabled={noteSending || !noteRecipient || !noteMessage.trim()}
                    className="px-5 py-2 rounded-sm text-sm font-bold transition disabled:opacity-40"
                    style={{
                      background: 'linear-gradient(135deg, #8b1a1a 0%, #5c2e2e 100%)',
                      color: '#f8d5b0',
                      border: '1px solid rgba(176, 34, 34, 0.3)',
                    }}
                  >
                    {noteSending ? 'Sending…' : 'Send'}
                  </button>
                </div>
                {noteSent && (
                  <p className="text-xs text-center font-semibold" style={{ color: '#3ab8a5' }}>
                    ✓ Sent!
                  </p>
                )}
              </form>
            </div>

            {/* Received notes */}
            <div>
              <h2 className="text-xs uppercase tracking-widest mb-4 font-semibold" style={{ color: '#d4af37' }}>
                📬 Received Notes ({myNotes.length})
              </h2>
              {myNotes.length === 0 ? (
                <p className="text-center text-base pt-4" style={{ color: '#707070' }}>
                  No messages yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {myNotes.map((note) => (
                    <NoteCard key={note.id} note={note} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* VOTE */}
        {activeTab === 'vote' && isVotePhase && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <p className="text-2xl font-bold" style={{ color: '#d4af37', fontFamily: "'Playfair Display', serif" }}>
                Who killed Grammy?
              </p>
              <p className="text-xs" style={{ color: '#a0a0a0' }}>
                Your vote is final. Choose wisely.
              </p>
            </div>

            {character.isVictim ? (
              <p className="text-center text-base" style={{ color: '#707070' }}>
                Victims cannot vote.
              </p>
            ) : alreadyVoted || voteSubmitted ? (
              <div className="card-teal p-7 text-center space-y-3">
                <div className="text-5xl">✅</div>
                <p className="font-bold text-lg" style={{ color: '#3ab8a5' }}>
                  Vote submitted
                </p>
                <p className="text-sm" style={{ color: '#a8c8c4' }}>
                  You voted for:
                  <br />
                  <strong style={{ color: '#f0ead6', fontSize: '1.1em' }}>
                    {myVote ?? selectedVote}
                  </strong>
                </p>
                {!state.votesRevealed && (
                  <p className="text-xs" style={{ color: '#707070' }}>
                    Waiting for all players…
                  </p>
                )}
                {state.votesRevealed && (
                  <p className="text-xs" style={{ color: '#d4af37' }}>
                    All votes are in! Check the TV screen.
                  </p>
                )}
              </div>
            ) : (
              <form onSubmit={handleVote} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  {SUSPECT_NAMES.map((name) => {
                    const char = CHARACTERS.find((c) => c.name === name);
                    return (
                      <button
                        key={name}
                        type="button"
                        onClick={() => setSelectedVote(name)}
                        className="p-4 rounded-sm text-center transition-all duration-200 hover:scale-105 active:scale-95"
                        style={{
                          background: selectedVote === name
                            ? 'rgba(139, 26, 26, 0.35)'
                            : 'rgba(26, 31, 46, 0.6)',
                          border: selectedVote === name
                            ? '2px solid #b02222'
                            : '1px solid rgba(212, 175, 55, 0.15)',
                          color: selectedVote === name ? '#f8d5b0' : '#a0a0a0',
                        }}
                      >
                        <div className="text-4xl mb-2">{char?.emoji}</div>
                        <div className="text-xs font-bold">{name}</div>
                      </button>
                    );
                  })}
                </div>
                {voteError && (
                  <p className="text-center text-sm" style={{ color: '#d4574d' }}>
                    {voteError}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={!selectedVote}
                  className="w-full py-4 rounded-sm text-lg font-bold uppercase tracking-widest transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    background: selectedVote
                      ? 'linear-gradient(135deg, #8b1a1a 0%, #5c2e2e 100%)'
                      : 'rgba(60, 60, 60, 0.3)',
                    color: selectedVote ? '#f8d5b0' : '#707070',
                    border: '1px solid rgba(212, 175, 55, 0.2)',
                  }}
                >
                  {selectedVote ? `Accuse ${selectedVote}` : 'Select a suspect'}
                </button>
              </form>
            )}
          </div>
        )}
      </div>

      {/* Phase 4 vote notification banner */}
      {isVotePhase && activeTab !== 'vote' && !alreadyVoted && !voteSubmitted && (
        <div
          className="px-5 py-4 text-center text-sm font-bold cursor-pointer separator-gold border-t"
          style={{
            background: 'linear-gradient(135deg, rgba(139, 26, 26, 0.3) 0%, rgba(92, 46, 46, 0.2) 100%)',
            color: '#f8d5b0',
          }}
          onClick={() => setActiveTab('vote')}
        >
          🗳️ Voting is open — tap to cast your vote
        </div>
      )}

      {/* Phase 5 reveal banner */}
      {phase === 5 && (
        <div
          className="px-5 py-4 text-center text-sm font-bold separator-gold border-t"
          style={{
            background: 'linear-gradient(135deg, rgba(139, 26, 26, 0.3) 0%, rgba(92, 46, 46, 0.2) 100%)',
            color: '#f8d5b0',
          }}
        >
          ☠️ The killer has been revealed. Check the TV screen.
        </div>
      )}
    </div>
  );
}

function NoteCard({ note }: { note: Note }) {
  const [expanded, setExpanded] = useState(!note.read);
  const fromChar = CHARACTERS.find((c) => c.name === note.from);
  const time = new Date(note.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div
      className="rounded-sm overflow-hidden cursor-pointer transition-all"
      style={{
        background: note.read
          ? 'rgba(26, 31, 46, 0.6)'
          : 'linear-gradient(135deg, rgba(139, 26, 26, 0.2) 0%, rgba(26, 31, 46, 0.8) 100%)',
        border: note.read
          ? '1px solid rgba(212, 175, 55, 0.15)'
          : '1px solid rgba(176, 34, 34, 0.35)',
        boxShadow: note.read ? 'none' : '0 4px 12px rgba(0, 0, 0, 0.4)',
      }}
      onClick={() => setExpanded((v) => !v)}
    >
      <div className="px-5 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1">
          {!note.read && (
            <span
              className="w-2 h-2 rounded-full flex-shrink-0 animate-pulse"
              style={{ background: '#b02222' }}
            />
          )}
          <div>
            <span className="text-sm font-semibold" style={{ color: '#f0ead6' }}>
              {fromChar?.emoji} {note.from}
            </span>
          </div>
        </div>
        <span className="text-xs flex-shrink-0" style={{ color: '#707070' }}>
          {time}
        </span>
      </div>
      {expanded && (
        <div className="px-5 pb-4 border-t separator-gold pt-3">
          <p className="text-sm leading-relaxed" style={{ color: '#d8d0c0' }}>
            {note.message}
          </p>
        </div>
      )}
    </div>
  );
}
