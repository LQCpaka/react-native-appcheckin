export type InventoryType = 'HaveInput' | 'NoInput';

export interface InventoryItem {
  _id: string;
  productId: string;
  productName: string;
  countAs: string;
  amountProduct: number;
  amountProductChecked: number;
  productPrice?: string;
  productDescriptionA?: string;
  productDescriptionB?: string;
  type?: 'HaveInput';
}

export interface InventoryNoInput {
  _id: string;
  productId: string;
  productName: string;
  amountProduct: number;
  scannedData: {
    scannedBy: string;
    scannedAt: Date;
    scannedByName?: string;
  }[];
  totalScanned?: number;
  type?: 'NoInput';
}

export type ScannedInventoryType = InventoryItem | InventoryNoInput;

