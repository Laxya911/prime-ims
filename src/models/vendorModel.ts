// Import necessary modules and dependencies
import mongoose, { Document, models } from "mongoose";
export interface VendorTypes extends Document {
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
  date_created: Date;
  createdAt: Date;
  updatedAt: Date;
  companyId: string;
}

// Define schema for Vendors collection
const vendorSchema = new mongoose.Schema<VendorTypes>(
  {
    vName: String,
    gst_vat_no: String,
    contact_no: String,
    email: String,
    company: String,
    address: String,
    country: String,
    state: String,
    city: String,
    zip: String,
    companyId: String,
    date_created: {
      type: Date,
      immutable: true,
    },
    created_by: {
      type: String,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Vendor = models.Vendor || mongoose.model("Vendor", vendorSchema);

export default Vendor;
