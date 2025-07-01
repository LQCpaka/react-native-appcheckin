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
  type?: 'HaveInput'; // optional để dễ phân loại
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
  totalScanned?: number; // có thể được cập nhật sau từ scannedData.length
  type?: 'NoInput';
}

// Optional: Gộp thành 1 kiểu dùng chung
export type ScannedInventoryType = InventoryItem | InventoryNoInput;

