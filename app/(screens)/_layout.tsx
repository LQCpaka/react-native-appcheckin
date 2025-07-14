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
      <Stack.Screen
        name="detailsavedticket"
        options={{ title: 'Chi tiết phiếu đã lưu' }}
      />
      <Stack.Screen
        name="savedticket"
        options={{ title: 'Phiếu kiểm kê đã lưu' }}
      />
    </Stack >
  )
}

export default _layout
