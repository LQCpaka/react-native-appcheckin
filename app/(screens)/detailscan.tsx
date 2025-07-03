import { useInventoryStore } from '../../libs/useInventoryStore';
import { FlatList, View, Text, TouchableOpacity } from 'react-native';
import { getCheckedCount } from '../../utils/getCheckedCount'; // nếu bạn tách riêng ra rồi
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import EditItemSheet from '@/components/EditItemSheet';
import { useState } from 'react';
import { InventoryItem } from '@/types/Inventory';


const DetailsScanScreen = () => {
  const { ticketId, ticketType, scannedData, setScannedData } = useInventoryStore();
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const handleUpdateItem = (updated: InventoryItem) => {
    const updatedList = scannedData.map(i =>
      i.productId === updated.productId ? updated : i
    );
    setScannedData(updatedList);
    setSelectedItem(updated); // để giữ sheet mở nếu bạn thích
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <FlatList
        data={scannedData}
        keyExtractor={(item, index) => `${item.productId}-${index}`}
        contentContainerStyle={{ paddingVertical: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setSelectedItem(item)}
            style={{
              padding: 10,
              marginHorizontal: 16,
              marginBottom: 10,
              backgroundColor: '#fff',
              borderRadius: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
              elevation: 4,
            }}
          >
            <View>
              <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.productName || 'Chưa có tên'}</Text>
              <Text style={{ color: '#888' }}>{item.productId}</Text>
            </View>

            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: '#888' }}>Số lượng</Text>
              <Text style={{ fontSize: 22, fontWeight: 'bold' }}>{getCheckedCount(item)}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: 50 }}>
            <Text style={{ color: '#aaa' }}>Chưa có sản phẩm nào được quét</Text>
          </View>
        }
      />
      {selectedItem && (
        <EditItemSheet
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onUpdate={handleUpdateItem}
          paddingSheet='15%'
        />
      )}

    </GestureHandlerRootView>
  );
};

export default DetailsScanScreen;
