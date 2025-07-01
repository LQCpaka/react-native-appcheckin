import { create } from 'zustand';
import { ScannedInventoryType } from '../types/Inventory';

type InventoryType = 'HaveInput' | 'NoInput';

type StoreState = {
  scannedData: ScannedInventoryType[];
  setScannedData: (data: ScannedInventoryType[]) => void;
  resetScannedData: () => void;

  // ✨ Thêm phần ticket vào đây
  ticketId: string;
  ticketType: InventoryType;
  setTicket: (id: string, type: InventoryType) => void;
  clearTicket: () => void;
};

export const useInventoryStore = create<StoreState>((set) => ({
  scannedData: [],
  setScannedData: (data) => set({ scannedData: data }),
  resetScannedData: () => set({ scannedData: [] }),

  ticketId: '',
  ticketType: 'HaveInput',
  setTicket: (id, type) => set({ ticketId: id, ticketType: type }),
  clearTicket: () => set({ ticketId: '', ticketType: 'HaveInput' }),
}));

