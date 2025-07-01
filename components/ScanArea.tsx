import axios from "axios";
import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { router, useFocusEffect, useGlobalSearchParams } from "expo-router";

import { Text, TextInput, FlatList, View, ScrollView, TouchableOpacity, NativeSyntheticEvent, TextInputSubmitEditingEventData, Image, Alert } from "react-native";
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

import { useInventoryStore } from '@/libs/useInventoryStore';
import { getCheckedCount } from '@/utils/getCheckedCount';

type InventoryType = 'HaveInput' | 'NoInput';

interface BaseInventory {
  _id: string;
  productId: string;
  productName: string;
  amountProduct: number;
  type: InventoryType;
}

interface InventoryWithInput extends BaseInventory {
  countAs: string;
  amountProductChecked: number;
  productPrice?: string;
  productDescriptionA?: string;
  productDescriptionB?: string;
}

interface InventoryNoInput extends BaseInventory {
  scannedData: {
    scannedBy: string;
    scannedAt: Date;
    scannedByName?: string;
  }[];
  totalScanned?: number;
}

type InventoryItem = InventoryWithInput | InventoryNoInput;


const ScanArea = () => {
  const inputRef = useRef<TextInput>(null);
  const [scanInput, setScanInput] = useState('');
  const { ticketId, ticketType, scannedData, setScannedData } = useInventoryStore();
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
  const API_URL = process.env.EXPO_PUBLIC_BEAPI_URL;

  useFocusEffect(
    useCallback(() => {
      const timeout = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timeout);
    }, [])
  )

  //=================================| FETCH INVENTORY DATA |===================================

  useEffect(() => {
    if (!ticketId || !ticketType) return;

    setInventoryData([]);

    const fetchData = async () => {
      try {
        const endpoint =
          ticketType === "HaveInput"
            ? `${API_URL}/inventory/${ticketId}`
            : `${API_URL}/no-input/${ticketId}`;

        const response = await axios.get(endpoint, {
          headers: { Accept: 'application/json' },
        });

        if (Array.isArray(response.data)) {
          setInventoryData(response.data);
        } else {
          setInventoryData([]);
        }
      } catch (error) {
        console.error("Error fetching inventory data:", error);
      }
    };
    fetchData();
  }, [ticketId, ticketType]);

  //=================================| HANDLE SUBMIT DATA |===================================

  const handleSubmit = (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
    const scanned = e.nativeEvent.text.trim();
    if (!scanned) return;

    let updatedList = [...scannedData];
    const existedIndex = scannedData.findIndex(item => item.productId === scanned);

    if (ticketType === 'HaveInput') {
      if (existedIndex !== -1) {
        updatedList[existedIndex].amountProductChecked += 1;

        updatedList = [
          updatedList[existedIndex],
          ...updatedList.filter((_, i) => i !== existedIndex),
        ];
      } else {
        const match = inventoryData.find(item => item.productId === scanned);
        if (!match) {
          Alert.alert("Không tìm thấy sản phẩm!");
          return;
        }

        const newItem: InventoryItem = {
          ...match,
          amountProductChecked: 1,
        };

        updatedList = [newItem, ...updatedList];
      }
    }

    else if (ticketType === 'NoInput') {
      if (existedIndex !== -1) {
        updatedList[existedIndex].amountProduct += 1;

        updatedList[existedIndex].scannedData.push({
          scannedBy: 'admin',
          scannedAt: new Date(),
        });

        updatedList[existedIndex].totalScanned = updatedList[existedIndex].scannedData.length;

        updatedList = [
          updatedList[existedIndex],
          ...updatedList.filter((_, i) => i !== existedIndex),
        ];
      } else {
        const newItem: InventoryNoInput = {
          _id: scanned,
          productId: scanned,
          productName: '',
          amountProduct: 1,
          scannedData: [
            { scannedBy: 'admin', scannedAt: new Date() }
          ],
          totalScanned: 1,
          type: 'NoInput',
        };

        updatedList = [newItem, ...updatedList];
      }
    }

    setScannedData(updatedList);
    setScanInput('');
  };



  const topScannedItems = useMemo(() => scannedData.slice(0, 5), [scannedData]);



  return (
    <>
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
              // style={{ position: 'absolute', opacity: 0 }}
              />

              {scannedData.length > 0 && (
                <>
                  <Text className='ml-2 font-semibold'>Mã Sản Phẩm</Text>
                  <TextInput className='rounded-md bg-gray-200 text-gray-500 pl-4' readOnly value={scannedData[0].productId} />
                  <Text className='ml-2 font-semibold'>Tên Sản Phẩm</Text>
                  <TextInput className='rounded-md bg-gray-200 text-gray-500 pl-4' readOnly value={scannedData[0].productName} />
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
                data={topScannedItems}
                scrollEnabled={false}
                keyExtractor={(item, index) => `${item.productId}-${index}`}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={{
                      padding: 10,
                      marginHorizontal: 16,
                      marginBottom: 10,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      backgroundColor: '#fff',
                      borderRadius: 10,
                      elevation: 5,
                      shadowColor: '#000',
                      shadowOffset: { width: 1, height: 2 },
                      shadowOpacity: 0.2,
                      shadowRadius: 4
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Entypo name="box" size={40} color="#aba4a4" />
                      <View style={{ marginLeft: 12 }}>
                        <Text style={{ fontSize: 16, fontWeight: '600' }}>{item.productName}</Text>
                        <Text style={{ fontSize: 14, color: '#787474' }}>{item.productId}</Text>
                      </View>
                    </View>

                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={{ color: '#787474' }}>Số lượng</Text>
                      <Text style={{ fontSize: 25, fontWeight: 'bold' }}>
                        {getCheckedCount(item)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={(
                  <View style={{ height: '75%', marginTop: 10, justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={images.nodatafound} style={{ width: 200, height: 200 }} />
                  </View>
                )}
              />

            </View>


          </View>
        </View>
        {/* <View style={{ marginHorizontal: '4%' }}></View> */}
      </ScrollView>
    </>
  )
}

export default ScanArea
