// PrismaClient는 커넥션 풀을 들고 있습니다. 앱 전체에서 '하나만' 만들어 재사용하세요.
// 요청마다 new PrismaClient()를 하면 커넥션이 폭발합니다.
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { config } from '../config/index.js'

// Prisma 7부터는 드라이버 어댑터로 접속합니다. (v6 이하에는 이 단계가 없었습니다)
const adapter = new PrismaPg({ connectionString: config.databaseUrl })

export const prisma = new PrismaClient({
  adapter,
  log: config.isProduction ? ['error'] : ['query', 'warn', 'error'],
})
