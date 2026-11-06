import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import {
  Check,
  Copy,
  Heart,
  Share2,
  Sparkles,
  X,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme/theme';
import { FortuneReport } from '../types';

interface ReportModalProps {
  visible: boolean;
  report: FortuneReport | null;
  onClose: () => void;
  onSelectCounselor?: (counselorId: string) => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  visible,
  report,
  onClose,
  onSelectCounselor,
}) => {
  const insets = useSafeAreaInsets();
  const [copiedChannel, setCopiedChannel] = useState<string | null>(null);

  if (!visible || !report) return null;

  const handleShareChannel = (channel: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCopiedChannel(channel);
    setTimeout(() => setCopiedChannel(null), 2400);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Top Bar */}
        <View style={styles.header}>
          <View style={styles.headerBadge}>
            <Sparkles size={14} color={COLORS.yellowPrimary} />
            <Text style={styles.headerBadgeText}>OFFICIAL FORTUNE REPORT</Text>
          </View>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onClose();
            }}
          >
            <X size={20} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom + 32, 48) },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Report Title */}
          <Text style={styles.reportDate}>{report.createdAt}</Text>
          <Text style={styles.reportTitle}>{report.title}</Text>
          <Text style={styles.reportSubtitle}>{report.subtitle}</Text>

          {/* Drawn Tarot Hero Card */}
          <View style={styles.tarotShowcaseCard}>
            <View style={styles.romanPill}>
              <Text style={styles.romanText}>ARCANA {report.tarotCard.numberRoman}</Text>
            </View>
            <Image
              source={{ uri: report.tarotCard.image }}
              style={styles.tarotArtwork}
              contentFit="cover"
            />
            <Text style={styles.tarotName}>{report.tarotCard.name}</Text>

            <View style={styles.keywordWrap}>
              {report.tarotCard.keywords.map((kw) => (
                <View key={kw} style={styles.keywordChip}>
                  <Text style={styles.keywordText}># {kw}</Text>
                </View>
              ))}
            </View>

            <View style={styles.scoreMeterBox}>
              <View style={styles.scoreHeader}>
                <Text style={styles.scoreLabel}>Destined Love Resonance</Text>
                <Text style={styles.scoreValue}>{report.compatibilityScore}%</Text>
              </View>
              <View style={styles.scoreTrack}>
                <View
                  style={[
                    styles.scoreFill,
                    { width: `${report.compatibilityScore}%` },
                  ]}
                />
              </View>
            </View>
          </View>

          {/* Core Reading Section */}
          <View style={styles.sectionBox}>
            <Text style={styles.sectionTitle}>🔮 Core Card Interpretation</Text>
            <Text style={styles.bodyText}>{report.tarotCard.uprightMeaning}</Text>
            <View style={styles.divider} />
            <Text style={styles.bodyText}>{report.coreSummary}</Text>
          </View>

          {/* 30-Day Love Timeline */}
          <View style={styles.sectionBox}>
            <Text style={styles.sectionTitle}>🗓️ 30-Day Romantic Timeline</Text>
            {report.loveTimeline.map((slot, idx) => (
              <View key={slot.period} style={styles.timelineItem}>
                <View style={styles.timelineDotCol}>
                  <View style={styles.timelineDot} />
                  {idx < report.loveTimeline.length - 1 && (
                    <View style={styles.timelineLine} />
                  )}
                </View>
                <View style={styles.timelineContent}>
                  <Text style={styles.timelinePeriod}>{slot.period}</Text>
                  <Text style={styles.timelineDesc}>{slot.prediction}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Actionable Advice & Lucky Charms */}
          <View style={styles.sectionBox}>
            <Text style={styles.sectionTitle}>🍀 Secret Action Guide</Text>
            {report.actionableAdvice.map((tip) => (
              <View key={tip} style={styles.adviceRow}>
                <View style={styles.checkBadge}>
                  <Check size={12} color={COLORS.textInverse} strokeWidth={3} />
                </View>
                <Text style={styles.adviceText}>{tip}</Text>
              </View>
            ))}

            <View style={styles.luckyGrid}>
              <View style={styles.luckyCard}>
                <Text style={styles.luckyLabel}>LUCKY CHARM</Text>
                <Text style={styles.luckyValue}>{report.tarotCard.luckyItem}</Text>
              </View>
              <View style={styles.luckyCard}>
                <Text style={styles.luckyLabel}>AURA COLOR</Text>
                <Text style={styles.luckyValue}>{report.tarotCard.luckyColor}</Text>
              </View>
            </View>
          </View>

          {/* Counselor Promo Card */}
          <TouchableOpacity
            style={styles.counselorPromo}
            activeOpacity={0.85}
            onPress={() => {
              onClose();
              onSelectCounselor?.(report.counselorId);
            }}
          >
            <Image
              source={{ uri: report.counselorAvatar }}
              style={styles.counselorAvatar}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.counselorTag}>COUNSELOR IN CHARGE</Text>
              <Text style={styles.counselorName}>{report.counselorName}</Text>
              <Text style={styles.counselorSub}>
                Tap to explore more Love & Reunion Tarot spreads →
              </Text>
            </View>
          </TouchableOpacity>

          {/* Share Section */}
          <View style={styles.shareContainer}>
            <Text style={styles.shareHeading}>Share & Archive Your Reading</Text>
            <Text style={styles.shareCaption}>
              Your results are archived when shared with friends
            </Text>

            <View style={styles.shareRow}>
              {[
                { id: 'Instagram', label: 'Instagram', bg: '#E1306C', icon: '📸' },
                { id: 'Facebook', label: 'Facebook', bg: '#1877F2', icon: '📘' },
                { id: 'X', label: 'X (Twitter)', bg: '#27272A', icon: '𝕏' },
                { id: 'Copy Link', label: 'Copy Link', bg: COLORS.yellowPrimary, icon: '🔗', dark: true },
              ].map((btn) => (
                <TouchableOpacity
                  key={btn.id}
                  style={styles.shareBtnCol}
                  onPress={() => handleShareChannel(btn.id)}
                >
                  <View
                    style={[
                      styles.shareCircle,
                      { backgroundColor: btn.bg },
                    ]}
                  >
                    <Text
                      style={[
                        styles.shareEmoji,
                        btn.dark && { color: COLORS.textInverse },
                      ]}
                    >
                      {btn.icon}
                    </Text>
                  </View>
                  <Text style={styles.shareBtnLabel}>{btn.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {copiedChannel && (
              <View style={styles.toastBanner}>
                <Copy size={14} color={COLORS.emeraldPrimary} />
                <Text style={styles.toastText}>
                  Shared via {copiedChannel}! Reading permanently archived to your Report tab.
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.yellowSoft,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
  },
  headerBadgeText: {
    color: COLORS.yellowPrimary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.bgInput,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: SPACING.xl,
  },
  reportDate: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  reportTitle: {
    ...TYPOGRAPHY.display,
    marginBottom: 6,
  },
  reportSubtitle: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.yellowPrimary,
    marginBottom: SPACING.xl,
  },
  tarotShowcaseCard: {
    backgroundColor: '#130D21',
    borderRadius: RADIUS.xxl,
    padding: SPACING.xl,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#5B21B6',
    marginBottom: SPACING.xl,
  },
  romanPill: {
    backgroundColor: 'rgba(167, 139, 250, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    marginBottom: SPACING.md,
  },
  romanText: {
    color: '#DDD6FE',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  tarotArtwork: {
    width: 170,
    height: 250,
    borderRadius: RADIUS.lg,
    borderWidth: 2,
    borderColor: COLORS.yellowPrimary,
    marginBottom: SPACING.lg,
  },
  tarotName: {
    ...TYPOGRAPHY.h1,
    color: COLORS.yellowPrimary,
    letterSpacing: 1,
    marginBottom: SPACING.md,
  },
  keywordWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: SPACING.xl,
  },
  keywordChip: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
  },
  keywordText: {
    color: '#E9D5FF',
    fontSize: 12,
    fontWeight: '600',
  },
  scoreMeterBox: {
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.45)',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  scoreLabel: {
    ...TYPOGRAPHY.caption,
    color: '#DDD6FE',
  },
  scoreValue: {
    ...TYPOGRAPHY.h3,
    color: COLORS.yellowPrimary,
  },
  scoreTrack: {
    height: 8,
    backgroundColor: '#2E1065',
    borderRadius: RADIUS.full,
    overflow: 'hidden',
  },
  scoreFill: {
    height: '100%',
    backgroundColor: COLORS.yellowPrimary,
    borderRadius: RADIUS.full,
  },
  sectionBox: {
    backgroundColor: COLORS.bgSurface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h2,
    marginBottom: SPACING.md,
  },
  bodyText: {
    ...TYPOGRAPHY.body,
    color: '#E4E4E7',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.md,
  },
  timelineItem: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  timelineDotCol: {
    alignItems: 'center',
    width: 16,
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.yellowPrimary,
    marginTop: 5,
  },
  timelineLine: {
    flex: 1,
    width: 2,
    backgroundColor: COLORS.border,
    marginVertical: 4,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: SPACING.lg,
  },
  timelinePeriod: {
    ...TYPOGRAPHY.h3,
    color: COLORS.yellowPrimary,
    marginBottom: 4,
  },
  timelineDesc: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
  },
  adviceRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: SPACING.md,
  },
  checkBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.yellowPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  adviceText: {
    flex: 1,
    ...TYPOGRAPHY.body,
    color: '#E4E4E7',
  },
  luckyGrid: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.md,
  },
  luckyCard: {
    flex: 1,
    backgroundColor: COLORS.bgInput,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  luckyLabel: {
    ...TYPOGRAPHY.micro,
    color: COLORS.yellowPrimary,
    marginBottom: 4,
  },
  luckyValue: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
  counselorPromo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    backgroundColor: COLORS.bgSurface,
    padding: SPACING.lg,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.xl,
  },
  counselorAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: COLORS.yellowPrimary,
  },
  counselorTag: {
    ...TYPOGRAPHY.micro,
    color: COLORS.yellowPrimary,
  },
  counselorName: {
    ...TYPOGRAPHY.h2,
  },
  counselorSub: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  shareContainer: {
    backgroundColor: COLORS.bgSurface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  shareHeading: {
    ...TYPOGRAPHY.h2,
    marginBottom: 4,
  },
  shareCaption: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
  },
  shareRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  shareBtnCol: {
    alignItems: 'center',
    gap: 8,
  },
  shareCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareEmoji: {
    fontSize: 22,
    color: COLORS.textPrimary,
    fontWeight: '800',
  },
  shareBtnLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  toastBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: SPACING.lg,
    backgroundColor: COLORS.emeraldSoft,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
  },
  toastText: {
    color: COLORS.emeraldPrimary,
    fontSize: 12,
    fontWeight: '700',
  },
});
