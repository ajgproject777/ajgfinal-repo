import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Path, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { colors, typography } from '../../theme/tokens';

interface DineGoLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export function DineGoLogo({ size = 'md', showTagline = false }: DineGoLogoProps) {
  const iconSize = size === 'lg' ? 40 : size === 'md' ? 32 : 24;
  const fontSize = size === 'lg' ? 30 : size === 'md' ? 24 : 18;

  return (
    <View style={styles.row} accessibilityLabel="DineGo Logo">
      <Svg width={iconSize} height={iconSize} viewBox="0 0 48 48" fill="none">
        <Defs>
          <LinearGradient id="dinegoGradient" x1="0" y1="0" x2="48" y2="48">
            <Stop offset="0%" stopColor="#FF6B35" />
            <Stop offset="100%" stopColor="#D4621A" />
          </LinearGradient>
        </Defs>

        {/* Outer Route Pin */}
        <Path
          d="M24 4C14.059 4 6 12.059 6 22c0 13.25 18 22 18 22s18-8.75 18-22c0-9.941-8.059-18-18-18z"
          fill="url(#dinegoGradient)"
        />

        {/* Inner Plate/Cutout Circle */}
        <Circle cx="24" cy="20" r="10" fill="#0E0D0C" />

        {/* Fork & Knife silhouette in the pin */}
        <Path
          d="M21 15v5m2-5v5m-1 0v4m4-9v9c0 .5-.5 1-1 1"
          stroke="#FFB59D"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Route Dot Accent */}
        <Circle cx="37" cy="38" r="3" fill="#FFB59D" />
        <Circle cx="32" cy="42" r="2" fill="#FF6B35" />
      </Svg>

      <View>
        <Text style={[styles.name, { fontSize }]}>
          Dine<Text style={{ color: colors.brandPrimary }}>Go</Text>
        </Text>
        {showTagline && (
          <Text style={styles.tagline}>DINE ALONG YOUR JOURNEY</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  name: {
    color: colors.foreground,
    fontFamily: typography.fontFamily.bold,
    letterSpacing: -0.5,
  },
  tagline: {
    color: colors.mutedForeground,
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.medium,
    letterSpacing: 1.5,
    marginTop: 2,
  },
});
