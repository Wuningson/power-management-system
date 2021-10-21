// Error Handling class using code from https://www.toptal.com/nodejs/node-js-error-handling

class BaseError extends Error {
  public readonly name: ErrorName;
  public readonly httpCode: ErrorHttpStatusCode;
  // TODO: Implement this for logging and all other deets
  // public readonly isOperational: boolean

  constructor(
    name: ErrorName,
    httpCode: ErrorHttpStatusCode,
    description: string
  ) {
    super(description);
    Object.setPrototypeOf(this, new.target.prototype);

    this.name = name;
    this.httpCode = httpCode;

    Error.captureStackTrace(this);
  }
}
