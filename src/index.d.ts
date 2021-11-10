import { LeanDocument } from 'mongoose';
import { AdminDocument } from './models/admin.model';
import { CustomerDocument } from './models/customer.model';
import { EmployeeDocument } from './models/employee.model';

declare global {
  namespace Express {
    export interface Request {
      admin?: LeanDocument<AdminDocument>;
      customer?: LeanDocument<CustomerDocument>;
      employee?: LeanDocument<EmployeeDocument>;
    }
  }
}
