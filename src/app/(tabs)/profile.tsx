import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuth } from '../../store/auth';
import { colors, radius, spacing, typography } from '../../theme/tokens';
import { DemoBanner } from '../../components/DemoBanner';
import { DEMO_MODE } from '../../config';

export default function ProfileTabRoute() {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.replace('/login');
  };

  const displayName = user?.name || (user?.email ? user.email.split('@')[0] : 'Guest Traveller');
  const displayEmail = user?.email || 'guest@dinego.in';
  const role = user?.role || 'traveller';

  return (
    <SafeAreaView style={styles.container}>
      {DEMO_MODE && <DemoBanner />}
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={32} color={colors.brandPrimary} />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{displayName}</Text>
            <Text style={styles.userEmail}>{displayEmail}</Text>
            <View style={styles.roleBadgeContainer}>
              <View
                style={[
                  styles.roleBadge,
                  role === 'owner' ? styles.roleBadgeOwner : styles.roleBadgeTraveller,
                ]}
              >
                <Text
                  style={[
                    styles.roleBadgeText,
                    role === 'owner' ? styles.roleBadgeTextOwner : styles.roleBadgeTextTraveller,
                  ]}
                >
                  {role === 'owner' ? 'Restaurant Owner' : 'Traveller'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Status & Diagnostics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Authentication Status</Text>

          <View style={styles.infoRow}>
            <Ionicons
              name={DEMO_MODE ? 'alert-circle-outline' : 'checkmark-circle-outline'}
              size={20}
              color={DEMO_MODE ? colors.warningText : colors.success}
            />
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Mode</Text>
              <Text style={styles.infoValue}>
                {DEMO_MODE ? 'Offline Demo (Simulated Session)' : 'Live Backend Authentication'}
              </Text>
            </View>
          </View>

          {DEMO_MODE && (
            <View style={styles.demoNote}>
              <Text style={styles.demoNoteText}>
                The mobile app is currently running in local demo mode. No live server credentials or user database records have been modified.
              </Text>
            </View>
          )}
        </View>

        {/* Restaurant Management / Partner Portal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Restaurant Partner Portal</Text>
          <TouchableOpacity
            style={styles.partnerCard}
            onPress={() => router.push('/owner/dashboard')}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Open restaurant owner dashboard"
          >
            <Ionicons name="business-outline" size={24} color={colors.partnerAccent} />
            <View style={styles.partnerCardText}>
              <Text style={styles.partnerCardTitle}>
                {role === 'owner' ? 'Open Owner Dashboard' : 'Preview Partner Dashboard (Demo)'}
              </Text>
              <Text style={styles.partnerCardSub}>
                Table availability, live kitchen queue, incoming highway orders, and instant menu stock controls.
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.partnerAccent} />
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Application</Text>
          <View style={styles.infoRow}>
            <Ionicons name="phone-portrait-outline" size={20} color={colors.mutedForeground} />
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Framework</Text>
              <Text style={styles.infoValue}>Expo SDK 58 (Expo Router)</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="code-slash-outline" size={20} color={colors.mutedForeground} />
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Runtime</Text>
              <Text style={styles.infoValue}>React Native 0.88.0</Text>
            </View>
          </View>
        </View>

        {/* Sign Out Action */}
        <TouchableOpacity
          style={styles.signOutButton}
          onPress={handleSignOut}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={20} color={colors.error} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    padding: spacing.lg,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLow,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceHigh,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    color: colors.foreground,
  },
  userEmail: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.mutedForeground,
    marginTop: 2,
  },
  roleBadgeContainer: {
    marginTop: 6,
    flexDirection: 'row',
  },
  roleBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  roleBadgeTraveller: {
    backgroundColor: 'rgba(255, 107, 53, 0.15)',
  },
  roleBadgeOwner: {
    backgroundColor: 'rgba(123, 208, 255, 0.15)',
  },
  roleBadgeText: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.semiBold,
  },
  roleBadgeTextTraveller: {
    color: colors.brandPrimary,
  },
  roleBadgeTextOwner: {
    color: colors.partnerAccent,
  },
  section: {
    backgroundColor: colors.surfaceLow,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.mutedForeground,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.xs,
  },
  infoCol: {
    flex: 1,
  },
  infoLabel: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.medium,
    color: colors.mutedForeground,
  },
  infoValue: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.foreground,
    marginTop: 1,
  },
  demoNote: {
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.warningBg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.warningBorder,
  },
  demoNoteText: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.regular,
    color: colors.warningText,
    lineHeight: 18,
  },
  partnerCard: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: colors.surfaceMid,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(123, 208, 255, 0.2)',
  },
  partnerCardText: {
    flex: 1,
  },
  partnerCardTitle: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.bold,
    color: colors.partnerAccent,
    marginBottom: 4,
  },
  partnerCardSub: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.regular,
    color: colors.secondaryForeground,
    lineHeight: 18,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surfaceLow,
    borderWidth: 1,
    borderColor: 'rgba(248, 113, 113, 0.3)',
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    marginTop: spacing.sm,
  },
  signOutText: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.error,
  },
});
