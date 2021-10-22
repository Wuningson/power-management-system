// All password fields are made optional so they can be deleted before sending data to the user

type AdminDocument = import('./models/admin.model').AdminDocument;
type EmployeeDocument = import('./models/employee.model').EmployeeDocument;
type CustomerDocument = import('./models/customer.model').CustomerDocument;

interface EnvironmentVariables {
  port: number;
  jwtToken: string;
  apiPath?: string;
  databaseUrl: string;
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
