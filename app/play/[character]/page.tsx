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
    <div className="min-h-screen bg-atmosphere flex flex-col max-w-lg mx-auto">
      {/* ── Character header ── */}
      <div
        className="px-4 pt-6 pb-4 border-b relative"
        style={{ borderColor: 'rgba(201,168,76,0.15)' }}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{character.emoji}</span>
            <div>
              <h1 className="text-xl font-bold" style={{ color: '#e8dcc8' }}>
                {character.name}
              </h1>
              <span
                className="text-xs uppercase tracking-widest font-semibold"
                style={{ color: roleColor }}
              >
                {character.role}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="text-xs px-2 py-1 rounded-md"
              style={{ background: 'rgba(201,168,76,0.1)', color: '#c9a84c', border: '1px solid rgba(201,168,76,0.3)' }}
            >
              Phase {phase}
            </div>
            <button
              onClick={() => setShowHelp((v) => !v)}
              className="w-7 h-7 rounded-full text-sm font-bold flex items-center justify-center transition hover:opacity-80"
              style={{ background: 'rgba(45,158,141,0.2)', border: '1px solid rgba(45,158,141,0.4)', color: '#3ab8a5' }}
              aria-label="Help"
            >
              ?
            </button>
          </div>
        </div>

        {/* Help panel */}
        {showHelp && (
          <div
            className="mt-3 p-3 rounded-lg text-sm"
            style={{ background: 'rgba(45,158,141,0.1)', border: '1px solid rgba(45,158,141,0.3)', color: '#a0ccc8' }}
          >
            {PHASE_HELP[phase] ?? 'Follow the host screen for instructions.'}
          </div>
        )}
      </div>

      {/* ── Tabs ── */}
      <div
        className="flex overflow-x-auto border-b"
        style={{ borderColor: 'rgba(201,168,76,0.15)' }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex-shrink-0 px-4 py-3 text-sm font-semibold transition-all relative whitespace-nowrap"
            style={{
              color: activeTab === tab.id ? '#c9a84c' : '#6b7280',
              borderBottom: activeTab === tab.id ? '2px solid #c9a84c' : '2px solid transparent',
              background: 'transparent',
            }}
          >
            {tab.label}
            {tab.badge ? (
              <span
                className="ml-1 text-xs rounded-full px-1.5 py-0.5 font-bold"
                style={{ background: tab.id === 'notes' ? '#8b1a1a' : 'rgba(201,168,76,0.25)', color: tab.id === 'notes' ? '#f8d5b0' : '#c9a84c' }}
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
          <div className="space-y-4">
            {character.isVictim ? (
              <div className="card-crimson p-5 text-center space-y-2">
                <div className="text-4xl">☠️</div>
                <p className="text-lg font-bold" style={{ color: '#e08080' }}>You are the Victim</p>
                <p className="text-sm text-gray-400">
                  Dorothy &quot;Grammy&quot; Keating has been found dead. You play the victim — act as a ghost or silent observer. You may not share your secret.
                </p>
              </div>
            ) : null}

            <div className="card-dark p-4 space-y-3">
              <h2 className="text-xs uppercase tracking-widest" style={{ color: '#c9a84c' }}>Your Bio</h2>
              <p className="text-sm leading-relaxed text-gray-300">{character.bio}</p>
            </div>

            {!character.isVictim && (
              <div className="card-crimson p-4 space-y-3">
                <h2 className="text-xs uppercase tracking-widest" style={{ color: '#e08080' }}>
                  🔒 Your Secret (private — do not read aloud)
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: '#f0c0c0' }}>
                  {character.secret}
                </p>
              </div>
            )}

            <div className="card-dark p-4 space-y-2">
              <h2 className="text-xs uppercase tracking-widest" style={{ color: '#2d9e8d' }}>Your Alibi</h2>
              <p className="text-sm leading-relaxed text-gray-300 italic">&ldquo;{character.alibi}&rdquo;</p>
            </div>
          </div>
        )}

        {/* MY CLUES */}
        {activeTab === 'clues' && (
          <div className="space-y-3">
            {character.isVictim ? (
              <p className="text-gray-500 text-sm text-center pt-4">Victims don&apos;t receive phase clues.</p>
            ) : unlockedClues.length === 0 ? (
              <div className="text-center pt-8 space-y-2">
                <p className="text-gray-500 text-sm">No private clues yet.</p>
                <p className="text-xs text-gray-700">Clues unlock as phases advance.</p>
              </div>
            ) : (
              unlockedClues.map(([phaseNum, clue]) => (
                <div
                  key={phaseNum}
                  className="p-4 rounded-xl"
                  style={{
                    background: 'rgba(201,168,76,0.06)',
                    border: '1px solid rgba(201,168,76,0.2)',
                  }}
                >
                  <div className="text-xs uppercase tracking-widest mb-2" style={{ color: '#c9a84c' }}>
                    Phase {phaseNum} Clue
                  </div>
                  <p className="text-sm leading-relaxed text-gray-200">{clue}</p>
                </div>
              ))
            )}
          </div>
        )}

        {/* EVIDENCE BOARD */}
        {activeTab === 'evidence' && (
          <div className="space-y-3">
            <h2 className="text-xs uppercase tracking-widest text-center" style={{ color: '#2d9e8d' }}>
              Public Evidence — Phase {phase}
            </h2>
            {publicClues.length === 0 ? (
              <div className="text-center pt-8">
                <p className="text-gray-500 text-sm">No public evidence yet.</p>
                <p className="text-xs text-gray-700 mt-1">Evidence will appear as the game progresses.</p>
              </div>
            ) : (
              publicClues.map((clue, i) => (
                <div key={i} className="card-seafoam p-4">
                  <span className="text-seafoam mr-2 text-xs">◆</span>
                  <span className="text-sm leading-relaxed text-gray-200">{clue}</span>
                </div>
              ))
            )}
          </div>
        )}

        {/* NOTES */}
        {activeTab === 'notes' && (
          <div className="space-y-5">
            {/* Send a note form */}
            <div className="card-dark p-4 space-y-3">
              <h2 className="text-xs uppercase tracking-widest" style={{ color: '#c9a84c' }}>
                Send a Private Note
              </h2>
              <form onSubmit={handleSendNote} className="space-y-3">
                <select
                  value={noteRecipient}
                  onChange={(e) => setNoteRecipient(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-yellow-500"
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
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white resize-none focus:outline-none focus:border-yellow-500"
                />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">{noteMessage.length}/500</span>
                  <button
                    type="submit"
                    disabled={noteSending || !noteRecipient || !noteMessage.trim()}
                    className="px-4 py-2 rounded-lg text-sm font-bold transition hover:opacity-80 disabled:opacity-40"
                    style={{ background: '#8b1a1a', color: '#f8d5b0' }}
                  >
                    {noteSending ? 'Sending…' : 'Send Note'}
                  </button>
                </div>
                {noteSent && (
                  <p className="text-xs text-green-400 text-center">Note sent!</p>
                )}
              </form>
            </div>

            {/* Received notes */}
            <div>
              <h2 className="text-xs uppercase tracking-widest mb-3" style={{ color: '#c9a84c' }}>
                Received Notes ({myNotes.length})
              </h2>
              {myNotes.length === 0 ? (
                <p className="text-gray-600 text-sm text-center pt-2">No notes yet.</p>
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
          <div className="space-y-4">
            <div className="text-center space-y-1">
              <p className="text-lg font-bold" style={{ color: '#c9a84c' }}>Who killed Grammy?</p>
              <p className="text-xs text-gray-500">Your vote is final. Choose wisely.</p>
            </div>

            {character.isVictim ? (
              <p className="text-gray-500 text-sm text-center">Victims cannot vote.</p>
            ) : alreadyVoted || voteSubmitted ? (
              <div className="card-seafoam p-5 text-center space-y-2">
                <div className="text-3xl">✅</div>
                <p className="font-bold" style={{ color: '#3ab8a5' }}>Vote submitted!</p>
                <p className="text-sm text-gray-400">
                  You voted for: <strong style={{ color: '#e8dcc8' }}>{myVote ?? selectedVote}</strong>
                </p>
                {!state.votesRevealed && (
                  <p className="text-xs text-gray-600">Waiting for all votes…</p>
                )}
                {state.votesRevealed && (
                  <p className="text-xs" style={{ color: '#c9a84c' }}>
                    All votes are in! Check the TV screen.
                  </p>
                )}
              </div>
            ) : (
              <form onSubmit={handleVote} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {SUSPECT_NAMES.map((name) => {
                    const char = CHARACTERS.find((c) => c.name === name);
                    return (
                      <button
                        key={name}
                        type="button"
                        onClick={() => setSelectedVote(name)}
                        className="p-3 rounded-xl text-center transition-all duration-150 hover:scale-105 active:scale-95"
                        style={{
                          background: selectedVote === name
                            ? 'rgba(139,26,26,0.4)'
                            : 'rgba(17,24,39,0.7)',
                          border: selectedVote === name
                            ? '2px solid #b02222'
                            : '1px solid rgba(201,168,76,0.15)',
                          color: selectedVote === name ? '#f8d5b0' : '#9ca3af',
                        }}
                      >
                        <div className="text-2xl mb-1">{char?.emoji}</div>
                        <div className="text-xs font-bold">{name}</div>
                      </button>
                    );
                  })}
                </div>
                {voteError && (
                  <p className="text-red-400 text-sm text-center">{voteError}</p>
                )}
                <button
                  type="submit"
                  disabled={!selectedVote}
                  className="w-full py-4 rounded-xl text-lg font-bold uppercase tracking-widest transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                  style={{ background: '#8b1a1a', color: '#f8d5b0', border: '1px solid rgba(201,168,76,0.3)' }}
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
          className="px-4 py-3 text-center text-sm font-bold cursor-pointer"
          style={{ background: 'rgba(139,26,26,0.4)', color: '#f8d5b0', borderTop: '1px solid rgba(176,34,34,0.4)' }}
          onClick={() => setActiveTab('vote')}
        >
          🗳️ Voting is open — tap to cast your vote
        </div>
      )}

      {/* Phase 5 reveal banner */}
      {phase === 5 && (
        <div
          className="px-4 py-3 text-center text-sm font-bold"
          style={{ background: 'rgba(139,26,26,0.4)', color: '#f8d5b0', borderTop: '1px solid rgba(176,34,34,0.4)' }}
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
      className="rounded-xl overflow-hidden cursor-pointer transition-all"
      style={{
        background: note.read ? 'rgba(17,24,39,0.6)' : 'rgba(139,26,26,0.15)',
        border: note.read
          ? '1px solid rgba(75,85,99,0.4)'
          : '1px solid rgba(176,34,34,0.4)',
      }}
      onClick={() => setExpanded((v) => !v)}
    >
      <div className="px-4 py-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {!note.read && (
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: '#b02222' }}
            />
          )}
          <span className="text-sm font-bold" style={{ color: '#e8dcc8' }}>
            {fromChar?.emoji} {note.from}
          </span>
        </div>
        <span className="text-xs text-gray-600">{time}</span>
      </div>
      {expanded && (
        <div className="px-4 pb-4">
          <p className="text-sm text-gray-200 leading-relaxed">{note.message}</p>
        </div>
      )}
    </div>
  );
}
