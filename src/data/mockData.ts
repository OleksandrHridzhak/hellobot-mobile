import {
  CategoryItem,
  ChatThread,
  ConversationStep,
  Counselor,
  FortuneReport,
  HeartPackage,
  Skill,
  TarotCardData,
} from '../types';

export const HERO_PROMO = {
  id: 'pet-k-costume-5',
  tag: 'Pet AI Profile #5',
  title: "What would my pet's K-costume look like?",
  subtitle: 'Transform your furry friend into a royal Joseon dynasty noble in 30 seconds!',
  hearts: 44,
  originalHearts: 59,
  discountBadge: '25%\nSALE',
  skillId: 'skill-pet-hanbok',
  collageImages: [
    'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=500&q=80',
  ],
};

export const CATEGORIES: CategoryItem[] = [
  { id: 'special', label: 'Special Offer', emoji: '🎁', bgTint: 'rgba(244, 63, 94, 0.16)' },
  { id: 'astrology', label: 'Astrology', emoji: '🪐', bgTint: 'rgba(139, 92, 246, 0.16)' },
  { id: 'love', label: 'Love Status', emoji: '💘', bgTint: 'rgba(236, 72, 153, 0.16)' },
  { id: 'fortune', label: 'Fortune', emoji: '🔮', bgTint: 'rgba(59, 130, 246, 0.16)' },
  { id: 'tarot', label: 'Tarot', emoji: '🃏', bgTint: 'rgba(250, 204, 21, 0.16)' },
  { id: 'trending', label: 'Now Trending', emoji: '🔥', badge: 'LIVE', bgTint: 'rgba(16, 185, 129, 0.16)' },
  { id: 'palmistry', label: 'Palmistry', emoji: '🖐️', bgTint: 'rgba(249, 115, 22, 0.16)' },
  { id: 'ai_profile', label: 'AI Studio', emoji: '✨', bgTint: 'rgba(6, 182, 212, 0.16)' },
];

export const COUNSELORS: Counselor[] = [
  {
    id: 'llamama',
    name: 'Llamama',
    specialty: 'Love Tarot & Relationship Coach',
    category: 'tarot',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80',
    heroImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=900&q=80',
    rating: 4.9,
    reviewCount: 1420,
    skillsCount: 5,
    quote: '"Every card holds the secret pulse of your next romance."',
    bio: 'Master of the 78-card Mystic Tarot deck. Llamama has guided over 300,000 souls through unrequited crushes, complicated breakups, and destined encounters.',
    greeting: "Hello there! I'm Llamama 🦙✨ Ready to peek into the cards of your heart?",
    accentColor: '#FACC15',
  },
  {
    id: 'amber',
    name: 'Amber',
    specialty: 'Palmistry Specialist',
    category: 'palmistry',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=500&q=80',
    heroImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=900&q=80',
    rating: 4.8,
    reviewCount: 7,
    skillsCount: 1,
    quote: '"Let me read your palms"',
    bio: 'AI Palmistry & Physiognomy specialist trained on 50,000+ traditional Eastern & Western palm lines. Discover your lifeline, wealth destiny, and marriage timing.',
    greeting: 'Show me your hand, and I will trace the map of your destiny 🖐️✨',
    accentColor: '#F97316',
  },
  {
    id: 'lyn',
    name: 'Lyn Astrology',
    specialty: 'Natal Chart & Saju Master',
    category: 'astrology',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=500&q=80',
    heroImage: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&w=900&q=80',
    rating: 4.7,
    reviewCount: 618,
    skillsCount: 3,
    quote: '"The stars aligned the moment you took your first breath."',
    bio: 'Combining Western planetary transits with traditional Korean Four Pillars (Saju) to pinpoint your luckiest months for wealth, career leaps, and soulmates.',
    greeting: 'Welcome under the starlight 🪐 Let us read your celestial blueprint.',
    accentColor: '#A78BFA',
  },
  {
    id: 'momo',
    name: 'Momo Studio',
    specialty: 'AI Profile & Pet Portrait Artist',
    category: 'ai_profile',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=500&q=80',
    heroImage: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=900&q=80',
    rating: 4.9,
    reviewCount: 932,
    skillsCount: 2,
    quote: '"Turning your beloved pets into royal masterpieces!"',
    bio: 'Creator of the viral Pet AI K-Costume series and Aura Soul Sketch portraits.',
    greeting: 'Meow & Woof! Ready to see your pet dressed like royalty? 👑🐾',
    accentColor: '#10B981',
  },
];

export const DEFAULT_SENTIMENTS = [
  { id: 'boo' as const, emoji: '💩', label: 'Boo', count: 1, percentage: 6 },
  { id: 'like' as const, emoji: '🍯', label: 'Like', count: 14, percentage: 38 },
  { id: 'helpful' as const, emoji: '🍀', label: 'Helpful', count: 19, percentage: 52 },
  { id: 'comforting' as const, emoji: '💪', label: 'Comforting', count: 16, percentage: 44 },
  { id: 'thanks' as const, emoji: '❤️', label: 'Thanks', count: 39, percentage: 100, isDominant: true },
];

export const SKILLS: Skill[] = [
  {
    id: 'skill-solo-love',
    title: 'Solo Love Fortune: Who is Approaching My Heart Next?',
    subtitle: 'Deep 1-Card Mystic Tarot reading for singles & secret crushes',
    counselorId: 'llamama',
    counselorName: 'Llamama',
    counselorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80',
    category: 'tarot',
    sectionTag: 'trending',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    rating: 3.9,
    usersCount: '500+ users',
    reviewCount: 89,
    originalHearts: 10,
    discountPercent: 50,
    finalHearts: 5,
    whoShouldTry: [
      'Those wondering if a new romantic connection will appear within the next 30 days',
      'Singles who have a secret crush and want to know how to bridge the distance',
      'Anyone feeling exhausted by dating apps and curious about their destined encounter',
    ],
    description:
      'Using Llamama’s signature 78-card Celestial Love Tarot deck, we analyze your current romantic aura, the personality and appearance of the person drawn to you next, and the exact environment where sparks will fly.',
    sentiments: DEFAULT_SENTIMENTS,
    relatedSkillIds: ['skill-reunion-tarot', 'skill-2024-wealth', 'skill-palm-destiny'],
  },
  {
    id: 'skill-2024-wealth',
    title: 'Grand Saju & New Year Total Destiny Blueprint',
    subtitle: 'Month-by-month wealth, career promotion, and love luck',
    counselorId: 'lyn',
    counselorName: 'Lyn Astrology',
    counselorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=500&q=80',
    category: 'fortune',
    sectionTag: '2024_fortune',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    usersCount: '2,400+ users',
    reviewCount: 312,
    originalHearts: 20,
    discountPercent: 50,
    finalHearts: 10,
    whoShouldTry: [
      'People planning a major job switch, business launch, or investment',
      'Anyone curious about their peak financial windfall months this year',
      'Those seeking harmony between their Four Pillars and planetary transits',
    ],
    description:
      'A comprehensive East-meets-West reading that decodes your natal elements and upcoming luck cycles. Discover when to take bold risks and when to protect your energy.',
    sentiments: DEFAULT_SENTIMENTS,
    relatedSkillIds: ['skill-solo-love', 'skill-natal-soulmate'],
  },
  {
    id: 'skill-palm-destiny',
    title: 'AI Palm Line Scan: Marriage Age & Hidden Wealth',
    subtitle: 'Precision palmistry reading of your Heart, Head, and Fate lines',
    counselorId: 'amber',
    counselorName: 'Amber',
    counselorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=500&q=80',
    category: 'palmistry',
    sectionTag: 'recommend',
    image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
    rating: 4.6,
    usersCount: '800+ users',
    reviewCount: 64,
    originalHearts: 10,
    discountPercent: 50,
    finalHearts: 5,
    whoShouldTry: [
      'Curious minds who want to decode the subtle branches on their palm lines',
      'Those wondering when their strongest marriage and partnership luck arrives',
      'Anyone interested in whether they carry the rare "M" wealth palm mark',
    ],
    description:
      'Amber examines the depth, curvature, and intersections of your three primary palm creases to reveal your innate temperament and upcoming life turning points.',
    sentiments: DEFAULT_SENTIMENTS,
    relatedSkillIds: ['skill-solo-love', 'skill-2024-wealth'],
  },
  {
    id: 'skill-reunion-tarot',
    title: 'Does My Ex Still Check My Profile at 2 AM?',
    subtitle: 'Unfiltered subconscious Tarot spread on lingering feelings & reunion',
    counselorId: 'llamama',
    counselorName: 'Llamama',
    counselorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80',
    category: 'love',
    sectionTag: 'trending',
    image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    usersCount: '5,100+ users',
    reviewCount: 410,
    originalHearts: 12,
    discountPercent: 50,
    finalHearts: 6,
    whoShouldTry: [
      'Those going through a recent breakup or no-contact phase',
      'Anyone wondering if reaching out first will heal or hurt the bond',
      'People who want closure or clarity on their ex-partner’s true thoughts',
    ],
    description:
      'We pull directly into their late-night subconscious thoughts, unspoken regrets, and the realistic probability of a message landing in your inbox.',
    sentiments: DEFAULT_SENTIMENTS,
    relatedSkillIds: ['skill-solo-love', 'skill-natal-soulmate'],
  },
  {
    id: 'skill-natal-soulmate',
    title: 'Soulmate Sketch & First Initial Astrology',
    subtitle: 'Where you will meet your future partner and their zodiac signature',
    counselorId: 'lyn',
    counselorName: 'Lyn Astrology',
    counselorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=500&q=80',
    category: 'astrology',
    sectionTag: '2024_fortune',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
    rating: 4.7,
    usersCount: '1,900+ users',
    reviewCount: 155,
    originalHearts: 16,
    discountPercent: 50,
    finalHearts: 8,
    whoShouldTry: [
      'Romantics curious about their destined partner’s appearance & vibe',
      'Those wanting to know their Venus & 7th House marriage timing',
      'Anyone choosing between two very different romantic prospects',
    ],
    description:
      'By mapping your 7th House ruler and Juno asteroid placement, Lyn uncovers the unmistakable traits and initials of your most compatible life partner.',
    sentiments: DEFAULT_SENTIMENTS,
    relatedSkillIds: ['skill-solo-love', 'skill-2024-wealth'],
  },
  {
    id: 'skill-pet-hanbok',
    title: "Pet AI Profile #5: What would my pet's K-costume look like?",
    subtitle: '2x2 Royal Joseon Hanbok studio portraits for dogs & cats',
    counselorId: 'momo',
    counselorName: 'Momo Studio',
    counselorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=500&q=80',
    category: 'special',
    sectionTag: 'recommend',
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    usersCount: '3,200+ users',
    reviewCount: 284,
    originalHearts: 59,
    discountPercent: 25,
    finalHearts: 44,
    whoShouldTry: [
      'Pet parents who want ultra-cute traditional Korean royal portraits',
      'Anyone looking for a unique profile picture or holiday greeting card',
      'Dog and cat lovers curious about their pet’s past-life noble rank',
    ],
    description:
      'Upload or describe your pet and receive high-resolution royal K-costume portraits along with a playful past-life palace fortune reading!',
    sentiments: DEFAULT_SENTIMENTS,
    relatedSkillIds: ['skill-solo-love', 'skill-palm-destiny'],
  },
];

export const THE_HIEROPHANT_CARD: TarotCardData = {
  id: 'card-hierophant-v',
  numberRoman: 'V',
  name: 'THE HIEROPHANT',
  keywords: ['Destined Mentor', 'Sincere Commitment', 'Trusted Circle', 'Warm Stability'],
  uprightMeaning:
    'The Hierophant (Card V) signifies a deeply trustworthy, respectful, and enduring bond. Rather than a fleeting spark that burns out, a mature and grounded connection is entering your orbit through a familiar community, workplace, or mutual friend.',
  loveAdvice:
    'Pay close attention to someone who listens thoughtfully and offers calm advice when you speak. Accepting an invitation to a small group gathering, study session, or wedding this month opens the door to romance.',
  luckyItem: 'Silver Bookmark or Classic Wristwatch',
  luckyColor: 'Royal Champagne Gold',
  image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80',
};

export const CONVERSATION_FLOW: Record<string, ConversationStep> = {
  step_greeting: {
    id: 'step_greeting',
    botMessages: [
      {
        type: 'sticker',
        stickerEmoji: '🦙✨',
        stickerCaption: 'Llamama is shuffling the starlight deck...',
      },
      {
        type: 'text',
        text: "Welcome! I'm Llamama, your Love Tarot guide. Today we're uncovering the hidden currents of your Solo Love Fortune 💜",
      },
      {
        type: 'text',
        text: 'Before I spread the 78 mystic cards, tell me—are you ready to hear the unfiltered truth of what the cards see?',
      },
    ],
    quickReplies: [
      { id: 'qr-1', label: 'Hello, Llamama 👋', nextStepId: 'step_status' },
      { id: 'qr-2', label: 'Oh wow, I am ready!', nextStepId: 'step_status' },
      { id: 'qr-3', label: 'Alright 🥰', nextStepId: 'step_status' },
    ],
  },
  step_status: {
    id: 'step_status',
    botMessages: [
      {
        type: 'text',
        text: 'Hehe, I love your energy! Let me tune the deck to your current heart frequency first.',
      },
      {
        type: 'text',
        text: 'How would you describe your romantic situation right at this moment?',
      },
    ],
    quickReplies: [
      { id: 'qr-status-1', label: "I'm completely single 🙋", nextStepId: 'step_draw_prompt' },
      { id: 'qr-status-2', label: 'Crushing on someone... 💓', nextStepId: 'step_draw_prompt' },
      { id: 'qr-status-3', label: "It's complicated 🌙", nextStepId: 'step_draw_prompt' },
    ],
  },
  step_draw_prompt: {
    id: 'step_draw_prompt',
    botMessages: [
      {
        type: 'text',
        text: 'Got it! I can already sense a very warm, steady vibration surrounding your upcoming month.',
      },
      {
        type: 'tarot_prompt',
        text: 'Take a deep breath, think of your heart’s wish, and draw ONE card from the celestial fan below ✨',
      },
    ],
    quickReplies: [],
    showTarotFan: true,
  },
  step_after_draw: {
    id: 'step_after_draw',
    botMessages: [
      {
        type: 'tarot_reveal',
        tarotCard: THE_HIEROPHANT_CARD,
        text: 'You drew Card V — THE HIEROPHANT!',
      },
      {
        type: 'text',
        text: 'Oh my!! Look at the golden keys at the base of this card. The Hierophant is one of the strongest cards for a sincere, loyal partner who treats your heart with genuine respect.',
      },
      {
        type: 'text',
        text: 'This person isn’t a player—they are someone with a calm voice, reliable reputation, and someone you likely meet through a friend’s introduction, class, or professional setting!',
      },
    ],
    quickReplies: [
      { id: 'qr-reveal-1', label: 'When will we meet? 🗓️', nextStepId: 'step_final_report' },
      { id: 'qr-reveal-2', label: 'Show my full Love Report 🔮', nextStepId: 'step_final_report' },
    ],
  },
  step_final_report: {
    id: 'step_final_report',
    botMessages: [
      {
        type: 'text',
        text: 'Between the 14th and 27th of this cycle, your social luck peaks! Keep an eye out for someone wearing muted earth tones or glasses who asks thoughtful questions.',
      },
      {
        type: 'summary_card',
        reportId: 'report-solo-love-1',
        tarotCard: THE_HIEROPHANT_CARD,
        text: "Guest's Solo Love Fortune complete report has been sealed and archived for you.",
      },
    ],
    quickReplies: [
      { id: 'qr-restart', label: 'Draw another card 🔄', nextStepId: 'step_draw_prompt' },
      { id: 'qr-thanks', label: 'Thank you Llamama ❤️', nextStepId: 'step_thanks' },
    ],
  },
  step_thanks: {
    id: 'step_thanks',
    botMessages: [
      {
        type: 'sticker',
        stickerEmoji: '💖🦙',
        stickerCaption: 'Llamama is cheering for your love life!',
      },
      {
        type: 'text',
        text: 'May the warm blessing of The Hierophant bring a wonderful person straight to your side! Tap "View more" on the report card anytime to review or share your reading ✨',
      },
    ],
    quickReplies: [
      { id: 'qr-draw-again', label: 'Draw another card 🃏', nextStepId: 'step_draw_prompt' },
    ],
  },
};

export const INITIAL_REPORTS: FortuneReport[] = [
  {
    id: 'report-solo-love-1',
    skillId: 'skill-solo-love',
    counselorId: 'llamama',
    counselorName: 'Llamama',
    counselorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80',
    title: "Guest's Solo Love Fortune",
    subtitle: 'Card V • THE HIEROPHANT — Destined Respect & Sincere Romance',
    createdAt: 'Today • 11:42 PM',
    tarotCard: THE_HIEROPHANT_CARD,
    coreSummary:
      'Your solitary season is transitioning into a period of warm, grounded companionship. The Hierophant reveals that your next romantic partner enters through a trusted social bridge—such as a mentor, mutual friend, alum network, or shared project—rather than a random fleeting encounter.',
    loveTimeline: [
      {
        period: 'Early Window (Days 1–10)',
        prediction:
          'A period of emotional clearing. You naturally let go of past disappointments and attract conversations with mature, kind-hearted people.',
      },
      {
        period: 'Golden Spark (Days 11–22)',
        prediction:
          'High probability of a meaningful introduction or a familiar acquaintance suddenly opening up about their personal feelings over coffee or dinner.',
      },
      {
        period: 'Deepening Trust (Days 23–30)',
        prediction:
          'Consistent messages and effortless plans turn initial curiosity into steady romantic momentum.',
      },
    ],
    actionableAdvice: [
      'Say yes to small group dinners, workshops, or friend-of-a-friend invitations this month.',
      'Ask for someone’s opinion or advice—The Hierophant connection often begins with helpful conversation.',
      'Wear warm ivory, gold accents, or classic tailored silhouettes on weekend outings to amplify your Venus aura.',
    ],
    compatibilityScore: 94,
  },
];

export const INITIAL_THREADS: ChatThread[] = [
  {
    id: 'llamama',
    counselorId: 'llamama',
    counselorName: 'Llamama',
    counselorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80',
    skillId: 'skill-solo-love',
    skillTitle: 'Solo Love Fortune: Who is Approaching My Heart Next?',
    lastMessage: "Ready to draw your Destiny Tarot Card? Tap to continue ✨",
    timestamp: 'Just now',
    unreadCount: 1,
  },
  {
    id: 'amber',
    counselorId: 'amber',
    counselorName: 'Amber',
    counselorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=500&q=80',
    skillId: 'skill-palm-destiny',
    skillTitle: 'AI Palm Line Scan: Marriage Age & Hidden Wealth',
    lastMessage: 'Show me your hand, and I will trace the map of your destiny 🖐️✨',
    timestamp: '2h ago',
    unreadCount: 0,
    isFreeConsultation: true,
  },
  {
    id: 'lyn',
    counselorId: 'lyn',
    counselorName: 'Lyn Astrology',
    counselorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=500&q=80',
    skillId: 'skill-2024-wealth',
    skillTitle: 'Grand Saju & New Year Total Destiny Blueprint',
    lastMessage: 'Your Jupiter transit enters your 2nd house of wealth soon 🪐',
    timestamp: 'Yesterday',
    unreadCount: 0,
    isFreeConsultation: true,
  },
];

export const HEART_PACKAGES: HeartPackage[] = [
  {
    id: 'pkg-26',
    hearts: 26,
    priceUsd: 4.99,
    priceFormatted: '$4.99',
    perHeartUsd: '$0.19 US$ per heart',
  },
  {
    id: 'pkg-60',
    hearts: 60,
    priceUsd: 9.99,
    priceFormatted: '$9.99',
    perHeartUsd: '$0.17 US$ per heart',
  },
  {
    id: 'pkg-120',
    hearts: 120,
    priceUsd: 18.99,
    priceFormatted: '$18.99',
    perHeartUsd: '$0.16 US$ per heart',
  },
  {
    id: 'pkg-200',
    hearts: 200,
    priceUsd: 29.99,
    priceFormatted: '$29.99',
    perHeartUsd: '$0.15 US$ per heart',
    calloutBanner: 'Most popular choice 😍',
    calloutVariant: 'popular',
  },
  {
    id: 'pkg-380',
    hearts: 380,
    priceUsd: 49.99,
    priceFormatted: '$49.99',
    perHeartUsd: '$0.13 US$ per heart',
  },
  {
    id: 'pkg-610',
    hearts: 610,
    priceUsd: 69.99,
    priceFormatted: '$69.99',
    perHeartUsd: '$0.11 US$ per heart',
    calloutBanner: 'Frequently bought by top 10% 💰',
    calloutVariant: 'vip',
  },
];
