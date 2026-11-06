import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Bell, ChevronRight, Search, X } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CATEGORIES, HERO_PROMO, SKILLS } from '../../src/data/mockData';
import { useAppStore } from '../../src/store/useAppStore';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../../src/theme/theme';
import { CategoryId, Skill } from '../../src/types';

export default function HomeScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | null>(null);
  const setRecentlyViewedSkill = useAppStore((s) => s.setRecentlyViewedSkill);
  const hearts = useAppStore((s) => s.hearts);

  const filteredSkills = useMemo(() => {
    return SKILLS.filter((skill) => {
      const matchesCat = selectedCategory ? skill.category === selectedCategory : true;
      const matchesQuery = searchQuery.trim()
        ? skill.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          skill.counselorName.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      return matchesCat && matchesQuery;
    });
  }, [searchQuery, selectedCategory]);

  const fortuneSkills = useMemo(
    () => filteredSkills.filter((s) => s.sectionTag === '2024_fortune' || s.category === 'fortune'),
    [filteredSkills]
  );
  const trendingSkills = useMemo(
    () => filteredSkills.filter((s) => s.sectionTag === 'trending' || s.category === 'tarot'),
    [filteredSkills]
  );
  const recommendSkills = useMemo(
    () => filteredSkills.filter((s) => s.sectionTag === 'recommend' || s.category === 'special'),
    [filteredSkills]
  );

  const handleOpenSkill = (skill: Skill) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setRecentlyViewedSkill(skill.id);
    router.push(`/skill/${skill.id}`);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Sticky Top Bar */}
      <View style={styles.topHeader}>
        <View style={styles.brandRow}>
          <Text style={styles.wordmark}>hellobot</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.heartPill}
              onPress={() => {
                Haptics.selectionAsync();
                router.push('/(tabs)/charge');
              }}
            >
              <Text style={styles.heartPillText}>❤️ {hearts}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.bellBtn}
              onPress={() => {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                Alert.alert(
                  'Notifications 🔔',
                  'Llamama sent you a new daily Tarot blessing! Tap any skill to claim your 50% discount.'
                );
              }}
            >
              <Bell size={22} color={COLORS.textPrimary} />
              <View style={styles.unreadDot} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Sleek Dark Search Input (#1C1C1E) */}
        <View style={styles.searchBar}>
          <Search size={18} color={COLORS.textMuted} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search tarot, soulmate, palmistry, Llamama..."
            placeholderTextColor={COLORS.textMuted}
            style={styles.searchInput}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={16} color={COLORS.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Recommend Hero Card */}
        <TouchableOpacity
          activeOpacity={0.92}
          onPress={() => {
            const heroSkill =
              SKILLS.find((s) => s.id === HERO_PROMO.skillId) || SKILLS[0];
            handleOpenSkill(heroSkill);
          }}
          style={styles.heroCardWrap}
        >
          <LinearGradient
            colors={['#1E293B', '#0F172A', '#141416']}
            style={styles.heroCard}
          >
            {/* 2x2 Pet K-Costume Collage */}
            <View style={styles.collageContainer}>
              <View style={styles.collageGrid}>
                {HERO_PROMO.collageImages.map((uri, index) => (
                  <Image
                    key={uri + index}
                    source={{ uri }}
                    style={styles.collageCell}
                    contentFit="cover"
                  />
                ))}
              </View>

              {/* Floating ❤️ 44 Pill */}
              <View style={styles.floatingHeartPill}>
                <Text style={styles.floatingHeartText}>❤️ {HERO_PROMO.hearts}</Text>
              </View>

              {/* Circular 25% SALE Badge */}
              <View style={styles.saleCircleBadge}>
                <Text style={styles.saleCircleText}>{HERO_PROMO.discountBadge}</Text>
              </View>
            </View>

            {/* Hero Copy & Green CTA */}
            <View style={styles.heroContent}>
              <View style={styles.heroTagPill}>
                <Text style={styles.heroTagText}>✨ RECOMMEND</Text>
              </View>
              <Text style={styles.heroTitle}>
                {HERO_PROMO.tag}: {HERO_PROMO.title}
              </Text>
              <Text style={styles.heroSubtitle}>{HERO_PROMO.subtitle}</Text>

              <View style={styles.heroFooterRow}>
                <View style={styles.viewNowGreenBtn}>
                  <Text style={styles.viewNowGreenText}>View now!</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* 2-Row Category Grid */}
        <View style={styles.categorySection}>
          <View style={styles.categoryGrid}>
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={styles.categoryItem}
                  activeOpacity={0.78}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setSelectedCategory((prev) =>
                      prev === cat.id ? null : cat.id
                    );
                  }}
                >
                  <View
                    style={[
                      styles.categoryIconBox,
                      { backgroundColor: cat.bgTint },
                      isSelected && styles.categoryIconBoxActive,
                    ]}
                  >
                    <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
                    {cat.badge && (
                      <View style={styles.liveBadge}>
                        <Text style={styles.liveBadgeText}>{cat.badge}</Text>
                      </View>
                    )}
                  </View>
                  <Text
                    style={[
                      styles.categoryLabel,
                      isSelected && {
                        color: COLORS.yellowPrimary,
                        fontWeight: '800',
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {selectedCategory && (
            <TouchableOpacity
              style={styles.clearFilterChip}
              onPress={() => {
                Haptics.selectionAsync();
                setSelectedCategory(null);
              }}
            >
              <Text style={styles.clearFilterText}>
                Showing "{CATEGORIES.find((c) => c.id === selectedCategory)?.label}" • Tap to show all
              </Text>
              <X size={14} color={COLORS.yellowPrimary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Section 1: 🔮 2024 Fortune (Horizontal Cards) */}
        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🔮 2024 Fortune</Text>
            <TouchableOpacity
              style={styles.viewAllBtn}
              onPress={() => {
                Haptics.selectionAsync();
                setSelectedCategory(null);
              }}
            >
              <Text style={styles.viewAllText}>View all</Text>
              <ChevronRight size={15} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {(fortuneSkills.length > 0 ? fortuneSkills : SKILLS).map((skill) => (
              <TouchableOpacity
                key={skill.id}
                style={styles.horizontalSkillCard}
                activeOpacity={0.86}
                onPress={() => handleOpenSkill(skill)}
              >
                <Image
                  source={{ uri: skill.image }}
                  style={styles.horizontalArt}
                  contentFit="cover"
                />
                <Text style={styles.attributionText} numberOfLines={1}>
                  Media by {skill.counselorName}
                </Text>
                <Text style={styles.skillCardTitle} numberOfLines={2}>
                  {skill.title}
                </Text>
                <Text style={styles.ratingMeta}>
                  ⭐ {skill.rating.toFixed(1)} • {skill.usersCount}
                </Text>

                <View style={styles.priceRow}>
                  <Text style={styles.discountPct}>{skill.discountPercent}%</Text>
                  <Text style={styles.strikeHearts}>🤍 {skill.originalHearts}</Text>
                  <Text style={styles.activeHearts}>❤️ {skill.finalHearts}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Section 2: 🏆 Trending Skills (Vertical List Cards) */}
        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🏆 Trending Skills</Text>
            <TouchableOpacity
              style={styles.viewAllBtn}
              onPress={() => router.push('/(tabs)/counselors')}
            >
              <Text style={styles.viewAllText}>View all</Text>
              <ChevronRight size={15} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>

          <View style={styles.verticalList}>
            {(trendingSkills.length > 0 ? trendingSkills : SKILLS).map((skill) => (
              <TouchableOpacity
                key={skill.id}
                style={styles.verticalSkillCard}
                activeOpacity={0.86}
                onPress={() => handleOpenSkill(skill)}
              >
                <Image
                  source={{ uri: skill.image }}
                  style={styles.verticalArt}
                  contentFit="cover"
                />
                <View style={styles.verticalBody}>
                  <Text style={styles.attributionText}>
                    Media by {skill.counselorName}
                  </Text>
                  <Text style={styles.skillCardTitle} numberOfLines={2}>
                    {skill.title}
                  </Text>
                  <Text style={styles.ratingMeta}>
                    ⭐ {skill.rating.toFixed(1)} • {skill.usersCount}
                  </Text>
                  <View style={styles.priceRow}>
                    <Text style={styles.discountPct}>{skill.discountPercent}%</Text>
                    <Text style={styles.strikeHearts}>
                      🤍 {skill.originalHearts}
                    </Text>
                    <Text style={styles.activeHearts}>❤️ {skill.finalHearts}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Section 3: ✅ Recommend */}
        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>✅ Recommend</Text>
            <TouchableOpacity
              style={styles.viewAllBtn}
              onPress={() => router.push('/(tabs)/counselors')}
            >
              <Text style={styles.viewAllText}>View all</Text>
              <ChevronRight size={15} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>

          <View style={styles.verticalList}>
            {(recommendSkills.length > 0 ? recommendSkills : SKILLS).map((skill) => (
              <TouchableOpacity
                key={skill.id}
                style={styles.verticalSkillCard}
                activeOpacity={0.86}
                onPress={() => handleOpenSkill(skill)}
              >
                <Image
                  source={{ uri: skill.image }}
                  style={styles.verticalArt}
                  contentFit="cover"
                />
                <View style={styles.verticalBody}>
                  <Text style={styles.attributionText}>
                    Media by {skill.counselorName}
                  </Text>
                  <Text style={styles.skillCardTitle} numberOfLines={2}>
                    {skill.title}
                  </Text>
                  <Text style={styles.ratingMeta}>
                    ⭐ {skill.rating.toFixed(1)} • {skill.usersCount}
                  </Text>
                  <View style={styles.priceRow}>
                    <Text style={styles.discountPct}>{skill.discountPercent}%</Text>
                    <Text style={styles.strikeHearts}>
                      🤍 {skill.originalHearts}
                    </Text>
                    <Text style={styles.activeHearts}>❤️ {skill.finalHearts}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
  },
  topHeader: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xs,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.bgPrimary,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  wordmark: {
    fontSize: 27,
    fontWeight: '900',
    letterSpacing: -1,
    color: COLORS.textPrimary,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  heartPill: {
    backgroundColor: COLORS.bgSurface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  heartPillText: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '800',
  },
  bellBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.bgSurface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  unreadDot: {
    position: 'absolute',
    top: 8,
    right: 9,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.rosePrimary,
    borderWidth: 1.5,
    borderColor: COLORS.bgSurface,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgElevated,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    height: 44,
    gap: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '500',
  },
  scrollContent: {
    paddingBottom: 42,
  },
  heroCardWrap: {
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
  },
  heroCard: {
    borderRadius: RADIUS.xxl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  collageContainer: {
    height: 215,
    width: '100%',
    position: 'relative',
  },
  collageGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  collageCell: {
    width: '50%',
    height: '50%',
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.4)',
  },
  floatingHeartPill: {
    position: 'absolute',
    top: 14,
    left: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.78)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  floatingHeartText: {
    color: COLORS.textPrimary,
    fontWeight: '800',
    fontSize: 13,
  },
  saleCircleBadge: {
    position: 'absolute',
    bottom: -22,
    right: 18,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.rosePrimary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#141416',
    zIndex: 5,
  },
  saleCircleText: {
    color: COLORS.textPrimary,
    fontSize: 12,
    fontWeight: '900',
    textAlign: 'center',
    lineHeight: 14,
  },
  heroContent: {
    padding: SPACING.xl,
  },
  heroTagPill: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.emeraldSoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    marginBottom: 8,
  },
  heroTagText: {
    color: COLORS.emeraldPrimary,
    fontSize: 11,
    fontWeight: '800',
  },
  heroTitle: {
    ...TYPOGRAPHY.h1,
    marginBottom: 6,
  },
  heroSubtitle: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },
  heroFooterRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  viewNowGreenBtn: {
    backgroundColor: COLORS.emeraldPrimary,
    paddingHorizontal: 22,
    paddingVertical: 11,
    borderRadius: RADIUS.full,
  },
  viewNowGreenText: {
    color: COLORS.textInverse,
    fontWeight: '900',
    fontSize: 14,
  },
  categorySection: {
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.xxl,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: SPACING.lg,
  },
  categoryItem: {
    width: '23%',
    alignItems: 'center',
  },
  categoryIconBox: {
    width: 60,
    height: 60,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 7,
    borderWidth: 1,
    borderColor: COLORS.border,
    position: 'relative',
  },
  categoryIconBoxActive: {
    borderColor: COLORS.yellowPrimary,
    borderWidth: 2,
  },
  categoryEmoji: {
    fontSize: 26,
  },
  liveBadge: {
    position: 'absolute',
    top: -6,
    right: -8,
    backgroundColor: COLORS.rosePrimary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  liveBadgeText: {
    color: COLORS.textPrimary,
    fontSize: 9,
    fontWeight: '900',
  },
  categoryLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  clearFilterChip: {
    marginTop: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: COLORS.yellowSoft,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
  },
  clearFilterText: {
    color: COLORS.yellowPrimary,
    fontSize: 12,
    fontWeight: '700',
  },
  sectionBlock: {
    marginTop: SPACING.xxxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h1,
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewAllText: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  horizontalScroll: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
  },
  horizontalSkillCard: {
    width: 176,
    backgroundColor: COLORS.bgSurface,
    borderRadius: RADIUS.xl,
    padding: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  horizontalArt: {
    width: '100%',
    height: 152,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.sm,
  },
  attributionText: {
    ...TYPOGRAPHY.micro,
    color: COLORS.textMuted,
    marginBottom: 3,
  },
  skillCardTitle: {
    ...TYPOGRAPHY.h3,
    fontSize: 14,
    lineHeight: 19,
    marginBottom: 6,
  },
  ratingMeta: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  discountPct: {
    color: COLORS.rosePrimary,
    fontWeight: '900',
    fontSize: 13,
  },
  strikeHearts: {
    color: COLORS.textMuted,
    fontSize: 12,
    textDecorationLine: 'line-through',
  },
  activeHearts: {
    color: COLORS.textPrimary,
    fontWeight: '800',
    fontSize: 13,
  },
  verticalList: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
  },
  verticalSkillCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.bgSurface,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    gap: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  verticalArt: {
    width: 96,
    height: 96,
    borderRadius: RADIUS.lg,
  },
  verticalBody: {
    flex: 1,
    justifyContent: 'center',
  },
});
