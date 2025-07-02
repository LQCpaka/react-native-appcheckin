import { useState } from 'react';
import { View, Text } from 'react-native'
import { DataTable, Divider, Modal, Searchbar, Portal, PaperProvider, Button } from 'react-native-paper';

const ModalConfirmUpdate = () => {

  //Modal state
  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  return (
    <View>
      <Text></Text>
    </View>
  )
}

export default ModalConfirmUpdate
