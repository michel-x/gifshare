type Detail = {
  message: string;
  field?: string;
};

export class CustomError extends Error {
  public details: Detail[];
  public code: number;

  constructor(code: number, message: string, details: Detail[]) {
    super(message);
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}
