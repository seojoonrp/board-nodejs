// 환경변수는 여기서 '한 번만' 읽고 검증합니다.
// 다른 파일에서 process.env를 직접 쓰지 마세요. 오타가 나도 undefined로 조용히 흘러갑니다.
import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  PORT: z.coerce.number().int().positive().default(3000),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  // 잘못된 설정으로 서버가 뜨는 것보다, 시작 시점에 죽는 게 낫습니다.
  console.error('환경변수 설정이 잘못되었습니다:')
  for (const issue of parsed.error.issues) {
    console.error(`  - ${issue.path.join('.')}: ${issue.message}`)
  }
  process.exit(1)
}

export const config = {
  databaseUrl: parsed.data.DATABASE_URL,
  port: parsed.data.PORT,
  nodeEnv: parsed.data.NODE_ENV,
  isProduction: parsed.data.NODE_ENV === 'production',
}
