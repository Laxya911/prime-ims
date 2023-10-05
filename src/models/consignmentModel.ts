import mongoose, { Document, models } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface Consignment extends Document {
  _id: string;
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
  packages: {
    weight: number;
    length: number;
    width: number;
    height: number;
    numOfPackage: number;
    volumetricWeight: number;
    rate: number;
  }[];
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
  tracking_id: { type: string; unique: true };
  created_by: string;
  updated_by: string;
  comments: string;
  shipment_status: {
    status: string;
    date_updated: Date;
  }[];
}
const consignmentSchema = new mongoose.Schema<Consignment>(
  {
    _id: {
      type: String,
      default: uuidv4,
    },
    sender: String,
    senderEmail: String,
    senderName: String,
    senderContact: Number,
    senderGst: String,
    senderCity: String,
    senderState: String,
    senderCountry: String,
    receiver: String,
    receiverEmail: String,
    receiverName: String,
    receiverContact: Number,
    receiverGst: String,
    receiverCity: String,
    receiverState: String,
    receiverCountry: String,
    packages: [
      {
        weight: Number,
        length: Number,
        width: Number,
        height: Number,
        numOfPackage: Number,
        volumetricWeight: Number,
        rate: Number,
      },
    ],
    companyId: String,
    subTotal: String,
    actualWeight: String,
    totalDim: String,
    grandTotal: String,
    courier_partner: String,
    trackingUrl: String,
    shipment_type: String,
    payment_mode: String,
    origin: String,
    destination: String,
    tracking_id: { type: String, unique: true },
    created_by: String,
    updated_by: String,
    comments: String,

    shipment_status: [
      {
        status: {
          type: String,
          default: "Processing",
        },
        date_updated: {
          type: Date,
          default: Date.now, 
        },
      },
    ],
  },
  { timestamps: true }
);

const Consignment =
  models.Consignment ||
  mongoose.model<Consignment>("Consignment", consignmentSchema);

export default Consignment;
