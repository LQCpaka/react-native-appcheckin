import { useEffect, useState } from 'react';
import { TextInput, Text, TouchableOpacity, View } from 'react-native';
import { InventoryItem } from '@/types/Inventory';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { Entypo, Feather, FontAwesome6 } from '@expo/vector-icons';

type Props = {
  item: InventoryItem | null;
  onClose: () => void;
  onUpdate: (updatedItem: InventoryItem) => void;
};

const EditItemSheet = ({ item, onClose, onUpdate }: Props) => {
  const [editB, setEditB] = useState(false);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    setEditValue(item?.productDescriptionB ?? '');
  }, [item]);

  if (!item) return null;

  const handleQuantityChange = (delta: number) => {
    if ('amountProductChecked' in item) {
      const updated = { ...item, amountProductChecked: item.amountProductChecked + delta };
      onUpdate(updated);
    } else {
      const updated = { ...item, amountProduct: item.amountProduct + delta };
      onUpdate(updated);
    }
  };

  const handleSaveB = () => {
    if ('productDescriptionB' in item) {
      const updated = { ...item, productDescriptionB: editValue };
      onUpdate(updated);
    }
    setEditB(false);
  };

  return (
    <BottomSheet
      enablePanDownToClose
      snapPoints={['50%']}
      index={0}
      onClose={onClose}

    >
      <BottomSheetView style={{ padding: 16, paddingBottom: '15%' }}>

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
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text style={{ fontSize: 16, fontWeight: 'semibold' }}>{item.productId}</Text>
          <Text style={{ fontSize: 16, fontWeight: 'semibold' }}>{item.productName}</Text>

        </View>
        {/* Ghi chú A */}
        {'productDescriptionA' in item && (
          <>
            <Text style={{ marginTop: 12 }}>Ghi chú A</Text>
            <TextInput
              style={{ backgroundColor: '#eee', borderRadius: 8, paddingHorizontal: 8 }}
              value={item.productDescriptionA || ''}
              editable={false}
            />
          </>
        )}

        {/* Ghi chú B */}
        {'productDescriptionB' in item && (
          <>
            <Text style={{ marginTop: 12 }}>Ghi chú B</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TextInput
                style={{ flex: 1, backgroundColor: '#eee', borderRadius: 8, paddingLeft: 8 }}
                editable={editB}
                value={editValue}
                onChangeText={setEditValue}
              />
              <TouchableOpacity onPress={editB ? handleSaveB : () => setEditB(true)}>
                {editB
                  ? <FontAwesome6 name="save" size={24} />
                  : <Feather name="edit" size={24} />}
              </TouchableOpacity>
            </View>
          </>
        )}
      </BottomSheetView>
    </BottomSheet>
  );
};

export default EditItemSheet;

