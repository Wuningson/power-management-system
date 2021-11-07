// All password fields are made optional so they can be deleted before sending data to the user

type AdminDocument = import('./models/admin.model').AdminDocument;
type EmployeeDocument = import('./models/employee.model').EmployeeDocument;
type CustomerDocument = import('./models/customer.model').CustomerDocument;

interface EnvironmentVariables {
  port: number;
  jwtToken: string;
  apiPath?: string;
  publicKey: string;
  privateKey: string;
  databaseUrl: string;
  provenDbUrl: string;
  provenDbService: string;
}

enum SuccessHttpStatusCode {
  OK = 200,
}

enum ErrorHttpStatusCode {
  NOT_FOUND = 404,
  FORBIDDEN = 403,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  INTERNAL_SERVER = 500,
}

type HttpStatusCode = SuccessHttpStatusCode | ErrorHttpStatusCode;

type ErrorName = keyof typeof ErrorHttpStatusCode;

type SuccessName = keyof typeof SuccessHttpStatusCode;

interface ErrorResponse {
  name?: ErrorName;
  message?: string;
  status?: boolean;
}

interface ControllerResult {
  data: null | Record<string, any> | string | number;
  message: string;
}

interface Admin {
  adminId: string;
  createdAt: Date;
  lastName: string;
  firstName: string;
  password?: string;
}

interface Employee {
  createdAt: Date;
  lastName: string;
  firstName: string;
  password?: string;
  employeeId: string;
  createdBy: string | AdminDocument;
}

interface Customer {
  address: string;
  createdAt: Date;
  meterNo: number;
  lastName: string;
  firstName: string;
  password?: string;
  accountNo: string;
  middleName?: string;
  createdBy: string | EmployeeDocument;
}
interface BigChainBill {
  rate: number;
  createdAt: string;
  createdBy: string;
  unitsUsed: number;
  customerId: string;
  billingMonth: number;
}

interface Bill {
  createdAt: Date;
  customerId: string;
  transactionId: string;
  billingMonth: number;
}

interface Payment {
  amount: number;
  createdAt: Date;
  customerId: string;
  status: 'pending' | 'successful' | 'failed';
}

interface BigChainPayment extends Payment {
  createdAt: string;
  status: 'successful';
}

interface FetchQuery {
  page?: string;
  limit?: string;
}

interface BigChainPaymentReturn extends BigChainPayment {
  createdAt: Date;
}

interface BillMetaData {
  transactionId?: string;
}

interface GetAccessTokenResponse {
  token_type: string;
  expires_in: number;
  access_token: string;
  refresh_token: string;
}
