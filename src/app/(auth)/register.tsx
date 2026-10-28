import React from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { RegisterScreen } from '../../screens/RegisterScreen';
import { DemoBanner } from '../../components/DemoBanner';
import { useAuth } from '../../store/auth';
import { DEMO_MODE } from '../../config';
import { colors } from '../../theme/tokens';
import { AuthUser } from '../../services/authService';

export default function RegisterRoute() {
  const { signIn } = useAuth();

  const handleRegistered = async (user: AuthUser) => {
    await signIn(user.email, '');
    router.replace('/home');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      {DEMO_MODE && <DemoBanner />}
      <View style={styles.screenWrapper}>
        <RegisterScreen onRegistered={handleRegistered} onBack={handleBack} />
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
