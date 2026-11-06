import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  Bookmark,
  Check,
  Share2,
  Sparkles,
  Users,
  X,
} from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SentimentChart } from '../../src/components/SentimentChart';
import { SkillCheckoutSheet } from '../../src/components/SkillCheckoutSheet';
import { SKILLS } from '../../src/data/mockData';
import { useAppStore } from '../../src/store/useAppStore';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../../src/theme/theme';

export default function SkillDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollY = useSharedValue(0);

  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const skill = useMemo(
    () => SKILLS.find((s) => s.id === id) || SKILLS[0],
    [id]
  );

  const relatedSkills = useMemo(
    () =>
      SKILLS.filter(
        (s) => skill.relatedSkillIds.includes(s.id) && s.id !== skill.id
      ),
    [skill]
  );

  const hearts = useAppStore((s) => s.hearts);
  const bookmarkedSkillIds = useAppStore((s) => s.bookmarkedSkillIds);
  const toggleBookmarkSkill = useAppStore((s) => s.toggleBookmarkSkill);
  const unlockSkill = useAppStore((s) => s.unlockSkill);
  const resetChatRoom = useAppStore((s) => s.resetChatRoom);

  const isBookmarked = bookmarkedSkillIds.includes(skill.id);

  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const stickyHeaderBgStyle = useAnimatedStyle(() => ({
    backgroundColor: `rgba(0, 0, 0, ${interpolate(
      scrollY.value,
      [60, 150],
      [0, 0.96],
      Extrapolation.CLAMP
    )})`,
    borderBottomColor: `rgba(42, 42, 48, ${interpolate(
      scrollY.value,
      [100, 160],
      [0, 1],
      Extrapolation.CLAMP
    )})`,
  }));

  const stickyTitleStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [90, 160],
      [0, 1],
      Extrapolation.CLAMP
    ),
    transform: [
      {
        translateY: interpolate(
          scrollY.value,
          [90, 160],
          [8, 0],
          Extrapolation.CLAMP
        ),
      },
    ],
  }));

  const handleConfirmPurchase = () => {
    const ok = unlockSkill(skill.id, skill.finalHearts);
    if (!ok) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(
        'Not Enough Hearts ❤️',
        `You need ${skill.finalHearts} Hearts to unlock this reading, but you currently have ${hearts} Hearts. Would you like to top up now?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Charge Hearts',
            onPress: () => {
              setCheckoutOpen(false);
              router.push('/(tabs)/charge');
            },
          },
        ]
      );
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCheckoutOpen(false);
    resetChatRoom(skill.counselorId);
    router.replace(`/chat/${skill.counselorId}`);
  };

  return (
    <View style={styles.container}>
      {/* Animated Sticky Header */}
      <Animated.View
        style={[
          styles.stickyHeader,
          { paddingTop: insets.top + 6 },
          stickyHeaderBgStyle,
        ]}
      >
        <Animated.Text
          style={[styles.stickyTitle, stickyTitleStyle]}
          numberOfLines={1}
        >
          {skill.title}
        </Animated.Text>

        <View style={styles.headerRightActions}>
          <TouchableOpacity
            style={styles.circleBtn}
            onPress={() => {
              Haptics.selectionAsync();
              Share.share({
                message: `Check out "${skill.title}" by ${skill.counselorName} on HelloBot!`,
              });
            }}
          >
            <Share2 size={18} color={COLORS.textPrimary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.circleBtn}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.back();
            }}
          >
            <X size={20} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: Math.max(insets.bottom + 110, 130),
        }}
      >
        {/* Artwork Banner */}
        <Image
          source={{ uri: skill.image }}
          style={styles.heroArtwork}
          contentFit="cover"
        />

        {/* Overview Block */}
        <View style={styles.overviewBlock}>
          <TouchableOpacity
            style={styles.counselorRow}
            onPress={() => router.push(`/counselor/${skill.counselorId}`)}
          >
            <View style={styles.miniTarotBadge}>
              <Sparkles size={13} color={COLORS.yellowPrimary} />
            </View>
            <Text style={styles.counselorName}>{skill.counselorName}</Text>
          </TouchableOpacity>

          <Text style={styles.largeTitle}>{skill.title}</Text>
          <Text style={styles.subtitleText}>{skill.subtitle}</Text>

          <View style={styles.priceBannerRow}>
            <View style={styles.discountPill}>
              <Text style={styles.discountPillText}>
                {skill.discountPercent}% OFF
              </Text>
            </View>
            <Text style={styles.originalPrice}>🤍 {skill.originalHearts}</Text>
            <Text style={styles.finalPrice}>❤️ {skill.finalHearts}</Text>
          </View>

          {/* Bordered 2-Column Metric Box */}
          <View style={styles.metricBox}>
            <View style={styles.metricCol}>
              <Text style={styles.metricValue}>
                ⭐ {skill.rating.toFixed(1)} Rating
              </Text>
              <Text style={styles.metricSub}>Verified satisfaction</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricCol}>
              <View style={styles.usersRow}>
                <Users size={15} color={COLORS.yellowPrimary} />
                <Text style={styles.metricValue}>{skill.usersCount}</Text>
              </View>
              <Text style={styles.metricSub}>Completed readings</Text>
            </View>
          </View>
        </View>

        {/* Skill Introduction Card */}
        <View style={styles.sectionPadding}>
          <View style={styles.introCard}>
            <Text style={styles.introHeading}>Who should try?</Text>
            <View style={styles.bulletList}>
              {skill.whoShouldTry.map((point) => (
                <View key={point} style={styles.bulletRow}>
                  <View style={styles.checkCircle}>
                    <Check
                      size={12}
                      color={COLORS.textInverse}
                      strokeWidth={3}
                    />
                  </View>
                  <Text style={styles.bulletText}>{point}</Text>
                </View>
              ))}
            </View>

            <View style={styles.introDivider} />
            <Text style={styles.introHeading}>About this reading</Text>
            <Text style={styles.descriptionCopy}>{skill.description}</Text>
          </View>
        </View>

        {/* Sentiment Review Chart ("89 reviews received") */}
        <View style={styles.sectionPadding}>
          <SentimentChart
            totalReviews={skill.reviewCount}
            sentiments={skill.sentiments}
          />
        </View>

        {/* Related Skills Cross-Sell List */}
        <View style={styles.sectionPadding}>
          <Text style={styles.relatedTitle}>Related Skills</Text>
          <View style={styles.relatedList}>
            {relatedSkills.map((rel) => (
              <TouchableOpacity
                key={rel.id}
                style={styles.relatedCard}
                activeOpacity={0.86}
                onPress={() => {
                  Haptics.selectionAsync();
                  router.replace(`/skill/${rel.id}`);
                }}
              >
                <Image
                  source={{ uri: rel.image }}
                  style={styles.relatedArt}
                  contentFit="cover"
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.relatedCounselor}>
                    Media by {rel.counselorName}
                  </Text>
                  <Text style={styles.relatedSkillTitle} numberOfLines={2}>
                    {rel.title}
                  </Text>
                  <View style={styles.relatedPriceRow}>
                    <Text style={styles.relatedDiscount}>
                      {rel.discountPercent}%
                    </Text>
                    <Text style={styles.relatedHearts}>
                      ❤️ {rel.finalHearts}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Animated.ScrollView>

      {/* Sticky Bottom Action Bar */}
      <View
        style={[
          styles.bottomBar,
          { paddingBottom: Math.max(insets.bottom, SPACING.md) },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.bookmarkBtn,
            isBookmarked && styles.bookmarkBtnActive,
          ]}
          activeOpacity={0.8}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            toggleBookmarkSkill(skill.id);
          }}
        >
          <Bookmark
            size={22}
            color={isBookmarked ? COLORS.yellowPrimary : COLORS.textPrimary}
            fill={isBookmarked ? COLORS.yellowPrimary : 'transparent'}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.viewNowBtn}
          activeOpacity={0.88}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            setCheckoutOpen(true);
          }}
        >
          <Text style={styles.viewNowText}>View now</Text>
        </TouchableOpacity>
      </View>

      {/* Checkout Bottom Sheet */}
      <SkillCheckoutSheet
        visible={checkoutOpen}
        skill={skill}
        userHearts={hearts}
        onClose={() => setCheckoutOpen(false)}
        onGetHearts={() => {
          setCheckoutOpen(false);
          router.push('/(tabs)/charge');
        }}
        onConfirmBuy={handleConfirmPurchase}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
  },
  stickyHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  stickyTitle: {
    ...TYPOGRAPHY.h3,
    flex: 1,
    marginRight: SPACING.md,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  circleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(20, 20, 22, 0.82)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  heroArtwork: {
    width: '100%',
    height: 290,
  },
  overviewBlock: {
    padding: SPACING.xl,
  },
  counselorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: SPACING.sm,
  },
  miniTarotBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.yellowSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counselorName: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.yellowPrimary,
    fontWeight: '700',
  },
  largeTitle: {
    ...TYPOGRAPHY.display,
    marginBottom: 8,
  },
  subtitleText: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },
  priceBannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: SPACING.xl,
  },
  discountPill: {
    backgroundColor: COLORS.roseSoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  discountPillText: {
    color: COLORS.rosePrimary,
    fontWeight: '900',
    fontSize: 13,
  },
  originalPrice: {
    color: COLORS.textMuted,
    fontSize: 16,
    textDecorationLine: 'line-through',
  },
  finalPrice: {
    ...TYPOGRAPHY.h1,
    color: COLORS.textPrimary,
  },
  metricBox: {
    flexDirection: 'row',
    backgroundColor: COLORS.bgSurface,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: SPACING.lg,
  },
  metricCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricDivider: {
    width: 1,
    backgroundColor: COLORS.border,
  },
  usersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metricValue: {
    ...TYPOGRAPHY.h3,
    marginBottom: 2,
  },
  metricSub: {
    ...TYPOGRAPHY.caption,
  },
  sectionPadding: {
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  introCard: {
    backgroundColor: COLORS.bgSurface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  introHeading: {
    ...TYPOGRAPHY.h2,
    marginBottom: SPACING.md,
  },
  bulletList: {
    gap: SPACING.md,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.yellowPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  bulletText: {
    flex: 1,
    ...TYPOGRAPHY.body,
    color: '#E4E4E7',
  },
  introDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.xl,
  },
  descriptionCopy: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  relatedTitle: {
    ...TYPOGRAPHY.h2,
    marginBottom: SPACING.md,
  },
  relatedList: {
    gap: SPACING.md,
  },
  relatedCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.bgSurface,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    gap: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  relatedArt: {
    width: 78,
    height: 78,
    borderRadius: RADIUS.lg,
  },
  relatedCounselor: {
    ...TYPOGRAPHY.micro,
    color: COLORS.textMuted,
    marginBottom: 2,
  },
  relatedSkillTitle: {
    ...TYPOGRAPHY.h3,
    fontSize: 14,
    marginBottom: 6,
  },
  relatedPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  relatedDiscount: {
    color: COLORS.rosePrimary,
    fontWeight: '800',
    fontSize: 12,
  },
  relatedHearts: {
    color: COLORS.textPrimary,
    fontWeight: '800',
    fontSize: 12,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md,
    backgroundColor: 'rgba(0,0,0,0.94)',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  bookmarkBtn: {
    width: 54,
    height: 54,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.bgSurface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  bookmarkBtnActive: {
    borderColor: COLORS.yellowPrimary,
    backgroundColor: COLORS.yellowSoft,
  },
  viewNowBtn: {
    flex: 1,
    height: 54,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.yellowPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewNowText: {
    color: COLORS.textInverse,
    fontSize: 16,
    fontWeight: '900',
  },
});
