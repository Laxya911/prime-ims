import mongoose, { Document, ObjectId, models } from 'mongoose';

const { Schema } = mongoose;

export interface User extends Document {
  _id: string;
  name: string;
  userName: string; 
  email: string;
  password: string; 
  role: 'superadmin' | 'admin' | 'normal' | ''; // Enum type
  isActive: boolean; // Boolean type
  companyId: string;
  assignedCompany: ObjectId;
  createdAt: Date;
}

const userSchema = new Schema({
  name: String, 
  userName: String, 
  email: String, 
  password: String, 
  role: {
    type: String,
    enum: ['superadmin', 'admin', 'normal', ''],
  },
  isActive: {
    type: Boolean,
    default: false, 
  },
  companyId: String, 
  assignedCompany: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now, 
  },
}, { timestamps: true }); 

const User = models.User ||  mongoose.model("User", userSchema);

export default User;
