import { View, Text, StyleSheet, FlatList } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { DataTable, Divider, Searchbar } from 'react-native-paper';
import TicketDataList from '@/components/TicketDataList';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const statusIcon = [
  {
    status: 'Phiếu Mới',
    icon: () => <FontAwesome6 name="question" size={15} color="white" style={styles.iconStyleQuestion} />,
    backgroundColor: 'red',
  },
  {
    status: 'Phiếu Chờ Xác Nhận',
    icon: () => <FontAwesome6 name="question" size={15} color="white" style={styles.iconStyleQuestion} />,
    backgroundColor: 'red',
  },
  {
    status: 'Phiếu Đã Xác Nhận',
    icon: () => <MaterialCommunityIcons name="reload" size={15} color="white" style={styles.iconStyleWaiting} />,
    backgroundColor: '#60A5FA',
  },
  {
    status: 'Kiểm Kê Hoàn Tất',
    icon: () => <Entypo name="check" size={15} color="white" style={styles.iconStyleComplete} />,
    backgroundColor: '#FACC15',
  }
]


interface InventoryItem {
  _id: string;
  ticketId: string;
  ticketName: string;
  ticketType: string;
  ticketStatus: string;
  createdDate: string;
}
const Inventory = () => {
  const [ticketData, setTicketData] = useState<InventoryItem[]>([]);

  //Search Querry
  const [filteredData, setFilteredData] = useState(ticketData);
  const [searchQuery, setSearchQuery] = useState<string>('');
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredData(ticketData);
      return;
    }

    const lowerQuery = searchQuery.toLowerCase();

    const filtered = ticketData.filter(item =>
      item._id.toLowerCase().includes(lowerQuery) ||
      item.ticketId.toLowerCase().includes(lowerQuery) ||
      item.ticketName.toLowerCase().includes(lowerQuery) ||
      item.ticketType.toLowerCase().includes(lowerQuery) ||
      item.ticketStatus.toLowerCase().includes(lowerQuery)
    );

    setFilteredData(filtered);
  }, [searchQuery, ticketData]);


  const API_URL = process.env.EXPO_PUBLIC_BEAPI_URL;
  useEffect(() => {
    axios.get(
      `${API_URL}/list-tickers`,
      { headers: { 'Content-Type': 'application/json' } })

      .then(response => {
        console.log('API response:', response.data);
        if (Array.isArray(response.data)) {
          setTicketData(response.data);
        } else {
          console.error('Error: API did not return an array', response.data);
          setTicketData([]);
        }
      })
      .catch(error => console.error('Error fetching inventory:', error));
  }, []);

  return (
    <SafeAreaView>
      <View className='flex items-center justify-center h-12 bg-white shadow'>
        <Text className='text-lg uppercase font-semibold'>Phiếu Kiểm Kê</Text>
      </View>
      <Searchbar
        onChangeText={setSearchQuery}
        value={searchQuery}
        placeholder="Tìm kiếm phiếu kiểm kê"
        placeholderTextColor="#aba4a4"
        style={{
          borderRadius: 10,
          marginTop: 20,
          marginHorizontal: 10,
          shadowColor: '#000',
          shadowOffset: { width: 1, height: 2 },
          shadowOpacity: 1,
          shadowRadius: 3,
          elevation: 5, // Dùng cho Android
          backgroundColor: '#fff',
        }}
      />
      <Divider style={{ marginVertical: 25, marginHorizontal: 10 }} />


      <FlatList
        style={{ height: '80%', marginBottom: 20 }}
        data={filteredData}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => {
          const matchedStatus = statusIcon.find(si => si.status === item.ticketStatus)
          return (
            <View className='mx-4 rounded-md shadow' style={{ backgroundColor: '#fff', padding: 10, marginBottom: 10 }}>
              <View style={{
                width: 0,
                height: 0,
                borderBottomWidth: 30,
                borderRightWidth: 35,
                borderBottomColor: 'transparent',
                borderRightColor: `${matchedStatus && matchedStatus.backgroundColor}`,
                position: 'absolute',
                top: 0,
                right: 0,
              }}>
              </View>

              {matchedStatus && matchedStatus.icon()}

              {/* <Entypo name="check" size={15} color="yellow" /> */}
              <Text style={{ fontSize: 16, fontWeight: '400', marginBottom: 10 }} >Id: {item._id} - {item.ticketName}</Text>
              <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: '#aba4a4' }} >{new Date(item.createdDate).toLocaleString('vi-VN')}</Text>
                <Text style={{ color: '#aba4a4' }} >{item.ticketStatus}</Text>
              </View>
            </View>
          )
        }}
      />
      {/* <TicketDataList data={ticketData} /> */}

    </SafeAreaView >
  )
}

const styles = StyleSheet.create({
  iconStyleComplete: {
    position: 'absolute', top: 2, right: 2, zIndex: 1
  },
  iconStyleWaiting: {
    position: 'absolute', top: 2, right: 2, zIndex: 1
  },
  iconStyleQuestion: {
    position: 'absolute', top: 3, right: 4, zIndex: 1
  }

})
export default Inventory
