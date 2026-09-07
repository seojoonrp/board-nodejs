// Prisma 7부터 DB 접속 정보가 schema.prisma에서 이 파일로 옮겨졌습니다.
// (v6 이하 튜토리얼에서는 schema.prisma 안의 datasource 블록에 url이 있습니다)
import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: env('DATABASE_URL'),
  },
  migrations: {
    seed: 'tsx prisma/seed.ts',
  },
})
