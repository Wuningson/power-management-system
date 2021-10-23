import { Document, model, Schema, Types } from 'mongoose';

export interface CustomerDocument extends Document, Customer {}

const CustomerSchema = new Schema({
  address: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  middleName: {
    type: String,
  },
  accountNo: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdBy: {
    type: Types.ObjectId,
    required: true,
    ref: 'Admin',
  },
  createdAt: {
    type: Date,
    default: new Date().toISOString(),
  },
});

export default model<CustomerDocument>('Customer', CustomerSchema);
