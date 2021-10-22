// Error Handling class using code from https://www.toptal.com/nodejs/node-js-error-handling

export default class BaseError extends Error {
  public readonly name: ErrorName;
  public readonly httpCode: ErrorHttpStatusCode;
  // TODO: Implement this for logging and all other deets
  // public readonly isOperational: boolean

  constructor(name: ErrorName, description: string) {
    super(description);
    Object.setPrototypeOf(this, new.target.prototype);

    this.name = name;
    this.httpCode = ErrorHttpStatusCode[name];

    Error.captureStackTrace(this);
  }
}

// tslint-disable-next-line no=any
export const handleError = (error: any) => {
  const response: ErrorResponse = {};
  response.name = 'INTERNAL_SERVER';
  response.status = false;

  let statusCode: ErrorHttpStatusCode = 500;

  if (error instanceof BaseError) {
    response.name = error.name;
    response.message = error.message;
    statusCode = error.httpCode;
  } else if (error instanceof Error) {
    response.message = error.message;
  } else {
    response.message = 'Something went wrong';
  }
  return { response, statusCode };
};
