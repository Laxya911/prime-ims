// import { models } from "mongoose";
import mongoose ,{models, }from 'mongoose';

const newConsignmentSchema = new mongoose.Schema({
    consignmentName: {
    type: String,
  },
  shipment_status: [
    {
      status: {
        type: String,
        enum: ["Processing", "Processed", "In Transit", "Out For Delivery", "Delivered"],
        required: true,
      },
      date_updated: {
        type: Date,
        required: true,
      },
    },
  ],
});

// export const ConsignmentModel = mongoose.model('NewConsignment', newConsignmentSchema);
const NewConsignment = models.NewConsignment ||  mongoose.model("NewConsignment", newConsignmentSchema);

export default NewConsignment;