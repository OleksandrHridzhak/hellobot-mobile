import * as Haptics from '../../src/utils/haptics';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { ChevronRight, FileText, Sparkles } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ReportModal } from '../../src/components/ReportModal';
import { SKILLS } from '../../src/data/mockData';
import { useAppStore } from '../../src/store/useAppStore';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../../src/theme/theme';
import { FortuneReport } from '../../src/types';

type SegmentTab = 'chat' | 'free' | 'report';

export default function ChatAndReportScreen() {
  const router = useRouter();
  const [segment, setSegment] = useState<SegmentTab>('chat');
  const [activeReport, setActiveReport] = useState<FortuneReport | null>(null);

  const chatThreads = useAppStore((s) => s.chatThreads);
  const savedReports = useAppStore((s) => s.savedReports);
  const recentlyViewedSkillId = useAppStore((s) => s.recentlyViewedSkillId);

  const recentSkill = useMemo(
    () => SKILLS.find((s) => s.id === recentlyViewedSkillId) || SKILLS[0],
    [recentlyViewedSkillId]
  );

  const visibleThreads = useMemo(() => {
    if (segment === 'free') {
      return chatThreads.filter((t) => t.isFreeConsultation);
    }
    return chatThreads;
  }, [chatThreads, segment]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Top Segmented Pills */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chat & Report</Text>
        <View style={styles.segmentRow}>
          {[
            { id: 'chat' as const, label: 'Chat' },
            { id: 'free' as const, label: 'Free Consultation' },
            { id: 'report' as const, label: `Report (${savedReports.length})` },
          ].map((tab) => {
            const active = segment === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[styles.segmentPill, active && styles.segmentPillActive]}
                onPress={() => {
                  Haptics.selectionAsync();
                  setSegment(tab.id);
                }}
              >
                <Text
                  style={[
                    styles.segmentText,
                    active && styles.segmentTextActive,
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Recently Viewed Skill Banner */}
        <TouchableOpacity
          style={styles.recentBanner}
          activeOpacity={0.86}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push(`/skill/${recentSkill.id}`);
          }}
        >
          <Image
            source={{ uri: recentSkill.image }}
            style={styles.recentImage}
            contentFit="cover"
          />
          <View style={{ flex: 1 }}>
            <View style={styles.recentTagRow}>
              <Sparkles size={12} color={COLORS.yellowPrimary} />
              <Text style={styles.recentTag}>RECENTLY VIEWED SKILL</Text>
            </View>
            <Text style={styles.recentTitle} numberOfLines={1}>
              {recentSkill.title}
            </Text>
            <Text style={styles.recentSub}>
              {recentSkill.counselorName} • ❤️ {recentSkill.finalHearts}
            </Text>
          </View>
          <ChevronRight size={18} color={COLORS.textMuted} />
        </TouchableOpacity>

        {/* Segment Content */}
        {segment === 'report' ? (
          <View style={styles.listSection}>
            <Text style={styles.sectionHeading}>Saved Fortune Reports</Text>
            {savedReports.map((rep) => (
              <TouchableOpacity
                key={rep.id}
                style={styles.reportCard}
                activeOpacity={0.86}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setActiveReport(rep);
                }}
              >
                <Image
                  source={{ uri: rep.tarotCard.image }}
                  style={styles.reportCardArt}
                  contentFit="cover"
                />
                <View style={{ flex: 1 }}>
                  <View style={styles.reportBadgeRow}>
                    <FileText size={12} color={COLORS.yellowPrimary} />
                    <Text style={styles.reportBadgeText}>
                      {rep.tarotCard.name}
                    </Text>
                  </View>
                  <Text style={styles.threadName}>{rep.title}</Text>
                  <Text style={styles.threadPreview} numberOfLines={2}>
                    {rep.coreSummary}
                  </Text>
                  <Text style={styles.threadTime}>
                    Counselor {rep.counselorName} • {rep.createdAt}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.listSection}>
            <Text style={styles.sectionHeading}>
              {segment === 'free'
                ? 'Free Daily Bot Consultations'
                : 'Active Counseling Rooms'}
            </Text>

            {visibleThreads.map((thread) => (
              <TouchableOpacity
                key={thread.id}
                style={styles.threadRow}
                activeOpacity={0.85}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push(`/chat/${thread.counselorId}`);
                }}
              >
                <View style={styles.avatarWrap}>
                  <Image
                    source={{ uri: thread.counselorAvatar }}
                    style={styles.avatar}
                    contentFit="cover"
                  />
                  <View style={styles.onlineDot} />
                </View>

                <View style={styles.threadBody}>
                  <View style={styles.threadTopRow}>
                    <Text style={styles.threadName}>{thread.counselorName}</Text>
                    <Text style={styles.threadTime}>{thread.timestamp}</Text>
                  </View>
                  <Text style={styles.threadSkillTag} numberOfLines={1}>
                    🔮 {thread.skillTitle}
                  </Text>
                  <Text style={styles.threadPreview} numberOfLines={1}>
                    {thread.lastMessage}
                  </Text>
                </View>

                {thread.unreadCount > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadBadgeText}>
                      {thread.unreadCount}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      <ReportModal
        visible={!!activeReport}
        report={activeReport}
        onClose={() => setActiveReport(null)}
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
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xs,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
  },
  headerTitle: {
    ...TYPOGRAPHY.display,
    marginBottom: SPACING.md,
  },
  segmentRow: {
    flexDirection: 'row',
    gap: 8,
  },
  segmentPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.bgInput,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  segmentPillActive: {
    backgroundColor: COLORS.yellowPrimary,
    borderColor: COLORS.yellowPrimary,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  segmentTextActive: {
    color: COLORS.textInverse,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: 40,
  },
  recentBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    backgroundColor: COLORS.bgSurface,
    padding: SPACING.md,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.xxl,
  },
  recentImage: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.md,
  },
  recentTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  recentTag: {
    ...TYPOGRAPHY.micro,
    color: COLORS.yellowPrimary,
  },
  recentTitle: {
    ...TYPOGRAPHY.h3,
    fontSize: 14,
  },
  recentSub: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  listSection: {
    gap: SPACING.md,
  },
  sectionHeading: {
    ...TYPOGRAPHY.h2,
    marginBottom: 4,
  },
  threadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    backgroundColor: COLORS.bgSurface,
    padding: SPACING.md,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  avatarWrap: {
    position: 'relative',
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.emeraldPrimary,
    borderWidth: 2,
    borderColor: COLORS.bgSurface,
  },
  threadBody: {
    flex: 1,
  },
  threadTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  threadName: {
    ...TYPOGRAPHY.h3,
  },
  threadTime: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
  },
  threadSkillTag: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.yellowPrimary,
    marginBottom: 3,
  },
  threadPreview: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
  },
  unreadBadge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.rosePrimary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadBadgeText: {
    color: COLORS.textPrimary,
    fontSize: 11,
    fontWeight: '800',
  },
  reportCard: {
    flexDirection: 'row',
    gap: SPACING.md,
    backgroundColor: COLORS.bgSurface,
    padding: SPACING.md,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  reportCardArt: {
    width: 72,
    height: 102,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.yellowPrimary,
  },
  reportBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 4,
  },
  reportBadgeText: {
    ...TYPOGRAPHY.micro,
    color: COLORS.yellowPrimary,
  },
});
