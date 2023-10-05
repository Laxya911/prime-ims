import mongoose, { Document, ObjectId, models } from 'mongoose';

const { Schema } = mongoose;

const logSchema = new Schema({
  deletedBy: { type: String, ref: 'User', required: true },
  userName: { type: String, ref: 'User', required: true },
  deletedItem: { type: String },
  deletedName: { type: String },
  deletedEmail: { type: String },
  itemType: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Log = models.Log || mongoose.model('Log', logSchema);

export default Log;
