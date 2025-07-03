import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native'
import { DataTable, Divider, Modal, Searchbar, Portal, PaperProvider, Button } from 'react-native-paper';

type ModalProps = {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

const ModalConfirmDelete = ({ visible, onConfirm, onCancel }: ModalProps) => (
  <Portal>
    <Modal visible={visible} onDismiss={onCancel} contentContainerStyle={{ zIndex: 999, backgroundColor: 'white', padding: 20, margin: 20, borderRadius: 8 }}>
      <View style={{ alignItems: 'center' }}>
        <FontAwesome name="warning" size={32} color="#4CAF50" style={{ marginBottom: 12 }} />
        <Text style={{ fontSize: 16, fontWeight: '500', textAlign: 'center' }}>
          Bạn có chắc muốn xóa tất cả dữ liệu và hủy phiếu hiện tại không?
        </Text>
      </View>
      <View style={{ flexDirection: 'row', marginTop: 16, gap: 10 }}>
        <TouchableOpacity style={{ flex: 1, padding: 10, backgroundColor: '#eee', borderRadius: 8 }} onPress={onCancel}>
          <Text style={{ textAlign: 'center' }}>Hủy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ flex: 1, padding: 10, backgroundColor: '#E53935', borderRadius: 8 }} onPress={onConfirm}>
          <Text style={{ textAlign: 'center', color: 'white', fontWeight: 'bold' }}>Xác nhận xóa</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  </Portal>
);

export default ModalConfirmDelete;
