import { NextRequest, NextResponse } from 'next/server';
import { getState, setState } from '@/lib/store';
import type { Note } from '@/lib/types';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const character = searchParams.get('character');
  if (!character) {
    return NextResponse.json({ error: 'character param required' }, { status: 400 });
  }

  const state = await getState();
  const notes = state.notes.filter(
    (n) => n.to.toLowerCase() === character.toLowerCase()
  );
  // Sort unread first, then by timestamp
  notes.sort((a, b) => {
    if (a.read !== b.read) return a.read ? 1 : -1;
    return b.timestamp - a.timestamp;
  });
  return NextResponse.json({ notes });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { from, to, message } = body as { from: string; to: string; message: string };

  if (!from || !to || !message) {
    return NextResponse.json({ error: 'from, to, and message are required' }, { status: 400 });
  }

  const state = await getState();

  const note: Note = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    from,
    to,
    message,
    timestamp: Date.now(),
    read: false,
  };

  state.notes.push(note);
  await setState(state);
  return NextResponse.json({ success: true, note });
}
