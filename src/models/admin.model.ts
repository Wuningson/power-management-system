import { Document, model, Schema } from 'mongoose';

export interface AdminDocument extends Admin, Document {}

const AdminSchema = new Schema({
  adminId: {
    type: String,
    required: true,
    unique: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: new Date().toISOString(),
  },
});

export default model<AdminDocument>('Admin', AdminSchema);
