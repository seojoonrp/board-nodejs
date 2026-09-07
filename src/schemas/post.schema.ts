import { z } from 'zod'

// 경로 파라미터. req.params.id는 항상 문자열이라 coerce로 숫자 변환이 필요합니다.
export const postIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
})

// 생성 요청. Post 모델과 달리 id / createdAt / updatedAt이 없습니다.
// 그건 클라이언트가 정하는 값이 아니라 DB와 Prisma가 채우는 값이기 때문입니다.
// max 값은 schema.prisma의 @db.VarChar(...)와 맞춰뒀습니다. DB에 가기 전에 걸러내려고요.
export const createPostSchema = z.object({
  title: z.string().trim().min(1, '제목을 입력해주세요.').max(200),
  content: z.string().trim().min(1, '내용을 입력해주세요.'),
  author: z.string().trim().min(1, '작성자를 입력해주세요.').max(50),
})

// PATCH는 일부 필드만 보내므로 전부 optional로 바꿉니다.
// .partial()로 재사용하면 createPostSchema의 제약(min/max)이 그대로 따라옵니다.
// refine은 빈 객체 {} 를 막습니다. 아무것도 안 보내고 수정 요청하는 건 잘못된 요청이니까요.
export const updatePostSchema = createPostSchema
  .partial()
  .refine((v) => Object.keys(v).length > 0, {
    message: '수정할 필드를 최소 하나는 보내야 합니다.',
  })

// 스키마에서 타입을 뽑아냅니다. 스키마를 고치면 타입이 자동으로 따라오므로 둘이 어긋나지 않습니다.
export type CreatePostInput = z.infer<typeof createPostSchema>
export type UpdatePostInput = z.infer<typeof updatePostSchema>
