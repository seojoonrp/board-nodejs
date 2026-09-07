// 이 계층은 DB 쿼리만 압니다. express의 req/res를 절대 import 하지 마세요.
// 반환 타입을 일부러 안 적었습니다. Prisma가 만들어준 타입이 그대로 추론되어 올라갑니다.
import { prisma } from "../db/prisma.js";
import type {
  CreatePostInput,
  UpdatePostInput,
} from "../schemas/post.schema.js";

export const postRepository = {
  findMany() {
    return prisma.post.findMany({
      orderBy: { createdAt: "desc" },
    });
  },

  // 못 찾으면 예외가 아니라 null을 반환합니다. 404로 바꾸는 건 서비스의 몫입니다.
  findById(id: number) {
    return prisma.post.findUnique({
      where: { id },
    });
  },

  create(data: CreatePostInput) {
    return prisma.post.create({ data });
  },

  update(id: number, data: UpdatePostInput) {
    return prisma.post.update({ where: { id }, data });
  },

  delete(id: number) {
    return prisma.post.delete({ where: { id } });
  },
};
