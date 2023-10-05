import mongoose, {  models } from 'mongoose';

export interface CustomerTypes {
  _id: string ;
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
  createdAt:Date;
  date_created:Date;
  updatedAt: Date;
  companyId: string;
}

const customerSchema = new mongoose.Schema<CustomerTypes>({
  customerName: String,
  contact_no: String,
  email: String,
  gst_vat_no: String,
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


const Customer = models.Customer ||  mongoose.model("Customer", customerSchema);

export default Customer;