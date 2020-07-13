import { ValidationError } from "express-validator";

export class RequestValidationError extends Error {
  constructor(public errors: ValidationError[]) {
    super();

    // Because it is extending a built in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }
}
