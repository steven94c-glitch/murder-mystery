import { NextRequest, NextResponse } from 'next/server';
import { resetState } from '@/lib/store';
import { HOST_PASSWORD } from '@/lib/game-data';

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (body.password !== HOST_PASSWORD) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }
  const state = await resetState();
  return NextResponse.json(state);
}
