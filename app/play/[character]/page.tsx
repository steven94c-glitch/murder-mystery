'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { GameState, Note } from '@/lib/types';
import {
  CHARACTERS,
  getCumulativePublicClues,
  getPhaseInfo,
  findCharacterBySlug,
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
  const rawCharSlug = typeof params.character === 'string' ? params.character : '';

  const character = findCharacterBySlug(rawCharSlug);

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
      {/* ── Character header / Vintage Playbill ── */}
      <div className="px-6 pt-8 pb-6 border-b separator-gold relative" style={{ background: 'rgba(26, 26, 26, 0.6)' }}>
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-start gap-5">
            <span className="text-6xl" style={{ filter: 'drop-shadow(0 0 8px rgba(212, 175, 55, 0.2))' }}>{character.emoji}</span>
            <div className="flex-1">
              <h1 className="art-deco-title text-3xl mb-2" style={{ color: '#f4d03f', letterSpacing: '0.1em' }}>
                {character.name}
              </h1>
              <span
                className="text-xs uppercase tracking-widest font-semibold inline-block"
                style={{ color: roleColor, fontFamily: "'Cormorant', serif", letterSpacing: '0.08em' }}
              >
                {character.role}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <div
              className="text-xs px-4 py-2 font-semibold uppercase tracking-widest"
              style={{
                background: 'rgba(107, 44, 44, 0.25)',
                color: '#f4d03f',
                border: '2px solid rgba(212, 175, 55, 0.3)',
                fontFamily: "'Bebas Neue', sans-serif",
              }}
            >
              Phase {phase}
            </div>
            <button
              onClick={() => setShowHelp((v) => !v)}
              className="w-10 h-10 text-lg font-bold flex items-center justify-center transition"
              style={{
                background: 'rgba(58, 184, 165, 0.2)',
                border: '2px solid rgba(58, 184, 165, 0.4)',
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
            className="p-5 text-sm"
            style={{
              background: 'rgba(45, 122, 110, 0.15)',
              border: '2px solid rgba(58, 184, 165, 0.35)',
              color: '#b8dcd8',
              fontFamily: "'Cormorant', serif",
            }}
          >
            {PHASE_HELP[phase] ?? 'Follow the host screen for instructions.'}
          </div>
        )}
      </div>

      {/* ── Tabs - Theater Program Sections ── */}
      <div
        className="flex overflow-x-auto border-b separator-gold"
        style={{ background: 'rgba(26, 26, 26, 0.5)' }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex-shrink-0 px-6 py-4 text-sm font-semibold transition-all relative whitespace-nowrap uppercase tracking-widest"
            style={{
              color: activeTab === tab.id ? '#f4d03f' : '#8b5a3c',
              borderBottom: activeTab === tab.id ? '3px solid #f4d03f' : '3px solid transparent',
              background: 'transparent',
              fontFamily: "'Cormorant', serif",
              fontSize: '0.95rem',
            }}
          >
            {tab.label}
            {tab.badge ? (
              <span
                className="ml-2 text-xs rounded-full px-2.5 py-0.5 font-bold"
                style={{
                  background: tab.id === 'notes' ? 'rgba(139, 26, 26, 0.5)' : 'rgba(212, 175, 55, 0.3)',
                  color: tab.id === 'notes' ? '#f8d5b0' : '#f4d03f',
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: '0.7rem',
                  letterSpacing: '0.08em'
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

            <div className="card-dark p-7 space-y-4">
              <h2 className="text-xs uppercase tracking-widest font-semibold" style={{ color: '#f4d03f', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.1em' }}>
                Character Biography
              </h2>
              <p className="text-base leading-relaxed" style={{ color: '#f5ede0', fontFamily: "'Cormorant', serif", lineHeight: 1.8 }}>
                {character.bio}
              </p>
            </div>

            {!character.isVictim && (
              <div className="card-burgundy p-7 space-y-5" style={{ borderLeft: '4px solid rgba(244, 160, 144, 0.6)' }}>
                <h2 className="text-xs uppercase tracking-widest font-semibold flex items-center gap-3" style={{ color: '#f4a090', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.12em' }}>
                  <span>🔒</span> Confidential Secret
                </h2>
                <p className="text-xs leading-relaxed italic font-semibold" style={{ color: '#d4a574' }}>
                  (Private — Do Not Reveal)
                </p>
                <p className="text-base leading-relaxed border-l-2 pl-4" style={{ color: '#f5ede0', borderLeftColor: 'rgba(244, 160, 144, 0.4)', fontFamily: "'Cormorant', serif", lineHeight: 1.8 }}>
                  {character.secret}
                </p>
              </div>
            )}

            <div className="card-teal p-7 space-y-4">
              <h2 className="text-xs uppercase tracking-widest font-semibold" style={{ color: '#3ab8a5', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.1em' }}>
                Your Alibi
              </h2>
              <p className="text-base leading-relaxed italic" style={{ color: '#d8ebe8', fontFamily: "'Cormorant', serif", lineHeight: 1.8 }}>
                &ldquo;{character.alibi}&rdquo;
              </p>
            </div>
          </div>
        )}

        {/* MY CLUES */}
        {activeTab === 'clues' && (
          <div className="space-y-5">
            {character.isVictim ? (
              <p className="text-center text-base pt-8" style={{ color: '#8b5a3c', fontFamily: "'Cormorant', serif" }}>
                Victims don&apos;t receive phase clues.
              </p>
            ) : unlockedClues.length === 0 ? (
              <div className="text-center pt-10 space-y-4">
                <p className="text-base" style={{ color: '#d4a574', fontFamily: "'Cormorant', serif" }}>
                  No clues yet.
                </p>
                <p className="text-xs uppercase tracking-widest" style={{ color: '#8b5a3c', fontFamily: "'Bebas Neue', sans-serif" }}>
                  Clues unlock as phases advance.
                </p>
              </div>
            ) : (
              unlockedClues.map(([phaseNum, clue]) => (
                <div
                  key={phaseNum}
                  className="evidence-card"
                >
                  <div className="text-xs uppercase tracking-widest mb-4 font-semibold" style={{ color: '#f4d03f', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.12em' }}>
                    📌 Phase {phaseNum} Discovery
                  </div>
                  <p className="text-base leading-relaxed" style={{ color: '#f5ede0', fontFamily: "'Cormorant', serif", lineHeight: 1.8 }}>
                    {clue}
                  </p>
                </div>
              ))
            )}
          </div>
        )}

        {/* EVIDENCE BOARD */}
        {activeTab === 'evidence' && (
          <div className="space-y-6">
            <div className="divider-marquee">
              <div />
              <span className="divider-marquee-text">Public Evidence</span>
              <div />
            </div>
            {publicClues.length === 0 ? (
              <div className="text-center pt-10 space-y-3">
                <p className="text-base" style={{ color: '#d4a574', fontFamily: "'Cormorant', serif" }}>
                  No public evidence yet.
                </p>
                <p className="text-xs uppercase tracking-widest" style={{ color: '#8b5a3c', fontFamily: "'Bebas Neue', sans-serif" }}>
                  Evidence will be revealed as the game progresses.
                </p>
              </div>
            ) : (
              publicClues.map((clue, i) => (
                <div key={i} className="evidence-card">
                  <p className="text-base leading-relaxed" style={{ color: '#f5ede0', fontFamily: "'Cormorant', serif", lineHeight: 1.8 }}>
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
            <div className="card-dark p-7 space-y-5">
              <h2 className="text-xs uppercase tracking-widest font-semibold" style={{ color: '#f4d03f', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.1em' }}>
                ✉️ Correspondence
              </h2>
              <form onSubmit={handleSendNote} className="space-y-4">
                <select
                  value={noteRecipient}
                  onChange={(e) => setNoteRecipient(e.target.value)}
                  className="w-full px-4 py-3 text-sm focus:outline-none transition"
                  style={{
                    background: 'rgba(42, 42, 42, 0.7)',
                    border: '2px solid rgba(212, 175, 55, 0.25)',
                    color: '#f5ede0',
                    fontFamily: "'Cormorant', serif",
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
                  className="w-full px-4 py-3 text-sm resize-none focus:outline-none transition"
                  style={{
                    background: 'rgba(42, 42, 42, 0.7)',
                    border: '2px solid rgba(212, 175, 55, 0.25)',
                    color: '#f5ede0',
                    fontFamily: "'Cormorant', serif",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(212, 175, 55, 0.5)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(212, 175, 55, 0.2)';
                  }}
                />
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: '#8b5a3c' }}>
                    {noteMessage.length}/500
                  </span>
                  <button
                    type="submit"
                    disabled={noteSending || !noteRecipient || !noteMessage.trim()}
                    className="px-6 py-2 text-sm font-bold uppercase tracking-widest transition disabled:opacity-40"
                    style={{
                      background: 'linear-gradient(135deg, #8b1a1a 0%, #6b2c2c 100%)',
                      color: '#f8d5b0',
                      border: '2px solid rgba(212, 175, 55, 0.25)',
                      fontFamily: "'Bebas Neue', sans-serif",
                      letterSpacing: '0.08em'
                    }}
                  >
                    {noteSending ? 'Sending…' : 'Send'}
                  </button>
                </div>
                {noteSent && (
                  <p className="text-xs text-center font-semibold" style={{ color: '#3ab8a5', fontFamily: "'Bebas Neue', sans-serif" }}>
                    ✓ Sent!
                  </p>
                )}
              </form>
            </div>

            {/* Received notes */}
            <div>
              <h2 className="text-xs uppercase tracking-widest mb-5 font-semibold" style={{ color: '#f4d03f', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.1em' }}>
                📬 Received Messages ({myNotes.length})
              </h2>
              {myNotes.length === 0 ? (
                <p className="text-center text-base pt-4" style={{ color: '#8b5a3c', fontFamily: "'Cormorant', serif" }}>
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
          <div className="space-y-7">
            <div className="text-center space-y-3">
              <p className="art-deco-title text-3xl" style={{ color: '#f4d03f', letterSpacing: '0.12em' }}>
                Who killed Grammy?
              </p>
              <p className="text-xs uppercase tracking-widest" style={{ color: '#8b5a3c', fontFamily: "'Bebas Neue', sans-serif" }}>
                Your ballot is final · Choose wisely
              </p>
            </div>

            {character.isVictim ? (
              <p className="text-center text-base" style={{ color: '#8b5a3c', fontFamily: "'Cormorant', serif" }}>
                Victims cannot vote.
              </p>
            ) : alreadyVoted || voteSubmitted ? (
              <div className="card-teal p-8 text-center space-y-4">
                <div className="text-6xl">✅</div>
                <p className="font-bold text-lg uppercase tracking-widest" style={{ color: '#3ab8a5', fontFamily: "'Bebas Neue', sans-serif" }}>
                  Ballot Submitted
                </p>
                <p className="text-sm" style={{ color: '#c8dbd8', fontFamily: "'Cormorant', serif", lineHeight: 1.8 }}>
                  You voted for:
                  <br />
                  <strong style={{ color: '#f5ede0', fontSize: '1.2em', fontFamily: "'Playfair Display', serif" }}>
                    {myVote ?? selectedVote}
                  </strong>
                </p>
                {!state.votesRevealed && (
                  <p className="text-xs uppercase tracking-widest" style={{ color: '#8b5a3c', fontFamily: "'Bebas Neue', sans-serif" }}>
                    Awaiting all voters…
                  </p>
                )}
                {state.votesRevealed && (
                  <p className="text-xs uppercase tracking-widest" style={{ color: '#f4d03f', fontFamily: "'Bebas Neue', sans-serif" }}>
                    All votes in! Check the TV screen.
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
                  className="w-full py-5 text-lg font-bold uppercase tracking-widest transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    background: selectedVote
                      ? 'linear-gradient(135deg, #8b1a1a 0%, #6b2c2c 100%)'
                      : 'rgba(60, 60, 60, 0.3)',
                    color: selectedVote ? '#f8d5b0' : '#707070',
                    border: '2px solid rgba(212, 175, 55, 0.25)',
                    boxShadow: selectedVote ? '0 6px 20px rgba(0, 0, 0, 0.6)' : 'none',
                    fontFamily: "'Bebas Neue', sans-serif",
                    letterSpacing: '0.12em'
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
          className="px-6 py-5 text-center text-sm font-bold cursor-pointer separator-gold border-t uppercase tracking-widest"
          style={{
            background: 'linear-gradient(135deg, rgba(139, 26, 26, 0.3) 0%, rgba(107, 44, 44, 0.25) 100%)',
            color: '#f8d5b0',
            fontFamily: "'Bebas Neue', sans-serif",
            letterSpacing: '0.1em'
          }}
          onClick={() => setActiveTab('vote')}
        >
          🗳️ Voting Open — Tap to Cast Ballot
        </div>
      )}

      {/* Phase 5 reveal banner */}
      {phase === 5 && (
        <div
          className="px-6 py-5 text-center text-sm font-bold separator-gold border-t uppercase tracking-widest"
          style={{
            background: 'linear-gradient(135deg, rgba(139, 26, 26, 0.3) 0%, rgba(107, 44, 44, 0.25) 100%)',
            color: '#f8d5b0',
            fontFamily: "'Bebas Neue', sans-serif",
            letterSpacing: '0.1em'
          }}
        >
          ☠️ The Killer Revealed · Check the TV Screen
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
      className="overflow-hidden cursor-pointer transition-all"
      style={{
        background: note.read
          ? 'rgba(26, 26, 26, 0.7)'
          : 'linear-gradient(135deg, rgba(139, 26, 26, 0.25) 0%, rgba(26, 26, 26, 0.85) 100%)',
        border: note.read
          ? '2px solid rgba(212, 175, 55, 0.2)'
          : '2px solid rgba(212, 175, 55, 0.35)',
        boxShadow: note.read ? 'none' : '0 6px 16px rgba(0, 0, 0, 0.5)',
      }}
      onClick={() => setExpanded((v) => !v)}
    >
      <div className="px-5 py-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1">
          {!note.read && (
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0 animate-pulse"
              style={{ background: '#f4a090' }}
            />
          )}
          <div>
            <span className="text-sm font-semibold" style={{ color: '#f5ede0', fontFamily: "'Cormorant', serif" }}>
              {fromChar?.emoji} {note.from}
            </span>
          </div>
        </div>
        <span className="text-xs flex-shrink-0" style={{ color: '#8b5a3c' }}>
          {time}
        </span>
      </div>
      {expanded && (
        <div className="px-5 pb-5 border-t separator-gold pt-4">
          <p className="text-sm leading-relaxed" style={{ color: '#f5ede0', fontFamily: "'Cormorant', serif", lineHeight: 1.8 }}>
            {note.message}
          </p>
        </div>
      )}
    </div>
  );
}
