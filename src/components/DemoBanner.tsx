import { StyleSheet, Text, View } from 'react-native'
import { colors } from '../theme'

export function DemoBanner() {
  return (
    <View style={styles.bar}>
      <Text style={styles.text}>Demo mode — backend not connected. Data shown is sample data.</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: colors.warningBg,
    borderBottomWidth: 1,
    borderBottomColor: colors.warningBorder,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  text: { color: colors.warningText, fontSize: 11, fontWeight: '600', textAlign: 'center' },
})
