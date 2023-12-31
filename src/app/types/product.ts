// product.ts

export interface Products {
  _id: string;
  newBal: number;
  newRecvQty: number;
  recvQty: number;
  balQty: number;
  productName: string;
  vName: string;
  customerName: string;
  category: string;
  productCode: string;
  buyingPrice: number;
  sellingPrice: number;
  brand: string;
  newOrder: number;
  unit: string;
  rate: number;
  gst: number;
  total: number;
  subTotal: string;
  remark: string;
  status: string;
  po_Number: string;
  qNumber: string;
  invoiceNumber: string;
  date_created: Date | string;
  grandTotal: string;
  created_by: string;
  companyId: string;
  inStock: number;
  products: string;
  totalGst: string;
}

export interface PurchaseProduct {
  customerId: string;
  newRecvQty: number;
  _id: string;
  vName: string;
  customerName: string;
  contact_no: string;
  email: string;
  address: string;
  gst_vat_no: string;
  date_created: Date;
  po_Number: string;
  qNumber: string;
  invoiceNumber: string;
  grandTotal: string;
  subTotal: string;
  totalGst: string;
  created_by : string;
  companyId: string;
  recvQty: number;
  balQty: number;
  newBal: number;
  productName: string;
  category: string;
  productCode: string;
  buyingPrice: number;
  sellingPrice: number;
  brand: string;
  newOrder: number;
  unit: string;
  rate: number;
  gst: number;
  total: number;
  remark: string;
  status: string;
  inStock: number;
  products: Products[];
  updatedAt: string;
  quantity: number;

}


export interface ProductTypes {
  _id: string;
  productName: string;
  productCode: string;
  category: string;
  brand: string;
  buyingPrice: number;
  sellingPrice: number;
  gst: number;
  vName: string;
  inStock: number;
  unit: string;
  companyId: string;
  date_created:  Date;
  created_by: string;
  updatedAt: string;
  quantity: number;
}
