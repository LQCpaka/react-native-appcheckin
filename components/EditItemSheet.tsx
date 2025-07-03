import { useEffect, useState } from 'react';
import { TextInput, Text, TouchableOpacity, View } from 'react-native';
import { InventoryItem } from '@/types/Inventory';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { Entypo, Feather, FontAwesome6 } from '@expo/vector-icons';
import { Divider } from 'react-native-paper';

type Props = {
  paddingSheet?: string;
  item: InventoryItem | null;
  onClose: () => void;
  onUpdate: (updatedItem: InventoryItem) => void;
};

const EditItemSheet = ({ item, onClose, onUpdate, paddingSheet }: Props) => {
  const [editA, setEditA] = useState(false);
  const [editValueA, setEditValueA] = useState('');

  const [editB, setEditB] = useState(false);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    setEditValueA(item?.productDescriptionA ?? '');
    setEditValue(item?.productDescriptionB ?? '');
  }, [item]);

  if (!item) return null;

  const handleQuantityChange = (delta: number) => {
    const newAmount =
      'amountProductChecked' in item
        ? item.amountProductChecked + delta
        : item.amountProduct + delta;

    // Nếu <= 0 thì xóa khỏi danh sách
    if (newAmount <= 0) {
      onUpdate({ ...item, amountProductChecked: 0 }); // Optional: cập nhật trước khi xóa

      // Gửi 1 signal để component cha (`ScanArea`) xoá item đó
      onUpdate({ ...item, __delete: true }); // 👈 gợi ý thêm flag nếu bạn dùng trạng thái tạm
      return;
    }

    const updated = 'amountProductChecked' in item
      ? { ...item, amountProductChecked: newAmount }
      : { ...item, amountProduct: newAmount };

    onUpdate(updated);
  };

  const handleSaveB = () => {
    if ('productDescriptionB' in item) {
      const updated = { ...item, productDescriptionB: editValue };
      onUpdate(updated);
    }
    setEditB(false);
  };
  const handleSaveA = () => {
    if ('productDescriptionA' in item) {
      const updated = { ...item, productDescriptionA: editValueA };
      onUpdate(updated);
    }
    setEditA(false);
  };

  return (
    <BottomSheet
      enablePanDownToClose
      snapPoints={['70%']}
      index={0}
      onClose={onClose}
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -5 },
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 5,
        borderRadius: 16,
      }}

    >
      <BottomSheetView
        style={{
          padding: 16,
          paddingBottom: paddingSheet,
        }} >

        {/* Quantity controls */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 12 }}>
          <TouchableOpacity onPress={() => handleQuantityChange(-1)}>
            <Entypo name="minus" size={24} />
          </TouchableOpacity>
          <Text style={{ fontSize: 20 }}>
            {'amountProductChecked' in item ? item.amountProductChecked : item.amountProduct} cái
          </Text>
          <TouchableOpacity onPress={() => handleQuantityChange(1)}>
            <Entypo name="plus" size={24} />
          </TouchableOpacity>
        </View>
        <Divider style={{ marginVertical: '3%', marginHorizontal: 5 }} />
        <View style={{ flexDirection: 'row', gap: 10, width: '100%' }}>
          <Text style={{ width: '48%', borderRadius: 8, backgroundColor: '#eee', padding: 8, textAlign: 'center', fontSize: 16, fontWeight: '500' }}>{item.productId}</Text>
          <Text style={{ width: '48%', borderRadius: 8, backgroundColor: '#eee', padding: 8, textAlign: 'center', fontSize: 16, fontWeight: '500' }}>{item.productName}</Text>

        </View>

        {/* Ghi chú A */}
        {'productDescriptionA' in item && (
          <>
            <Text style={{ marginTop: 12, marginBottom: 5, fontSize: 16, fontWeight: '400', marginLeft: 5 }}>Ghi chú A</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <TextInput
                style={{ flex: 1, backgroundColor: '#eee', borderRadius: 8, paddingLeft: 8, color: editA ? '#000' : '#aba4a4' }}
                editable={editA}
                value={editValueA}
                onChangeText={setEditValueA}
              />
              <TouchableOpacity
                style={{ padding: 8, borderRadius: '20%', backgroundColor: '#eee' }}
                onPress={editA ? handleSaveA : () => setEditA(true)}>
                {editA
                  ? <FontAwesome6 name="save" size={24} />
                  : <Feather name="edit" size={24} />}
              </TouchableOpacity>
            </View>
          </>
        )}


        {/* Ghi chú B */}
        {'productDescriptionB' in item && (
          <>
            <Text style={{ marginTop: 12, marginBottom: 5, fontSize: 16, fontWeight: '400', marginLeft: 5 }}>Ghi chú B</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <TextInput
                style={{ flex: 1, backgroundColor: '#eee', borderRadius: 8, paddingLeft: 8, color: editB ? '#000' : '#aba4a4' }}
                editable={editB}
                value={editValue}

                onChangeText={setEditValue}
              />
              <TouchableOpacity
                style={{ padding: 8, borderRadius: '20%', backgroundColor: '#eee' }}
                onPress={editB ? handleSaveB : () => setEditB(true)}>
                {editB
                  ? <FontAwesome6 name="save" size={24} />
                  : <Feather name="edit" size={24} />}
              </TouchableOpacity>
            </View>
          </>
        )}
      </BottomSheetView>
    </BottomSheet >
  );
};

export default EditItemSheet;

