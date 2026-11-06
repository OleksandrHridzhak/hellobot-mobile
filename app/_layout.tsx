import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { COLORS } from '../src/theme/theme';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <StatusBar style="light" backgroundColor={COLORS.bgPrimary} />
        <View style={styles.outerShell}>
          <View style={styles.appContainer}>
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: COLORS.bgPrimary },
                animation: 'slide_from_right',
              }}
            >
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="skill/[id]"
                options={{
                  presentation: 'card',
                  animation: 'slide_from_bottom',
                }}
              />
              <Stack.Screen
                name="counselor/[id]"
                options={{
                  presentation: 'card',
                  animation: 'slide_from_right',
                }}
              />
              <Stack.Screen
                name="chat/[id]"
                options={{
                  presentation: 'card',
                  animation: 'slide_from_right',
                }}
              />
            </Stack>
          </View>
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
  },
  outerShell: {
    flex: 1,
    width: '100%',
    backgroundColor: Platform.OS === 'web' ? '#070709' : COLORS.bgPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appContainer: {
    flex: 1,
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 480 : '100%',
    backgroundColor: COLORS.bgPrimary,
    position: 'relative',
    ...(Platform.OS === 'web'
      ? {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.6,
          shadowRadius: 24,
          borderLeftWidth: 1,
          borderRightWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.1)',
          overflow: 'hidden',
        }
      : {}),
  },
});
