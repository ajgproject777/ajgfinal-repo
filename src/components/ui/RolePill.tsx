import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme/tokens';
import { UserRole } from '../../store/auth';

interface RolePillProps {
  selectedRole: UserRole;
  onSelectRole: (role: UserRole) => void;
}

export function RolePill({ selectedRole, onSelectRole }: RolePillProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.pill, selectedRole === 'traveller' && styles.pillActive]}
        onPress={() => onSelectRole('traveller')}
        activeOpacity={0.8}
      >
        <Text
          style={[
            styles.label,
            selectedRole === 'traveller' && styles.labelActive,
          ]}
        >
          Traveller
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.pill, selectedRole === 'owner' && styles.pillActiveOwner]}
        onPress={() => onSelectRole('owner')}
        activeOpacity={0.8}
      >
        <Text
          style={[
            styles.label,
            selectedRole === 'owner' && styles.labelActiveOwner,
          ]}
        >
          Restaurant Owner
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceLow,
    borderRadius: radius.pill,
    padding: 3,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  pill: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
  },
  pillActive: {
    backgroundColor: colors.brandPrimary,
  },
  pillActiveOwner: {
    backgroundColor: colors.surfaceHigh,
    borderWidth: 1,
    borderColor: colors.partnerAccent,
  },
  label: {
    fontSize: typography.fontSize.sm,
    color: colors.mutedForeground,
    fontFamily: typography.fontFamily.medium,
  },
  labelActive: {
    color: '#FFFFFF',
    fontFamily: typography.fontFamily.bold,
  },
  labelActiveOwner: {
    color: colors.partnerAccent,
    fontFamily: typography.fontFamily.bold,
  },
});
