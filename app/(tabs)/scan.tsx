import axios from "axios";
import { useRef, useState, useEffect } from "react";
import { Text, TextInput, FlatList, View, ScrollView, TouchableOpacity } from "react-native";
import { Button, DataTable, Divider } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
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

  // =================| BOTTOM SHEET DATA |===========================

  const sheetRef = useRef<BottomSheetMethods>(null);
  const [isOpen, setIsOpen] = useState(false);
  const snapPoint = ['50%'];

  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className='flex-1'>
        <View className='flex items-center justify-center h-12 bg-white shadow mb-4'>
          <Text className='text-lg uppercase font-semibold'>Quét Mã</Text>
        </View>
        <View style={{ marginHorizontal: '7%' }}>
          <View className="flex flex-row items-center justify-between mb-2" style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: '2%' }}>
            <Text >
              Quét QR bằng nút trái/phải trên EF501
            </Text>
            <MaterialCommunityIcons name="qrcode-scan" size={24} color="black" />
          </View>
          <Divider className="mb-4" />


          {/* TextInput ẩn */}
          <TextInput
            ref={inputRef}
            value={qrText}
            onChangeText={(text) => handleScan(text)} // Gọi handleScan khi có dữ liệu mới
            autoFocus={true}
            blurOnSubmit={false}
            showSoftInputOnFocus={false}
            style={{ borderWidth: 0.5, borderColor: '#bab1b1' }} // Ẩn TextInput
            className=" rounded-md mb-5"
          />
          <View className="mx-2" style={{ flexDirection: 'row', justifyContent: 'center', gap: '1%' }}>
            <TouchableOpacity className="rounded-md shadow-md py-4" style={{ backgroundColor: '#007BFF', width: '50%' }} onPress={handleClearText} >
              <Text className="font-semibold text-white uppercase text-center">Nhập Mới</Text>
            </TouchableOpacity>
            <TouchableOpacity className="rounded-md py-4" style={{ backgroundColor: '#28A745', width: '50%' }} onPress={handleBatchUpdate}>
              <Text className="font-semibold text-white uppercase text-center">Cập Nhật</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Divider style={{ margin: '4%' }} />
        <View className="mx-4">
          <DataTable>
            <DataTable.Header style={{ backgroundColor: '#dddddd', boxShadow: 'md' }} className="shadow-md rounded-md">
              <DataTable.Title style={{ flex: 1.5, justifyContent: 'center', }} textStyle={{ color: "black" }} >Mã sản phẩm</DataTable.Title>
              <DataTable.Title style={{ flex: 2, justifyContent: 'center' }} textStyle={{ color: "black" }}>Tên sản phẩm</DataTable.Title>
              <DataTable.Title style={{ flex: 1, justifyContent: 'flex-end' }} textStyle={{ color: "black" }}>Số lượng</DataTable.Title>
              <DataTable.Title style={{ flex: 1, justifyContent: 'flex-end' }} textStyle={{ color: "black" }}>Đã kiểm</DataTable.Title>
            </DataTable.Header>

            {/* {/* Scroll View */} */}
            {/* <ScrollView style={{ maxHeight: '70%' }}> */}
            {/*   {inventoryData.map((item) => ( */}
            {/*     <DataTable.Row key={item._id} */}
            {/*       onPress={() => { */}
            {/*         setSelectedItem(item); */}
            {/*         sheetRef.current?.expand(); */}
            {/*       }}                > */}
            {/*       <DataTable.Cell style={{ flex: 1.5, justifyContent: 'center' }} textStyle={{ color: "gray" }}>{item.productId}</DataTable.Cell> */}
            {/*       <DataTable.Cell style={{ flex: 2, justifyContent: 'center' }} textStyle={{ color: "gray" }}>{item.productName}</DataTable.Cell> */}
            {/*       <DataTable.Cell style={{ flex: 1, justifyContent: 'flex-end' }} textStyle={{ color: "gray" }}>{item.amountProduct}</DataTable.Cell> */}
            {/*       <DataTable.Cell style={{ flex: 1, justifyContent: 'flex-end' }} textStyle={{ color: "gray" }}>{item.amountProductChecked}</DataTable.Cell> */}
            {/*     </DataTable.Row> */}
            {/*   ))} */}
            {/* </ScrollView> */}
          </DataTable>
        </View>

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
            <View>
              ProductItem
            </View>
            {/*   {selectedItem && ( */}
            {/*     <View style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}> */}
            {/*       <DataTable> */}
            {/*         <DataTable.Header style={{ backgroundColor: '#dddddd', boxShadow: 'md' }} className="shadow-md rounded-md"> */}
            {/*           <DataTable.Title style={{ flex: 1.5, justifyContent: 'center' }} textStyle={{ color: "black" }}>THÔNG TIN SẢN PHẨM</DataTable.Title> */}
            {/*         </DataTable.Header> */}
            {/*         <DataTable.Row> */}
            {/*           <DataTable.Cell style={{ flex: 1.5, justifyContent: 'center' }} textStyle={{ color: "Black" }}>Mã Sản Phẩm</DataTable.Cell> */}
            {/*           <DataTable.Cell style={{ flex: 2, justifyContent: 'center' }} textStyle={{ color: "gray" }}>{selectedItem.productId}</DataTable.Cell> */}
            {/*         </DataTable.Row> */}
            {/*         <DataTable.Row> */}
            {/*           <DataTable.Cell style={{ flex: 1.5, justifyContent: 'center' }} textStyle={{ color: "Black" }}>Tên Sản Phẩm</DataTable.Cell> */}
            {/*           <DataTable.Cell style={{ flex: 2, justifyContent: 'center' }} textStyle={{ color: "gray" }}>{selectedItem.productName}</DataTable.Cell> */}
            {/*         </DataTable.Row> */}
            {/*         <DataTable.Row> */}
            {/*           <DataTable.Cell style={{ flex: 1.5, justifyContent: 'center' }} textStyle={{ color: "Black" }}>Số Lượng</DataTable.Cell> */}
            {/*           <DataTable.Cell style={{ flex: 2, justifyContent: 'center' }} textStyle={{ color: "gray" }}>{selectedItem.amountProduct} {selectedItem.countAs}</DataTable.Cell> */}
            {/*         </DataTable.Row> */}
            {/*         <DataTable.Row> */}
            {/*           <DataTable.Cell style={{ flex: 1.5, justifyContent: 'center' }} textStyle={{ color: "Black" }}>Đã Kiểm Kê</DataTable.Cell> */}
            {/*           <DataTable.Cell style={{ flex: 2, justifyContent: 'center' }} textStyle={{ color: "gray" }}>{selectedItem.amountProductChecked}</DataTable.Cell> */}
            {/*         </DataTable.Row> */}
            {/*         <DataTable.Row> */}
            {/*           <DataTable.Cell style={{ flex: 1.5, justifyContent: 'center' }} textStyle={{ color: "Black" }}>Giá Sản Phẩm</DataTable.Cell> */}
            {/*           <DataTable.Cell style={{ flex: 2, justifyContent: 'center' }} textStyle={{ color: "gray" }}>{selectedItem.productPrice} VND</DataTable.Cell> */}
            {/*         </DataTable.Row> */}
            {/*         <DataTable.Row> */}
            {/*           <DataTable.Cell style={{ flex: 1.5, justifyContent: 'center' }} textStyle={{ color: "Black" }}>Ghi Chú Chính</DataTable.Cell> */}
            {/*           <DataTable.Cell style={{ flex: 2, justifyContent: 'center' }} textStyle={{ color: "gray" }}>{selectedItem.productDescriptionA ? selectedItem.productDescriptionA : "Không Có"}</DataTable.Cell> */}
            {/*         </DataTable.Row> */}
            {/*         <DataTable.Row> */}
            {/*           <DataTable.Cell style={{ flex: 1.5, justifyContent: 'center' }} textStyle={{ color: "Black" }}>Ghi Chú Phụ</DataTable.Cell> */}
            {/*           <DataTable.Cell style={{ flex: 2, justifyContent: 'center' }} textStyle={{ color: "gray" }}>{selectedItem.productDescriptionB ? selectedItem.productDescriptionB : "Không Có"}</DataTable.Cell> */}
            {/*         </DataTable.Row> */}
            {/*       </DataTable> */}
            {/**/}
            {/*     </View> */}
            {/*   )} */}
          </BottomSheetView>
        </BottomSheet>
      </SafeAreaView>

    </GestureHandlerRootView >

  );
}

