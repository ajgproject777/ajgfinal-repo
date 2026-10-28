import { useEffect, useState } from 'react'
import { BackHandler, StyleSheet, View } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { DemoBanner } from './src/components/DemoBanner'
import { DEMO_MODE } from './src/config'
import { ForgotPasswordScreen } from './src/screens/ForgotPasswordScreen'
import { HomeScreen } from './src/screens/HomeScreen'
import { LoginScreen } from './src/screens/LoginScreen'
import { RegisterScreen } from './src/screens/RegisterScreen'
import { AuthUser } from './src/services/authService'
import { colors } from './src/theme'

type Screen = 'login' | 'register' | 'forgot-password' | 'home'

export default function App() {
  const [screen, setScreen] = useState<Screen>('login')
  const [user, setUser] = useState<AuthUser | null>(null)

  // Android hardware back: go back to login from register / forgot-password.
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (screen === 'register' || screen === 'forgot-password') {
        setScreen('login')
        return true
      }
      return false
    })
    return () => sub.remove()
  }, [screen])

  const signedIn = (u: AuthUser) => {
    setUser(u)
    setScreen('home')
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
        {DEMO_MODE && <DemoBanner />}
        <View style={styles.flex}>
          {screen === 'login' && (
            <LoginScreen
              onSignedIn={signedIn}
              onRegister={() => setScreen('register')}
              onForgotPassword={() => setScreen('forgot-password')}
            />
          )}
          {screen === 'register' && <RegisterScreen onRegistered={signedIn} onBack={() => setScreen('login')} />}
          {screen === 'forgot-password' && <ForgotPasswordScreen onBack={() => setScreen('login')} />}
          {screen === 'home' && user && (
            <HomeScreen
              user={user}
              onSignOut={() => {
                setUser(null)
                setScreen('login')
              }}
            />
          )}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
})
