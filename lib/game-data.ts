import type { Character, PhaseInfo } from './types';

export const GAME_TITLE = 'The Gilded Deception: A Cape May Art Gala Mystery';
export const SETTING =
  "Arabella Ashford-Cross's exclusive Cape May estate, a lavish 1920s mansion. An intimate weekend gala celebrating the acquisition of a priceless Impressionist masterpiece. Rain all weekend.";
export const VICTIM_NAME = 'Vladimir Karpov';
export const KILLER_NAME = 'Arabella Ashford-Cross';
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
    id: 'forged-paintings',
    title: 'The Forged Paintings',
    description:
      "Vladimir was examining certain paintings in Arabella's collection and making notes about 'provenance issues.' What did he discover? Which paintings were questionable? Find evidence of the forgeries.",
    unlocksInPhase: 2,
    difficulty: 'hard',
  },
  {
    id: 'blackmail-scheme',
    title: "Vladimir's Leverage",
    description:
      "Vladimir was a sophisticated con man who used secrets as currency. What did he know about each guest? What was he threatening people with? Track the leverage he had on everyone.",
    unlocksInPhase: 2,
    difficulty: 'hard',
  },
  {
    id: 'library-timeline',
    title: 'The Library Timeline',
    description:
      "Who was in the library/study between 7:45–8:15 PM when Vladimir was examining the paintings? Get conflicting accounts and establish who had access to him.",
    unlocksInPhase: 2,
    difficulty: 'medium',
  },
  {
    id: 'missing-documents',
    title: "Vladimir's Missing Documents",
    description:
      "Vladimir carried an antique leather portfolio with notes, photographs, and documentation about various art pieces and the guests' secrets. It's missing from his room. Where is it? Who took it?",
    unlocksInPhase: 3,
    difficulty: 'medium',
  },
  {
    id: 'broken-alibi',
    title: 'The Broken Alibi',
    description:
      "Someone's story about where they were doesn't hold up under pressure. Find the inconsistency. Who claims they were with someone who denies it? Who was actually in the garden? Who slipped away?",
    unlocksInPhase: 3,
    difficulty: 'hard',
  },
];

export const KILLER_REVEAL_TEXT = `ARABELLA ASHFORD-CROSS DID IT.

For forty years, Arabella Ashford-Cross built her reputation as one of the most discerning art collectors on the East Coast. Museums invited her to galas. Auction houses courted her business. She was the arbiter of taste, the keeper of masterpieces, the queen of the art world.

Three months ago, she acquired what she believed was her crowning achievement: a lost Monet, authenticated by experts, worth $8 million. It was the centerpiece of her collection, the painting that would secure her legacy.

Vladimir Karpov arrived this weekend with documents proving the Monet was a forgery. Not just the Monet — he'd discovered that eight other paintings in her collection were also frauds. A sophisticated forgery ring had been operating for years, and Arabella had been buying fakes.

When Vladimir showed her the evidence — the chemical analysis, the authentication inconsistencies, the documentation of the fraud network — Arabella's entire world collapsed. Not just her reputation. Her finances. Her legacy. Everything.

Vladimir wasn't just a threat. He was holding a gun to her head. He had leverage on her, on others in her circle who'd bought through dubious channels, on people whose financial dealings wouldn't survive scrutiny.

She asked him for mercy. He laughed.

Around 8:00 PM, while the gala continued downstairs, Arabella invited Vladimir to the library to 'discuss terms.' She served him a glass of vintage cognac from her private collection. As he examined the paintings on the walls — the fakes he'd come to expose — she slipped the digitalis from her heart medication into his drink.

By 8:45 PM, Vladimir Karpov's heart had stopped.

Arabella has spent the evening as the grieving hostess, the concerned patron, the victim of tragedy. But she is clearheaded. She made her choice to protect her legacy, her reputation, her forty years of carefully constructed status. And she would make it again.

THE EVIDENCE:
• Vladimir's antique leather portfolio containing photographs and documentation of the forged paintings
• Chemical analysis reports proving Arabella's Monet and eight others are forgeries
• A confession letter Vladimir was writing before he died: "I have documented every fraudulent acquisition in your collection..."
• Arabella's heart medication bottle showing two missing tablets
• The empty cognac snifter near Vladimir, smelling faintly bitter
• Guests reporting Arabella's unusual calmness after Vladimir's death, as if a weight had lifted
• Margot's observation that Arabella seemed almost relieved when Vladimir collapsed
• Multiple guests confirming Vladimir was privately confronting people about art authenticity
• The authentication certificates on Arabella's paintings bearing suspicious similarities to known forgery patterns
• Witnesses to Arabella and Vladimir having an intense private conversation before dinner

Arabella protected the only thing that mattered to her: the image she'd built over forty years. Vladimir threatened to destroy it. She chose to end the threat.`;

export const PHASES: PhaseInfo[] = [
  {
    number: 0,
    name: "Welcome to the Gala",
    tvMessage:
      "Guests have arrived for an exclusive weekend at Arabella Ashford-Cross's Cape May estate. A celebration of art, champagne, and carefully kept secrets. The rain beats against the windows. Check your phones, read your character carefully, and prepare to enter this world of sophistication and deception.",
    publicClues: [],
  },
  {
    number: 1,
    name: 'The Discovery (8:45 PM)',
    tvMessage:
      "Vladimir Karpov, a distinguished art dealer and critic, has been found unresponsive in the library. The physician confirms he is gone. An empty cognac snifter sits nearby — a faint bitter smell in the air. This is now a murder investigation. Everyone has secrets. Everyone had access. Everyone has motive.",
    publicClues: [
      "Vladimir Karpov, 52, arrived as Arabella's guest — described as an 'art expert' and 'old friend,' though the nature of their relationship remained vague.",
      "Vladimir had been privately examining paintings and documents throughout the day, taking extensive notes in a leather portfolio.",
      "Cause of death: cardiac arrest — consistent with poisoning via digitalis or a similar cardiac toxin.",
      "Vladimir had private conversations with nearly every guest between 4:00–7:00 PM. Each person came away looking deeply unsettled.",
      "Arabella serves digitalis as part of her heart medication regimen. Her prescription bottle is kept in the library study where Vladimir was found.",
    ],
  },
  {
    number: 2,
    name: 'The Investigation',
    tvMessage:
      "New evidence has surfaced. Check your phones for expanded clues. The manor is now open for investigation. Vladimir's room, the library, the study — all accessible. Search for his leather portfolio and any documentation he was compiling. Side quests are available for the determined investigator. Nothing about Vladimir Karpov was what it appeared to be.",
    publicClues: [
      "Vladimir's leather portfolio has disappeared. It contained photographs, documents, and notes about Arabella's art collection and private conversations with guests.",
      "Arabella's Monet — acquired three months ago for $8 million and displayed as the centerpiece of her collection — bears authentication inconsistencies. Chemical analysis suggests it may be a sophisticated forgery.",
      "Eight other paintings in Arabella's collection show similar provenance issues. All were acquired in the past five years. All came through exclusive dealers.",
      "Arabella takes digitalis daily for her heart. Two doses are missing from her Saturday medication organizer, though she claims she only took her normal dose.",
      "The empty cognac snifter shows residue consistent with digitalis. Arabella's private cognac collection was accessible throughout the evening.",
      "Multiple guests report seeing Arabella and Vladimir in intense, private conversation before dinner. Overheard fragments: 'You can't prove anything,' and 'I have every document.'",
    ],
  },
  {
    number: 3,
    name: 'Confrontations',
    tvMessage:
      "It's time for confrontations. Players may now make formal accusations and present evidence. The accused will respond with their own alibis and evidence. This is a debate — bring your documentation. Who will crack under pressure? Check your phones for your final clues and hidden evidence.",
    publicClues: [
      "Vladimir had financial leverage against nearly everyone in this house — different secrets, different threats.",
      "Multiple people had motive: forgery victims facing exposure, reputations at risk, financial ruin looming.",
      "Multiple people had opportunity: Vladimir was alone in the library between 7:45–8:15 PM with access to Arabella's cognac and medication.",
      "The poisoned cognac shows digitalis residue — but who had access to Arabella's heart medication? Who knew about it?",
      "Alibi challenge: Who claims they were where? Who can verify it? What gaps exist in the timeline?",
      "The leather portfolio has vanished. If it surfaces, the evidence would be definitive. Until then, it's interpretation and accusation.",
    ],
  },
  {
    number: 4,
    name: 'The Final Vote',
    tvMessage:
      "Cast your vote on your phone. Who murdered Vladimir Karpov? You must prove your case with evidence. Wrong accusations have consequences — your reputation, your theory, your credibility.",
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
    name: 'Arabella Ashford-Cross',
    emoji: '👑',
    role: 'Guest',
    bio: "Arabella Ashford-Cross (Grammy), 72. The legendary hostess of Cape May's art world for forty years. She commands attention effortlessly — impeccably groomed, perfectly poised, always knows exactly what to say. She's celebrating the acquisition of a priceless Impressionist masterpiece this weekend, which she believes will cement her legacy as the greatest collector of her generation. People either admire or fear her, sometimes both. She has an uncanny ability to read people and always seems to know more than she's letting on.\n\n*Characteristic phrases:* \"That's not how this world works,\" and \"Everything must be perfect.\" She speaks with certainty and expects obedience. She rarely admits doubt.",
    secret:
      "You built your entire reputation and fortune on your eye for art. Over the past five years, you've acquired what you believed was a priceless collection, culminating in a lost Monet acquired three months ago — the crown jewel worth $8 million.\n\nThree weeks ago, Vladimir Karpov arrived at your home claiming to have 'concerns' about several pieces in your collection. He showed you documentation proving that your Monet is a sophisticated forgery. Not just the Monet — he presented evidence that eight other paintings you own are also fakes. A forgery ring has been operating, and you've been buying their work.\n\nYour entire legacy, your reputation, your worth as a collector — all destroyed. Worse, if this becomes public, your finances would be scrutinized. Questions would be asked about other acquisitions, other dealers, other irregular transactions. People you've done business with would be exposed.\n\nVladimir had decided to go public with the documentation. He wanted to 'set the record straight' in the art world. He was threatening to annihilate everything you've built.\n\nSaturday evening, around 8:00 PM, you invited Vladimir to the library for 'a private discussion.' You brought him a glass of your finest vintage cognac. You took two of your digitalis tablets from the medication organizer in the study and crushed them into his drink. As he examined the paintings on your walls — the fakes he'd exposed — his heart began to fail. By 8:45 PM, he was gone. You destroyed his leather portfolio containing the evidence, but he may have made other copies. You've spent the evening as the grieving hostess. But you are clearheaded. You made the right choice to protect your legacy.",
    alibi: 'I was in the library most of the evening, attending to guests privately.',
    phaseClues: {
      1: "Vladimir's arrival this morning was unexpected. He claimed to be examining your collection 'as a professional courtesy,' but his manner was sinister. You immediately understood he was a threat.",
      2: "Two of your heart medication tablets are missing from Saturday's dose. Your hands are steady. Your mind is clear. You did what was necessary to protect everything you've built over forty years.",
      3: "No one understands what Vladimir was truly threatening. But everyone had something to lose. You simply acted first. You protected your legacy the only way that mattered.",
    },
  },
  {
    name: 'Vladimir Karpov',
    emoji: '🎨',
    role: 'Guest',
    bio: "Vladimir Karpov (Derek), 52. A sophisticated art dealer, critic, and authenticator with a mysterious past and connections to the international art world. Suave, impeccably dressed, with an air of knowing something others don't. His charm is calculated. His smile suggests secrets. He moves through rooms with the confidence of someone who holds leverage.",
    secret:
      "You've spent your career developing expertise in identifying forgeries and tracking fraud networks in the art world. Recently, you've been investigating a sophisticated operation that's been placing high-quality fakes into private collections across the East Coast.\n\nYour investigation led you directly to Arabella Ashford-Cross's collection. Her newly acquired Monet is a forgery. So are eight other paintings she owns. The forgery ring has been exploiting her desire for increasingly rare pieces.\n\nBut here's where it gets interesting: you discovered that Arabella wasn't alone. Other guests this weekend have also been defrauded through similar channels. You found documentation connecting them to questionable acquisitions, dubious dealers, irregular financial transactions.\n\nYou've decided to expose everything — both Arabella's collection and the broader network of fraud. You're carrying documentation in your leather portfolio that proves each guest's involvement in various schemes: questionable art purchases, financial irregularities, hidden transactions.\n\nEvery guest at this gala has something to lose if you go public. Every single one. You've spent the day privately confronting people, showing them evidence, watching them panic. You've enjoyed the power. Their fear amuses you.\n\nBut someone decided your knowledge was too dangerous.",
    alibi: 'I was examining the library and study throughout the day and early evening.',
    phaseClues: {
      1: "Your documentation is comprehensive and damaging. You have evidence on everyone here.",
      2: "Your leather portfolio contains photographs, authentication reports, and personal notes about each guest's financial and art world vulnerabilities.",
      3: "You were not a mere art expert visiting an old friend. You were an investigator with leverage on every person in this house. Someone decided to eliminate that threat.",
    },
  },
  {
    name: 'Vivienne Dumont',
    emoji: '🎭',
    role: 'Guest',
    bio: "Vivienne Dumont (Liz), 35. A glamorous jazz singer known throughout the Northeast for her sultry voice and mysterious allure. She performs at exclusive venues and mingles easily with wealthy patrons. She's observant, intuitive, and excellent at reading people. She laughs readily and makes everyone feel like they're in on a secret. Her beauty is undeniable, but it's her presence that captivates.\n\n*Characteristic phrases:* \"I noticed something interesting,\" and \"Darling, you look terrified.\" She says things with casual observation that somehow land like accusations. She tends to use her charm to extract information from people.",
    secret:
      "You and Arabella have been intimate friends for fifteen years. You've performed at her private galas, been a confidante, been privy to her inner world. You knew her as well as anyone.\n\nVladimir's arrival this weekend threw Arabella into a panic unlike anything you'd ever seen. She seemed terrified. Around 4:00 PM, she pulled you aside and admitted that Vladimir had 'discovered some complications' with her collection. She didn't elaborate, but you understood the weight of it.\n\nWHAT VLADIMIR KNEW ABOUT YOU: He discovered that your jazz performances have been funded through Arabella's patronage — money that technically should have been reported as performance income but never was. He had documentation. He was planning to expose it, which would create tax complications and potentially end your career.\n\nAround 8:00 PM, you saw Arabella invite Vladimir to the library. You noticed her face — not panicked, but resolved. At peace. Like someone who'd made a decision. Around 8:45 PM, you watched Arabella's reaction when someone discovered Vladimir's body. She was sad, yes. But also relieved. Like a weight had lifted.\n\nYou've spent the evening wrestling with what you know. Arabella was your closest friend. But you saw her face when Vladimir was found. You know something happened in that library.",
    alibi: 'I was in the drawing room with Celestine most of the evening, preparing to perform later.',
    phaseClues: {
      1: "Arabella was terrified of Vladimir. Not angry. Not confused. Terrified in a way I'd never seen before.",
      2: "Around 8:00 PM, I watched Arabella invite Vladimir to the library. Her composure was different. Like steel. Like someone who'd made an irreversible choice.",
      3: "When Vladimir was found, Arabella's reaction was grief mixed with something else. Relief. Peace. Like a burden had been lifted from her shoulders.",
    },
  },
  {
    name: 'Maximilian Creed',
    emoji: '🎪',
    role: 'Guest',
    bio: "Maximilian Creed (Steve), 48. A witty, observant British playwright and director, known for sharp dialogue and darker themes. He's theatrical in manner but analytical in mind. He notices inconsistencies in people's stories and points them out with cutting humor. His laugh is sharp, his observations sharper. He speaks with a precise British accent that somehow makes accusations sound like compliments.",
    secret:
      "You're a playwright, which means you spend your life studying human behavior, motivation, and deception. You can read a lie faster than most people can tell it.\n\nWhen Vladimir arrived, you immediately recognized something about him: he was a predator with information. Not a physical threat, but a threat nonetheless. You've written characters like him — charming, intelligent, holding secrets over people's heads.\n\nWHAT VLADIMIR KNEW ABOUT YOU: He discovered that your recent 'original play' that received critical acclaim was heavily inspired by — if not directly derived from — an unpublished manuscript by a dead playwright. He had documentation. He was planning to expose it, which would destroy your reputation and career.\n\nYou spent the day watching him. You saw him confront Arabella, Evangelina, Constantine, others. You read their panic. You analyzed their fear. And you noticed something fascinating: Arabella didn't just look scared. She looked like someone planning something.\n\nAround 8:15 PM, you were in the hallway near the library. You saw Arabella exit the library and head toward the study. Her hands were steady. Her face was calm. Five minutes later, you heard Vladimir collapse.",
    alibi: 'I was mostly in the drawing room and parlor, observing the guests and enjoying a drink.',
    phaseClues: {
      1: "Vladimir was a sophisticated operator. He understood leverage the way I understand human nature — completely.",
      2: "I watched Arabella's face when she understood Vladimir's power. Then I watched it change to something else. Determination.",
      3: "Around 8:15 PM, I saw Arabella leave the library with a particular expression. Like an actress after delivering a final, devastating line. Like someone who'd just ended something permanently.",
    },
  },
  {
    name: 'Evangeline Beaumont',
    emoji: '💎',
    role: 'Guest',
    bio: "Evangeline Beaumont (Annie), 24. A young heiress with old money and minimal life experience. Sheltered, naive, beautiful in an ethereal way. She speaks softly, laughs at things she doesn't quite understand, and seems perpetually anxious. She defers to authority figures and hides her intelligence behind an air of innocence. Her background is aristocratic, her future predetermined — or at least it was before this weekend.",
    secret:
      "Your family's wealth is old money, established generations ago. You've never had to work, never had to worry. Your life was supposed to unfold like a fairy tale: education at the right schools, marriage to the right person, children, grandchildren, a legacy of wealth and status.\n\nBut you have a secret. Three years ago, your father discovered that his accountant had been embezzling from the family trust for years. Hundreds of thousands of dollars missing. Your father wanted to prosecute. Your mother wanted to keep it quiet — to protect the family reputation.\n\nYour parents compromised: they covered the losses quietly, fired the accountant, and swore everyone to secrecy. Including you.\n\nWHAT VLADIMIR KNEW: He discovered the whole sordid affair. He had documentation proving that your family's wealth had been compromised, that there were financial irregularities in your trust, that your inheritance wasn't as secure as it appeared. He was threatening to expose it, which would raise questions about your family's financial integrity and potentially trigger investigations.\n\nSaturday afternoon, Vladimir cornered you privately and said: 'Your family's secrets are remarkable. I have documentation. For discretion, we should discuss terms.' He was blackmailing you. Using your inheritance as leverage.\n\nYou've been terrified all day. Arabella assured you everything would be handled. Then Vladimir died. And you understood what 'handled' meant.",
    alibi: 'I was in my room most of the afternoon and early evening. I came down around 8:30 PM.',
    phaseClues: {
      1: "Vladimir knew things about my family that were supposed to be secrets. Private things. He was using them against me.",
      2: "I told Arabella what Vladimir had threatened. I asked what to do. She said not to worry. That she'd 'take care of it.'",
      3: "By 8:30 PM, Vladimir was dead. And I understood what Arabella meant by taking care of it.",
    },
  },
  {
    name: 'Constantine Blackwell',
    emoji: '🔎',
    role: 'Guest',
    bio: "Constantine Blackwell (John), 55. A private investigator and security consultant hired by wealthy clients. Quiet, meticulous, with an air of knowing more than he's saying. He observes rather than participates. His manner is precise and professional. He has a habit of asking questions that reveal inconsistencies in people's stories. He speaks deliberately, measuring each word.",
    secret:
      "You're a private investigator, hired by someone to look into certain financial irregularities and business dealings in the art world. Your investigation wasn't focused on Arabella specifically — at least not at first. You were researching a network of questionable transactions and suspicious dealer relationships.\n\nVladimir's name appeared in your investigation multiple times. He was connected to the forgery network you were tracking. You came to this gala specifically to observe him and gather intelligence.\n\nWHAT VLADIMIR KNEW ABOUT YOU: He recognized you. He'd done his own research and discovered that you were investigating him. He had documentation about who hired you and what you were investigating. He was planning to expose your entire operation, which would compromise multiple ongoing cases and damage your professional reputation.\n\nYou spent Saturday trying to stay in the background, gathering information about Vladimir's interactions with guests. You noticed he was confronting people. You noticed they were panicking. You noticed Arabella in particular looked like someone who understood the magnitude of the threat.\n\nAround 8:15 PM, you were in the hall near the study. You saw Arabella retrieve her medication bottle. She looked calm. Resolute. You've investigated enough murders to know the look of someone about to commit one.",
    alibi: 'I was moving between rooms, getting a sense of the house layout and guest dynamics.',
    phaseClues: {
      1: "Vladimir wasn't who he appeared to be. He was part of the network I'm investigating.",
      2: "I saw Arabella's medication bottle. I saw her expression. I know what she was planning.",
      3: "In my experience, people don't look relieved when someone they care about dies by accident. They look relieved when they've solved a problem.",
    },
  },
  {
    name: 'Josephine Marchmont',
    emoji: '📰',
    role: 'Guest',
    bio: "Josephine Marchmont (Kelly), 40. A society gossip columnist and socialite who makes her living knowing everyone's secrets and publishing carefully worded exposés. She's charming but predatory, collecting information like currency. She laughs easily and makes people feel comfortable before extracting their secrets. Her charm is weapon-sharp.",
    secret:
      "You've built your career on knowing secrets — the art world is full of them, and you're the keeper of the most valuable ones. You know about forged paintings, hidden affairs, financial irregularities, all of it.\n\nYou've been investigating Arabella's collection for months because you suspected something was off. The provenance stories seemed rehearsed. The acquisitions seemed rushed. You were gathering information for a piece that would expose the cracks in her perfect facade.\n\nWHAT VLADIMIR KNEW ABOUT YOU: He discovered that you've been bribing authenticators to overlook questionable pieces in your own art collection — pieces you purchased without proper documentation. He had evidence of the bribes. He was planning to expose it, which would destroy your credibility as a journalist and ruin your career.\n\nSaturday, when Vladimir revealed what he knew, you panicked. Your career, your reputation, your entire livelihood was at risk. Around 7:30 PM, you overheard Arabella and Vladimir arguing in the study. You heard Vladimir say something about 'exposing everything.' You heard Arabella's response: 'Not if I can help it.'\n\nYou understood immediately what that meant. By 8:45 PM, Vladimir was dead. And you realized Arabella had done what you were too frightened to do.",
    alibi: 'I was in the drawing room, mingling and observing guests.',
    phaseClues: {
      1: "I overheard Vladimir threatening Arabella. Not gently. Not casually. Threatening.",
      2: "I heard Arabella say, 'Not if I can help it.' Those were her exact words. Quietly, but with absolute certainty.",
      3: "By the time Vladimir was found, Arabella had already decided. She'd already acted. She'd already eliminated the threat.",
    },
  },
  {
    name: 'Ludovic Steele',
    emoji: '🎩',
    role: 'Guest',
    bio: "Ludovic Steele (Clark), 38. A charming con artist and sophisticated criminal operating in the high-end art world. Handsome, witty, with an air of danger disguised as charm. He's excellent at reading people and playing whatever role they need him to be. His smile is disarming. His stories are always believable. His true intentions are always hidden.",
    secret:
      "You're a con artist operating in the art world, running various schemes against wealthy collectors. You buy stolen pieces and place them with unsuspecting dealers. You create fake provenance documents. You manipulate prices in private auctions. You live on the edge of legality, which is exactly where you thrive.\n\nVladimir Karpov discovered your operation. He had documentation of your schemes, your fake identities, your network of dealers. He was planning to expose you and turn the evidence over to law enforcement.\n\nWHAT VLADIMIR KNEW ABOUT YOU: He could destroy you. He could send you to prison. He could end everything you've built.\n\nSaturday afternoon, Vladimir cornered you privately and said: 'I know exactly what you are. I have documentation. Unless we come to an arrangement, I'm taking this to the authorities.' You panicked. You spent the day trying to figure out how to neutralize the threat. You even considered it — murdering Vladimir, recovering the documentation, disappearing.\n\nBut around 8:00 PM, you watched Arabella invite Vladimir to the library. You noticed her face — calm, resolved, like someone who'd made a decision. You watched her exit the study moments later. By 8:45 PM, Vladimir was dead.\n\nYou didn't have to do it. Someone else did. And for the first time in your criminal career, you're relieved that you didn't have to commit murder.",
    alibi: 'I was in the garden and parlor most of the evening, avoiding Vladimir.',
    phaseClues: {
      1: "Vladimir had leverage on me. The kind of leverage that destroys lives. He was planning to use it.",
      2: "Around 8:00 PM, I saw Arabella and Vladimir disappear into the library together. She looked different. Resolved.",
      3: "When Vladimir collapsed, I felt something I've never felt before: relief. Someone had solved the problem for me.",
    },
  },
  {
    name: 'Margot Silvain',
    emoji: '🍷',
    role: 'Guest',
    bio: "Margot Silvain (Nan), 48. A sophisticated woman with connections to organized crime and black market operations. She moves between legitimate business and illegal enterprise with ease. She's elegant, poised, and speaks with measured precision. She notices everything and forgets nothing. Her smile is knowing.",
    secret:
      "You run a high-end black market operation acquiring and placing stolen art pieces in private collections. You work with dealers, security consultants, and corrupt authenticators to move valuable pieces through private channels.\n\nYou've worked with Arabella for years, helping her acquire pieces through... irregular means. Most of her collection came through your network. You have documentation of every transaction, every piece, every questionable acquisition.\n\nWHAT VLADIMIR KNEW ABOUT YOU: He discovered your entire operation. He had evidence of your black market dealings, your stolen art network, your connections to organized crime. He was threatening to expose everything — which would implicate you, Arabella, and dozens of other collectors and dealers.\n\nSaturday, Vladimir privately threatened you with exposure. You've eliminated threats before. You contemplated doing it again. But you also understood that Arabella had as much to lose as you did. More, actually.\n\nAround 8:15 PM, you observed Arabella's behavior shift. You've learned to read the subtle signs of someone about to commit an irreversible act. You watched her move toward the study. You watched her retrieve something. You watched her return to the library.\n\nBy 8:45 PM, Vladimir was dead. And you realized Arabella had protected not just her reputation, but yours as well.",
    alibi: 'I was in the dining room and parlor, enjoying the gala.',
    phaseClues: {
      1: "Vladimir's leverage extended beyond Arabella. It extended to everyone connected to her acquisition network.",
      2: "Around 8:15 PM, I noticed Arabella's demeanor change completely. She looked like someone preparing for a difficult action.",
      3: "Arabella eliminated the threat to all of us. She protected her legacy and, in doing so, protected everyone else's.",
    },
  },
  {
    name: 'Quinton Darling',
    emoji: '🌟',
    role: 'Guest',
    bio: "Quinton Darling (Doug), 60. A wealthy aesthete and collector of fine things — art, wine, music, experiences. He's cultured, gossipy, and perpetually amused by the drama around him. He speaks with dry wit and observes human behavior like it's his personal entertainment. His laugh is quick and sharp. He notices everything.",
    secret:
      "You're a collector like Arabella, though less serious about it. You buy what you love, not necessarily what's valuable. You've been considering several pieces from Arabella's collection, thinking about acquiring them.\n\nVladimir approached you privately and revealed that several of the pieces you were interested in are forgeries. He had documentation. He said: 'Before you make a significant investment, you should know these are not authentic.' He was saving you from a bad purchase — or so he made it seem.\n\nWHAT VLADIMIR KNEW ABOUT YOU: He discovered that you'd purchased a valuable 'Vermeer' through Arabella's network five years ago, and that piece is also a forgery. You'd never authenticated it properly. If the truth came out, you'd be exposed as either a fool or complicit in fraud.\n\nVladimir implied that this information could be kept private — as long as you helped him with other matters. He was blackmailing you subtly, using the threat of exposure to ensure your cooperation.\n\nSaturday evening, you watched Vladimir die, and you realized you were safe. Your secret about the 'Vermeer' dies with him. Your reputation is protected. Your collection remains impressive, even if some pieces are questionable.",
    alibi: 'I was in the parlor and at the bar most of the evening, enjoying drinks and conversation.',
    phaseClues: {
      1: "Vladimir knew about my Vermeer. He was using it as leverage. Or at least threatening to.",
      2: "When he died, all of his leverage died with him. I was relieved. Genuinely relieved.",
      3: "Arabella protected a lot of people by eliminating Vladimir. Whether she meant to or not.",
    },
  },
  {
    name: 'Celestine Vanderbilt',
    emoji: '🏰',
    role: 'Guest',
    bio: "Celestine Vanderbilt (Evan), 52. A wealthy collector and rival of Arabella, competing for prestige in the art world. She's elegant, ambitious, and driven by a need to win. She speaks with confidence, makes sharp observations about others' failings, and takes satisfaction in their struggles. Her competitiveness is barely concealed.",
    secret:
      "You and Arabella have been rivals for fifteen years, competing for acquisitions, status, and prestige in the art world. She's always seemed to win — better pieces, better connections, better reputation.\n\nBut recently, you discovered that several pieces in Arabella's collection are forgeries. You gathered documentation proving it. You were planning to expose her — not publicly, but quietly through art world channels — in order to damage her reputation and position yourself as the more trustworthy collector.\n\nVladimir arrived at the gala with his own documentation about Arabella's forged paintings. When you learned this, you were both relieved (someone else would expose her) and frustrated (you wouldn't get credit for the expose).\n\nWHAT VLADIMIR KNEW ABOUT YOU: He discovered that you've also purchased forged pieces — through different channels, with different intent. You knew what you were buying and bought anyway, thinking you could authenticate them later or sell them at a profit. He had evidence of your deliberate fraud participation. He was planning to expose you as well, which would destroy your competitive advantage and your reputation.\n\nVladimir cornered you privately Saturday and said: 'I know about your collections too. Don't try to outmaneuver me. You're in this deeper than Arabella.' You panicked. You contemplated murder yourself. You wanted him dead.\n\nBut around 8:15 PM, you watched Arabella's behavior shift. You recognized the signs. And you realized she was going to do what you were too frightened to attempt.",
    alibi: 'I was in the drawing room preparing to perform a musical number later in the evening.',
    phaseClues: {
      1: "Vladimir was threatening to expose not just Arabella, but me as well. I had motive. Serious motive.",
      2: "Around 8:00 PM, I watched Arabella and Vladimir go to the library. I watched her exit alone moments later, looking calm.",
      3: "I wanted Vladimir dead. But I didn't have the courage to act. Arabella did.",
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
