export default class ApiErrors extends Error {
  status: number;
  errors: any[];

  constructor(status: number, message: string, errors: any[] = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static UnauthorizedError() {
    return new ApiErrors(401, 'Пользователь не авторизован');
  }

  static BadRequest(message: string, errors: any[] = []) {
    return new ApiErrors(400, message, errors);
  }
  static Forbidden(message: string, errors: any[] = []) {
    return new ApiErrors(403, message, errors);
  }
  static NotFound(message: string, errors: any[] = []) {
    return new ApiErrors(404, message, errors);
  }
}