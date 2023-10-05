// vendor.ts

export interface VendorTypes {
  _id: string;
  vName: string;
  gst_vat_no: string;
  contact_no: string;
  email: string;
  company: string;
  address: string;
  country: string;
  state: string;
  city: string;
  zip: string;
  created_by: string;
  createdAt: Date;
  date_created: Date;
  updatedAt: Date;
  companyId: string;
}
export interface CustomerTypes {
  _id: string;
  gst_vat_no: string;
  customerName: string;
  contact_no: string;
  email: string;
  address: string;
  country: string;
  state: string;
  city: string;
  zip: string;
  created_by: string;
  createdAt: Date;
  date_created: Date;
  updatedAt: Date;
  companyId: string;
}
