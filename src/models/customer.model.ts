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
  meterNo: {
    type: String,
    required: true,
    unique: true,
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
    ref: 'Employee',
  },
  email: {
    type: String,
    match:
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    required: true,
  },
  createdAt: {
    type: Date,
    default: new Date().toISOString(),
  },
});

export default model<CustomerDocument>('Customer', CustomerSchema);
