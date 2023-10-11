// Import necessary modules and dependencies
import mongoose, { Document, ObjectId, models } from 'mongoose';

export interface Company extends Document {
  logo: string ,
  name: string ,
  companyId: string ,
  contact: number ,
  email: string ,
  company_Url: string ,
  doj: string ,
  pancard: string ,
  gstNo: string ,
  address: string ,
  country: string ,
  state: string ,
  city: string ,
  zip: string ,
  bank_name: string ,
  account_no: string ,
  account_type: string ,
  ifsc_code: string ,
  b_branch: string ,
  b_address: string ,
  created_by : string
}
const companySchema = new mongoose.Schema<Company>({
  logo: String ,
  name: String ,
  companyId: String ,
  contact: Number ,
  email: String ,
  company_Url: String ,
  doj: String ,
  pancard: String ,
  gstNo: String ,
  address: String ,
  country: String ,
  state: String ,
  city: String ,
  zip: String ,
  bank_name: String ,
  account_no: String ,
  ifsc_code: String ,
  b_branch: String ,
  b_address: String ,
  created_by: {
    type: String,
    ref: "User",
  }
},
{ timestamps: true }
);

const Company = models.Company || mongoose.model("Company", companySchema);

export default Company;
