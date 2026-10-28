import React from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LoginScreen } from '../../screens/LoginScreen';
import { DemoBanner } from '../../components/DemoBanner';
import { RolePill } from '../../components/ui/RolePill';
import { useAuth, UserRole } from '../../store/auth';
import { DEMO_MODE } from '../../config';
import { colors, radius, spacing, typography } from '../../theme/tokens';
import { AuthUser } from '../../services/authService';

export default function LoginRoute() {
  const { selectedRole, setSelectedRole, signIn } = useAuth();

  const handleSignedIn = async (user: AuthUser) => {
    // Sync state with AuthProvider and redirect according to selected role
    await signIn(user.email, '');
    if (selectedRole === 'owner') {
      router.replace('/owner/dashboard');
    } else {
      router.replace('/home');
    }
  };

  const handleRegister = () => {
    router.push('/register');
  };

  const handleForgotPassword = () => {
    router.push('/forgot-password');
  };

  return (
    <View style={styles.container}>
      {DEMO_MODE && <DemoBanner />}

      {/* Role Selector Header */}
      <View style={styles.roleHeader}>
        <RolePill
          selectedRole={selectedRole}
          onSelectRole={(role: UserRole) => setSelectedRole(role)}
        />

        {selectedRole === 'owner' && (
          <View style={styles.ownerNotice}>
            <View style={styles.ownerNoticeHeader}>
              <Ionicons name="information-circle" size={18} color={colors.partnerAccent} />
              <Text style={styles.ownerNoticeTitle}>Restaurant Owner Partner</Text>
            </View>
            <Text style={styles.ownerNoticeText}>
              The full Restaurant Owner Management Dashboard is a dedicated web application launching in Phase 4. You can sign in below to preview traveller discovery or manage partner settings.
            </Text>
          </View>
        )}
      </View>

      {/* Preserved Login Screen */}
      <View style={styles.screenWrapper}>
        <LoginScreen
          onSignedIn={handleSignedIn}
          onRegister={handleRegister}
          onForgotPassword={handleForgotPassword}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  roleHeader: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    backgroundColor: colors.background,
  },
  ownerNotice: {
    backgroundColor: colors.surfaceHigh,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(123, 208, 255, 0.3)',
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  ownerNoticeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  ownerNoticeTitle: {
    color: colors.partnerAccent,
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.bold,
  },
  ownerNoticeText: {
    color: colors.secondaryForeground,
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.regular,
    lineHeight: 18,
  },
  screenWrapper: {
    flex: 1,
  },
});
