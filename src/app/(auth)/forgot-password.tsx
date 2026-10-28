import React from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { ForgotPasswordScreen } from '../../screens/ForgotPasswordScreen';
import { DemoBanner } from '../../components/DemoBanner';
import { DEMO_MODE } from '../../config';
import { colors } from '../../theme/tokens';

export default function ForgotPasswordRoute() {
  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      {DEMO_MODE && <DemoBanner />}
      <View style={styles.screenWrapper}>
        <ForgotPasswordScreen onBack={handleBack} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screenWrapper: {
    flex: 1,
  },
});
