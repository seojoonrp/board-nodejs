// Express의 '에러 미들웨어'는 인자가 반드시 4개여야 합니다.
// (err, req, res, next) - next를 안 써도 지우면 안 됩니다. Express가 인자 개수로 구분합니다.
import type { ErrorRequestHandler } from 'express'
import { ZodError } from 'zod'
import { AppError } from '../errors/AppError.js'
import { config } from '../config/index.js'

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  // 스키마 검증 실패. 컨트롤러의 parse()에서 올라옵니다.
  // 어느 필드가 왜 틀렸는지 알려줘야 클라이언트가 고칠 수 있습니다.
  if (err instanceof ZodError) {
    res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: '요청 값이 올바르지 않습니다.',
        details: err.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      },
    })
    return
  }

  // 우리가 의도적으로 던진 에러 (NotFoundError 등)
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: { code: err.code, message: err.message },
    })
    return
  }

  // 예상 못 한 에러: 내부 정보가 클라이언트로 새지 않게 메시지를 감춥니다.
  console.error(err)
  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: config.isProduction ? '서버 오류가 발생했습니다.' : String(err),
    },
  })
}
