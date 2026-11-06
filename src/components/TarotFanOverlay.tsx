import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Sparkles } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  FadeInDown,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme/theme';

interface TarotFanOverlayProps {
  visible: boolean;
  onCardPicked: (cardIndex: number) => void;
}

const TOTAL_CARDS = 7;
const MIDDLE_INDEX = 3;

interface FanCardItemProps {
  index: number;
  selectedCard: number | null;
  fanProgress: SharedValue<number>;
  onSelect: (index: number) => void;
}

const FanCardItem: React.FC<FanCardItemProps> = ({
  index,
  selectedCard,
  fanProgress,
  onSelect,
}) => {
  const offsetFromCenter = index - MIDDLE_INDEX;
  const isPicked = selectedCard === index;
  const lift = useSharedValue(0);

  useEffect(() => {
    if (isPicked) {
      lift.value = withSpring(-52, { damping: 12, stiffness: 160 });
    } else if (selectedCard !== null) {
      lift.value = withTiming(30, { duration: 250 });
    } else {
      lift.value = 0;
    }
  }, [isPicked, lift, selectedCard]);

  const animatedCardStyle = useAnimatedStyle(() => {
    const angleDeg = offsetFromCenter * 11 * fanProgress.value;
    const translateX = offsetFromCenter * 34 * fanProgress.value;
    const archY = Math.abs(offsetFromCenter) * 9 * fanProgress.value + lift.value;
    const scale = isPicked ? 1.14 : selectedCard !== null ? 0.92 : 1;
    const opacity = selectedCard !== null && !isPicked ? 0.35 : 1;

    return {
      opacity,
      transform: [
        { translateX },
        { translateY: archY },
        { rotateZ: `${angleDeg}deg` },
        { scale },
      ],
    };
  });

  return (
    <Animated.View style={[styles.cardWrapper, animatedCardStyle]}>
      <Pressable
        onPress={() => onSelect(index)}
        style={styles.cardTouchable}
      >
        <LinearGradient
          colors={['#5B21B6', '#2E1065', '#1E1B4B']}
          style={[
            styles.cardBack,
            isPicked && { borderColor: COLORS.yellowPrimary, borderWidth: 2.5 },
          ]}
        >
          <View style={styles.innerFrame}>
            <Text style={styles.celestialCorner}>✦</Text>
            <View style={styles.centerEmblem}>
              <Text style={styles.heartMotif}>💜</Text>
              <Text style={styles.starMotif}>✧</Text>
            </View>
            <Text style={[styles.celestialCorner, { alignSelf: 'flex-end' }]}>
              ✦
            </Text>
          </View>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
};

export const TarotFanOverlay: React.FC<TarotFanOverlayProps> = ({
  visible,
  onCardPicked,
}) => {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const fanProgress = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      setSelectedCard(null);
      fanProgress.value = 0;
      fanProgress.value = withDelay(
        80,
        withSpring(1, { damping: 14, stiffness: 110 })
      );
    } else {
      fanProgress.value = withTiming(0, {
        duration: 200,
        easing: Easing.out(Easing.quad),
      });
    }
  }, [fanProgress, visible]);

  if (!visible) return null;

  const handleSelect = (idx: number) => {
    if (selectedCard !== null) return;
    setSelectedCard(idx);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTimeout(() => {
      onCardPicked(idx);
    }, 520);
  };

  return (
    <Animated.View
      entering={FadeInDown.duration(320).springify()}
      style={styles.container}
    >
      <View style={styles.promptPill}>
        <Sparkles size={14} color={COLORS.yellowPrimary} />
        <Text style={styles.promptText}>
          {selectedCard !== null
            ? 'Destiny card chosen! Revealing your reading...'
            : 'Focus on your question & tap 1 card from the fan'}
        </Text>
      </View>

      <View style={styles.fanStage}>
        {Array.from({ length: TOTAL_CARDS }).map((_, idx) => (
          <FanCardItem
            key={idx}
            index={idx}
            selectedCard={selectedCard}
            fanProgress={fanProgress}
            onSelect={handleSelect}
          />
        ))}
      </View>

      <Text style={styles.deckHint}>78 MYSTIC CELESTIAL TAROT DECK</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0E0B16',
    borderTopWidth: 1,
    borderColor: '#3B236A',
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xl,
    alignItems: 'center',
  },
  promptPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(109, 40, 217, 0.25)',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 250, 0.4)',
    marginBottom: SPACING.xl,
  },
  promptText: {
    color: '#EDE9FE',
    fontSize: 13,
    fontWeight: '700',
  },
  fanStage: {
    height: 185,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardWrapper: {
    position: 'absolute',
    width: 96,
    height: 148,
  },
  cardTouchable: {
    flex: 1,
  },
  cardBack: {
    flex: 1,
    borderRadius: RADIUS.md,
    padding: 7,
    borderWidth: 1.5,
    borderColor: '#A78BFA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 8,
    elevation: 7,
  },
  innerFrame: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(250, 204, 21, 0.45)',
    borderRadius: 8,
    padding: 6,
    justifyContent: 'space-between',
  },
  celestialCorner: {
    color: COLORS.yellowPrimary,
    fontSize: 11,
    fontWeight: '700',
  },
  centerEmblem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartMotif: {
    fontSize: 24,
  },
  starMotif: {
    color: COLORS.yellowPrimary,
    fontSize: 12,
    marginTop: -2,
  },
  deckHint: {
    ...TYPOGRAPHY.micro,
    color: '#A78BFA',
    marginTop: SPACING.sm,
    letterSpacing: 1.4,
  },
});
