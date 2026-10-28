import { useState } from 'react'
import { Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { TextField } from './TextField'
import { colors } from '../theme'

type Props = Omit<React.ComponentProps<typeof TextField>, 'right' | 'secureTextEntry'>

export function PasswordField(props: Props) {
  const [show, setShow] = useState(false)
  return (
    <TextField
      {...props}
      secureTextEntry={!show}
      autoCapitalize="none"
      autoCorrect={false}
      right={
        <Pressable
          onPress={() => setShow((s) => !s)}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel={show ? 'Hide password' : 'Show password'}
          style={{ paddingHorizontal: 14 }}
        >
          <Ionicons name={show ? 'eye-off-outline' : 'eye-outline'} size={19} color={colors.mutedForeground} />
        </Pressable>
      }
    />
  )
}
