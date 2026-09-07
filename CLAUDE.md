# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 이 저장소의 목적

**학습용 프로젝트입니다. 결과물이 아니라 사용자의 학습이 목표입니다.**

사용자는 Go + MongoDB로 백엔드 경험이 많지만 Node.js와 SQL 기반 DB는 처음입니다. 새로 합류할 회사의 스택에 적응하려고 직접 손으로 익히는 중입니다. 게시판 API는 그 연습용 소재일 뿐, 완성도나 배포는 목표가 아닙니다.

## 작업 규칙

이 저장소에서는 아래가 일반적인 코딩 지원보다 우선합니다.

- **요청받지 않은 애플리케이션 로직을 대신 완성하지 마세요.** 사용자가 직접 씁니다. 코드를 쓰기 전에 범위를 확인하세요.
- 설정·도구·보일러플레이트(tsconfig, docker-compose, 의존성, 마이그레이션 실행)는 대신 처리해도 됩니다. 학습 가치가 낮고 삽질만 많은 영역입니다.
- 사용자가 **명시적으로** "짜줘", "모범 답안" 등을 요청하면 구현합니다. 그 경우에도 컴파일을 위해 요청 범위를 넘어 건드린 파일이 있으면 어떤 파일인지 밝히세요.
- 리뷰 요청 시에는 고쳐주지 말고 지적하세요. 무엇이 왜 문제인지, 관용적 표현이 무엇인지 알려주는 게 목적입니다.
- 개념 설명은 **Go 대응 개념으로** 연결하면 잘 전달됩니다. 계층 구조는 Go의 handler → usecase → repository에 맞춰 선택된 것입니다.
- 추측보다 실행이 낫습니다. 동작이 헷갈리면 짧은 스크립트로 확인해서 실제 출력을 보여주세요. 사용자가 이 방식으로 배우고 있습니다.
- 사용자는 한국어로 대화합니다.

## 명령어

```bash
npm run db:up        # Postgres 컨테이너 기동 (Docker Desktop WSL 연동 필요)
npm run db:migrate   # prisma migrate dev - 스키마 변경 후 필수
npm run db:seed
npm run dev          # tsx watch. 개발 시 이걸 쓸 것
npm run typecheck    # tsc --noEmit
npm run db:studio    # 브라우저 DB 뷰어
docker exec -it board-postgres psql -U board -d board
```

**테스트 러너가 아직 설치되어 있지 않습니다.** `tests/` 디렉터리는 비어 있습니다. 테스트를 요청받으면 러너 선택(vitest 등)부터 사용자와 정하세요.

## 아키텍처

계층형이고 **의존 방향이 한 방향으로만** 흐릅니다. 역방향 import가 생기면 구조가 무너집니다.

```
routes → controllers → services → repositories → db/prisma
```

- `routes/` — URL과 핸들러 연결만
- `controllers/` — zod로 요청 파싱, 서비스 호출, 상태 코드 결정. `req`/`res`를 아는 마지막 계층
- `services/` — 도메인 규칙. "없으면 404" 판단이 여기 있음. HTTP도 SQL도 모름
- `repositories/` — Prisma 쿼리만. `express`를 import하면 안 됨
- `app.ts` — 앱 조립만, `listen` 없음. 테스트에서 supertest에 그대로 넘기기 위함
- `server.ts` — 진입점, graceful shutdown

### 검증과 에러 흐름

`try/catch`를 계층마다 쓰지 않습니다. 던지면 자동으로 위로 전파됩니다.

```
컨트롤러: schema.parse(req.body)  → 실패 시 ZodError throw
서비스:   없으면 NotFoundError throw
   ↓ Express 5가 async 핸들러의 throw를 자동 전파
middlewares/errorHandler.ts 에서만 HTTP 응답으로 변환
   ZodError → 400 (+ details), AppError → 각자의 statusCode, 그 외 → 500
```

`app.ts`에서 `notFound`와 `errorHandler`는 **반드시 모든 라우터 뒤에** 등록되어야 합니다.

`schemas/`의 zod 스키마는 요청 검증과 DTO 타입 정의를 겸합니다(`z.infer`). DB 모델(`Post`)과 요청 DTO는 다른 것이며, 섞지 마세요.

## 이 스택의 함정

버전이 최신이라 인터넷 예제 대부분과 다릅니다. 예제를 그대로 적용하면 깨집니다.

- **ESM**: 상대경로 import에 `.js` 확장자가 필요합니다. `.ts` 파일을 가리켜도 `.js`입니다.
- **Prisma 7**: DB 접속 URL이 `schema.prisma`가 아니라 `prisma.config.ts`에 있고, 드라이버 어댑터(`@prisma/adapter-pg`)를 거칩니다. v6 이하 튜토리얼의 `datasource { url = env(...) }`를 쓰면 `P1012`로 실패합니다. `.env` 자동 로딩도 없어서 `dotenv`를 명시적으로 import합니다.
- **Prisma CLI 버전**: `npm i prisma@latest`가 8.x RC를 설치합니다. `@prisma/client`와 메이저 버전을 맞춰 7.x로 고정해야 합니다.
- **Express 5**: async 핸들러의 throw를 자동 전파하므로 예제에 흔한 `asyncHandler` 래퍼가 필요 없습니다. 대신 `req.query`가 getter라 재할당할 수 없습니다.
- **`req.params.id`의 타입은 `string | string[] | undefined`** 입니다. `Number()`는 빈 문자열을 `0`으로 만드는 등 함정이 많으니 `z.coerce.number().int().positive()`로 파싱합니다.
- **자동 import 오염**: VSCode가 엉뚱한 패키지에서 같은 이름을 끌어옵니다(예: `zod/locales`의 `id`는 인도네시아어 로케일). `tsc`도 통과하니 import 줄을 확인하세요.

## 현재 상태

`posts` CRUD 5개 엔드포인트(`/api/v1/posts`)가 동작하며, 응답 형태는 성공 시 `{ data }`, 실패 시 `{ error: { code, message } }`입니다.

**아래는 사용자가 직접 할 과제입니다. 요청 없이 먼저 구현하지 마세요.**

- `middlewares/validate.ts` — 컨트롤러의 `parse` 호출을 미들웨어로 옮기는 리팩터링 (현재 빈 파일, 힌트 주석만 있음)
- 페이지네이션 (`listPostsQuerySchema` + `skip`/`take`)
- `Comment` 모델과 FK 관계 — 생성된 `migration.sql`에서 `FOREIGN KEY`를 확인하는 것이 학습 목표
- 응답 DTO 분리 (현재 Prisma 객체를 그대로 반환 중)

`schema.prisma`의 `Comment` 관련 TODO 주석과 각 소스 파일의 TODO 주석이 사용자의 진행 상황을 나타냅니다.
