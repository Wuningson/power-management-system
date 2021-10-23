import { Document, model, Schema, Types } from 'mongoose';

export interface EmployeeDocument extends Employee, Document {}

const EmployeeSchema = new Schema({
  employeeId: {
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

export default model<EmployeeDocument>('Employee', EmployeeSchema);
