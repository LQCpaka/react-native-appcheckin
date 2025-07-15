import { View, Text, StyleSheet, FlatList, Pressable, TextInput } from 'react-native'

import { SafeAreaView } from 'react-native-safe-area-context'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { DataTable, Divider, Modal, Searchbar, Portal, PaperProvider, Button } from 'react-native-paper';
import TicketDataList from '@/components/TicketDataList';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { router } from 'expo-router';

import { useInventoryStore } from '@/libs/useInventoryStore';


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
  ticketDescription: string;
  createdDate: string;
}
const containerStyle = {
  backgroundColor: 'white',
  padding: 20,
  borderRadius: 10,
  margin: 20,
};


const Inventory = () => {
  const [ticketData, setTicketData] = useState<InventoryItem[]>([]);

  //Modal state
  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  //Modal Selected Data

  const [selectedItem, setSelectedItem] = useState(null);

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


  //Data Fetching
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



  const { resetScannedData, setTicket } = useInventoryStore();

  const handleSelectTicket = (ticketId: string, type: 'HaveInput' | 'NoInput') => {

    resetScannedData();       // clear data
    setTicket(ticketId, type); // lưu phiếu mới

    setTimeout(() => {
      router.push('/(tabs)/scan'); // push sau 1 tick event loop
    }, 0);
  };

  return (
    <PaperProvider>
      <SafeAreaView >

        <View style={{ zIndex: 99 }} className='flex items-center justify-center h-12 bg-white shadow'>
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
        <Divider style={{ marginVertical: 15, marginHorizontal: 10 }} />


        <FlatList
          style={{ marginBottom: 120 }}
          data={filteredData}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => {
            const matchedStatus = statusIcon.find(si => si.status === item.ticketStatus)
            return (
              <Pressable
                onPress={() => {
                  setSelectedItem(item);
                  showModal();
                }

                }
                className='mx-4 rounded-md shadow'
                style={{
                  backgroundColor: item.ticketDescription === 'Edited' ? '#FDDC5C' : '#fff',
                  padding: 10,
                  marginBottom: 10
                }}>
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
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                  <MaterialCommunityIcons name="alpha-t-box" size={18} color="black" style={{ marginRight: 5 }} />
                  <Text style={{ fontSize: 16, fontWeight: '400' }} >{item.ticketId} - {item.ticketName}</Text>
                </View>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: '#aba4a4' }} >{new Date(item.createdDate).toLocaleString('vi-VN')}</Text>
                  <Text style={{ color: '#aba4a4' }} >{item.ticketStatus}</Text>
                </View>
              </Pressable>
            )
          }}
        />
        <Portal>
          <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
            <View>
              <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                  <AntDesign name="infocirlceo" size={20} color="black" />
                  <Text style={{ fontSize: 18, marginLeft: 8 }} >Thông Tin Phiếu Kiểm</Text>
                </View>
                <Pressable onPress={hideModal} >
                  <AntDesign name="close" size={20} color="black" />
                </Pressable>

              </View>
              {selectedItem && (
                <>
                  <View className='flex gap-2'>
                    <Text className='ml-2 font-semibold'>ID</Text>
                    <TextInput className='rounded-md bg-gray-200 text-gray-500 pl-4' readOnly>{selectedItem._id}</TextInput>
                    <Text className='ml-2 font-semibold'>Mã Phiếu</Text>
                    <TextInput className='rounded-md bg-gray-200 text-gray-500 pl-4' readOnly>{selectedItem.ticketId}</TextInput>
                    <Text className='ml-2 font-semibold'>Tên Phiếu</Text>
                    <TextInput className='rounded-md bg-gray-200 text-gray-500 pl-4' readOnly>{selectedItem.ticketName}</TextInput>
                    <Text className='ml-2 font-semibold'>Loại Phiếu</Text>
                    <TextInput className='rounded-md bg-gray-200 text-gray-500 pl-4' readOnly>{selectedItem.ticketType === 'HaveInput' ? 'Có Dữ Liệu Đầu Vào' : 'Không Có Dữ Liệu Đầu Vào'}</TextInput>
                    <Text className='ml-2 font-semibold'>Trạng Thái Phiếu</Text>
                    <TextInput className='rounded-md bg-gray-200 text-gray-500 pl-4' readOnly>{selectedItem.ticketStatus}</TextInput>
                  </View>
                  <View style={{ marginTop: 20, display: 'flex', flexDirection: 'row', gap: 4 }}>
                    {selectedItem.ticketStatus === 'Phiếu Đã Xác Nhận' ? (
                      <>
                        <Button
                          onPress={() => {
                            handleSelectTicket(selectedItem.ticketId, selectedItem.ticketType)
                            hideModal();
                          }}
                          style={{ backgroundColor: '#1F8EF1', width: '50%', borderRadius: 8 }}
                          textColor='#fff'                         >
                          Bắt Đầu Kiểm
                        </Button>
                        <Button
                          onPress={() => {
                            router.push({
                              pathname: '/(screens)/detailinventory',
                              params: { ticketId: selectedItem.ticketId, ticketType: selectedItem.ticketType },
                            });
                            hideModal();
                          }}
                          style={{ backgroundColor: '#FF6B00', width: '50%', borderRadius: 8 }}
                          textColor='#fff' className='rounded-md'  >Chi Tiết Phiếu</Button>
                      </>
                    ) : (
                      <Button
                        onPress={() => {
                          router.push({
                            pathname: '/(screens)/detailinventory',
                            params: { ticketId: selectedItem.ticketId },
                          });
                          hideModal();
                        }}
                        style={{ backgroundColor: '#FF6B00', width: '100%', borderRadius: 8 }}
                        textColor='#fff' className='rounded-md'  >Chi Tiết Phiếu</Button>

                    )}
                  </View>
                </>
              )}
            </View>
          </Modal>
        </Portal>
        {/* <TicketDataList data={ticketData} /> */}

      </SafeAreaView >
    </PaperProvider >
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
