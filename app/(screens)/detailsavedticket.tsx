import { images } from '@/constant/images';
import { useAuth } from '@/context/AuthContext';
import { deleteDraft } from '@/services/draftManager';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGlobalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { View, ScrollView, Image, TouchableOpacity, Alert, Text } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DataTable, Modal, PaperProvider, Portal } from 'react-native-paper';

const Detailsavedticket = () => {
  const route = useRouter();
  const { ticketId, ticketType, timestamp } = useGlobalSearchParams();
  const { userInfo } = useAuth();
  const [scannedList, setScannedList] = useState([]);

  const fetchDraftDetails = async () => {
    const username = userInfo?.name; // 👈 nếu có login
    const key = `inventory_draft_${username}_${ticketId}_${timestamp}`;
    const value = await AsyncStorage.getItem(key);
    const draft = value ? JSON.parse(value) : null;

    if (draft?.scannedData) {
      setScannedList(draft.scannedData); // lưu vào state để hiển thị
    }
  };
  useEffect(() => {
    fetchDraftDetails();

  }, [ticketId, timestamp])

  //=======================================| BOTTOM SHEET |========================================
  const sheetRef = useRef<BottomSheetMethods>(null);
  const [isOpen, setIsOpen] = useState(false);
  const snapPoint = ['50%'];

  const [selectedItem, setSelectedItem] = useState(null);


  //=======================================| DELETE ITEM |========================================
  const [isVisible, setVisible] = useState(false);

  const showConfirmDelete = () => setVisible(true);
  const hideConfirmDelete = () => setVisible(false);

  const handleDeleteTicket = async (key: string) => {
    deleteDraft(key);
    hideConfirmDelete();
    route.back();
  }
  return (
    <SafeAreaView edges={['bottom']} style={{ flex: 1 }}>
      <PaperProvider>
        <GestureHandlerRootView>
          <View >
            {/* <Text>Id: {ticketId}</Text> */}
            <DataTable className="rounded-md" >
              <DataTable.Header style={{ backgroundColor: '#dddddd', boxShadow: 'md' }} className="rounded-md">
                <DataTable.Title style={{ flex: 1.5, justifyContent: 'center', }} textStyle={{ color: "black" }} >Mã sản phẩm</DataTable.Title>
                <DataTable.Title style={{ flex: 2, justifyContent: 'center' }} textStyle={{ color: "black" }}>Tên sản phẩm</DataTable.Title>
                <DataTable.Title style={{ flex: 1, justifyContent: 'flex-end' }} textStyle={{ color: "black" }}>Số lượng</DataTable.Title>
                <DataTable.Title style={{ flex: 1, justifyContent: 'flex-end' }} textStyle={{ color: "black" }}>Đã kiểm</DataTable.Title>
              </DataTable.Header>
              {/* Scroll View */}
              {scannedList.length !== 0 ? (
                <ScrollView style={{ marginBottom: '0%' }}>
                  {scannedList.map((item, index) => (
                    <DataTable.Row key={`${item.productId}_${index}`}
                      onPress={() => {
                        setSelectedItem(item);
                        sheetRef.current?.expand();
                      }}
                    >
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
          <BottomSheet
            ref={sheetRef}
            enablePanDownToClose
            snapPoints={snapPoint}
            index={9}
            style={{ zIndex: 999 }}
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
                    {ticketType === 'HaveInput' ? (
                      <>
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
                      </>
                    ) : (
                      <DataTable.Row>
                        <DataTable.Cell style={{ flex: 1.5, justifyContent: 'center' }} textStyle={{ color: "Black" }}>Đã Kiểm Kê</DataTable.Cell>
                        <DataTable.Cell style={{ flex: 2, justifyContent: 'center' }} textStyle={{ color: "gray" }}>{selectedItem.amountProduct}</DataTable.Cell>
                      </DataTable.Row>

                    )}

                  </DataTable>
                </View>
              )}
            </BottomSheetView>
          </BottomSheet>
          <TouchableOpacity
            onPress={() => {
              showConfirmDelete();
            }}
            style={{ zIndex: -1, position: 'absolute', bottom: 30, right: 30, backgroundColor: '#FF0000', borderRadius: 30, width: 60, height: 60, justifyContent: 'center', alignItems: 'center', elevation: 5 }} >
            <Ionicons name='trash-outline' color='white' size={24} />
          </TouchableOpacity>
          <Portal>
            <Modal
              visible={isVisible}
              onDismiss={() => hideConfirmDelete}
              contentContainerStyle={{ zIndex: 999, backgroundColor: 'white', padding: 20, margin: 20, borderRadius: 8 }}>
              <View style={{ alignItems: 'center' }}>
                <FontAwesome name="warning" size={32} color="#4CAF50" style={{ marginBottom: 12 }} />
                <Text style={{ fontSize: 16, fontWeight: '500', textAlign: 'center' }}>
                  Bạn có chắc muốn xóa tất cả dữ liệu và hủy phiếu hiện tại không?
                </Text>
              </View>
              <View style={{ flexDirection: 'row', marginTop: 16, gap: 10 }}>
                <TouchableOpacity style={{ flex: 1, padding: 10, backgroundColor: '#eee', borderRadius: 8 }} onPress={() => hideConfirmDelete()}>
                  <Text style={{ textAlign: 'center' }}>Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ flex: 1, padding: 10, backgroundColor: '#E53935', borderRadius: 8 }} onPress={() => handleDeleteTicket(`inventory_draft_${userInfo?.name}_${ticketId}_${timestamp}`)}>
                  <Text style={{ textAlign: 'center', color: 'white', fontWeight: 'bold' }}>Xác nhận xóa</Text>
                </TouchableOpacity>
              </View>
            </Modal>
          </Portal>
        </ GestureHandlerRootView>
      </PaperProvider>
    </SafeAreaView >

  )
}

export default Detailsavedticket
