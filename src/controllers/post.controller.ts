// = Go의 handler. 하는 일은 세 가지뿐입니다.
//   1. 요청에서 값을 꺼내 검증하고  2. 서비스를 부르고  3. 응답 형태를 정한다
// 여기에 if문(비즈니스 규칙)이 늘어나면 서비스로 옮겨야 한다는 신호입니다.
import type { RequestHandler } from 'express'
import { postService } from '../services/post.service.js'
import {
  createPostSchema,
  postIdParamSchema,
  updatePostSchema,
} from '../schemas/post.schema.js'

// safeParse가 아니라 parse를 씁니다. 실패하면 ZodError를 던지고,
// errorHandler가 그걸 400으로 변환합니다. 덕분에 컨트롤러에 if문이 사라집니다.
// Go의 if err != nil을 계층마다 반복하지 않아도 되는 게 이 모델의 장점입니다.

const listPosts: RequestHandler = async (_req, res) => {
  const posts = await postService.listPosts()
  res.json({ data: posts })
}

const getPost: RequestHandler = async (req, res) => {
  const { id } = postIdParamSchema.parse(req.params)
  const post = await postService.getPost(id)
  res.json({ data: post })
}

const createPost: RequestHandler = async (req, res) => {
  const input = createPostSchema.parse(req.body)
  const post = await postService.createPost(input)
  // 생성은 201. Location 헤더로 만들어진 리소스의 위치를 알려주는 게 REST 관례입니다.
  res.status(201).location(`/api/v1/posts/${post.id}`).json({ data: post })
}

const updatePost: RequestHandler = async (req, res) => {
  const { id } = postIdParamSchema.parse(req.params)
  const input = updatePostSchema.parse(req.body)
  const post = await postService.updatePost(id, input)
  res.json({ data: post })
}

const deletePost: RequestHandler = async (req, res) => {
  const { id } = postIdParamSchema.parse(req.params)
  await postService.deletePost(id)
  // 204는 '성공했고 보낼 본문이 없다'는 뜻입니다. json()을 부르면 안 됩니다.
  res.status(204).send()
}

export const postController = {
  listPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
}
