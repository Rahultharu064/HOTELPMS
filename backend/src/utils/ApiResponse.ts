export class ApiResponse<T> {
  public readonly success: boolean;
  public readonly message: string;
  public readonly data: T | null;
  public readonly errors?: any[];

  constructor(
    success: boolean,
    message: string,
    data: T | null = null,
    errors?: any[]
  ) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.errors = errors;
  }

  static success<T>(message: string, data: T | null = null): ApiResponse<T> {
    return new ApiResponse<T>(true, message, data);
  }

  static error(message: string, errors?: any[]): ApiResponse<null> {
    return new ApiResponse<null>(false, message, null, errors);
  }
}