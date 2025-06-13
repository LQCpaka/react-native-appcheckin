import { View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { DataTable } from 'react-native-paper';

interface InventoryItem {
  _id: string;
  productId: string;
  productName: string;
  amountProduct: number;
  amountProductChecked: number;
  productPrice?: string;
  productDescriptionA?: string;
  productDescriptionB?: string;
}
const Inventory = () => {
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);

  const API_URL = process.env.EXPO_PUBLIC_BEAPI_URL;
  useEffect(() => {
    axios.get(
      `${API_URL}/inventory`,
      { headers: { Accept: 'application/json' } })

      .then(response => {
        console.log('API response:', response.data);
        if (Array.isArray(response.data)) {
          setInventoryData(response.data);
        } else {
          console.error('Error: API did not return an array', response.data);
          setInventoryData([]);
        }
      })
      .catch(error => console.error('Error fetching inventory:', error));
  }, []);

  return (
    <SafeAreaView>
      <View className='flex items-center justify-center h-12 bg-white shadow'>
        <Text className='text-lg uppercase font-semibold'>Kiểm kê</Text>
      </View>

      <DataTable>
        <DataTable.Header style={{ backgroundColor: '#dddddd', boxShadow: 'md' }} className="shadow-md rounded-md" >
          <DataTable.Title style={{ flex: 1.5, justifyContent: 'center' }} textStyle={{ color: "black" }} >Mã sản phẩm</DataTable.Title>
          <DataTable.Title style={{ flex: 2, justifyContent: 'center' }} textStyle={{ color: "black" }}>Tên sản phẩm</DataTable.Title>
          <DataTable.Title style={{ flex: 1, justifyContent: 'center' }} textStyle={{ color: "black" }}>Số lượng</DataTable.Title>
          <DataTable.Title style={{ flex: 1, justifyContent: 'center' }} textStyle={{ color: "black" }}>Đã kiểm kê</DataTable.Title>
        </DataTable.Header>

        {inventoryData.map((item) => (
          <DataTable.Row key={item._id}>
            <DataTable.Cell style={{ flex: 1.5, justifyContent: 'center' }} textStyle={{ color: "gray" }}>{item.productId}</DataTable.Cell>
            <DataTable.Cell style={{ flex: 2, justifyContent: 'center' }} textStyle={{ color: "gray" }}>{item.productName}</DataTable.Cell>
            <DataTable.Cell style={{ flex: 1, justifyContent: 'center' }} textStyle={{ color: "gray" }}>{item.amountProduct}</DataTable.Cell>
            <DataTable.Cell style={{ flex: 1, justifyContent: 'center' }} textStyle={{ color: "gray" }}>{item.amountProductChecked}</DataTable.Cell>
          </DataTable.Row>
        ))}
      </DataTable>
    </SafeAreaView>
  )
}

export default Inventory
