// 비즈니스 규칙이 사는 곳입니다. HTTP를 모르고(req/res 없음), SQL도 모릅니다(prisma 없음).
// '없으면 404'는 HTTP 규칙이 아니라 도메인 규칙이라 여기서 판단합니다.
import { NotFoundError } from '../errors/AppError.js'
import { postRepository } from '../repositories/post.repository.js'
import type { CreatePostInput, UpdatePostInput } from '../schemas/post.schema.js'

// 여러 메서드가 '있는지 확인하고 없으면 404'를 반복하므로 따로 뺐습니다.
// 객체 안에서 postService.getPost()를 부르면 TS가 순환 참조로 보고 타입 추론을 포기합니다.
// 바깥 함수로 빼면 그 문제가 없고, 의도도 더 분명합니다.
async function findPostOrThrow(id: number) {
  const post = await postRepository.findById(id)
  if (!post) {
    // new를 빠뜨리면 클래스 자체가 던져져서 errorHandler가 500으로 처리합니다.
    throw new NotFoundError('게시글을 찾을 수 없습니다.')
  }
  return post
}

export const postService = {
  listPosts() {
    return postRepository.findMany()
  },

  getPost(id: number) {
    return findPostOrThrow(id)
  },

  createPost(input: CreatePostInput) {
    return postRepository.create(input)
  },

  async updatePost(id: number, input: UpdatePostInput) {
    // 존재 확인을 먼저 합니다. 이게 없으면 없는 id로 수정할 때
    // Prisma의 P2025 에러가 그대로 올라가 500이 됩니다.
    await findPostOrThrow(id)
    return postRepository.update(id, input)
  },

  async deletePost(id: number) {
    await findPostOrThrow(id)
    await postRepository.delete(id)
  },
}
