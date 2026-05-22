import { NextRequest, NextResponse } from 'next/server';
import { getState, setState } from '@/lib/store';
import { HOST_PASSWORD } from '@/lib/game-data';

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (body.password !== HOST_PASSWORD) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }
  const state = await getState();
  if (state.phase >= 5) {
    return NextResponse.json({ error: 'Already at final phase' }, { status: 400 });
  }
  state.phase = state.phase + 1;
  await setState(state);
  return NextResponse.json(state);
}
