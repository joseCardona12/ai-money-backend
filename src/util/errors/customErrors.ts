export class CustomError extends Error {
  public statusCode: number;
  public code: string;

  constructor(message: string, statusCode: number, code: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.name = this.constructor.name;
  }
}

export class ValidationError extends CustomError {
  constructor(message: string) {
    super(message, 400, "VALIDATION_ERROR");
  }
}

export class NotFoundError extends CustomError {
  constructor(message: string) {
    super(message, 404, "NOT_FOUND");
  }
}

export class UnauthorizedError extends CustomError {
  constructor(message: string) {
    super(message, 401, "UNAUTHORIZED");
  }
}

export class ConflictError extends CustomError {
  constructor(message: string) {
    super(message, 409, "CONFLICT");
  }
}

export class InternalServerError extends CustomError {
  constructor(message: string = "Internal server error") {
    super(message, 500, "INTERNAL_SERVER_ERROR");
  }
}
