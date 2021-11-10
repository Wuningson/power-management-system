// All password fields are made optional so they can be deleted before sending data to the user

type AdminDocument = import('./models/admin.model').AdminDocument;
type EmployeeDocument = import('./models/employee.model').EmployeeDocument;
type CustomerDocument = import('./models/customer.model').CustomerDocument;

interface EnvironmentVariables {
  port: number;
  jwtToken: string;
  apiPath?: string;
  databaseUrl: string;
  provenDbUrl: string;
  paystackSecret: string;
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
  email?: string;
  meterNo: number;
  lastName: string;
  firstName: string;
  password?: string;
  accountNo: string;
  middleName?: string;
  createdBy: string | EmployeeDocument;
}

interface Bill {
  rate: number;
  createdAt: Date;
  createdBy: string;
  unitsUsed: number;
  customerId: string;
  billingMonth: number;
}

interface BlockChainBill extends Bill {
  _id: string;
}

interface Payment {
  amount: number;
  createdAt: Date;
  reference: string;
  customerId: string;
  status: 'successful';
}

interface BlockChainPayment extends Payment {
  _id: string;
}

type ProofStatus = 'Pending' | 'Submitted' | 'Valid' | 'Unproven';

interface FetchQuery {
  page?: string;
  limit?: string;
}

interface BigChainPaymentReturn extends BigChainPayment {
  createdAt: Date;
}

interface BigChainMetaData {
  transactionId?: string;
}

interface GetAccessTokenResponse {
  token_type: string;
  expires_in: number;
  access_token: string;
  refresh_token: string;
}
interface AddCustomerBillPayload
  extends Pick<
    BigChainBill,
    'billingMonth' | 'rate' | 'unitsUsed' | 'customerId'
  > {}

interface FetchCustomerBillsPayload extends FetchQuery {
  customerId?: string;
}

interface GetVersionResponse {
  ok: number;
  status: string;
  version: number;
  response: string;
}

type DepositType = 'card' | 'bank_transfer';

interface GeneratePaymentLinkPayload {
  email: string;
  amount: number;
  metadata: string;
  reference: string;
  callbackUrl?: string;
  channel: 'card' | 'bank_transfer';
}

interface GeneratePaymentLinkResponse {
  status: string;
  message: string;
  data: {
    reference: string;
    access_code: string;
    authorization_url: string;
  };
}

interface VerifyTransaction {
  status: boolean;
  message: string;
  data: {
    amount: number;
    status: string;
    paidAt: string;
    reference: string;
    metadata: { userId: string };
  };
}

interface GeneratePaymentLink {
  email: string;
  amount: number;
  channel: DepositType;
}

interface PaymentCallbackPayload {
  event: string;
  data: { reference: string };
}

interface CustomerById {
  customerId?: string;
}

interface UpdateCustomerPayload
  extends Partial<
    Pick<
      Customer,
      | 'email'
      | 'address'
      | 'meterNo'
      | 'lastName'
      | 'firstName'
      | 'accountNo'
      | 'middleName'
    >
  > {}
