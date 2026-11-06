import * as Haptics from 'expo-haptics';
import { CheckCircle2, ShieldCheck, Sparkles, X } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { HEART_PACKAGES } from '../../src/data/mockData';
import { useAppStore } from '../../src/store/useAppStore';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../../src/theme/theme';
import { HeartPackage } from '../../src/types';

export default function ChargeHeartsScreen() {
  const insets = useSafeAreaInsets();
  const hearts = useAppStore((s) => s.hearts);
  const batteries = useAppStore((s) => s.batteries);
  const addHearts = useAppStore((s) => s.addHearts);

  const [selectedPkg, setSelectedPkg] = useState<HeartPackage | null>(null);
  const [purchaseToast, setPurchaseToast] = useState<string | null>(null);

  const handleConfirmPurchase = () => {
    if (!selectedPkg) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addHearts(selectedPkg.hearts);
    const msg = `+${selectedPkg.hearts} Hearts credited to your balance!`;
    setSelectedPkg(null);
    setPurchaseToast(msg);
    setTimeout(() => setPurchaseToast(null), 3200);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header with Live Batteries & Hearts */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Charge Hearts</Text>
        <View style={styles.balanceRow}>
          <View style={styles.balancePill}>
            <Text style={styles.balancePillText}>🔋 {batteries}</Text>
          </View>
          <View style={[styles.balancePill, styles.heartBalancePill]}>
            <Text style={styles.balancePillText}>❤️ {hearts}</Text>
          </View>
        </View>
      </View>

      {purchaseToast && (
        <Animated.View entering={FadeIn} style={styles.successBanner}>
          <CheckCircle2 size={18} color={COLORS.emeraldPrimary} />
          <Text style={styles.successBannerText}>{purchaseToast}</Text>
        </Animated.View>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.introCard}>
          <Sparkles size={18} color={COLORS.yellowPrimary} />
          <Text style={styles.introText}>
            Hearts unlock premium Tarot spreads, Saju blueprints, and AI Pet K-Costume portraits. Larger bundles save up to 42%!
          </Text>
        </View>

        <View style={styles.packageList}>
          {HEART_PACKAGES.map((pkg) => (
            <View key={pkg.id} style={styles.pkgWrapper}>
              <TouchableOpacity
                style={[
                  styles.pkgCard,
                  pkg.calloutBanner && styles.pkgCardFeatured,
                ]}
                activeOpacity={0.85}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSelectedPkg(pkg);
                }}
              >
                <View style={styles.pkgLeft}>
                  <View style={styles.heartIconCircle}>
                    <Text style={styles.heartEmoji}>❤️</Text>
                  </View>
                  <View>
                    <Text style={styles.pkgTitle}>Heart {pkg.hearts}</Text>
                    <Text style={styles.pkgUnitSub}>{pkg.perHeartUsd}</Text>
                  </View>
                </View>

                <View style={styles.priceButton}>
                  <Text style={styles.priceButtonText}>
                    {pkg.priceFormatted}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Full-Width Callout Banner Under Heart 200 & Heart 610 */}
              {pkg.calloutBanner && (
                <View
                  style={[
                    styles.calloutBanner,
                    pkg.calloutVariant === 'vip'
                      ? styles.calloutVip
                      : styles.calloutPopular,
                  ]}
                >
                  <Text
                    style={[
                      styles.calloutText,
                      pkg.calloutVariant === 'vip' && {
                        color: COLORS.yellowPrimary,
                      },
                    ]}
                  >
                    {pkg.calloutBanner}
                  </Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Native-Style Mock IAP Purchase Sheet */}
      {selectedPkg && (
        <Modal
          visible={!!selectedPkg}
          transparent
          animationType="none"
          onRequestClose={() => setSelectedPkg(null)}
        >
          <View style={styles.modalOverlay}>
            <Pressable
              style={StyleSheet.absoluteFill}
              onPress={() => setSelectedPkg(null)}
            >
              <Animated.View
                entering={FadeIn.duration(180)}
                style={styles.backdrop}
              />
            </Pressable>

            <Animated.View
              entering={SlideInDown.springify().damping(19).stiffness(180)}
              style={[
                styles.iapSheet,
                { paddingBottom: Math.max(insets.bottom, SPACING.xl) },
              ]}
            >
              <View style={styles.sheetTopBar}>
                <View style={styles.storeTagRow}>
                  <ShieldCheck size={16} color={COLORS.emeraldPrimary} />
                  <Text style={styles.storeTagText}>APP STORE SANDBOX IAP</Text>
                </View>
                <TouchableOpacity
                  onPress={() => setSelectedPkg(null)}
                  style={styles.closeCircle}
                >
                  <X size={18} color={COLORS.textSecondary} />
                </TouchableOpacity>
              </View>

              <View style={styles.iapSummaryRow}>
                <View style={styles.iapIconBox}>
                  <Text style={{ fontSize: 30 }}>❤️</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.iapItemTitle}>
                    HelloBot — Heart {selectedPkg.hearts} Pack
                  </Text>
                  <Text style={styles.iapItemSub}>
                    Instant credit • {selectedPkg.perHeartUsd}
                  </Text>
                </View>
                <Text style={styles.iapPriceText}>
                  {selectedPkg.priceFormatted}
                </Text>
              </View>

              <View style={styles.balancePreviewRow}>
                <Text style={styles.balancePreviewLabel}>
                  Balance after purchase
                </Text>
                <Text style={styles.balancePreviewVal}>
                  ❤️ {hearts} → ❤️ {hearts + selectedPkg.hearts}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.confirmPayBtn}
                activeOpacity={0.86}
                onPress={handleConfirmPurchase}
              >
                <Text style={styles.confirmPayBtnText}>
                  Double-Tap to Pay {selectedPkg.priceFormatted}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
  },
  headerTitle: {
    ...TYPOGRAPHY.display,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  balancePill: {
    backgroundColor: COLORS.bgSurface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  heartBalancePill: {
    borderColor: 'rgba(244, 63, 94, 0.45)',
    backgroundColor: COLORS.roseSoft,
  },
  balancePillText: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '800',
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.md,
    backgroundColor: COLORS.emeraldSoft,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.emeraldPrimary,
  },
  successBannerText: {
    color: COLORS.emeraldPrimary,
    fontWeight: '700',
    fontSize: 13,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: 42,
  },
  introCard: {
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
  introText: {
    flex: 1,
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
  },
  packageList: {
    gap: SPACING.md,
  },
  pkgWrapper: {
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.bgSurface,
  },
  pkgCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.lg,
  },
  pkgCardFeatured: {
    backgroundColor: '#19191E',
  },
  pkgLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  heartIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.roseSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartEmoji: {
    fontSize: 20,
  },
  pkgTitle: {
    ...TYPOGRAPHY.h2,
    marginBottom: 2,
  },
  pkgUnitSub: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  priceButton: {
    backgroundColor: COLORS.yellowPrimary,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: RADIUS.lg,
  },
  priceButtonText: {
    color: COLORS.textInverse,
    fontWeight: '900',
    fontSize: 14,
  },
  calloutBanner: {
    paddingVertical: 8,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  calloutPopular: {
    backgroundColor: COLORS.roseSoft,
  },
  calloutVip: {
    backgroundColor: COLORS.yellowSoft,
  },
  calloutText: {
    color: COLORS.rosePrimary,
    fontSize: 12,
    fontWeight: '800',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.72)',
  },
  iapSheet: {
    backgroundColor: COLORS.bgSurface,
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
    padding: SPACING.xl,
    borderTopWidth: 1,
    borderColor: COLORS.border,
  },
  sheetTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  storeTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  storeTagText: {
    ...TYPOGRAPHY.micro,
    color: COLORS.emeraldPrimary,
    letterSpacing: 0.8,
  },
  closeCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.bgInput,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iapSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    backgroundColor: COLORS.bgPrimary,
    padding: SPACING.lg,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.lg,
  },
  iapIconBox: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.roseSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iapItemTitle: {
    ...TYPOGRAPHY.h3,
    marginBottom: 2,
  },
  iapItemSub: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  iapPriceText: {
    ...TYPOGRAPHY.h1,
    color: COLORS.yellowPrimary,
  },
  balancePreviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
    paddingHorizontal: 4,
  },
  balancePreviewLabel: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
  },
  balancePreviewVal: {
    ...TYPOGRAPHY.h3,
    color: COLORS.emeraldPrimary,
  },
  confirmPayBtn: {
    height: 56,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.yellowPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmPayBtnText: {
    color: COLORS.textInverse,
    fontSize: 16,
    fontWeight: '900',
  },
});
