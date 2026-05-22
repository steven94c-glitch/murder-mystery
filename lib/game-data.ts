import type { Character, PhaseInfo } from './types';

export const GAME_TITLE = 'Sand, Secrets & Sorrow: A Cape May Mystery';
export const SETTING =
  "Grammy's family beach house, Cape May NJ, Memorial Day weekend. Rain all weekend.";
export const VICTIM_NAME = 'Derek Hollis';
export const KILLER_NAME = 'Grammy';
export const HOST_PASSWORD = 'capemay2025';

export const KILLER_REVEAL_TEXT = `GRAMMY DID IT.

Three months ago, Grammy's private accountant confirmed what she suspected: Derek Hollis had been systematically embezzling from her trust fund for three years. Over $340,000 gone.

Saturday morning, Derek arrived unannounced at the beach house. He knew she'd discovered the theft. In private, he cornered her. He said: "You expose me, I destroy your family. Years of legal proceedings. Your entire estate tied up. Your grandchildren watching it all fall apart."

Grammy was faced with a choice: lose her wealth fighting Derek in courts, or protect her family another way.

Around 7:45 PM, while the family transitioned from dinner to dessert, Grammy went to the kitchen. She took two of her digoxin tablets (her heart medication), crushed them, and stirred them into a fresh cognac. She brought it to Derek herself in the sitting room. "You look stressed," she said. "This might help."

Derek drank it. By 8:30 PM, his heart had stopped.

Grammy has spent the last few hours playing the confused, grieving family matriarch. But she is clearheaded. She made her decision to protect her family from Derek's threats, and she'd make it again.

THE EVIDENCE:
• Derek's embezzlement documents in his briefcase showing $340K+ transfers to a shell company
• Grammy's accountant report in her bedroom detailing 3 years of theft
• Two missing digoxin tablets from Grammy's Saturday medication dose
• Grammy's medication organizer on the kitchen counter — Monday's dose incomplete
• The empty cognac snifter in the sink, smelling faintly bitter
• Digoxin residue detected on the killer's hands
• Nan's observation of Grammy's eerie, resigned calm after arguing with Derek
• The threatening letter Derek was writing before he died: "You have 24 hours to decide..."
• Multiple witnesses confirming Derek's private threats and financial pressure on family members

Grammy made her choice to protect her family. She is a victim of Derek's extortion as much as anyone else — but she chose to end the threat.`;

export const PHASES: PhaseInfo[] = [
  {
    number: 0,
    name: "Welcome to Cape May",
    tvMessage:
      "The Keating family and friends have gathered at Grammy's beloved beach house for Memorial Day weekend. The rain hammers against the windows. Check your phones, read your character carefully, and get into character.",
    publicClues: [],
  },
  {
    number: 1,
    name: 'The Discovery (8:45 PM)',
    tvMessage:
      "Derek Hollis, 52, has been found unresponsive in the sitting room. The paramedics confirm he is gone. An empty cognac snifter sits on the side table — a faint bitter smell. This is now a murder investigation.",
    publicClues: [
      "Derek Hollis, 52, arrived Saturday morning with 'urgent estate paperwork' for Grammy.",
      "Derek had been Grammy's financial advisor for 15 years.",
      "Cause of death: cardiac arrest — consistent with poisoning.",
      "Derek had private conversations with multiple family members on Saturday.",
    ],
  },
  {
    number: 2,
    name: 'The Investigation',
    tvMessage:
      "New evidence has surfaced. Players with new clues — check your phones. Rooms are now searchable. It's time to start investigating.",
    publicClues: [
      "Derek's briefcase contains financial documents showing large, unauthorized transfers from Grammy's trust fund to a shell company.",
      "Grammy takes digoxin daily — a heart medication that can cause cardiac arrest in high doses.",
      "Derek had been making private threats and financial pressure on multiple family members throughout the day.",
      "Derek's final hour: he was alone in the sitting room with a cognac at 7:45 PM, dead by 8:30 PM.",
    ],
  },
  {
    number: 3,
    name: 'Confrontations',
    tvMessage:
      "It's time for confrontations. Players may now make formal accusations. The accused must respond. Check your phones for your final clues.",
    publicClues: [
      "Derek had motive and leverage against nearly everyone — he was blackmailing multiple family members using financial information.",
      "Multiple people had access to the kitchen and cognac bottles between 7:30–8:00 PM.",
      "The poisoned cognac glass shows digoxin residue — traced to someone who handled Grammy's medication.",
      "Two of Grammy's digoxin tablets are missing from her Saturday medication dose.",
    ],
  },
  {
    number: 4,
    name: 'The Final Vote',
    tvMessage:
      "Cast your vote on your phone. Who killed Derek Hollis? Choose wisely — truth demands justice.",
    publicClues: [],
  },
  {
    number: 5,
    name: 'The Revelation',
    tvMessage: KILLER_REVEAL_TEXT,
    publicClues: [],
  },
];

export const CHARACTERS: Character[] = [
  {
    name: 'Grammy',
    emoji: '👵',
    role: 'Killer',
    bio: "Dorothy 'Grammy' Keating, 78. The beloved matriarch. She's run this Cape May beach house for 40 years with warmth, sharp wit, and an iron will. This was supposed to be another perfect family weekend.",
    secret:
      "THE KILLER. You discovered three months ago that Derek Hollis had been embezzling from your trust fund for years — over $340,000. You had your private accountant confirm it. Saturday morning, Derek arrived unannounced. He cornered you in the study and made his move: 'You expose me, and I destroy your family. Years of legal proceedings. Your entire estate tied up. Your grandchildren watching it fall apart.' You made your choice. Around 7:45 PM, while everyone transitioned from dinner to dessert, you went to the kitchen. You took two of your digoxin tablets, crushed them, and stirred them into a fresh cognac. You brought it to Derek in the sitting room. 'You look stressed,' you said. 'This might help.' He drank it. By 8:30 PM, his heart had stopped. You have spent the last hours playing the confused, grieving grandmother. But you are clearheaded. You made the right choice.",
    alibi: 'I was clearing up from dinner and preparing dessert with the family.',
    phaseClues: {
      1: "Derek arrived this morning looking nervous and agitated. He had 'important estate documents' for you — but they looked fabricated.",
      2: "You took an extra dose of your heart medication before dinner. Your hands are steady. Your mind is clear. You made the right choice.",
      3: "Nan noticed you seemed surprisingly calm after your argument with Derek. Of course you were calm. Your decision was made. The threat was resolved.",
    },
  },
  {
    name: 'Liz',
    emoji: '⭐',
    role: 'Key Witness',
    bio: "Liz — daughter of Doug and Nan. Recently started a great new job and is truly living her best life. Came into the weekend excited and carefree. One detail she noticed may be crucial.",
    secret:
      "You worked for Derek as a paralegal 8 months ago. You quit abruptly after you discovered financial irregularities in his client accounts — something deeply unethical. You never reported it, which still haunts you. This weekend, you recognized Derek immediately when he arrived. You've been avoiding him all day, horrified that he's here.",
    alibi: 'I was in the living room most of the evening. I stepped away briefly around 7:45 PM.',
    phaseClues: {
      1: "You know Derek better than anyone in this house realizes. His 'estate documents' are a con — you've seen his work before.",
      2: "Around 7:45 PM, you saw Grammy go to the kitchen with a particular expression on her face. Not upset — resolved. Purposeful.",
      3: "You also saw Derek accept a drink from Grammy a few minutes later. She was smiling. Almost sad. Like she'd made a final decision.",
    },
  },
  {
    name: 'Annie',
    emoji: '🤰',
    role: 'Observer',
    bio: "Annie — 34 weeks pregnant, Steve's wife, friend of the family. Running on pure pregnancy instinct. Has been reading every room all weekend with hyperawareness.",
    secret:
      "Your pregnancy hyperawareness has been in overdrive all weekend. Saturday afternoon, you overheard Derek and Grammy arguing intensely in the study. You heard Derek say: 'You can't afford to fight me on this, Dorothy. Not if you want to protect them.' Grammy said nothing back. But the tone was chilling.",
    alibi: 'I was in the living room and dining area all evening.',
    phaseClues: {
      1: "That argument you overheard was not a normal family dispute. Derek was threatening her. And Grammy responded with a kind of quiet acceptance.",
      2: "Around 7:45 PM, you noticed Grammy moving around the kitchen with focused intention. Not casual. Deliberate.",
      3: "You also noticed Grammy's expression when she brought Derek his drink. It was the same expression she had after the argument — like she'd already decided something irreversible.",
    },
  },
  {
    name: 'Steve',
    emoji: '🔍',
    role: 'Observer',
    bio: "Steve — Annie's husband, friend of the family. Easygoing background observer. Worked in finance for 10 years before switching careers. Sometimes you notice things others miss.",
    secret:
      "You worked in finance for a decade before switching careers. When Derek showed up with his 'estate documents,' something immediately struck you as off. The signatures don't match. The dates are inconsistent. The letterhead formatting is wrong. Derek is running a con — you'd stake your career on it. But what is he conning?",
    alibi: 'I was in the living room all evening.',
    phaseClues: {
      1: "Those documents Derek brought are not legitimate. You'd bet your professional reputation on it. The question is: what is Derek actually here to do?",
      2: "Around 7:00 PM, you overheard Derek on his phone in the garden saying something like: 'The old woman has no idea how exposed she is. This weekend seals it.' He sounded confident. Threatening.",
      3: "Derek was running a scam. Grammy figured it out. And Grammy made a choice about how to handle it.",
    },
  },
  {
    name: 'Nan',
    emoji: '🌸',
    role: 'Suspect',
    bio: "Nan Keating — Doug's wife, Liz's mom. Warm, perceptive, the emotional center of her family. Has been quietly observing all weekend.",
    secret:
      "You noticed Grammy took an extra dose of her heart medication before dinner. When you asked about it, Grammy said she was fine — probably just the weekend stress. But then around 7:15 PM, after her private argument with Derek in the study, you saw Grammy. She was eerily calm. Resigned. Like she'd made a decision that brought her peace.",
    alibi: 'I was helping clear dishes from dinner around 7:30–8:00 PM.',
    phaseClues: {
      1: "Grammy's medication. Two tablets instead of one. At the time it seemed like a minor thing. Now it seems significant.",
      2: "Grammy's expression after her argument with Derek — it wasn't anger or fear. It was acceptance. Resolve.",
      3: "Think about what Grammy might have been protecting. Not herself. Her family. Derek was threatening her family.",
    },
  },
  {
    name: 'Doug',
    emoji: '💰',
    role: 'Suspect',
    bio: "Doug Keating — Grammy's son, Liz's father, Nan's husband. Salt-of-the-earth, hardworking. Has been quiet and tense all weekend.",
    secret:
      "Derek cornered you Saturday morning and said he knew about your recent financial problems — bad investment losses. He implied he could 'make problems go away' for a fee. He was blackmailing you. You told him to get lost and reported him to Grammy. You have a strong motive to want Derek gone, but you didn't do it. Grammy did.",
    alibi: 'I was in the living room most of the evening.',
    phaseClues: {
      1: "Derek tried to extort money from you this morning. You refused and told Grammy immediately.",
      2: "You're a suspect because you had motive. But so does everyone else Derek threatened.",
      3: "Grammy was protecting all of us. That's what this is really about.",
    },
  },
  {
    name: 'John',
    emoji: '🏠',
    role: 'Suspect',
    bio: "John Keating — Grammy's other son, Clark and Evan's father. Solid, dependable. The patriarch of the family.",
    secret:
      "Grammy confided in you three months ago that she was 'dealing with a situation regarding her finances.' She didn't elaborate, but she seemed worried. Now you're piecing it together — Derek was involved. Grammy discovered his theft. Derek threatened her. Grammy chose to end the threat rather than let it destroy the family.",
    alibi: 'I was on the front porch most of the evening.',
    phaseClues: {
      1: "Grammy told you three months ago something was wrong with her finances. She was handling it, she said. But you could see the weight of it.",
      2: "Derek showed up today claiming to have 'urgent estate documents.' That's when you knew something was very wrong.",
      3: "Grammy made a choice to protect this family. She's not the victim here — Derek is.",
    },
  },
  {
    name: 'Kelly',
    emoji: '💐',
    role: 'Suspect',
    bio: "Kelly — Evan's fiancée. Bright, funny, completely smitten. Has been glowing all weekend.",
    secret:
      "You overheard Derek on his phone in the garden Saturday afternoon. He said something like: 'Yeah, the whole family's got weaknesses. The old woman, the grandson's fiancée, everyone.' He was talking about finding leverage on everyone, including you. That scared you deeply. What does Derek think he knows about you?",
    alibi: 'I was in the living room most of the evening.',
    phaseClues: {
      1: "Derek was gathering dirt on everyone in this family. He had something on you — you're not sure what, but he knew.",
      2: "When you heard Derek on that phone call, you realized he was dangerous. To everyone.",
      3: "Grammy figured out Derek was a threat. She neutralized the threat.",
    },
  },
  {
    name: 'Clark',
    emoji: '🏄',
    role: 'Suspect',
    bio: "Clark Keating — Evan's older brother, son of John and Judy. Laid-back, funny, always the family stress-reliever.",
    secret:
      "Derek introduced himself to you this morning and immediately mentioned he knew about your family's financial situation. He hinted he could help with 'restructuring' for a fee. That's when you realized Derek wasn't just here for Grammy — he was here to leverage the entire family. You felt guilty introducing Derek to the family years ago at a charity event, like this is somehow your fault.",
    alibi: 'I was in the living room all evening.',
    phaseClues: {
      1: "You introduced Derek to the family years ago at a charity event. You had no idea what he'd become.",
      2: "When Derek showed up today and started talking about 'restructuring,' you realized the scope of what he was doing.",
      3: "Grammy found out and took action. She protected the family.",
    },
  },
  {
    name: 'Kara',
    emoji: '🎂',
    role: 'Red Herring',
    bio: "Kara — Clark's girlfriend, loves to bake. Brought Grammy's favorite lemon pound cake for dessert.",
    secret:
      "You baked an elaborate lemon pound cake for after dinner using only fresh ingredients from ShopRite this morning. Derek had a large slice with coffee. Now he's dead, and you are absolutely terrified that somehow, your cake poisoned him. But you used only fresh ingredients. You know it wasn't your cake. But the guilt is eating you alive.",
    alibi: 'I was in the kitchen and living room all evening.',
    phaseClues: {
      1: "You used: flour, sugar, butter, eggs, lemon zest, lemon juice, vanilla. All from ShopRite this morning. Nothing from the garden. Your cake is innocent.",
      2: "You are a prime suspect — but you are innocent. Derek died of poison, and your cake had nothing to do with it.",
      3: "The poison was in his cognac, not your cake. The poison was a medication-based toxin, not food-based.",
    },
  },
  {
    name: 'Evan',
    emoji: '💍',
    role: 'Suspect',
    bio: "Evan Keating — son of John and Judy, recently engaged to Kelly. Warm, competitive, fiercely loyal.",
    secret:
      "Derek pulled you aside before dinner and said: 'Your inheritance is being 'restructured.' Don't expect it to be what you thought.' You immediately confronted Grammy. She told you not to worry — everything would be 'taken care of.' At the time you thought she meant your inheritance. Now you realize she meant something much darker.",
    alibi: 'I was in the living room with Kelly most of the evening.',
    phaseClues: {
      1: "Derek threatened your financial future this morning. That gives you motive.",
      2: "Grammy told you not to worry — she'd take care of it. She did.",
      3: "Grammy protected you. She protected all of us.",
    },
  },
  {
    name: 'Matt',
    emoji: '🍺',
    role: 'Observer',
    isOptional: true,
    bio: "Matt — friend of the family from the Philly area. Doesn't know the Keatings as well as everyone else. Has been watching with fresh eyes all weekend.",
    secret:
      "You've known Derek casually for years — both from the Philadelphia area. You never liked him. Never trusted him. So when he showed up this weekend, you paid attention. You noticed he seemed nervous and paranoid all day Saturday. He kept looking over his shoulder. Making private phone calls. You thought he was in trouble. Now you know why — Grammy was deciding whether to expose him.",
    alibi: 'I was on the back porch most of the evening.',
    phaseClues: {
      1: "Derek was nervous all day. Paranoid. Like someone was closing in on him.",
      2: "You could see it in his body language — he was scared of something. Or someone.",
      3: "Grammy knew what Derek had done. Derek knew Grammy knew. The confrontation was inevitable.",
    },
  },
];

export function getCharacterByName(name: string): Character | undefined {
  return CHARACTERS.find(
    (c) => c.name.toLowerCase() === name.toLowerCase()
  );
}

export function getAllSuspects(): Character[] {
  return CHARACTERS.filter((c) => !c.isVictim);
}

export function getRequiredCharacters(): Character[] {
  return CHARACTERS.filter((c) => !c.isOptional && !c.isVictim);
}

export function getCumulativePublicClues(upToPhase: number): string[] {
  const clues: string[] = [];
  for (let i = 1; i <= upToPhase && i <= 5; i++) {
    const phase = PHASES.find((p) => p.number === i);
    if (phase) {
      clues.push(...phase.publicClues);
    }
  }
  return clues;
}

export function getPhaseInfo(phase: number): PhaseInfo {
  return PHASES.find((p) => p.number === phase) ?? PHASES[0];
}
