import mongoose, {models } from "mongoose";

const { Schema } = mongoose;

const primeInvoiceSchema = new Schema(  {
  invoiceNumber: { type: String, required: true, unique: true },
  products: [
    {
      productName: String,
      customerName: String,
      productCode: String,
      category: String,
      recvQty: {type: Number, default: 0},
      newBal: {type: Number, default: 0},
      balQty: {type: Number, default: 0},
      newOrder: {type: Number, default: 0},
      sellingPrice: {type: Number, default: 0},
      brand: String,
      quantity: {type: Number, default: 0},
      remark: {type: String, default: "None"},
      status: {type: String, default: "Pending"},
      gst: {type: Number, default: 0},
      unit: String,
      total: {type: Number, default: 0},
      created_by: String,
      date_created: {
        type: Date,
        required: true,
        default: Date.now,
      },
      invoiceNumber: { type: String, required: true, unique: true },
    },
  ],
  subTotal: String,
  totalGst: String,
  grandTotal: String,
  companyId: String,
  customerName: String,
  contact_no: String,
  email: String,
  address: String,
  gst_vat_no: String,
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "customer",
  },
  created_by: {
    type: String,
    ref: "User",
  },
  date_created: { type: Date, required: true, default: Date.now },
},
{ timestamps: true }
);

const PrimeInvoice = models.PrimeInvoice || mongoose.model("PrimeInvoice", primeInvoiceSchema);

export default PrimeInvoice;
