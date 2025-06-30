import axios from "axios";
import { useRef, useState, useEffect, useCallback } from "react";
import { router, useFocusEffect, useGlobalSearchParams } from "expo-router";

import { Text, TextInput, FlatList, View, ScrollView, TouchableOpacity, NativeSyntheticEvent, TextInputSubmitEditingEventData, Image } from "react-native";
import { Button, DataTable, Divider } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { images } from "@/constant/images";

import { useInventoryStore } from '@/libs/inventoryStore';
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

  const { ticketId, ticketType } = useGlobalSearchParams();

  //===========================| SCAN |================================
  const inputRef = useRef(null);

  // Khi component mount, focus TextInput ẩn luôn để nhận input scan
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  useFocusEffect(
    useCallback(() => {
      const timeout = setTimeout(() => {
        inputRef.current?.focus();
      }, 100); // Delay nhẹ để đảm bảo UI đã render

      return () => clearTimeout(timeout);
    }, [])
  );
  const [scanInput, setScanInput] = useState('');

  const [scannedItems, setScannedItems] = useState<InventoryItem[]>([]);
  const displayedItems = scannedItems.slice(0, 5);

  const handleScan = (text: string) => {
    if (text.endsWith('\n')) {
      const clean = text.trim();
      setScannedItems(prev => [...prev, clean]);
      setScanInput('');
    } else {
      setScanInput(text);
    }
  }

  const handleSubmit = (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
    const scanned = e.nativeEvent.text.trim();
    if (!scanned) return;

    const existedIndex = scannedItems.findIndex(item => item.productId === scanned);

    if (existedIndex !== -1) {
      const updatedItems = [...scannedItems];
      updatedItems[existedIndex].amountProductChecked += 1;

      const reOrdered = [
        updatedItems[existedIndex],
        ...updatedItems.filter((_, i) => i !== existedIndex)
      ];

      setScannedItems(reOrdered);
    } else {
      const data = inventoryData.find(item => item.productId === scanned);
      if (!data) {
        alert("Không tìm thấy sản phẩm!");
        return;
      }

      const newItem = { ...data, amountProductChecked: 1 };
      setScannedItems(prev => [newItem, ...prev]);
    }

    setScanInput('');
  };


  // ======================| DATA TABLE - FETCHING |=======================
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);

  const API_URL = process.env.EXPO_PUBLIC_BEAPI_URL;

  useEffect(() => {
    if (ticketId === null || ticketType === null) return; // ⛔ Tránh fetch khi thiếu dữ liệu

    setScannedItems([]);        // Reset danh sách đã scan
    setInventoryData([]);       // Xóa dữ liệu cũ trước khi load mới

    const fetchData = async () => {
      try {
        let endpoint = '';

        if (ticketType === 'HaveInput') {
          endpoint = `${API_URL}/inventory/${ticketId}`;
        } else if (ticketType === 'NoInput') {
          endpoint = `${API_URL}/no-input/${ticketId}`;
        } else {
          console.warn('Loại ticket không hợp lệ:', ticketType);
          return;
        }

        const response = await axios.get(endpoint, {
          headers: { Accept: 'application/json' },
        });

        if (Array.isArray(response.data)) {
          setInventoryData(response.data);
        } else {
          console.error('❗ API không trả về array:', response.data);
          setInventoryData([]);
        }
      } catch (error) {
        console.error('❌ Lỗi khi fetch dữ liệu:', error);
      }
    };

    fetchData();
  }, [ticketId, ticketType]); // 🔁 Theo dõi cả 2 giá trị
  // =================| BOTTOM SHEET DATA |===========================

  const sheetRef = useRef<BottomSheetMethods>(null);
  const [isOpen, setIsOpen] = useState(false);
  const snapPoint = ['50%'];

  const [selectedItem, setSelectedItem] = useState(null);

  const [isEditA, setIsEditA] = useState(false);
  const [isEditB, setIsEditB] = useState(false);

  const [editValue, setEditValue] = useState(selectedItem?.productDescriptionB || '');

  return (
    <SafeAreaView className='flex-1'>
      <GestureHandlerRootView style={{ flex: 1 }}>

        {/*===============================| HEADER  |============================================*/}
        <View className='flex items-center justify-center h-12 bg-white shadow mb-4'>
          <Text className='text-lg uppercase font-semibold'>Quét Mã</Text>
        </View>
        <ScrollView contentContainerStyle={{ paddingBottom: 50 }} style={{ paddingTop: '2%' }} >
          {/*===============================| SCAN DATA SECTION  |============================================*/}
          <View className="rounded-md" style={{ shadowColor: '#000', backgroundColor: '#fff', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.20, shadowRadius: 3.84, elevation: 5, marginHorizontal: '4%' }}>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: '4%', padding: 4 }}>
              <View style={{ display: 'flex', flexDirection: 'row', marginTop: 10 }}>
                <MaterialCommunityIcons name="qrcode-scan" size={20} color="#aba4a4" />
                <Text className="font-semibold" style={{ marginLeft: 10, color: '#aba4a4' }}>{!ticketId ? 'Vui Lòng Chọn Phiếu' : ticketId}</Text>
              </View>
              <TouchableOpacity onPress={() => {
                inputRef.current?.focus();
                inputRef.current?.setNativeProps({ text: '' });
              }}>
                <Ionicons name="reload-sharp" size={20} color="#aba4a4" style={{ marginTop: 10, }} />
              </TouchableOpacity>
            </View>
            <Divider style={{ backgroundColor: '#aba4a4', marginHorizontal: '3%', marginTop: '3%' }} />
            <View style={{ marginVertical: '3%', marginHorizontal: 15 }}>
              <View className='flex gap-2'>
                <TextInput
                  ref={inputRef}
                  showSoftInputOnFocus={false}
                  value={scanInput}
                  onChangeText={setScanInput}
                  onSubmitEditing={handleSubmit}
                  autoFocus
                  blurOnSubmit={false}
                  style={{ position: 'absolute', opacity: 0 }}
                />

                {scannedItems.length > 0 && (
                  <>
                    <Text className='ml-2 font-semibold'>Mã Sản Phẩm</Text>
                    <TextInput className='rounded-md bg-gray-200 text-gray-500 pl-4' readOnly value={scannedItems[0].productId} />
                    <Text className='ml-2 font-semibold'>Tên Sản Phẩm</Text>
                    <TextInput className='rounded-md bg-gray-200 text-gray-500 pl-4' readOnly value={scannedItems[0].productName} />
                  </>
                )}



              </View>
              <View style={{ display: 'flex', gap: 5, marginTop: '5%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Button style={{ backgroundColor: '#ee2400', width: '50%', borderRadius: 8 }} textColor='#fff'>Hủy Phiếu Kiểm</Button>
                <Button
                  style={{ backgroundColor: '#FF6B00', width: '50%', borderRadius: 8 }}
                  textColor='#fff' className='rounded-md'
                >
                  Cập Nhật
                </Button>
              </View>
            </View>
          </View>


          {/*===============================| DATA LOAD SECTION |===============================*/}
          <View>
            <View className="rounded-md" style={{ shadowColor: '#000', backgroundColor: '#fff', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.20, shadowRadius: 3.84, elevation: 5, marginHorizontal: '4%', marginTop: '5%' }}>

              {/* HEADER LOADSECTION */}
              <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: '4%', padding: '4%' }}>
                <Text className='text-xl font-semibold '>Danh Sách Sản Phẩm</Text>
                {ticketId && (
                  <TouchableOpacity onPress={() => {
                    inputRef.current?.focus();
                    useInventoryStore.getState().setScannedData(scannedItems);
                    router.push('/(screens)/detailscan');
                  }}>
                    <MaterialIcons name="open-in-new" size={20} color="black" />
                  </TouchableOpacity>

                )}
              </View>

              <Divider style={{ backgroundColor: '#aba4a4', marginHorizontal: '3%', marginBottom: '3%' }} />
              {/* PRODUCT ITEM */}
              <View style={{ backgroundColor: '#fff' }}>
                <FlatList
                  data={displayedItems}
                  scrollEnabled={false}
                  keyExtractor={(item, index) => `${item.productId}-${index}`}
                  renderItem={({ item }) => (
                    < TouchableOpacity
                      onPress={() => {
                        setSelectedItem(item);
                        sheetRef.current?.expand();
                      }}
                      className="rounded-lg mx-4"
                      style={{ display: 'flex', padding: 10, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', shadowColor: '#000', backgroundColor: '#fff', shadowOffset: { width: 1, height: 2 }, shadowOpacity: 0.20, shadowRadius: 3.84, elevation: 5 }}
                    >
                      <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', }}>
                        <Entypo name="box" size={40} color="#aba4a4" className="mr-4" />
                        <View>
                          <Text style={{ fontSize: 16, fontWeight: 'semibold' }} >{item.productName}</Text>
                          <Text style={{ fontSize: 16, fontWeight: 'semibold', color: '#787474' }} >{item.productId}</Text>
                        </View>
                      </View>


                      <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: '#787474' }} >Số lượng</Text>
                        <Text style={{ fontSize: 25, fontWeight: 'bold' }}>{item.amountProductChecked}</Text>
                      </View>
                    </TouchableOpacity>


                  )}
                  ListEmptyComponent={(
                    <View style={{ height: '75%', marginTop: 10 }} className=" items-center justify-center">
                      <Image
                        source={images.nodatafound}
                        style={{ width: 200, height: 200 }} />
                    </View>
                  )}
                />
              </View>


            </View>
          </View>
          {/* <View style={{ marginHorizontal: '4%' }}></View> */}
        </ScrollView>
        <BottomSheet
          ref={sheetRef}
          enablePanDownToClose
          snapPoints={snapPoint}
          index={-1}
          onClose={() => {
            setSelectedItem(null);
          }}
        >
          <BottomSheetView>

            {selectedItem && (
              <View style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-around', marginVertical: '3%' }}>
                  <TouchableOpacity>
                    <Entypo name="minus" size={24} color="black" />
                  </TouchableOpacity>
                  <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'black' }}>{selectedItem.amountProductChecked} Cái</Text>
                  <TouchableOpacity onPress={() => { selectedItem.amountProductChecked += 1; setSelectedItem({ ...selectedItem }) }}>
                    <Entypo name="plus" size={24} color="black" />
                  </TouchableOpacity>
                </View>
                <View style={{ width: '100%', paddingHorizontal: '3%', marginBottom: '5%', gap: 5 }}>
                  <Text>Mã Sản Phẩm</Text>
                  <TextInput className='rounded-md bg-gray-200 text-gray-500 pl-4' readOnly value={selectedItem.productId} />
                  <Text>Tên Sản Phẩm</Text>
                  <TextInput className='rounded-md bg-gray-200 text-gray-500 pl-4' readOnly value={selectedItem.productName} />
                  <Text>Ghi Chú A</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <TextInput
                      style={{ flex: 1 }}
                      className='rounded-md bg-gray-200 text-gray-500 pl-4'
                      readOnly
                      value={selectedItem.productDescriptionA} />
                    {isEditA === false ? (
                      <TouchableOpacity onPress={() => { setIsEditA(true) }}>
                        <Feather name="edit" size={24} color="black" />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity onPress={() => { setIsEditA(false) }}>
                        <FontAwesome6 name="save" size={24} color="black" />
                      </TouchableOpacity>
                    )}
                  </View>
                  <Text>Ghi Chú B</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <TextInput
                      style={{ flex: 1 }}
                      className='rounded-md bg-gray-200 text-gray-500 pl-4'
                      editable={isEditB}
                      value={editValue}
                      onChangeText={setEditValue} />
                    {isEditB === false ? (
                      <TouchableOpacity onPress={() => {
                        setIsEditB(true);
                      }}>
                        <Feather name="edit" size={24} color="black" />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity onPress={() => {
                        setIsEditB(false);

                      }}>
                        <FontAwesome6 name="save" size={24} color="black" />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            )}
          </BottomSheetView>
        </BottomSheet>
      </GestureHandlerRootView >
    </SafeAreaView >

  );
}

