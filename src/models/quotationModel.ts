import mongoose, { models } from "mongoose";
const { Schema } = mongoose;

const quotationSchema = new Schema(
  {
    qNumber: { type: String, required: true, unique: true },
    products: [
      {
        productName: String,
        customerName: String,
        productCode: String,
        category: String,
        buyingPrice: {type: Number, default: 0},
        sellingPrice: Number,
        recvQty: {type: Number, default: 0},
        newRecvQty: {type: Number, default: 0},
        newBal: {type: Number, default: 0},
        balQty: {type: Number, default: 0},
        newOrder: {type: Number, default: 0},
        brand: String,
        quantity: {type: Number, default: 0},
        remark: {type: String, default: "None"},
        status: String,
        gst: {type: Number, default: 0},
        unit: String,
        total: {type: Number, default: 0},
        created_by: String,
        date_created: {
          type: Date,
          required: true,
          default: Date.now,
        },
        qNumber: { type: String, required: true, unique: true },
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

const Quotation = models.Quotation || mongoose.model("Quotation", quotationSchema);

export default Quotation;
