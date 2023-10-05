// client.ts

export interface Client {
  created_by: string;
  createdAt:Date;
  sender: object;
  _id: string;
  name: string;
  gst_vat_no: string;
  contact_no: number;
  email: string;
  company: string;
  address: string;
  country: string;
  state: string;
  city: string;
  zip: string;
  type: number;
  date_created: Date;
  updated_at: Date;
  companyId: string;
  value: string;
  label: string;
}
