import { FlatList, Text, View } from 'react-native';
import { useInventoryStore } from '@/libs/inventoryStore';

const Detailscan = () => {
  const { scannedData } = useInventoryStore();

  return (
    <FlatList
      data={scannedData}
      keyExtractor={(item, index) => item.productId + '-' + index}
      renderItem={({ item }) => (
        <View style={{ padding: 10, borderBottomWidth: 1 }}>
          <Text style={{ fontWeight: 'bold' }}>{item.productName}</Text>
          <Text>Mã: {item.productId}</Text>
          <Text>Số lượng: {item.amountProductChecked}</Text>
        </View>
      )}
      ListEmptyComponent={<Text style={{ textAlign: 'center' }}>Chưa có dữ liệu</Text>}
    />
  );
};

export default Detailscan;

