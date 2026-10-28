import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useDineGoFonts } from '../theme/useDineGoFonts';
import { AuthProvider } from '../store/auth';
import { BookingProvider } from '../store/bookingContext';
import { colors } from '../theme/tokens';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const { isReady } = useDineGoFonts();

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <BookingProvider>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.background },
              animation: 'slide_from_right',
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="restaurant/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="restaurant/[id]/menu" options={{ headerShown: false }} />
            <Stack.Screen name="reservation/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="booking/confirmation" options={{ headerShown: false, gestureEnabled: false }} />
            <Stack.Screen name="owner/dashboard" options={{ headerShown: false }} />
          </Stack>
        </BookingProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

