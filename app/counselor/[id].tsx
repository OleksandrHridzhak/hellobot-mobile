import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ChevronLeft,
  MessageCircle,
  Search,
  UserCheck,
  UserPlus,
} from 'lucide-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Skeleton } from '../../src/components/Skeleton';
import { COUNSELORS, SKILLS } from '../../src/data/mockData';
import { useAppStore } from '../../src/store/useAppStore';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../../src/theme/theme';

export default function CounselorProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [isLoading, setIsLoading] = useState(true);
  const [skillQuery, setSkillQuery] = useState('');
  const [skillFilter, setSkillFilter] = useState<'all' | 'popular'>('all');

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, [id]);

  const counselor = useMemo(
    () => COUNSELORS.find((c) => c.id === id) || COUNSELORS[1],
    [id]
  );

  const followedCounselorIds = useAppStore((s) => s.followedCounselorIds);
  const toggleFollowCounselor = useAppStore((s) => s.toggleFollowCounselor);
  const isFollowing = followedCounselorIds.includes(counselor.id);

  const counselorSkills = useMemo(() => {
    const list = SKILLS.filter((s) => s.counselorId === counselor.id);
    const base = list.length > 0 ? list : SKILLS.slice(0, 2);
    return base.filter((s) =>
      skillQuery.trim()
        ? s.title.toLowerCase().includes(skillQuery.toLowerCase())
        : true
    );
  }, [counselor.id, skillQuery]);

  if (isLoading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top + 12 }]}>
        <View style={{ paddingHorizontal: SPACING.xl, gap: SPACING.lg }}>
          <Skeleton height={260} borderRadius={RADIUS.xxl} />
          <Skeleton width="60%" height={28} />
          <Skeleton width="90%" height={20} />
          <Skeleton height={86} borderRadius={RADIUS.xl} />
          <Skeleton height={46} borderRadius={RADIUS.lg} />
          <Skeleton height={110} borderRadius={RADIUS.xl} />
          <Skeleton height={110} borderRadius={RADIUS.xl} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Floating Header with Back & Follow Toggle */}
      <View style={[styles.floatingHeader, { top: insets.top + 8 }]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.back();
          }}
        >
          <ChevronLeft size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.followBtn, isFollowing && styles.followBtnActive]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            toggleFollowCounselor(counselor.id);
          }}
        >
          {isFollowing ? (
            <>
              <UserCheck size={15} color={COLORS.textInverse} />
              <Text style={styles.followBtnTextActive}>Following</Text>
            </>
          ) : (
            <>
              <UserPlus size={15} color={COLORS.textPrimary} />
              <Text style={styles.followBtnText}>Follow</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: Math.max(insets.bottom + 110, 130),
        }}
      >
        {/* Full-Bleed Hero Image */}
        <View style={styles.heroWrap}>
          <Image
            source={{ uri: counselor.heroImage }}
            style={styles.heroImage}
            contentFit="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.82)', '#000000']}
            style={styles.heroGradient}
          >
            <Image
              source={{ uri: counselor.avatar }}
              style={styles.avatarThumb}
              contentFit="cover"
            />
            <Text style={styles.heroName}>{counselor.name}</Text>
            <Text style={styles.heroSpecialty}>{counselor.specialty}</Text>
            <Text style={styles.heroBio}>{counselor.bio}</Text>
          </LinearGradient>
        </View>

        <View style={styles.bodyPadding}>
          {/* Stats Dashboard Box (1 Skill | 7 Review | Palmistry Category) */}
          <View style={styles.statsBox}>
            <View style={styles.statCol}>
              <Text style={styles.statVal}>{counselor.skillsCount}</Text>
              <Text style={styles.statLabel}>Skill</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCol}>
              <Text style={styles.statVal}>{counselor.reviewCount}</Text>
              <Text style={styles.statLabel}>Review</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCol}>
              <Text style={[styles.statVal, { color: COLORS.yellowPrimary }]}>
                {counselor.category.charAt(0).toUpperCase() +
                  counselor.category.slice(1)}
              </Text>
              <Text style={styles.statLabel}>Category</Text>
            </View>
          </View>

          {/* Search Input for Counselor's Skills */}
          <View style={styles.searchBar}>
            <Search size={18} color={COLORS.textMuted} />
            <TextInput
              value={skillQuery}
              onChangeText={setSkillQuery}
              placeholder={`Search ${counselor.name}'s skills...`}
              placeholderTextColor={COLORS.textMuted}
              style={styles.searchInput}
            />
          </View>

          {/* Filter Row */}
          <View style={styles.filterRow}>
            <Text style={styles.skillsHeading}>
              Available Skills ({counselorSkills.length})
            </Text>
            <View style={styles.filterPills}>
              {(['all', 'popular'] as const).map((f) => (
                <TouchableOpacity
                  key={f}
                  style={[
                    styles.miniChip,
                    skillFilter === f && styles.miniChipActive,
                  ]}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setSkillFilter(f);
                  }}
                >
                  <Text
                    style={[
                      styles.miniChipText,
                      skillFilter === f && styles.miniChipTextActive,
                    ]}
                  >
                    {f === 'all' ? 'All' : 'Popular'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Skill Cards */}
          <View style={styles.skillList}>
            {counselorSkills.map((skill) => (
              <TouchableOpacity
                key={skill.id}
                style={styles.skillCard}
                activeOpacity={0.86}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push(`/skill/${skill.id}`);
                }}
              >
                <Image
                  source={{ uri: skill.image }}
                  style={styles.skillArt}
                  contentFit="cover"
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.skillTitle} numberOfLines={2}>
                    {skill.title}
                  </Text>
                  <Text style={styles.skillMeta}>
                    ⭐ {skill.rating.toFixed(1)} • {skill.usersCount}
                  </Text>
                  <View style={styles.priceRow}>
                    <Text style={styles.discountPct}>
                      {skill.discountPercent}%
                    </Text>
                    <Text style={styles.strikeHearts}>
                      🤍 {skill.originalHearts}
                    </Text>
                    <Text style={styles.finalHearts}>
                      ❤️ {skill.finalHearts}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Sticky Yellow Go to Chat Room Button */}
      <View
        style={[
          styles.stickyFooter,
          { paddingBottom: Math.max(insets.bottom, SPACING.md) },
        ]}
      >
        <TouchableOpacity
          style={styles.chatRoomButton}
          activeOpacity={0.88}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.push(`/chat/${counselor.id}`);
          }}
        >
          <MessageCircle size={20} color={COLORS.textInverse} />
          <Text style={styles.chatRoomButtonText}>Go to chat room</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
  },
  floatingHeader: {
    position: 'absolute',
    left: SPACING.lg,
    right: SPACING.lg,
    zIndex: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.68)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  followBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(0,0,0,0.72)',
    borderWidth: 1,
    borderColor: COLORS.textPrimary,
  },
  followBtnActive: {
    backgroundColor: COLORS.yellowPrimary,
    borderColor: COLORS.yellowPrimary,
  },
  followBtnText: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '800',
  },
  followBtnTextActive: {
    color: COLORS.textInverse,
    fontSize: 13,
    fontWeight: '800',
  },
  heroWrap: {
    height: 360,
    width: '100%',
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: SPACING.xl,
    paddingTop: 60,
    paddingBottom: SPACING.lg,
  },
  avatarThumb: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: COLORS.yellowPrimary,
    marginBottom: SPACING.sm,
  },
  heroName: {
    ...TYPOGRAPHY.display,
    marginBottom: 4,
  },
  heroSpecialty: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.yellowPrimary,
    fontWeight: '700',
    marginBottom: 8,
  },
  heroBio: {
    ...TYPOGRAPHY.bodyMedium,
    color: '#D4D4D8',
  },
  bodyPadding: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md,
  },
  statsBox: {
    flexDirection: 'row',
    backgroundColor: COLORS.bgSurface,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.border,
  },
  statVal: {
    ...TYPOGRAPHY.h2,
    marginBottom: 4,
  },
  statLabel: {
    ...TYPOGRAPHY.caption,
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
    marginBottom: SPACING.xl,
  },
  searchInput: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 14,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  skillsHeading: {
    ...TYPOGRAPHY.h2,
  },
  filterPills: {
    flexDirection: 'row',
    gap: 8,
  },
  miniChip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.bgInput,
  },
  miniChipActive: {
    backgroundColor: COLORS.yellowPrimary,
  },
  miniChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  miniChipTextActive: {
    color: COLORS.textInverse,
  },
  skillList: {
    gap: SPACING.md,
  },
  skillCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.bgSurface,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    gap: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  skillArt: {
    width: 88,
    height: 88,
    borderRadius: RADIUS.lg,
  },
  skillTitle: {
    ...TYPOGRAPHY.h3,
    fontSize: 14,
    marginBottom: 4,
  },
  skillMeta: {
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
  finalHearts: {
    color: COLORS.textPrimary,
    fontWeight: '800',
    fontSize: 13,
  },
  stickyFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md,
    backgroundColor: 'rgba(0,0,0,0.94)',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  chatRoomButton: {
    height: 54,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.yellowPrimary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  chatRoomButtonText: {
    color: COLORS.textInverse,
    fontSize: 16,
    fontWeight: '900',
  },
});
