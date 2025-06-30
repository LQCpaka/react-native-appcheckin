import { Stack } from 'expo-router'
import { View, Text } from 'react-native'

const _layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="detailinventory"
        options={{ title: 'Kho Hàng' }}
      />
      <Stack.Screen
        name="detailscan"
        options={{ title: 'Chi tiết quét kiểm kê' }}
      />
    </Stack >
  )
}

export default _layout
