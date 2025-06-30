import { create } from 'zustand';
import { InventoryItem } from '../types/InventoryItem';

type StoreState = {
  scannedData: InventoryItem[];
  setScannedData: (data: InventoryItem[]) => void;
};

export const useInventoryStore = create<StoreState>((set) => ({
  scannedData: [],
  setScannedData: (data) => set({ scannedData: data }),
}));


