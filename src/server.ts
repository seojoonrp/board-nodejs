import { app } from './app.js'
import { config } from './config/index.js'
import { prisma } from './db/prisma.js'

const server = app.listen(config.port, () => {
  console.log(`서버 실행 중: http://localhost:${config.port} (${config.nodeEnv})`)
})

// 컨테이너가 보내는 종료 신호를 받아 처리 중인 요청을 마무리하고 커넥션을 닫습니다.
// Go의 http.Server.Shutdown + defer db.Close()에 해당합니다.
const shutdown = async (signal: string) => {
  console.log(`\n${signal} 수신, 종료합니다...`)
  server.close(async () => {
    await prisma.$disconnect()
    process.exit(0)
  })
}

process.on('SIGINT', () => void shutdown('SIGINT'))
process.on('SIGTERM', () => void shutdown('SIGTERM'))
