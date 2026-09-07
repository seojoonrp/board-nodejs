# board-nodejs

Node.js + PostgreSQL 학습용 게시판 API. (TypeScript / Express 5 / Prisma 7)

## 실행

```bash
npm run db:up        # Postgres 컨테이너 기동
npm run db:migrate   # 마이그레이션 적용
npm run db:seed      # 더미 데이터
npm run dev          # 개발 서버 (파일 저장 시 자동 재시작)
```

확인:
```bash
curl localhost:3000/api/v1/posts
```

기타: `npm run typecheck`, `npm run db:studio` (브라우저 DB 뷰어), `npm run db:down`

## 현재 상태

`GET /api/v1/posts` 한 줄만 routes → controller → service → repository로 관통되어 있습니다.
나머지는 각 파일의 `TODO` 주석을 따라 직접 채우세요.

## 다음 단계 (순서 추천)

1. `GET /posts/:id` — 없는 id면 404. `NotFoundError`를 서비스에서 throw
2. `src/schemas/post.schema.ts` + `src/middlewares/validate.ts` — zod 검증
3. `POST /posts` — 201과 Location 헤더
4. `PATCH` / `DELETE`
5. `schema.prisma`에 `Comment` 모델 추가 → `migrate dev` → 댓글 CRUD
6. 페이지네이션 (`?page=&limit=`) — `skip`/`take`와 전체 개수 `count`를 트랜잭션으로 묶기

## 알아둘 것

- **ESM이라 상대경로 import에 `.js`를 붙입니다.** `.ts` 파일을 가리켜도 `.js`입니다. 컴파일 후 기준이라 그렇습니다.
- **`schema.prisma`를 고치면 `npm run db:migrate`** 를 돌려야 DB와 타입이 같이 갱신됩니다.
- **Prisma 7은 v6 이하와 설정이 다릅니다.** 접속 URL이 `schema.prisma`가 아니라 `prisma.config.ts`에 있고, 드라이버 어댑터(`@prisma/adapter-pg`)를 거칩니다. 인터넷 튜토리얼 대부분은 v6 기준이라 `datasource` 블록 안에 `url`이 있는데, 그대로 따라 하면 에러가 납니다.
- **Express 5는 async 핸들러의 에러를 자동 전파합니다.** 예제 코드에 흔한 `asyncHandler` 래퍼는 Express 4용이라 여기선 필요 없습니다.
