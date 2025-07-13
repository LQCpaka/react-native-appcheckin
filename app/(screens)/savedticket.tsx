import { MaterialCommunityIcons } from '@expo/vector-icons'
import { View, Text, Pressable } from 'react-native'
import { PaperProvider } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'

const savedticket = () => {
  return (
    <PaperProvider>
      <SafeAreaView edges={['bottom']}>
        <Pressable
          className='shadow rounded-md'
          style={{ padding: 10, marginBottom: 10, marginHorizontal: 5, backgroundColor: '#fff' }}
        >
          <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <MaterialCommunityIcons name="clock-time-eight" size={18} color="black" style={{ marginRight: 5 }} />
            <Text style={{ fontSize: 16, fontWeight: '400' }} >ID - Name</Text>
          </View>
          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ color: '#aba4a4' }} >07-08-2003</Text>
            <Text style={{ color: '#aba4a4' }} >Đã kiểm</Text>
          </View>
        </Pressable>
      </SafeAreaView>
    </PaperProvider >
  )
}

export default savedticket
