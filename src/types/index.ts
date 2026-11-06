export type CategoryId =
  | 'special'
  | 'astrology'
  | 'love'
  | 'fortune'
  | 'tarot'
  | 'trending'
  | 'palmistry'
  | 'ai_profile';

export interface CategoryItem {
  id: CategoryId;
  label: string;
  emoji: string;
  badge?: string;
  bgTint: string;
}

export interface SentimentItem {
  id: 'boo' | 'like' | 'helpful' | 'comforting' | 'thanks';
  emoji: string;
  label: string;
  count: number;
  percentage: number;
  isDominant?: boolean;
}

export interface Counselor {
  id: string;
  name: string;
  specialty: string;
  category: CategoryId;
  avatar: string;
  heroImage: string;
  rating: number;
  reviewCount: number;
  skillsCount: number;
  quote: string;
  bio: string;
  greeting: string;
  accentColor: string;
}

export interface Skill {
  id: string;
  title: string;
  subtitle: string;
  counselorId: string;
  counselorName: string;
  counselorAvatar: string;
  category: CategoryId;
  sectionTag: '2024_fortune' | 'trending' | 'recommend';
  image: string;
  rating: number;
  usersCount: string;
  reviewCount: number;
  originalHearts: number;
  discountPercent: number;
  finalHearts: number;
  whoShouldTry: string[];
  description: string;
  sentiments: SentimentItem[];
  relatedSkillIds: string[];
}

export interface TarotCardData {
  id: string;
  numberRoman: string;
  name: string;
  keywords: string[];
  uprightMeaning: string;
  loveAdvice: string;
  luckyItem: string;
  luckyColor: string;
  image: string;
}

export type ChatMessageType =
  | 'text'
  | 'sticker'
  | 'tarot_prompt'
  | 'tarot_picked'
  | 'tarot_reveal'
  | 'summary_card';

export interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  type: ChatMessageType;
  text?: string;
  stickerEmoji?: string;
  stickerCaption?: string;
  tarotCard?: TarotCardData;
  reportId?: string;
  timestamp: string;
}

export interface QuickReplyOption {
  id: string;
  label: string;
  nextStepId: string;
  triggersTarotFan?: boolean;
}

export interface ConversationStep {
  id: string;
  botMessages: Omit<ChatMessage, 'id' | 'timestamp' | 'sender'>[];
  quickReplies: QuickReplyOption[];
  showTarotFan?: boolean;
}

export interface FortuneReport {
  id: string;
  skillId: string;
  counselorId: string;
  counselorName: string;
  counselorAvatar: string;
  title: string;
  subtitle: string;
  createdAt: string;
  tarotCard: TarotCardData;
  coreSummary: string;
  loveTimeline: {
    period: string;
    prediction: string;
  }[];
  actionableAdvice: string[];
  compatibilityScore: number;
}

export interface ChatThread {
  id: string;
  counselorId: string;
  counselorName: string;
  counselorAvatar: string;
  skillId: string;
  skillTitle: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isFreeConsultation?: boolean;
}

export interface HeartPackage {
  id: string;
  hearts: number;
  bonusHearts?: number;
  priceUsd: number;
  priceFormatted: string;
  perHeartUsd: string;
  calloutBanner?: string;
  calloutVariant?: 'popular' | 'vip';
}
