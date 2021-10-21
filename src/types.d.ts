interface EnvironmentVariables {
  port: number;
  apiPath?: string;
  databaseUrl: string;
}

enum SuccessHttpStatusCode {
  OK = 200,
}

enum ErrorHttpStatusCode {
  NOT_FOUND = 404,
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
