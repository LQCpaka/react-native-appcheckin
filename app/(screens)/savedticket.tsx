import { images } from '@/constant/images'
import { useAuth } from '@/context/AuthContext'
import { getDrafts } from '@/services/draftManager'
import { Ionicons } from '@expo/vector-icons'
import { useFocusEffect, useRouter } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import { View, Text, Pressable, FlatList, Image, TouchableOpacity, Alert } from 'react-native'
import { PaperProvider } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'

const Savedticket = () => {
  const route = useRouter();
  const { userInfo } = useAuth();
  const username = userInfo?.name;

  const [drafts, setDrafts] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const fetchDrafts = async () => {
        if (!username) return;
        const data = await getDrafts(username);
        setDrafts(data);
      };

      fetchDrafts();

      return () => {
      };
    }, [username])
  );

  useEffect(() => {
    const fetchDrafts = async () => {
      if (!username) return;
      const data = await getDrafts(username);
      setDrafts(data);
    };
    fetchDrafts();
  }, [username]);

  const handleCheckTicketId = (ticketId: string, ticketType: string, timestamp: any) => {
    route.push({
      pathname: '/(screens)/detailsavedticket',
      params: {
        ticketId: ticketId,
        ticketType: ticketType,
        timestamp: timestamp
      }
    })
  }
  return (
    <PaperProvider>
      <SafeAreaView edges={['bottom']} style={{ flex: 1 }}>
        {drafts.length > 0 && (
          <TouchableOpacity
            onPress={() => Alert.alert('Chức năng này đang được phát triển!')}
            style={{ zIndex: 999, position: 'absolute', bottom: 30, right: 30, backgroundColor: '#2196f3', borderRadius: 30, width: 60, height: 60, justifyContent: 'center', alignItems: 'center', elevation: 5 }} >
            <Ionicons name='cloud-upload-outline' color='white' size={24} />
          </TouchableOpacity>
        )}

        {drafts.length > 0 ? (
          <FlatList
            data={drafts}
            keyExtractor={(item, index) => `${item.ticketId}_${index}`}
            renderItem={({ item }) =>
              <Pressable
                onPress={() => handleCheckTicketId(item.ticketId, item.ticketType, item.savedAt)}
                className='shadow rounded-md'
                style={{ padding: 10, marginHorizontal: 5, marginTop: 5, backgroundColor: '#fff' }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                  <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                    <Ionicons name="time-sharp" size={18} color="black" style={{ marginRight: 5 }} />
                    <Text style={{ fontSize: 16, fontWeight: '400' }} >{item.ticketId}</Text>
                  </View>
                  <Text className='font-bold' style={{ fontSize: 18 }}>{item.scannedData.length}</Text>
                </View>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: '#aba4a4' }} >{new Date(item.savedAt).toLocaleDateString()}</Text>
                  <Text style={{ color: '#aba4a4' }} >Đã kiểm</Text>
                </View>
              </Pressable>
            }

          />
        ) : (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Image source={images.nodatafound} style={{ width: 200, height: 200 }} />
          </View>
        )}
      </SafeAreaView>
    </PaperProvider >
  )
}

export default Savedticket
