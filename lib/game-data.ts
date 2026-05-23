import type { Character, PhaseInfo } from './types';

export const GAME_TITLE = 'Sand, Secrets & Sorrow: A Cape May Mystery';
export const SETTING =
  "Grammy's family beach house, Cape May NJ, Memorial Day weekend. Rain all weekend.";
export const VICTIM_NAME = 'Derek Hollis';
export const KILLER_NAME = 'Grammy';
export const HOST_PASSWORD = 'capemay2025';

export interface SideQuest {
  id: string;
  title: string;
  description: string;
  unlocksInPhase: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export const SIDE_QUESTS: SideQuest[] = [
  {
    id: 'missing-digoxin',
    title: 'Find the Missing Digoxin',
    description:
      "Someone saw Grammy take an extra dose of her heart medication Saturday afternoon, but a bottle is missing from her nightstand. Where is it? Who moved it, and why? (Clue: Grammy destroyed the bottle after taking the tablets.)",
    unlocksInPhase: 2,
    difficulty: 'easy',
  },
  {
    id: 'derek-real-purpose',
    title: "Derek's Real Purpose",
    description:
      "Derek claimed he was here for 'estate paperwork,' but multiple people had private conversations with him. What was he actually threatening people about? Confront him on his con and track what leverage he claimed to have on each family member.",
    unlocksInPhase: 2,
    difficulty: 'hard',
  },
  {
    id: 'kitchen-timeline',
    title: 'The Kitchen Timeline',
    description:
      "Who was in the kitchen between 7:30–8:00 PM? Get conflicting accounts from different people to establish the narrow window and challenge alibi stories.",
    unlocksInPhase: 2,
    difficulty: 'medium',
  },
  {
    id: 'clark-debt',
    title: "Clark's Secret Debt",
    description:
      'Clark borrowed $5,000 from Grammy weeks ago. Get him to admit it and explain why he needed the money urgently. Does it connect to Derek?',
    unlocksInPhase: 3,
    difficulty: 'medium',
  },
  {
    id: 'broken-alibi',
    title: 'The Broken Alibi',
    description:
      "Someone's story doesn't hold up under pressure. Find the inconsistency between what they claimed and what others saw. Who was not where they said they were?",
    unlocksInPhase: 3,
    difficulty: 'hard',
  },
];

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
      "The Keating family and friends have gathered at Grammy's beloved beach house for Memorial Day weekend. The rain hammers against the windows. Check your phones, read your character carefully, and get into character. This weekend will test everyone.",
    publicClues: [],
  },
  {
    number: 1,
    name: 'The Discovery (8:45 PM)',
    tvMessage:
      "Derek Hollis, 52, has been found unresponsive in the sitting room. The paramedics confirm he is gone. An empty cognac snifter sits on the side table — a faint bitter smell. This is now a murder investigation. Everyone has secrets. Everyone has motive.",
    publicClues: [
      "Derek Hollis, 52, arrived Saturday morning with 'urgent estate paperwork' for Grammy.",
      "Derek had been Grammy's financial advisor for 15 years — or at least, that's what everyone believed.",
      "Cause of death: cardiac arrest — consistent with poisoning.",
      "Derek had private one-on-one conversations with almost every adult in the house on Saturday.",
      "Derek's behavior Saturday: nervous, paranoid, making multiple phone calls in private.",
    ],
  },
  {
    number: 2,
    name: 'The Investigation',
    tvMessage:
      "New evidence has surfaced. Players with new clues — check your phones. Rooms are now searchable. Side quests are available for the determined investigator. This is where the real investigation begins. Nothing is as simple as it appears.",
    publicClues: [
      "Derek's briefcase contains financial documents showing large, unauthorized transfers from Grammy's trust fund to a shell company over THREE YEARS. Amount: $340,000+.",
      "Grammy takes digoxin daily (a heart medication) — one tablet per day. Two doses are missing from Saturday's medication organizer.",
      "Derek was systematically leveraging family members with private information — different threats for different people.",
      "Timeline: Derek alone in sitting room 7:45–8:30 PM with cognac. Dead by 8:30 PM. Who had access to the kitchen between 7:30–8:00 PM?",
      "An empty cognac snifter found near Derek — smells faintly bitter and chemical. Residue testing pending.",
      "Multiple inconsistencies in people's accounts of their locations between 7:30–8:00 PM.",
    ],
  },
  {
    number: 3,
    name: 'Confrontations',
    tvMessage:
      "It's time for confrontations. Players may now make formal accusations and present evidence. The accused will respond with their own evidence and alibi challenges. Other players can jump in. This is a debate — bring your clues. Who will break under pressure? Check your phones for your final clues and hidden evidence.",
    publicClues: [
      "Derek had financial leverage against nearly everyone in this house — different secrets, different threats.",
      "Multiple people had motive: Derek was blackmailing, extorting, and threatening family members over financial matters.",
      "Multiple people had opportunity: The kitchen was accessible to several people between 7:30–8:00 PM.",
      "The poisoned cognac shows digoxin residue — but who had access to Grammy's medication? Who knew about it?",
      "Alibi challenge: Who claims they were where? Who can verify it? What gaps exist?",
      "The digoxin bottle from Grammy's nightstand is missing. Destroyed? Hidden? Never destroyed? Key question.",
    ],
  },
  {
    number: 4,
    name: 'The Final Vote',
    tvMessage:
      "Cast your vote on your phone. Who killed Derek Hollis? You must prove your case with evidence. Wrong accusations have consequences — your reputation, your theory, your credibility.",
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
    role: 'Suspect',
    bio: "Dorothy 'Grammy' Keating, 78. The beloved matriarch. She's run this Cape May beach house for 40 years with warmth, sharp wit, and an iron will. This was supposed to be another perfect family weekend.",
    secret:
      "THE KILLER. You discovered three months ago that Derek Hollis had been systematically embezzling from your trust fund for years — over $340,000 gone to a shell company. You had your private accountant confirm it. Saturday morning, Derek arrived unannounced. He cornered you in the study and made his move: 'You expose me, and I destroy your family. Years of legal proceedings. Your entire estate tied up. Your grandchildren watching it fall apart.' He wasn't bluffing. He had leverage on your entire family — financial information on Doug, threatening information on Evan, compromising details on others. You made your choice. Around 7:45 PM, while everyone transitioned from dinner to dessert, you went to the kitchen. You took two of your digoxin tablets from your Saturday dose, crushed them, and stirred them into a fresh cognac snifter. You brought it to Derek yourself in the sitting room. 'You look stressed,' you said. 'This might help.' He drank it without hesitation. By 8:30 PM, his heart had stopped. You destroyed the digoxin bottle afterward. You have spent the last hours playing the confused, grieving grandmother. But you are clearheaded. You made the right choice to protect your family. You would make it again.",
    alibi: 'I was in and out of the kitchen most of the evening, clearing dinner and preparing dessert.',
    phaseClues: {
      1: "Derek arrived this morning looking nervous and agitated. But not just nervous — paranoid. He had 'important estate documents' but kept watching you to gauge your reaction.",
      2: "You took an extra dose of your heart medication before dinner. Two tablets instead of one. Your hands are steady. Your mind is clear. You made the right choice. That bottle from your nightstand is gone now.",
      3: "Nan saw your calm. Annie saw your resolve. Liz saw you bring Derek that cognac. But here's the truth: Derek was a threat that had to be eliminated. He wasn't going to stop. He was going to destroy everything and everyone. You protected your family the only way that mattered.",
    },
  },
  {
    name: 'Liz',
    emoji: '⭐',
    role: 'Key Witness',
    bio: "Liz — daughter of Doug and Nan, 32. Recently started a great new job and is truly living her best life. Came into the weekend excited and carefree. But one detail she noticed may be the most crucial evidence.",
    secret:
      "You worked for Derek as a paralegal 8 months ago. You quit abruptly after discovering financial irregularities in his client accounts — something deeply unethical. You never reported it, which haunts you. This weekend, you recognized Derek immediately when he arrived. You've been avoiding him all day, horrified and terrified he'd bring up your brief time working for him and why you really quit. Derek approached you Saturday morning and hinted: 'I know why you really left. That documentation you were looking at? I know what you saw. And who else might want to know.' You're terrified. Around 7:45 PM, you witnessed something crucial: you saw Grammy move toward the kitchen with a specific expression — not upset, not confused. Resolved. Purposeful. Then minutes later, you saw Derek accept a drink from Grammy. She was smiling. Sad. Resigned. Like she'd made a decision and was at peace with it.",
    alibi: 'I was in the living room with Kelly most of the evening. I went to the bathroom around 7:45 PM for a few minutes.',
    phaseClues: {
      1: "You know Derek better than anyone in this house realizes. His 'estate documents' are definitely a con — you've seen his work before. He's a skilled manipulator.",
      2: "Around 7:45 PM, you saw Grammy head to the kitchen. You remember it vividly. Her face. The way she moved. Determined. Not frantic. Deliberate.",
      3: "Minutes later, Derek accepted a drink from Grammy herself. She handed it to him personally. Her expression was almost peaceful. Like she'd crossed a threshold she couldn't uncross.",
    },
  },
  {
    name: 'Annie',
    emoji: '🤰',
    role: 'Observer',
    bio: "Annie — 34 weeks pregnant, Steve's wife, friend of the family. Running on pure pregnancy instinct and hyperawareness. Has been reading every room all weekend with unsettling accuracy.",
    secret:
      "Your pregnancy hyperawareness has been in overdrive all weekend. Saturday afternoon, you overheard Derek and Grammy arguing intensely in the study. Derek said: 'You can't afford to fight me on this, Dorothy. Not if you want to protect them. Evan, Doug, all of them. I have documentation.' Grammy responded with silence. Chilling silence. That's when you knew something terrible was about to happen. Around 7:15 PM, you saw Grammy in the hallway. Her face was different — not upset. Resolved. Like someone who'd made an irreversible decision and was at peace with it. Around 7:45 PM, you watched Grammy move through the kitchen with focused intention — not casual, not stressed. Deliberate movements of someone with purpose. Then you saw her bring a cognac snifter to Derek in the sitting room. Her hand was steady. She smiled at him — sad, resigned. Like goodbye.",
    alibi: 'I was in the living room and dining area all evening, mostly with Steve.',
    phaseClues: {
      1: "That argument was not normal family dispute. Derek was systematically threatening Grammy with information about the whole family. The threat was existential.",
      2: "After that argument, Grammy's demeanor changed completely. Not panicked. Not confused. Resolved. At peace. That was the moment you understood.",
      3: "You watched Grammy bring Derek that drink yourself. You saw her face. You saw his accept it without question. You knew in that moment something was happening that couldn't be undone.",
    },
  },
  {
    name: 'Steve',
    emoji: '🔍',
    role: 'Observer',
    bio: "Steve — 35, Annie's husband, friend of the family. Easygoing background observer. Worked in finance for 10 years before switching careers. His analytical mind still catches inconsistencies others miss.",
    secret:
      "You worked in finance for a decade. When Derek showed up with his 'estate documents,' every alarm bell went off. The signatures don't match across documents. The dates are inconsistent (one says 2019, another references 2022 transfers that didn't exist). The letterhead formatting is slightly off — professional forgery, but still forgery. Derek is running a sophisticated con — you'd stake your career on it. But what is he actually doing? Saturday afternoon around 7:00 PM, you overheard Derek on his phone in the garden. He said: 'The old woman has no idea how exposed she is. I've got documentation on all of them. This weekend seals it.' He sounded cold. Confident. Threatening. Like someone holding all the cards. That's when you realized this wasn't just about Grammy — Derek had leverage on the entire family and was planning to use it.",
    alibi: 'I was in the living room with Annie all evening.',
    phaseClues: {
      1: "Those documents are sophisticated forgery. Derek is definitely running a con on this family. But here's what you realize: he may have real documentation on someone, even if his 'estate papers' are fake.",
      2: "You heard Derek on the phone. He sounded like someone closing a deal. Like he was about to make moves against multiple people. He felt powerful.",
      3: "Derek had leverage. Real leverage on real people. He was going to use it. And Grammy knew that.",
    },
  },
  {
    name: 'Nan',
    emoji: '🌸',
    role: 'Suspect',
    bio: "Nan Keating — 58, Doug's wife, Liz's mom. Warm, perceptive, the emotional center of her family. Has been quietly observing all weekend with unsettling accuracy.",
    secret:
      "You noticed Grammy took an extra dose of her heart medication before dinner — two tablets instead of her usual one. You asked about it, and Grammy said it was probably just weekend stress. But you know Grammy. You watched her face when Derek arrived. You saw the moment she realized what he was. Around 7:15 PM, after her private argument with Derek in the study, you encountered Grammy in the hallway. She was eerily calm. Not distressed. Not angry. Resigned. At peace. Like she'd made a decision that brought her clarity. You knew something had shifted. You even asked her if she was okay, and she said: 'I'm protecting my family. That's all that matters.' At 7:30 PM, you started clearing dishes with Liz. Around 7:45 PM, you stepped into the kitchen briefly and saw Grammy moving around with focused intention — checking cognac bottles, selecting one, her movements deliberate and calm.",
    alibi: 'I was helping clear dishes from dinner. I was in and out of the kitchen between 7:30–8:00 PM.',
    phaseClues: {
      1: "Grammy's medication. Two tablets. At the time it seemed minor. Now you understand: she was preparing for something.",
      2: "Grammy's expression after that argument with Derek — it wasn't anger or fear. It was resolve. Acceptance. Peace. That's when her decision was made.",
      3: "Grammy said she was protecting her family. Not herself. The family. Derek was a threat she chose to eliminate.",
    },
  },
  {
    name: 'Doug',
    emoji: '💰',
    role: 'Suspect',
    bio: "Doug Keating — 60, Grammy's son, Liz's father, Nan's husband. Salt-of-the-earth, hardworking, carrying financial stress. Has been quietly tense all weekend.",
    secret:
      "Three weeks ago, you borrowed $5,000 from Grammy. You haven't told Nan. Bad investment losses, some debt on your end, and you needed cash fast without questions. Grammy gave it to you. No judgment. Saturday morning, Derek cornered you and said: 'I know about your money problems. I know you borrowed from Grammy. I also know about those losses. For $10,000, I can make it all go away — falsify some documents, make it look like the investments recovered.' He was blackmailing you. Using Grammy's money as leverage. You refused and told him to go to hell. Then you immediately reported it to Grammy. You have motive — strong motive. But you didn't do it. Grammy did. Because Derek knew too much about too many people.",
    alibi: 'I was in the living room with John most of the evening.',
    phaseClues: {
      1: "Derek tried to extort money from you using information he shouldn't have had. You refused and told Grammy immediately. Yes, you have motive.",
      2: "You're a suspect because Derek was threatening you. But Derek was threatening everyone. The question is: who decided to end that threat?",
      3: "Grammy protected all of us. She discovered Derek's embezzlement. She learned about his leverage on every single family member. And she made a choice.",
    },
  },
  {
    name: 'John',
    emoji: '🏠',
    role: 'Suspect',
    bio: "John Keating — 62, Grammy's older son, Clark and Evan's father. Solid, dependable, the patriarch of the family. Reserved and observant.",
    secret:
      "Three months ago, Grammy confided in you that she was 'dealing with a financial situation that needs careful handling.' She didn't elaborate, but you could see the weight of it on her. She said: 'Don't worry. I'm handling it. But I need you to know that whatever happens, I'm doing it to protect all of us.' You didn't push for details. You trusted her. Now, seeing Derek here, watching his behavior, you're piecing it together. Derek was somehow involved. Grammy discovered something. Derek threatened her. Grammy made a choice. Saturday evening, you were on the front porch most of the time, but around 7:45 PM, you came inside briefly. You saw Grammy moving with purpose toward the kitchen. Not her normal evening movements. Then minutes later, you saw Derek accept a drink from her. His gratitude was immediate. Within the hour, he was dead.",
    alibi: 'I was on the front porch most of the evening, came inside briefly around 7:45 PM.',
    phaseClues: {
      1: "Grammy told you months ago something was wrong with her finances. You trusted her to handle it. You were right to trust her.",
      2: "Derek's arrival today confirmed your fears. Whatever Grammy had been handling, Derek was part of it.",
      3: "Grammy made a choice. Not out of anger. Out of protection. She protected this family the only way that mattered.",
    },
  },
  {
    name: 'Kelly',
    emoji: '💐',
    role: 'Suspect',
    bio: "Kelly — 31, Evan's fiancée, bright and funny, completely smitten. Has been glowing all weekend, blissfully unaware of family tensions.",
    secret:
      "Saturday afternoon, you overheard Derek on his phone in the garden. He said: 'Yeah, the whole family's got weaknesses. The old woman, the invested son, the fiancée with her own financial baggage — everyone's got something. This weekend I collect.' He was cataloging leverage. On you too. Apparently Derek dug into backgrounds and found something about your financial past that you haven't told Evan about — a bankruptcy scare three years ago that you resolved quietly. Derek was planning to use it as leverage. That terrified you. You suddenly realized Derek wasn't just a family friend visiting — he was a predator hunting for weaknesses in everyone here. Around 7:45 PM, you were in the living room. You saw Grammy pass by with focused intention. You saw Liz look at you knowingly. Something shifted in the room's energy. By 8:30 PM, Derek was gone.",
    alibi: 'I was in the living room with Liz and Evan most of the evening.',
    phaseClues: {
      1: "Derek was systematically gathering dirt on everyone. He had things on you that you haven't even told Evan. He was building leverage on the entire family.",
      2: "When you heard that phone call, you realized Derek was genuinely dangerous. Not just difficult. Dangerous.",
      3: "Grammy figured out the scope of what Derek was doing. She understood he wasn't going to stop. She made her choice.",
    },
  },
  {
    name: 'Clark',
    emoji: '🏄',
    role: 'Suspect',
    bio: "Clark Keating — 34, Evan's older brother, son of John and Judy. Laid-back, funny, the family stress-reliever who hides real financial problems.",
    secret:
      "You introduced Derek to the family six years ago at a Philadelphia charity event. He was charming, successful, seemed legitimate. You had no idea. Saturday morning, Derek pulled you aside privately and said: 'I know about your financial struggles with that business venture. I have documentation from your accountant's files. For the right price, I can make certain documents disappear.' He was blackmailing you about your failed investment. Then he added: 'I could also help restructure your inheritance expectations. Your father has significant assets, and I'm sure he'd want to know how you've been handling your finances.' He was threatening to expose you to your father. You tried to brush it off, but Derek was cold, systematic. He'd done his homework. Later that afternoon, you asked Evan if Derek had approached him about money. Evan said yes. Then you realized Derek was working the entire family. Every single person had some financial vulnerability Derek had identified and was preparing to exploit.",
    alibi: 'I was in the living room with Evan most of the evening.',
    phaseClues: {
      1: "You introduced Derek to this family. That guilt weighs on you. But Derek became a systematic predator, threatening everyone with financial information.",
      2: "Derek had detailed knowledge of your financial troubles. He was planning to use it unless you paid him.",
      3: "Grammy discovered the full scope of Derek's plan. She understood he wouldn't stop. She chose to protect the family the only way that mattered.",
    },
  },
  {
    name: 'Kara',
    emoji: '🎂',
    role: 'Red Herring',
    bio: "Kara — 28, Clark's girlfriend, talented baker. Brought Grammy's favorite lemon pound cake for dessert. Now terrified she might be involved.",
    secret:
      "You baked an elaborate lemon pound cake for after dinner using only fresh ingredients from ShopRite this morning. Flour, sugar, butter, eggs, lemon zest, lemon juice, vanilla extract. Nothing exotic. Nothing from the house. Derek had a large slice with coffee after dinner. Now he's dead, and you are absolutely terrified. Your mind spirals: Did the lemon zest have something in it? Did someone tamper with the cake somehow? But you know that's impossible — you baked it this morning and brought it directly. You know it wasn't your cake. But the guilt is eating you alive anyway. You were the one who brought dessert. You were the one who watched Derek eat it. Around 8:00 PM, Grammy asked you to brew coffee. You were in the kitchen briefly, then brought coffee to Derek. By 8:30 PM, he was dead. Could you have been used? Could someone have poisoned him while you were involved?",
    alibi: 'I was in the kitchen and living room all evening. I brewed coffee around 7:55 PM.',
    phaseClues: {
      1: "Your cake ingredients: flour, sugar, butter, eggs, lemon zest, lemon juice, vanilla. All from ShopRite this morning. All fresh. Your cake is innocent.",
      2: "You're a prime suspect because you baked his dessert and brewed his coffee. But you are innocent. The evidence will show that.",
      3: "The poison was not in food. The poison was in his cognac — a liquid, a medication-based toxin. Your cake has nothing to do with this.",
    },
  },
  {
    name: 'Evan',
    emoji: '💍',
    role: 'Suspect',
    bio: "Evan Keating — 30, son of John and Judy, recently engaged to Kelly. Warm, competitive, fiercely loyal, suddenly worried about inheritance.",
    secret:
      "Derek pulled you aside before dinner and said: 'Congratulations on the engagement. But here's something you should know: your inheritance is being restructured. Your father has been making decisions about the family finances that might affect your expectations. I have documentation. You should ask Grammy about it.' He planted the seed of doubt and walked away. You immediately confronted Grammy privately. She said: 'Don't worry about Derek. Everything will be taken care of. Your future is secure. Trust me.' At the time you thought she meant she'd protect your inheritance somehow. Then she said something strange: 'I'm going to handle the Derek situation. After tonight, you won't need to worry about anything he might have said or threatened.' You assumed she meant legal action. Now you realize she meant something much more direct. You were a target of Derek's leverage, and Grammy protected you.",
    alibi: 'I was in the living room with Kelly most of the evening.',
    phaseClues: {
      1: "Derek threatened your financial future before dinner. That gives you motive. But so do a lot of people.",
      2: "Grammy told you she'd handle Derek. She told you not to worry. Then Derek died.",
      3: "Grammy protected you. Grammy protected all of us. She took action to end the threat that Derek represented.",
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
