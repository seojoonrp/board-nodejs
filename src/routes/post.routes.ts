// URL과 핸들러를 연결하는 것 '만' 합니다. 로직을 여기 쓰지 마세요.
import { Router } from 'express'
import { postController } from '../controllers/post.controller.js'

export const postRoutes = Router()

// 주의: '/:id'보다 구체적인 경로(예: '/search')가 생기면 그걸 위에 등록해야 합니다.
// Express는 위에서부터 순서대로 매칭하므로 '/search'가 아래 있으면 id="search"로 잡힙니다.
postRoutes.get('/', postController.listPosts)
postRoutes.get('/:id', postController.getPost)
postRoutes.post('/', postController.createPost)
postRoutes.patch('/:id', postController.updatePost)
postRoutes.delete('/:id', postController.deletePost)
