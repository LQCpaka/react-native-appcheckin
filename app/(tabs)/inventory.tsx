import { View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { DataTable } from 'react-native-paper';
import TicketDataList from '@/components/TicketDataList';

interface InventoryItem {
  _id: string;
  ticketId: string;
  ticketName: string;
  ticketType: string;
}
const Inventory = () => {
  const [ticketData, setTicketData] = useState<InventoryItem[]>([]);

  const API_URL = process.env.EXPO_PUBLIC_BEAPI_URL;
  useEffect(() => {
    axios.get(
      `${process.env.EXPO_PUBLIC_BEAPI_URL}/list-tickers`,
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
        <Text className='text-lg uppercase font-semibold'>Kiểm kê</Text>
      </View>
      <TicketDataList data={ticketData} />

    </SafeAreaView>
  )
}

export default Inventory
