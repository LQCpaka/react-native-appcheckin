import { SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { useState, useEffect, useRef } from "react";
import { Text, TextInput, FlatList, View, ScrollView, TouchableOpacity, Image } from "react-native";
import { Button, DataTable, Divider } from "react-native-paper";
import axios from 'axios';
import { useGlobalSearchParams, useSearchParams } from "expo-router/build/hooks";
import { images } from "@/constant/images";


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

const Detailinventory = () => {

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

  const { ticketId } = useGlobalSearchParams()

  const API_URL = process.env.EXPO_PUBLIC_BEAPI_URL;
  useEffect(() => {
    axios.get(
      `${API_URL}/inventory/${ticketId}`,
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
    <SafeAreaView style={{ flex: 1 }}>
      <GestureHandlerRootView >
        <SafeAreaView >
          <View >
            {/* <Text>Id: {ticketId}</Text> */}
            <DataTable className="shadow-md rounded-md" style={{ marginTop: 10 }}>
              <DataTable.Header style={{ backgroundColor: '#dddddd', boxShadow: 'md' }} className="shadow-md rounded-md">
                <DataTable.Title style={{ flex: 1.5, justifyContent: 'center', }} textStyle={{ color: "black" }} >Mã sản phẩm</DataTable.Title>
                <DataTable.Title style={{ flex: 2, justifyContent: 'center' }} textStyle={{ color: "black" }}>Tên sản phẩm</DataTable.Title>
                <DataTable.Title style={{ flex: 1, justifyContent: 'flex-end' }} textStyle={{ color: "black" }}>Số lượng</DataTable.Title>
                <DataTable.Title style={{ flex: 1, justifyContent: 'flex-end' }} textStyle={{ color: "black" }}>Đã kiểm</DataTable.Title>
              </DataTable.Header>
              {/* Scroll View */}
              {inventoryData.length !== 0 ? (
                <ScrollView style={{ maxHeight: '90%' }}>
                  {inventoryData.map((item) => (
                    <DataTable.Row key={item._id}
                      onPress={() => {
                        setSelectedItem(item);
                        sheetRef.current?.expand();
                      }}                >
                      <DataTable.Cell style={{ flex: 1.5, justifyContent: 'center' }} textStyle={{ color: "gray" }}>{item.productId}</DataTable.Cell>
                      <DataTable.Cell style={{ flex: 2, justifyContent: 'center' }} textStyle={{ color: "gray" }}>{item.productName}</DataTable.Cell>
                      <DataTable.Cell style={{ flex: 1, justifyContent: 'flex-end' }} textStyle={{ color: "gray" }}>{item.amountProduct}</DataTable.Cell>
                      <DataTable.Cell style={{ flex: 1, justifyContent: 'flex-end' }} textStyle={{ color: "gray" }}>{item.amountProductChecked}</DataTable.Cell>
                    </DataTable.Row>
                  ))}
                </ScrollView>

              ) : (
                <View style={{ height: '75%' }} className=" items-center justify-center">
                  <Image source={images.nodatafound} style={{ width: 200, height: 200 }} />
                </View>
              )}
            </DataTable>

          </View>
        </SafeAreaView>
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
                <DataTable>
                  <DataTable.Header style={{ backgroundColor: '#dddddd', boxShadow: 'md' }} className="shadow-md rounded-md">
                    <DataTable.Title style={{ flex: 1.5, justifyContent: 'center' }} textStyle={{ color: "black" }}>THÔNG TIN SẢN PHẨM</DataTable.Title>
                  </DataTable.Header>
                  <DataTable.Row>
                    <DataTable.Cell style={{ flex: 1.5, justifyContent: 'center' }} textStyle={{ color: "Black" }}>Mã Sản Phẩm</DataTable.Cell>
                    <DataTable.Cell style={{ flex: 2, justifyContent: 'center' }} textStyle={{ color: "gray" }}>{selectedItem.productId}</DataTable.Cell>
                  </DataTable.Row>
                  <DataTable.Row>
                    <DataTable.Cell style={{ flex: 1.5, justifyContent: 'center' }} textStyle={{ color: "Black" }}>Tên Sản Phẩm</DataTable.Cell>
                    <DataTable.Cell style={{ flex: 2, justifyContent: 'center' }} textStyle={{ color: "gray" }}>{selectedItem.productName}</DataTable.Cell>
                  </DataTable.Row>
                  <DataTable.Row>
                    <DataTable.Cell style={{ flex: 1.5, justifyContent: 'center' }} textStyle={{ color: "Black" }}>Số Lượng</DataTable.Cell>
                    <DataTable.Cell style={{ flex: 2, justifyContent: 'center' }} textStyle={{ color: "gray" }}>{selectedItem.amountProduct} {selectedItem.countAs}</DataTable.Cell>
                  </DataTable.Row>
                  <DataTable.Row>
                    <DataTable.Cell style={{ flex: 1.5, justifyContent: 'center' }} textStyle={{ color: "Black" }}>Đã Kiểm Kê</DataTable.Cell>
                    <DataTable.Cell style={{ flex: 2, justifyContent: 'center' }} textStyle={{ color: "gray" }}>{selectedItem.amountProductChecked}</DataTable.Cell>
                  </DataTable.Row>
                  <DataTable.Row>
                    <DataTable.Cell style={{ flex: 1.5, justifyContent: 'center' }} textStyle={{ color: "Black" }}>Giá Sản Phẩm</DataTable.Cell>
                    <DataTable.Cell style={{ flex: 2, justifyContent: 'center' }} textStyle={{ color: "gray" }}>{selectedItem.productPrice} VND</DataTable.Cell>
                  </DataTable.Row>
                  <DataTable.Row>
                    <DataTable.Cell style={{ flex: 1.5, justifyContent: 'center' }} textStyle={{ color: "Black" }}>Ghi Chú Chính</DataTable.Cell>
                    <DataTable.Cell style={{ flex: 2, justifyContent: 'center' }} textStyle={{ color: "gray" }}>{selectedItem.productDescriptionA ? selectedItem.productDescriptionA : "Không Có"}</DataTable.Cell>
                  </DataTable.Row>
                  <DataTable.Row>
                    <DataTable.Cell style={{ flex: 1.5, justifyContent: 'center' }} textStyle={{ color: "Black" }}>Ghi Chú Phụ</DataTable.Cell>
                    <DataTable.Cell style={{ flex: 2, justifyContent: 'center' }} textStyle={{ color: "gray" }}>{selectedItem.productDescriptionB ? selectedItem.productDescriptionB : "Không Có"}</DataTable.Cell>
                  </DataTable.Row>
                </DataTable>

              </View>
            )}
          </BottomSheetView>
        </BottomSheet>
      </ GestureHandlerRootView>
    </SafeAreaView>
  )
}

export default Detailinventory
