// 앱 '조립'만 담당하고 listen은 하지 않습니다.
// 이렇게 분리해두면 테스트에서 포트를 열지 않고 app을 그대로 supertest에 넘길 수 있습니다.
import express from 'express'
import { apiRoutes } from './routes/index.js'
import { errorHandler } from './middlewares/errorHandler.js'
import { notFound } from './middlewares/notFound.js'

export const app = express()

// JSON 본문 파싱. 이게 없으면 req.body가 undefined입니다.
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/v1', apiRoutes)

// --- 아래 두 개는 반드시 모든 라우터 '뒤에' 와야 합니다 ---
// 미들웨어는 등록 순서대로 실행되므로, 위에서 매칭된 게 없을 때만 여기까지 옵니다.
app.use(notFound)
app.use(errorHandler)
