import * as Haptics from '../../src/utils/haptics';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ArrowUpDown, Search, Star } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COUNSELORS } from '../../src/data/mockData';
import { useAppStore } from '../../src/store/useAppStore';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../../src/theme/theme';

type FilterChipId = 'all' | 'following' | 'ai_profile' | 'palmistry';

const FILTER_CHIPS: { id: FilterChipId; label: string }[] = [
  { id: 'following', label: 'Following' },
  { id: 'all', label: 'All' },
  { id: 'ai_profile', label: 'AI Profile' },
  { id: 'palmistry', label: 'Palmistry' },
];

export default function CounselorsScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterChipId>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'rating'>('popular');
  const followedCounselorIds = useAppStore((s) => s.followedCounselorIds);

  const displayedCounselors = useMemo(() => {
    const filtered = COUNSELORS.filter((c) => {
      if (activeFilter === 'following') {
        return followedCounselorIds.includes(c.id);
      }
      if (activeFilter === 'ai_profile') {
        return c.category === 'ai_profile';
      }
      if (activeFilter === 'palmistry') {
        return c.category === 'palmistry';
      }
      return true;
    }).filter((c) =>
      search.trim()
        ? c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.specialty.toLowerCase().includes(search.toLowerCase())
        : true
    );

    return [...filtered].sort((a, b) =>
      sortBy === 'popular'
        ? b.reviewCount - a.reviewCount
        : b.rating - a.rating
    );
  }, [activeFilter, followedCounselorIds, search, sortBy]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header & Search */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Counselors</Text>
        <View style={styles.searchBar}>
          <Search size={18} color={COLORS.textMuted} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search AI counselors & specialties..."
            placeholderTextColor={COLORS.textMuted}
            style={styles.searchInput}
          />
        </View>

        {/* Filter Chips + Sort Selector */}
        <View style={styles.controlsRow}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsScroll}
          >
            {FILTER_CHIPS.map((chip) => {
              const active = activeFilter === chip.id;
              return (
                <TouchableOpacity
                  key={chip.id}
                  style={[styles.chip, active && styles.chipActive]}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setActiveFilter(chip.id);
                  }}
                >
                  <Text
                    style={[
                      styles.chipText,
                      active && styles.chipTextActive,
                    ]}
                  >
                    {chip.label}
                    {chip.id === 'following'
                      ? ` (${followedCounselorIds.length})`
                      : ''}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <TouchableOpacity
            style={styles.sortButton}
            onPress={() => {
              Haptics.selectionAsync();
              setSortBy((prev) => (prev === 'popular' ? 'rating' : 'popular'));
            }}
          >
            <ArrowUpDown size={13} color={COLORS.textSecondary} />
            <Text style={styles.sortText}>
              {sortBy === 'popular' ? 'Popular' : 'Top Rated'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 2-Column Masonry/Grid of Counselor Cards */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.gridContainer}
      >
        <View style={styles.gridWrap}>
          {displayedCounselors.map((counselor) => {
            const isFollowing = followedCounselorIds.includes(counselor.id);
            return (
              <TouchableOpacity
                key={counselor.id}
                style={styles.card}
                activeOpacity={0.88}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push(`/counselor/${counselor.id}`);
                }}
              >
                <View style={styles.portraitContainer}>
                  <Image
                    source={{ uri: counselor.avatar }}
                    style={styles.portrait}
                    contentFit="cover"
                  />

                  {/* Specialty Badge Top-Left */}
                  <View style={styles.specialtyBadge}>
                    <Text style={styles.specialtyText} numberOfLines={1}>
                      {counselor.specialty.split('&')[0].trim()}
                    </Text>
                  </View>

                  {isFollowing && (
                    <View style={styles.followingDot}>
                      <Text style={styles.followingDotText}>✓</Text>
                    </View>
                  )}

                  {/* Gradient Overlay at Bottom */}
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.88)', '#000000']}
                    style={styles.gradientOverlay}
                  >
                    <Text style={styles.counselorName}>{counselor.name}</Text>
                    <View style={styles.ratingRow}>
                      <Star
                        size={12}
                        color={COLORS.yellowPrimary}
                        fill={COLORS.yellowPrimary}
                      />
                      <Text style={styles.ratingNum}>
                        {counselor.rating.toFixed(1)}
                      </Text>
                      <Text style={styles.reviewCount}>
                        ({counselor.reviewCount} reviews)
                      </Text>
                    </View>
                  </LinearGradient>
                </View>

                {/* Quote Box Below */}
                <View style={styles.quoteBox}>
                  <Text style={styles.quoteText} numberOfLines={2}>
                    {counselor.quote}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
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
    marginBottom: SPACING.md,
  },
  searchInput: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 14,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.sm,
  },
  chipsScroll: {
    gap: 8,
    paddingRight: SPACING.sm,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.bgInput,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipActive: {
    backgroundColor: COLORS.yellowPrimary,
    borderColor: COLORS.yellowPrimary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  chipTextActive: {
    color: COLORS.textInverse,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.bgSurface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sortText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  gridContainer: {
    padding: SPACING.lg,
    paddingBottom: 40,
  },
  gridWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: SPACING.lg,
  },
  card: {
    width: '48%',
    backgroundColor: COLORS.bgSurface,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  portraitContainer: {
    height: 210,
    width: '100%',
    position: 'relative',
  },
  portrait: {
    width: '100%',
    height: '100%',
  },
  specialtyBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.76)',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    maxWidth: '78%',
  },
  specialtyText: {
    color: COLORS.yellowPrimary,
    fontSize: 10,
    fontWeight: '800',
  },
  followingDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.yellowPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  followingDotText: {
    color: COLORS.textInverse,
    fontSize: 11,
    fontWeight: '900',
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: SPACING.md,
    paddingTop: 28,
    paddingBottom: SPACING.sm,
  },
  counselorName: {
    ...TYPOGRAPHY.h2,
    fontSize: 17,
    marginBottom: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingNum: {
    color: COLORS.yellowPrimary,
    fontSize: 12,
    fontWeight: '800',
  },
  reviewCount: {
    color: COLORS.textSecondary,
    fontSize: 11,
  },
  quoteBox: {
    padding: SPACING.md,
    backgroundColor: COLORS.bgSurface,
    minHeight: 58,
    justifyContent: 'center',
  },
  quoteText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
});
