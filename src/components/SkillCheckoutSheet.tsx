import * as Haptics from 'expo-haptics';
import { X } from 'lucide-react-native';
import React from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme/theme';
import { Skill } from '../types';

interface SkillCheckoutSheetProps {
  visible: boolean;
  skill: Skill;
  userHearts: number;
  onClose: () => void;
  onGetHearts: () => void;
  onConfirmBuy: () => void;
}

export const SkillCheckoutSheet: React.FC<SkillCheckoutSheetProps> = ({
  visible,
  skill,
  userHearts,
  onClose,
  onGetHearts,
  onConfirmBuy,
}) => {
  const insets = useSafeAreaInsets();
  const discountAmount = skill.originalHearts - skill.finalHearts;
  const hasEnough = userHearts >= skill.finalHearts;

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
          <Animated.View entering={FadeIn.duration(200)} style={styles.backdrop} />
        </Pressable>

        <Animated.View
          entering={SlideInDown.springify().damping(20).stiffness(180)}
          style={[
            styles.sheet,
            { paddingBottom: Math.max(insets.bottom, SPACING.xl) },
          ]}
        >
          <View style={styles.handle} />

          <View style={styles.headerRow}>
            <View style={{ flex: 1, paddingRight: SPACING.md }}>
              <Text style={styles.sheetLabel}>UNLOCK SKILL SESSION</Text>
              <Text style={styles.skillTitle} numberOfLines={1}>
                {skill.title}
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeBtn}
              hitSlop={12}
            >
              <X size={18} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.receiptBox}>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptKey}>Price</Text>
              <Text style={styles.receiptVal}>❤️ {skill.originalHearts}</Text>
            </View>

            <View style={styles.receiptRow}>
              <View style={styles.discountRow}>
                <Text style={styles.receiptKey}>Promotion discount</Text>
                <View style={styles.salePill}>
                  <Text style={styles.salePillText}>{skill.discountPercent}% OFF</Text>
                </View>
              </View>
              <Text style={styles.discountVal}>-{discountAmount}</Text>
            </View>

            <View style={styles.receiptRow}>
              <Text style={styles.receiptKey}>My hearts</Text>
              <Text
                style={[
                  styles.receiptVal,
                  { color: hasEnough ? COLORS.emeraldPrimary : COLORS.rosePrimary },
                ]}
              >
                ❤️ {userHearts}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.receiptRow}>
              <Text style={styles.totalKey}>Total</Text>
              <Text style={styles.totalVal}>❤️ {skill.finalHearts}</Text>
            </View>
          </View>

          {!hasEnough && (
            <View style={styles.shortageBanner}>
              <Text style={styles.shortageText}>
                You need ❤️ {skill.finalHearts - userHearts} more hearts to start this reading.
              </Text>
            </View>
          )}

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.secondaryButton}
              activeOpacity={0.85}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onGetHearts();
              }}
            >
              <Text style={styles.secondaryButtonText}>Get hearts</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.primaryButton}
              activeOpacity={0.85}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                onConfirmBuy();
              }}
            >
              <Text style={styles.primaryButtonText}>
                Buy (❤️ {skill.finalHearts})
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
  },
  sheet: {
    backgroundColor: COLORS.bgSurface,
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderColor: COLORS.border,
  },
  handle: {
    width: 42,
    height: 5,
    borderRadius: RADIUS.full,
    backgroundColor: '#3F3F46',
    alignSelf: 'center',
    marginBottom: SPACING.lg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  sheetLabel: {
    ...TYPOGRAPHY.micro,
    color: COLORS.yellowPrimary,
    marginBottom: 4,
  },
  skillTitle: {
    ...TYPOGRAPHY.h2,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.bgInput,
    alignItems: 'center',
    justifyContent: 'center',
  },
  receiptBox: {
    backgroundColor: COLORS.bgPrimary,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  discountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  salePill: {
    backgroundColor: COLORS.roseSoft,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
  },
  salePillText: {
    color: COLORS.rosePrimary,
    fontSize: 10,
    fontWeight: '800',
  },
  receiptKey: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
  },
  receiptVal: {
    ...TYPOGRAPHY.h3,
  },
  discountVal: {
    ...TYPOGRAPHY.h3,
    color: COLORS.rosePrimary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 4,
  },
  totalKey: {
    ...TYPOGRAPHY.h2,
  },
  totalVal: {
    ...TYPOGRAPHY.h1,
    color: COLORS.yellowPrimary,
  },
  shortageBanner: {
    backgroundColor: COLORS.roseSoft,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: 'rgba(244, 63, 94, 0.35)',
  },
  shortageText: {
    color: COLORS.rosePrimary,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  secondaryButton: {
    flex: 1,
    height: 54,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.bgInput,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  secondaryButtonText: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
  },
  primaryButton: {
    flex: 1.4,
    height: 54,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.yellowPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textInverse,
    fontWeight: '800',
  },
});
