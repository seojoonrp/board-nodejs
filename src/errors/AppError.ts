// Go의 sentinel error / custom error type에 해당합니다.
// 서비스 계층은 이걸 throw만 하고, HTTP 상태 코드로 바꾸는 건 errorHandler가 담당합니다.
export class AppError extends Error {
  readonly statusCode: number
  readonly code: string

  constructor(message: string, statusCode: number, code: string) {
    super(message)
    this.name = this.constructor.name
    this.statusCode = statusCode
    this.code = code
  }
}

export class NotFoundError extends AppError {
  constructor(message = '리소스를 찾을 수 없습니다.') {
    super(message, 404, 'NOT_FOUND')
  }
}

// TODO: 필요해지면 직접 추가해보세요.
// - ValidationError (400, 'VALIDATION_ERROR')
// - ConflictError   (409, 'CONFLICT')
// - UnauthorizedError (401, 'UNAUTHORIZED')
