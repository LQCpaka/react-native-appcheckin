import { router, useGlobalSearchParams } from 'expo-router';
import { View, Text, FlatList } from 'react-native'

const Detailscan = () => {
  const { detailScannedItems } = useGlobalSearchParams();

  return (
    <FlatList
      data={detailScannedItems}
      keyExtractor={(item, index) => item.productId + '-' + index}
      renderItem={({ item }) => (
        <View style={{ padding: 10, borderBottomWidth: 1, borderColor: '#ccc' }}>
          <Text style={{ fontWeight: 'bold' }}>{item.productName}</Text>
          <Text>Mã: {item.productId}</Text>
          <Text>Số lượng: {item.amountProductChecked}</Text>
        </View>
      )}
    />
  );
}

export default Detailscan
