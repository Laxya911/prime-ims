import mongoose, { Document, models } from 'mongoose';

const { Schema } = mongoose;
export interface User extends Document {
  _id: string;
  companyId: String;
  origin: String;
  destination: String;
  weight: String;
  dimensions: String;
  name: String;
  email: String;
  phone: String;
  message: String;
  received_at: Date;
}

const messageSchema = new Schema({
  companyId: String ,
  origin: String ,
  destination: String ,
  weight: String ,
  dimensions: String ,
  name: String ,
  email: String,
  phone: String ,
  message: String ,
  received_at: {
    type: Date,
    default: Date.now,
  },
});

const Message = models.Message ||  mongoose.model("Message", messageSchema);

export default Message;