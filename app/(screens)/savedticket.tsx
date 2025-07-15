import ModalConfirmUpdate from '@/components/ModalConfirmUpdate'
import { images } from '@/constant/images'
import { useAuth } from '@/context/AuthContext'
import { getDrafts } from '@/services/draftManager'
import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { useFocusEffect, useRouter } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import { View, Text, Pressable, FlatList, Image, TouchableOpacity, Alert } from 'react-native'
import { PaperProvider } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'

const Savedticket = () => {
  const API_URL = process.env.EXPO_PUBLIC_BEAPI_URL;
  const route = useRouter();
  const { userInfo } = useAuth();
  const username = userInfo?.name;

  const [drafts, setDrafts] = useState([]);

  //====================| FETCH DRAFTS |====================
  const fetchDrafts = async () => {
    if (!username) return;
    const data = await getDrafts(username);
    setDrafts(data);
  };
  useFocusEffect(
    useCallback(() => {
      fetchDrafts();

      return () => {
      };
    }, [username])
  );

  // useEffect(() => {
  //   const fetchDrafts = async () => {
  //     if (!username) return;
  //     const data = await getDrafts(username);
  //     setDrafts(data);
  //   };
  //   fetchDrafts();
  // }, [username]);

  const handleCheckTicketId = (ticketId: string, ticketType: string, timestamp: any) => {
    route.push({
      pathname: '/(screens)/detailsavedticket',
      params: {
        ticketId: ticketId,
        ticketType: ticketType,
        timestamp: timestamp
      }
    })
  }
  //==================================| UPDATE SUCCESS NOTI |=============================

  const [isUpdateSuccessVisible, setUpdateSuccessVisible] = useState(false);

  const showUpdateSuccess = () => setUpdateSuccessVisible(true);
  const hideUpdateSuccess = () => setUpdateSuccessVisible(false);

  const [updateSuccessApartOrFail, setUpdateSuccessApartOrFail] = useState('');

  //==================================| HANDLE SEND DATA TO SERVER |=============================

  const [isVisible, setVisible] = useState(false);

  const showConfirmUpload = () => setVisible(true);
  const hideConfirmUpload = () => setVisible(false);

  const handleUploadDrafts = async () => {
    const drafts = await getDrafts(username);
    let successCount = 0;

    for (const draft of drafts) {
      try {
        const payload =
          draft.ticketType === 'HaveInput'
            ? {
              ticketId: draft.ticketId,
              scannedData: draft.scannedData.map((item) => ({
                productId: item.productId,
                checkedBy: username,
                amountProductChecked: item.amountProductChecked,
                productDescriptionA: item.productDescriptionA,
                productDescriptionB: item.productDescriptionB,
              })),
            }
            : {
              ticketId: draft.ticketId,
              scannedData: draft.scannedData.map((item) => ({
                productId: item.productId,
                scannedBy: username,
                scanCount: item.amountProduct,
              })),
            };
        if (draft.ticketType === 'HaveInput') {
          await axios.put(`${API_URL}/inventory/update`, payload);
        } else {
          await axios.post(`${API_URL}/no-input/update`, payload)
        }

        //update ticket status - Edited/Unedited
        await axios.put(`${API_URL}/ticket/description`, {
          ticketId: draft.ticketId,
          description: 'Edited',
        });

        const key = `inventory_draft_${username}_${draft.ticketId}_${draft.savedAt}`;
        await AsyncStorage.removeItem(key);

        successCount++;
      } catch (error) {
        Alert.alert('Lỗi khi gửi dữ liệu', 'Vui lòng thử lại sau.');
      }
    }

    hideConfirmUpload();

    if (successCount === drafts.length) {
      setUpdateSuccessApartOrFail('Cập nhật dữ liệu thành công!');
      fetchDrafts(); // Refresh fech data when upload success :v
      showUpdateSuccess();
    } else if (successCount > 0) {
      setUpdateSuccessApartOrFail(`Đã cập nhật ${successCount} trong tổng số ${drafts.length} dữ liệu.`);
      fetchDrafts(); // Refresh fech data when upload a part success and they will know which is error :v
      showUpdateSuccess();
    }
  }
  return (
    <PaperProvider>
      <SafeAreaView edges={['bottom']} style={{ flex: 1 }}>
        {drafts.length > 0 && (
          <TouchableOpacity
            onPress={() => showConfirmUpload()}
            style={{ zIndex: 999, position: 'absolute', bottom: 30, right: 30, backgroundColor: '#2196f3', borderRadius: 30, width: 60, height: 60, justifyContent: 'center', alignItems: 'center', elevation: 5 }} >
            <Ionicons name='cloud-upload-outline' color='white' size={24} />
          </TouchableOpacity>
        )}

        {drafts.length > 0 ? (
          <FlatList
            data={drafts}
            keyExtractor={(item, index) => `${item.ticketId}_${index}`}
            renderItem={({ item }) =>
              <Pressable
                onPress={() => handleCheckTicketId(item.ticketId, item.ticketType, item.savedAt)}
                className='shadow rounded-md'
                style={{ padding: 10, marginHorizontal: 5, marginTop: 5, backgroundColor: '#fff' }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                  <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                    <Ionicons name="time-sharp" size={18} color="black" style={{ marginRight: 5 }} />
                    <Text style={{ fontSize: 16, fontWeight: '400' }} >{item.ticketId}</Text>
                  </View>
                  <Text className='font-bold' style={{ fontSize: 18 }}>{item.scannedData.length}</Text>
                </View>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: '#aba4a4' }} >{new Date(item.savedAt).toLocaleDateString()}</Text>
                  <Text style={{ color: '#aba4a4' }} >Đã kiểm</Text>
                </View>
              </Pressable>
            }

          />
        ) : (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Image source={images.nodatafound} style={{ width: 200, height: 200 }} />
          </View>
        )}
      </SafeAreaView>

      {/* ================| POPUP CONFIRM UPDATE |============== */}
      <ModalConfirmUpdate
        description='Bạn có chắc chắn muốn gửi dữ liệu đã lưu lên server không?'
        canelButtonText='Chưa Vội'
        confirmButtonText='Cập Nhật'
        visible={isVisible}
        onCancel={hideConfirmUpload}
        onConfirm={handleUploadDrafts}
      />

      {/* ================| POPUP UPDATE SUCCESS |============== */}
      <ModalConfirmUpdate
        icon='checkcircle'
        description={updateSuccessApartOrFail}
        canelButtonText='Quay lại'
        confirmButtonText='Tiếp Tục'
        visible={isUpdateSuccessVisible}
        onCancel={route.back}
        onConfirm={hideUpdateSuccess}
      />
    </PaperProvider >
  )
}

export default Savedticket
