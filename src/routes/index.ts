import { Router } from 'express'
import { postRoutes } from './post.routes.js'

export const apiRoutes = Router()

apiRoutes.use('/posts', postRoutes)

// TODO: apiRoutes.use('/comments', commentRoutes)
// 또는 게시글 하위로 중첩하려면 post.routes.ts 안에서 mergeParams: true 를 쓴 Router를 붙입니다.
