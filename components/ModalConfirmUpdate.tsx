import { AntDesign } from '@expo/vector-icons';
import { View, Text, TouchableOpacity } from 'react-native'
import { Modal, Portal } from 'react-native-paper';

type ModalProps = {
  description: string;
  canelButtonText: string;
  confirmButtonText: string;
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

const ModalConfirmUpdate = ({ description, canelButtonText, confirmButtonText, visible, onConfirm, onCancel }: ModalProps) => (
  <Portal>
    <Modal visible={visible} onDismiss={onCancel} contentContainerStyle={{ zIndex: 999, backgroundColor: 'white', padding: 20, margin: 20, borderRadius: 8 }}>
      <View style={{ alignItems: 'center' }}>
        <AntDesign name="questioncircle" size={32} color="#ff5733" style={{ marginBottom: 12 }} />
        <Text style={{ fontSize: 16, fontWeight: '500', textAlign: 'center' }}>
          Bạn có muốn cập nhật dữ liệu kiểm kê hiện tại không?
        </Text>
      </View>
      <View style={{ flexDirection: 'row', marginTop: 16, gap: 10 }}>
        <TouchableOpacity style={{ flex: 1, padding: 10, backgroundColor: '#eee', borderRadius: 8 }} onPress={onCancel}>
          <Text style={{ textAlign: 'center' }}>Chưa vội</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ flex: 1, padding: 10, backgroundColor: '#E53935', borderRadius: 8 }} onPress={onConfirm}>
          <Text style={{ textAlign: 'center', color: 'white', fontWeight: 'bold' }}>Xác nhận, Cập Nhật</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  </Portal>
);

export default ModalConfirmUpdate;
