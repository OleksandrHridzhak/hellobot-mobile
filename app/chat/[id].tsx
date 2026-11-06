import * as Haptics from '../../src/utils/haptics';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ChevronLeft,
  Compass,
  ScanLine,
  Send,
  Sparkles,
  X,
} from 'lucide-react-native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeInUp, Layout } from 'react-native-reanimated';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { ReportModal } from '../../src/components/ReportModal';
import { Skeleton } from '../../src/components/Skeleton';
import { TarotFanOverlay } from '../../src/components/TarotFanOverlay';
import {
  CONVERSATION_FLOW,
  COUNSELORS,
  INITIAL_REPORTS,
  THE_HIEROPHANT_CARD,
} from '../../src/data/mockData';
import { useAppStore } from '../../src/store/useAppStore';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../../src/theme/theme';
import { ChatMessage, QuickReplyOption } from '../../src/types';

const EMPTY_MESSAGES: ChatMessage[] = [];

export default function InteractiveChatRoomScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const roomId = id || 'llamama';
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList<ChatMessage>>(null);

  const [initialSkeleton, setInitialSkeleton] = useState(true);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [inputText, setInputText] = useState('');
  const [reportModalOpen, setReportModalOpen] = useState(false);

  const counselor = useMemo(
    () => COUNSELORS.find((c) => c.id === roomId) || COUNSELORS[0],
    [roomId]
  );

  const messages = useAppStore((s) => s.chatMessagesById[roomId]) || EMPTY_MESSAGES;
  const currentStepId = useAppStore(
    (s) => s.currentStepById[roomId] || 'step_greeting'
  );
  const appendChatMessages = useAppStore((s) => s.appendChatMessages);
  const autoReplyEnabled = useAppStore((s) => s.autoReplyEnabled);
  const setAutoReplyEnabled = useAppStore((s) => s.setAutoReplyEnabled);
  const dismissedAutoTooltip = useAppStore((s) => s.dismissedAutoTooltip);
  const dismissAutoTooltip = useAppStore((s) => s.dismissAutoTooltip);
  const saveReport = useAppStore((s) => s.saveReport);

  const currentStep =
    CONVERSATION_FLOW[currentStepId] || CONVERSATION_FLOW.step_greeting;

  // Brief 400ms Skeleton loader on mount
  useEffect(() => {
    const t = setTimeout(() => setInitialSkeleton(false), 400);
    return () => clearTimeout(t);
  }, [roomId]);

  const enqueueBotSequence = useCallback(
    async (stepKey: string) => {
      const step = CONVERSATION_FLOW[stepKey];
      if (!step) return;

      setIsBotTyping(true);
      for (let i = 0; i < step.botMessages.length; i++) {
        const raw = step.botMessages[i];
        await new Promise((res) => setTimeout(res, 560));

        const msg: ChatMessage = {
          id: `${stepKey}-bot-${Date.now()}-${i}`,
          sender: 'bot',
          timestamp: 'Now',
          ...raw,
        };
        appendChatMessages(roomId, [msg], stepKey);
        Haptics.selectionAsync();

        if (raw.type === 'summary_card') {
          saveReport(INITIAL_REPORTS[0]);
        }
      }
      setIsBotTyping(false);
    },
    [appendChatMessages, roomId, saveReport]
  );

  // Trigger initial greeting if room has no messages yet
  useEffect(() => {
    if (!initialSkeleton && messages.length === 0) {
      enqueueBotSequence('step_greeting');
    }
  }, [enqueueBotSequence, initialSkeleton, messages.length]);

  const handleSelectQuickReply = useCallback(
    (option: QuickReplyOption) => {
      if (isBotTyping) return;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      const userBubble: ChatMessage = {
        id: `user-${Date.now()}`,
        sender: 'user',
        type: 'text',
        text: option.label,
        timestamp: 'Now',
      };

      appendChatMessages(roomId, [userBubble], option.nextStepId);
      enqueueBotSequence(option.nextStepId);
    },
    [appendChatMessages, enqueueBotSequence, isBotTyping, roomId]
  );

  // Auto-reply mode handler
  useEffect(() => {
    if (
      autoReplyEnabled &&
      !isBotTyping &&
      !initialSkeleton &&
      currentStep.quickReplies.length > 0
    ) {
      const timer = setTimeout(() => {
        handleSelectQuickReply(currentStep.quickReplies[0]);
      }, 1100);
      return () => clearTimeout(timer);
    }
  }, [
    autoReplyEnabled,
    currentStep.quickReplies,
    handleSelectQuickReply,
    initialSkeleton,
    isBotTyping,
  ]);

  const handleTarotCardPicked = (cardIndex: number) => {
    const userPickedMsg: ChatMessage = {
      id: `user-picked-${Date.now()}`,
      sender: 'user',
      type: 'tarot_picked',
      text: `Selected Celestial Card #${cardIndex + 1} ✨`,
      timestamp: 'Now',
    };
    appendChatMessages(roomId, [userPickedMsg], 'step_after_draw');
    enqueueBotSequence('step_after_draw');
  };

  const handleSendCustomText = () => {
    if (!inputText.trim() || isBotTyping) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const customText = inputText.trim();
    setInputText('');

    const nextId =
      currentStep.quickReplies[0]?.nextStepId || 'step_draw_prompt';

    const userMsg: ChatMessage = {
      id: `user-custom-${Date.now()}`,
      sender: 'user',
      type: 'text',
      text: customText,
      timestamp: 'Now',
    };
    appendChatMessages(roomId, [userMsg], nextId);
    enqueueBotSequence(nextId);
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isUser = item.sender === 'user';

    if (isUser) {
      return (
        <Animated.View
          entering={FadeInUp.duration(240)}
          layout={Layout.springify()}
          style={styles.userRow}
        >
          {item.type === 'tarot_picked' ? (
            <View style={styles.userTarotBubble}>
              <Text style={styles.userTarotEmoji}>🃏</Text>
              <Text style={styles.userBubbleText}>{item.text}</Text>
            </View>
          ) : (
            <View style={styles.userBubble}>
              <Text style={styles.userBubbleText}>{item.text}</Text>
            </View>
          )}
        </Animated.View>
      );
    }

    return (
      <Animated.View
        entering={FadeInUp.duration(260)}
        layout={Layout.springify()}
        style={styles.botRow}
      >
        <Image
          source={{ uri: counselor.avatar }}
          style={styles.botAvatar}
          contentFit="cover"
        />

        <View style={styles.botBubbleCol}>
          <Text style={styles.botSenderName}>{counselor.name}</Text>

          {item.type === 'sticker' && (
            <View style={styles.stickerBubble}>
              <Text style={styles.stickerEmoji}>{item.stickerEmoji}</Text>
              <Text style={styles.stickerCaption}>{item.stickerCaption}</Text>
            </View>
          )}

          {(item.type === 'text' || item.type === 'tarot_prompt') && (
            <View
              style={[
                styles.botBubble,
                item.type === 'tarot_prompt' && styles.tarotPromptBubble,
              ]}
            >
              <Text style={styles.botBubbleText}>{item.text}</Text>
            </View>
          )}

          {item.type === 'tarot_reveal' && item.tarotCard && (
            <View style={styles.tarotRevealCard}>
              <View style={styles.arcanaTag}>
                <Text style={styles.arcanaTagText}>
                  ARCANA {item.tarotCard.numberRoman}
                </Text>
              </View>
              <Image
                source={{ uri: item.tarotCard.image }}
                style={styles.revealedCardImage}
                contentFit="cover"
              />
              <Text style={styles.revealedCardTitle}>
                {item.tarotCard.name}
              </Text>
              <Text style={styles.revealedCardSub}>
                {item.tarotCard.keywords.join(' • ')}
              </Text>
            </View>
          )}

          {item.type === 'summary_card' && (
            <View style={styles.summaryReportBubble}>
              <View style={styles.summaryHeader}>
                <Sparkles size={15} color={COLORS.yellowPrimary} />
                <Text style={styles.summaryHeaderLabel}>
                  FORTUNE REPORT ARCHIVED
                </Text>
              </View>
              <Text style={styles.summaryTitle}>
                Guest's Solo Love Fortune
              </Text>
              <Text style={styles.summaryBody}>{item.text}</Text>

              <TouchableOpacity
                style={styles.viewMoreBtn}
                activeOpacity={0.86}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  setReportModalOpen(true);
                }}
              >
                <Text style={styles.viewMoreBtnText}>View more</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Animated.View>
    );
  };

  if (initialSkeleton) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.skeletonContainer}>
          <Skeleton height={54} borderRadius={RADIUS.lg} />
          <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
            <Skeleton width={40} height={40} borderRadius={20} />
            <Skeleton width="72%" height={78} borderRadius={RADIUS.xl} />
          </View>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <Skeleton width={40} height={40} borderRadius={20} />
            <Skeleton width="64%" height={60} borderRadius={RADIUS.xl} />
          </View>
          <View style={{ alignSelf: 'flex-end', width: '48%' }}>
            <Skeleton height={46} borderRadius={RADIUS.xl} />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Chat Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.back();
            }}
            style={styles.backBtn}
          >
            <ChevronLeft size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.botProfileTouch}
            onPress={() => router.push(`/counselor/${counselor.id}`)}
          >
            <Image
              source={{ uri: counselor.avatar }}
              style={styles.headerAvatar}
              contentFit="cover"
            />
            <View>
              <Text style={styles.headerName}>{counselor.name}</Text>
              <Text style={styles.headerStatus}>● AI Counselor Online</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.headerRight}>
          {/* Auto OFF/ON Switch */}
          <View style={styles.autoSwitchPill}>
            <Text
              style={[
                styles.autoLabel,
                autoReplyEnabled && { color: COLORS.yellowPrimary },
              ]}
            >
              Auto {autoReplyEnabled ? 'ON' : 'OFF'}
            </Text>
            <Switch
              value={autoReplyEnabled}
              onValueChange={(val) => {
                Haptics.selectionAsync();
                setAutoReplyEnabled(val);
              }}
              trackColor={{ false: '#27272A', true: COLORS.yellowPrimary }}
              thumbColor={
                autoReplyEnabled ? COLORS.textInverse : COLORS.textPrimary
              }
              style={{ transform: [{ scaleX: 0.78 }, { scaleY: 0.78 }] }}
            />
          </View>

          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={() => {
              Haptics.selectionAsync();
              setReportModalOpen(true);
            }}
          >
            <ScanLine size={19} color={COLORS.textPrimary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={() => {
              Haptics.selectionAsync();
              router.push('/skill/skill-solo-love');
            }}
          >
            <Compass size={19} color={COLORS.yellowPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Dismissible Floating Tooltip for Auto-Reply */}
      {!dismissedAutoTooltip && (
        <View style={styles.floatingTooltip}>
          <Sparkles size={14} color={COLORS.yellowPrimary} />
          <Text style={styles.tooltipText}>
            Tired of answering every time? Turn on auto-reply
          </Text>
          <TouchableOpacity
            onPress={() => {
              Haptics.selectionAsync();
              dismissAutoTooltip();
            }}
            hitSlop={10}
          >
            <X size={15} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>
      )}

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Chat Stream */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.chatListContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
          ListFooterComponent={
            isBotTyping ? (
              <View style={styles.typingRow}>
                <Image
                  source={{ uri: counselor.avatar }}
                  style={styles.botAvatar}
                />
                <View style={styles.typingBubble}>
                  <Text style={styles.typingDots}>• • •</Text>
                </View>
              </View>
            ) : null
          }
        />

        {/* Interactive Tarot Card Fan (Signature Feature) */}
        <TarotFanOverlay
          visible={!!currentStep.showTarotFan && !isBotTyping}
          onCardPicked={handleTarotCardPicked}
        />

        {/* Quick Reply Bar */}
        {!currentStep.showTarotFan && currentStep.quickReplies.length > 0 && (
          <View style={styles.quickReplyBar}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.quickReplyScroll}
            >
              {currentStep.quickReplies.map((qr) => (
                <TouchableOpacity
                  key={qr.id}
                  style={styles.quickReplyChip}
                  activeOpacity={0.82}
                  onPress={() => handleSelectQuickReply(qr)}
                >
                  <Text style={styles.quickReplyText}>{qr.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Bottom Message Input Bar */}
        <View
          style={[
            styles.inputBar,
            { paddingBottom: Math.max(insets.bottom, SPACING.sm) },
          ]}
        >
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder={`Ask ${counselor.name} anything...`}
            placeholderTextColor={COLORS.textMuted}
            style={styles.textInput}
            onSubmitEditing={handleSendCustomText}
          />
          <TouchableOpacity
            style={[
              styles.sendBtn,
              !inputText.trim() && { opacity: 0.45 },
            ]}
            onPress={handleSendCustomText}
            disabled={!inputText.trim()}
          >
            <Send size={17} color={COLORS.textInverse} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Full-Screen Shareable Report Modal */}
      <ReportModal
        visible={reportModalOpen}
        report={INITIAL_REPORTS[0]}
        onClose={() => setReportModalOpen(false)}
        onSelectCounselor={(cId) => router.push(`/counselor/${cId}`)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
  },
  skeletonContainer: {
    padding: SPACING.lg,
    gap: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.bgPrimary,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  backBtn: {
    padding: 4,
  },
  botProfileTouch: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: COLORS.yellowPrimary,
  },
  headerName: {
    ...TYPOGRAPHY.h3,
    fontSize: 15,
  },
  headerStatus: {
    fontSize: 11,
    color: COLORS.emeraldPrimary,
    fontWeight: '600',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  autoSwitchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgSurface,
    paddingLeft: 10,
    paddingRight: 2,
    height: 34,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  autoLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textSecondary,
  },
  headerIconBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.bgSurface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  floatingTooltip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginHorizontal: SPACING.lg,
    marginTop: 8,
    backgroundColor: '#1E1B2E',
    paddingHorizontal: SPACING.md,
    paddingVertical: 9,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: '#5B21B6',
  },
  tooltipText: {
    flex: 1,
    color: '#EDE9FE',
    fontSize: 12,
    fontWeight: '600',
  },
  chatListContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
    gap: SPACING.md,
  },
  botRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    maxWidth: '86%',
  },
  botAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginTop: 2,
  },
  botBubbleCol: {
    flex: 1,
    gap: 4,
  },
  botSenderName: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    marginLeft: 2,
  },
  botBubble: {
    backgroundColor: COLORS.bgSurface,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.xl,
    borderTopLeftRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tarotPromptBubble: {
    borderColor: '#7C3AED',
    backgroundColor: '#171126',
  },
  botBubbleText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
  },
  stickerBubble: {
    backgroundColor: COLORS.bgSurface,
    padding: SPACING.lg,
    borderRadius: RADIUS.xl,
    borderTopLeftRadius: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  stickerEmoji: {
    fontSize: 44,
    marginBottom: 6,
  },
  stickerCaption: {
    ...TYPOGRAPHY.caption,
    color: COLORS.yellowPrimary,
  },
  tarotRevealCard: {
    backgroundColor: '#140E24',
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.yellowPrimary,
  },
  arcanaTag: {
    backgroundColor: COLORS.yellowSoft,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    marginBottom: SPACING.sm,
  },
  arcanaTagText: {
    color: COLORS.yellowPrimary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  revealedCardImage: {
    width: 145,
    height: 215,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.yellowPrimary,
    marginBottom: SPACING.md,
  },
  revealedCardTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.yellowPrimary,
    marginBottom: 4,
  },
  revealedCardSub: {
    ...TYPOGRAPHY.caption,
    color: '#DDD6FE',
    textAlign: 'center',
  },
  summaryReportBubble: {
    backgroundColor: COLORS.bgSurface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1.5,
    borderColor: COLORS.yellowPrimary,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  summaryHeaderLabel: {
    ...TYPOGRAPHY.micro,
    color: COLORS.yellowPrimary,
  },
  summaryTitle: {
    ...TYPOGRAPHY.h2,
    marginBottom: 6,
  },
  summaryBody: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },
  viewMoreBtn: {
    height: 44,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.yellowPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewMoreBtnText: {
    color: COLORS.textInverse,
    fontWeight: '900',
    fontSize: 14,
  },
  userRow: {
    alignSelf: 'flex-end',
    maxWidth: '80%',
  },
  userBubble: {
    backgroundColor: COLORS.yellowPrimary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: 11,
    borderRadius: RADIUS.xl,
    borderBottomRightRadius: 4,
  },
  userTarotBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.yellowPrimary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: 11,
    borderRadius: RADIUS.xl,
    borderBottomRightRadius: 4,
  },
  userTarotEmoji: {
    fontSize: 18,
  },
  userBubbleText: {
    color: COLORS.textInverse,
    fontSize: 15,
    fontWeight: '800',
  },
  typingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 6,
  },
  typingBubble: {
    backgroundColor: COLORS.bgSurface,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  typingDots: {
    color: COLORS.yellowPrimary,
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 2,
  },
  quickReplyBar: {
    paddingVertical: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderSubtle,
    backgroundColor: COLORS.bgPrimary,
  },
  quickReplyScroll: {
    paddingHorizontal: SPACING.lg,
    gap: 8,
  },
  quickReplyChip: {
    backgroundColor: COLORS.bgSurface,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: RADIUS.full,
    borderWidth: 1.5,
    borderColor: COLORS.yellowPrimary,
  },
  quickReplyText: {
    color: COLORS.yellowPrimary,
    fontSize: 13,
    fontWeight: '800',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
    backgroundColor: COLORS.bgSurface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  textInput: {
    flex: 1,
    height: 42,
    backgroundColor: COLORS.bgInput,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.lg,
    color: COLORS.textPrimary,
    fontSize: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.yellowPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
