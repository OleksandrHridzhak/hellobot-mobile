import * as Haptics from 'expo-haptics';
import { Tabs } from 'expo-router';
import {
  Heart,
  Home,
  MessageCircle,
  Sparkles,
  User,
} from 'lucide-react-native';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { COLORS } from '../../src/theme/theme';

export default function TabLayout() {
  const triggerTabHaptic = () => {
    Haptics.selectionAsync();
  };

  return (
    <Tabs
      screenListeners={{
        tabPress: () => {
          triggerTabHaptic();
        },
      }}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.yellowPrimary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconWrap : undefined}>
              <Home size={22} color={color} strokeWidth={focused ? 2.5 : 2} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="counselors"
        options={{
          title: 'Counselors',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconWrap : undefined}>
              <Sparkles size={22} color={color} strokeWidth={focused ? 2.5 : 2} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat & Report',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconWrap : undefined}>
              <MessageCircle
                size={22}
                color={color}
                strokeWidth={focused ? 2.5 : 2}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="charge"
        options={{
          title: 'Charge Hearts',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconWrap : undefined}>
              <Heart
                size={22}
                color={focused ? COLORS.rosePrimary : color}
                fill={focused ? COLORS.rosePrimary : 'transparent'}
                strokeWidth={focused ? 2.5 : 2}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconWrap : undefined}>
              <User size={22} color={color} strokeWidth={focused ? 2.5 : 2} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.bgPrimary,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    height: Platform.OS === 'ios' ? 86 : 66,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 26 : 10,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  activeIconWrap: {
    transform: [{ scale: 1.06 }],
  },
});
