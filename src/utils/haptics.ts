import * as ExpoHaptics from 'expo-haptics';
import { Platform } from 'react-native';

export const selectionAsync = async (): Promise<void> => {
  if (Platform.OS === 'web') return;
  try {
    await ExpoHaptics.selectionAsync();
  } catch {
    // ignore on unsupported devices
  }
};

export const impactAsync = async (
  style: ExpoHaptics.ImpactFeedbackStyle = ExpoHaptics.ImpactFeedbackStyle.Light
): Promise<void> => {
  if (Platform.OS === 'web') return;
  try {
    await ExpoHaptics.impactAsync(style);
  } catch {
    // ignore on unsupported devices
  }
};

export const notificationAsync = async (
  type: ExpoHaptics.NotificationFeedbackType = ExpoHaptics.NotificationFeedbackType.Success
): Promise<void> => {
  if (Platform.OS === 'web') return;
  try {
    await ExpoHaptics.notificationAsync(type);
  } catch {
    // ignore on unsupported devices
  }
};

export const ImpactFeedbackStyle = ExpoHaptics.ImpactFeedbackStyle;
export const NotificationFeedbackType = ExpoHaptics.NotificationFeedbackType;

export default {
  selectionAsync,
  impactAsync,
  notificationAsync,
  ImpactFeedbackStyle,
  NotificationFeedbackType,
};
