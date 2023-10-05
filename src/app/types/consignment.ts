import { Package } from "./package";

interface ShipmentStatus {
  status: string;
  date_updated?: Date;
}

export interface ConsignmentTypes {
  createdAt: Date;
  _id: string;
  packages: Package[];
  tracking_id: string;
  sender: string;
  senderEmail: string;
  senderName: string;
  senderContact: number;
  senderGst: string;
  senderCity: string;
  senderState: string;
  senderCountry: string;
  receiver: string;
  receiverEmail: string;
  receiverName: string;
  receiverContact: number;
  receiverGst: string;
  receiverCity: string;
  receiverState: string;
  receiverCountry: string;
  companyId: string;
  subTotal: string;
  actualWeight: string;
  totalDim: string;
  grandTotal: string;
  courier_partner: string;
  trackingUrl: string;
  shipment_type: string;
  payment_mode: string;
  origin: string;
  destination: string;
  created_by: string;
  updated_by: string;
  comments: string;
  shipment_status: ShipmentStatus[]; 
}
