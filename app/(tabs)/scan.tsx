import axios from "axios";
import { useRef, useState, useEffect } from "react";
import { Text, TextInput, FlatList, View, ScrollView, TouchableOpacity } from "react-native";
import { Button, DataTable, Divider } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useGlobalSearchParams } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
//====================| DATA FETCHING |==========================

interface InventoryItem {
  _id: string;
  productId: string;
  productName: string;
  countAs: string;
  amountProduct: number;
  amountProductChecked: number;
  productPrice?: string;
  productDescriptionA?: string;
  productDescriptionB?: string;
}


export default function Index() {


  //===========================| SCAN |================================
  const [qrText, setQrText] = useState("");

  const inputRef = useRef<TextInput>(null);

  // Khi component mount, focus TextInput ẩn luôn để nhận input scan
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleClearText = () => {
    setQrText("");
  }

  const handleScan = (text: string) => {
    setQrText(text);

    setInventoryData(prevData => {
      const updated = prevData.map(item => {
        if (item.productId === text) {
          return {
            ...item,
            amountProductChecked: item.amountProductChecked + 1 // hoặc += số lượng nếu QR mang thông tin số lượng
          };
        }
        return item;
      });
      return updated;
    });
  };
  const handleBatchUpdate = async () => {
    try {
      const updates = inventoryData.map(item => ({
        _id: item._id,
        updatedData: {
          amountProductChecked: item.amountProductChecked
        }
      }));

      const res = await axios.put(`${API_URL}/update-multinventory`, {
        updates
      });

      alert('Cập nhật thành công!');
    } catch (err) {
      console.error('Batch update failed:', err);
      alert('Lỗi cập nhật!');
    }
  };

  // ======================| DATA TABLE - FETCHING |=======================
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);

  const API_URL = process.env.EXPO_PUBLIC_BEAPI_URL;
  // useEffect(() => {
  //   axios.get(
  //     `${API_URL}/inventory`,
  //     { headers: { Accept: 'application/json' } })
  //
  //     .then(response => {
  //       console.log('API response:', response.data);
  //       if (Array.isArray(response.data)) {
  //         setInventoryData(response.data);
  //       } else {
  //         console.error('Error: API did not return an array', response.data);
  //         setInventoryData([]);
  //       }
  //     })
  //     .catch(error => console.error('Error fetching inventory:', error));
  // }, []);

  // =================| BOTTOM SHEET DATA |===========================

  const sheetRef = useRef<BottomSheetMethods>(null);
  const [isOpen, setIsOpen] = useState(false);
  const snapPoint = ['50%'];

  const [selectedItem, setSelectedItem] = useState(null);

  const { ticketId } = useGlobalSearchParams();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className='flex-1'>
        <View className='flex items-center justify-center h-12 bg-white shadow mb-4'>
          <Text className='text-lg uppercase font-semibold'>Quét Mã</Text>
        </View>

        {/* SCAN DATA SECTION  */}
        <View className="rounded-md" style={{ shadowColor: '#000', backgroundColor: '#fff', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.20, shadowRadius: 3.84, elevation: 5, marginHorizontal: '4%' }}>
          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: '4%', padding: 4 }}>
            <View style={{ display: 'flex', flexDirection: 'row', marginTop: 10 }}>
              <MaterialCommunityIcons name="qrcode-scan" size={20} color="#aba4a4" />
              <Text className="font-semibold" style={{ marginLeft: 10, color: '#aba4a4' }}>{!ticketId ? 'Vui Lòng Chọn Phiếu' : ticketId}</Text>
            </View>
            <Ionicons name="reload-sharp" size={20} color="#aba4a4" style={{ marginTop: 10, }} />
          </View>
          <Divider style={{ backgroundColor: '#aba4a4', marginHorizontal: '3%', marginTop: '3%' }} />
          <View style={{ marginVertical: '3%', marginHorizontal: 15 }}>
            <View className='flex gap-2'>
              <Text className='ml-2 font-semibold'>Mã Sản Phẩm</Text>
              <TextInput className='rounded-md bg-gray-200 text-gray-500 pl-4' readOnly>12837192837</TextInput>
              <Text className='ml-2 font-semibold'>Tên Sản Phẩm</Text>
              <TextInput className='rounded-md bg-gray-200 text-gray-500 pl-4' readOnly>Thịt gà</TextInput>
            </View>
            <View style={{ display: 'flex', gap: 5, marginTop: '5%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Button style={{ backgroundColor: '#ee2400', width: '50%', borderRadius: 8 }} textColor='#fff'  >Hủy Phiếu Kiểm</Button>
              <Button
                style={{ backgroundColor: '#FF6B00', width: '50%', borderRadius: 8 }}
                textColor='#fff' className='rounded-md'
              >
                Cập Nhật
              </Button>
            </View>
          </View>
        </View>

        {/* DATA LOAD SECTION */}
      </SafeAreaView>

    </GestureHandlerRootView >

  );
}

