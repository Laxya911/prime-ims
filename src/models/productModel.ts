import mongoose, { models } from "mongoose";
const { Schema } = mongoose;

const productSchema = new Schema(
  {
    productName: String,
    category: String,
    productCode: String,
    buyingPrice: Number,
    sellingPrice: Number,
    brand: String,
    unit: String,
    inStock: {type:Number, default: 0},
    gst: {type:Number, default: 0},
    newOrder: {type:Number, default: 0},
    recvQty: {type:Number, default: 0},
    total: {type:Number, default: 0},
    companyId: String,
    created_by: {
      type: String,
      ref: "User",
    },
    date_created: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true }
);

const Product = models.Product || mongoose.model("Product", productSchema);

export default Product;
