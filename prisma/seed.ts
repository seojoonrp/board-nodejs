import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import 'dotenv/config'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

await prisma.post.deleteMany()
await prisma.post.createMany({
  data: [
    { title: '첫 번째 글', content: '시드 데이터입니다.', author: 'seojoon' },
    { title: '두 번째 글', content: 'GET /api/v1/posts 로 확인해보세요.', author: 'tester' },
  ],
})

console.log('시드 데이터 삽입 완료')
await prisma.$disconnect()
