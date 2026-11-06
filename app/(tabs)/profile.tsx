import * as Haptics from '../../src/utils/haptics';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import {
  AlertTriangle,
  Mail,
  Megaphone,
  MoreHorizontal,
  Moon,
  Settings,
  ShieldCheck,
} from 'lucide-react-native';
import React from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '../../src/store/useAppStore';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../../src/theme/theme';

export default function ProfileScreen() {
  const router = useRouter();
  const user = useAppStore((s) => s.user);
  const hearts = useAppStore((s) => s.hearts);
  const coupons = useAppStore((s) => s.coupons);
  const toggleSignIn = useAppStore((s) => s.toggleSignIn);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Top Bar with Theme & Settings Icons */}
      <View style={styles.topBar}>
        <Text style={styles.topTitle}>Profile</Text>
        <View style={styles.iconRow}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => {
              Haptics.selectionAsync();
              Alert.alert('OLED Dark Theme', 'Pure OLED Black mode (#000000) is active.');
            }}
          >
            <Moon size={20} color={COLORS.yellowPrimary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => {
              Haptics.selectionAsync();
              Alert.alert('Settings', 'App version 5.2.0 (Expo SDK 52 Production Build)');
            }}
          >
            <Settings size={20} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Centered Guest / User Avatar & Title */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarRing}>
            <Image
              source={{ uri: user.avatar }}
              style={styles.avatar}
              contentFit="cover"
            />
          </View>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>
            {user.isSignedIn ? user.email : 'Unlinked Guest Account'}
          </Text>
        </View>

        {/* 2-Column Balance Box (Coupons 🎫 1 | Hearts ❤️ X) */}
        <View style={styles.balanceBox}>
          <TouchableOpacity
            style={styles.balanceCol}
            onPress={() => {
              Haptics.selectionAsync();
              Alert.alert('50% Discount Coupon 🎫', 'Your 50% welcome discount is automatically applied at skill checkout!');
            }}
          >
            <Text style={styles.balanceLabel}>Coupons</Text>
            <Text style={styles.balanceValue}>🎫 {coupons}</Text>
          </TouchableOpacity>

          <View style={styles.verticalDivider} />

          <TouchableOpacity
            style={styles.balanceCol}
            onPress={() => {
              Haptics.selectionAsync();
              router.push('/(tabs)/charge');
            }}
          >
            <Text style={styles.balanceLabel}>Hearts</Text>
            <Text style={styles.balanceValue}>❤️ {hearts}</Text>
          </TouchableOpacity>
        </View>

        {/* Full-Width Yellow Sign In / Account Toggle Button */}
        <TouchableOpacity
          style={styles.signInButton}
          activeOpacity={0.86}
          onPress={() => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            toggleSignIn();
          }}
        >
          <Text style={styles.signInButtonText}>
            {user.isSignedIn ? 'Switch to Guest Mode' : 'Sign in'}
          </Text>
        </TouchableOpacity>

        {/* Red Warning Notice Box about Data Backup */}
        {!user.isSignedIn ? (
          <View style={styles.warningBox}>
            <AlertTriangle size={20} color={COLORS.rosePrimary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.warningTitle}>
                Wait! You are currently using a Guest account
              </Text>
              <Text style={styles.warningDesc}>
                Your Hearts balance (❤️ {hearts}), unlocked Tarot skills, and archived fortune reports may be lost if you delete the app or change devices. Sign in now to back up your data safely!
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.syncedBox}>
            <ShieldCheck size={20} color={COLORS.emeraldPrimary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.syncedTitle}>Cloud Backup Active</Text>
              <Text style={styles.warningDesc}>
                Your Hearts, followed counselors, and Tarot reports are securely synced to {user.email}.
              </Text>
            </View>
          </View>
        )}

        {/* 3-Column Utility Grid (Announcements, Email Developer, More) */}
        <View style={styles.utilityGrid}>
          <TouchableOpacity
            style={styles.utilityCard}
            onPress={() => {
              Haptics.selectionAsync();
              Alert.alert(
                'Announcements 📢',
                'New Pet AI K-Costume #5 Hanbok Edition & Llamama Solo Love Tarot are now live!'
              );
            }}
          >
            <View style={styles.utilityIconCircle}>
              <Megaphone size={22} color={COLORS.yellowPrimary} />
            </View>
            <Text style={styles.utilityLabel}>Announcements</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.utilityCard}
            onPress={() => {
              Haptics.selectionAsync();
              Alert.alert(
                'Email Developer ✉️',
                'Contact support@hellobot.ai with your inquiry or feedback.'
              );
            }}
          >
            <View style={styles.utilityIconCircle}>
              <Mail size={22} color={COLORS.emeraldPrimary} />
            </View>
            <Text style={styles.utilityLabel}>Email Developer</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.utilityCard}
            onPress={() => {
              Haptics.selectionAsync();
              Alert.alert(
                'More Options ⚙️',
                'Terms of Service • Privacy Policy • Restore Purchases'
              );
            }}
          >
            <View style={styles.utilityIconCircle}>
              <MoreHorizontal size={22} color={COLORS.textSecondary} />
            </View>
            <Text style={styles.utilityLabel}>More</Text>
          </TouchableOpacity>
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
  },
  topTitle: {
    ...TYPOGRAPHY.display,
  },
  iconRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.bgSurface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  scrollContent: {
    padding: SPACING.xl,
    paddingBottom: 42,
  },
  avatarSection: {
    alignItems: 'center',
    marginTop: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  avatarRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    padding: 3,
    borderWidth: 2,
    borderColor: COLORS.yellowPrimary,
    marginBottom: SPACING.md,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 45,
  },
  userName: {
    ...TYPOGRAPHY.h1,
    fontSize: 24,
  },
  userEmail: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  balanceBox: {
    flexDirection: 'row',
    backgroundColor: COLORS.bgSurface,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  balanceCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verticalDivider: {
    width: 1,
    backgroundColor: COLORS.border,
  },
  balanceLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  balanceValue: {
    ...TYPOGRAPHY.h1,
  },
  signInButton: {
    height: 54,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.yellowPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  signInButtonText: {
    color: COLORS.textInverse,
    fontSize: 16,
    fontWeight: '900',
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
    backgroundColor: COLORS.roseSoft,
    padding: SPACING.lg,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: 'rgba(244, 63, 94, 0.4)',
    marginBottom: SPACING.xxl,
  },
  syncedBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
    backgroundColor: COLORS.emeraldSoft,
    padding: SPACING.lg,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)',
    marginBottom: SPACING.xxl,
  },
  warningTitle: {
    color: COLORS.rosePrimary,
    fontWeight: '800',
    fontSize: 14,
    marginBottom: 4,
  },
  syncedTitle: {
    color: COLORS.emeraldPrimary,
    fontWeight: '800',
    fontSize: 14,
    marginBottom: 4,
  },
  warningDesc: {
    ...TYPOGRAPHY.caption,
    color: '#E4E4E7',
    lineHeight: 18,
  },
  utilityGrid: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  utilityCard: {
    flex: 1,
    backgroundColor: COLORS.bgSurface,
    borderRadius: RADIUS.xl,
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  utilityIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.bgInput,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  utilityLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
});
