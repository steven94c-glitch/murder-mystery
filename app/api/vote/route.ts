import { NextRequest, NextResponse } from 'next/server';
import { getState, setState } from '@/lib/store';
import { CHARACTERS, getRequiredCharacters } from '@/lib/game-data';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { voter, suspect } = body as { voter: string; suspect: string };

  if (!voter || !suspect) {
    return NextResponse.json({ error: 'voter and suspect are required' }, { status: 400 });
  }

  const state = await getState();

  if (state.phase !== 4) {
    return NextResponse.json({ error: 'Voting is only open in phase 4' }, { status: 400 });
  }

  // Record vote
  state.votes[voter] = suspect;

  // Check if all required (non-victim) non-optional players have voted
  // We consider active characters + any optional characters who joined
  const allNonVictim = CHARACTERS.filter((c) => !c.isVictim);
  const requiredVoters = getRequiredCharacters(); // non-optional, non-victim

  // Also include any optional characters in activeCharacters
  const activeOptional = CHARACTERS.filter(
    (c) => c.isOptional && state.activeCharacters.includes(c.name)
  );

  const votersNeeded = [...requiredVoters, ...activeOptional].map((c) => c.name);
  const allVoted = votersNeeded.every((name) => state.votes[name]);

  if (allVoted && votersNeeded.length > 0) {
    state.votesRevealed = true;
  }

  await setState(state);
  return NextResponse.json({ success: true, votesRevealed: state.votesRevealed, votes: state.votes });
}
