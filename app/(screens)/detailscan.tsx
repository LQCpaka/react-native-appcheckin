import { useInventoryStore } from '../../libs/useInventoryStore';
import { FlatList, View, Text, TouchableOpacity } from 'react-native';
import { getCheckedCount } from '../../utils/getCheckedCount'; // nếu bạn tách riêng ra rồi
const DetailsScanScreen = () => {
  const { scannedData } = useInventoryStore();

  return (
    <FlatList
      data={scannedData}
      keyExtractor={(item, index) => `${item.productId}-${index}`}
      contentContainerStyle={{ paddingVertical: 16 }}
      renderItem={({ item }) => (
        <TouchableOpacity
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
  );
};

export default DetailsScanScreen;
