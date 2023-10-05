// Import necessary modules and dependencies
import mongoose, { Document, models } from 'mongoose';
export interface Clients extends Document {
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
    created_by: string;
}

// Define schema for clients collection
const clientSchema = new mongoose.Schema<Clients>({
  name: String, 
  gst_vat_no: String,
  contact_no: Number, 
  email: String,  
  company: String, 
  address: String, 
  country: String, 
  state: String, 
  city: String, 
  zip: String, 
  type: Number,
  companyId: String ,
  date_created: {
    type: Date,
    immutable: true,
  },
  updated_at: {
    type: Date,
    default: Date.now, 
  },
  created_by: {
    type: String,
    ref: "User",
  },
  
},
{ timestamps: true }
);

const Client = models.Client || mongoose.model("Client", clientSchema);

export default Client;
