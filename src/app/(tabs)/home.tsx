import React from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { HomeScreen } from '../../screens/HomeScreen';
import { DemoBanner } from '../../components/DemoBanner';
import { useAuth } from '../../store/auth';
import { DEMO_MODE } from '../../config';
import { colors } from '../../theme/tokens';

export default function HomeTabRoute() {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.replace('/login');
  };

  const currentUser = user || { name: 'Traveller', email: 'guest@dinego.in' };

  return (
    <View style={styles.container}>
      {DEMO_MODE && <DemoBanner />}
      <View style={styles.screenWrapper}>
        <HomeScreen user={currentUser} onSignOut={handleSignOut} />
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
