import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme/theme';
import { SentimentItem } from '../types';

interface SentimentChartProps {
  totalReviews: number;
  sentiments: SentimentItem[];
}

const AnimatedBar: React.FC<{ item: SentimentItem; index: number }> = ({ item, index }) => {
  const heightProgress = useSharedValue(0);

  useEffect(() => {
    heightProgress.value = withDelay(
      index * 90,
      withTiming(item.percentage, {
        duration: 650,
        easing: Easing.out(Easing.cubic),
      })
    );
  }, [heightProgress, index, item.percentage]);

  const barStyle = useAnimatedStyle(() => ({
    height: `${Math.max(heightProgress.value, 8)}%`,
  }));

  return (
    <View style={styles.column}>
      <Text
        style={[
          styles.countText,
          item.isDominant && { color: COLORS.yellowPrimary, fontWeight: '800' },
        ]}
      >
        {item.count}
      </Text>
      <View style={styles.track}>
        <Animated.View
          style={[
            styles.fill,
            {
              backgroundColor: item.isDominant ? COLORS.yellowPrimary : '#3A3A44',
            },
            barStyle,
          ]}
        />
      </View>
      <Text style={styles.emoji}>{item.emoji}</Text>
      <Text
        style={[
          styles.label,
          item.isDominant && { color: COLORS.textPrimary, fontWeight: '700' },
        ]}
      >
        {item.label}
      </Text>
    </View>
  );
};

export const SentimentChart: React.FC<SentimentChartProps> = ({
  totalReviews,
  sentiments,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{totalReviews} reviews received</Text>
        <View style={styles.dominantBadge}>
          <Text style={styles.dominantBadgeText}>❤️ Most Thanked</Text>
        </View>
      </View>
      <Text style={styles.subtitle}>
        Real reactions left by users right after completing their reading
      </Text>

      <View style={styles.chartRow}>
        {sentiments.map((item, index) => (
          <AnimatedBar key={item.id} item={item} index={index} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.bgSurface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    ...TYPOGRAPHY.h2,
  },
  dominantBadge: {
    backgroundColor: COLORS.yellowSoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  dominantBadgeText: {
    color: COLORS.yellowPrimary,
    fontSize: 11,
    fontWeight: '700',
  },
  subtitle: {
    ...TYPOGRAPHY.caption,
    marginBottom: SPACING.xl,
  },
  chartRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 175,
    paddingTop: SPACING.md,
  },
  column: {
    flex: 1,
    alignItems: 'center',
  },
  countText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  track: {
    width: 22,
    height: 96,
    backgroundColor: COLORS.bgInput,
    borderRadius: RADIUS.full,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    padding: 2,
  },
  fill: {
    width: '100%',
    borderRadius: RADIUS.full,
  },
  emoji: {
    fontSize: 20,
    marginTop: 10,
  },
  label: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 4,
    fontWeight: '600',
  },
});
