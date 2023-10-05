import mongoose, { models } from "mongoose";
const { Schema } = mongoose;

const purchaseSchema = new Schema(
  {
    po_Number: { type: String, required: true, unique: true },
    products: [
      {
        productName: String,
        vName: String,
        productCode: String,
        category: String,
        buyingPrice: {type: Number, default: 0},
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
        po_Number: { type: String, required: true, unique: true },
      },
    ],
    subTotal: String,
    totalGst: String,
    grandTotal: String,
    companyId: String,
    vName: String,
    contact_no: String,
    email: String,
    address: String,
    gst_vat_no: String,
    vendorID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "vendor",
    },
    created_by: {
      type: String,
      ref: "User",
    },
    date_created: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true }
);

const Purchase = models.Purchase || mongoose.model("Purchase", purchaseSchema);

export default Purchase;
