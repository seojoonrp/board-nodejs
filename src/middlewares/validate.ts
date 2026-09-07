// TODO: 직접 구현해보세요.
//
// 목표: zod 스키마를 받아서 req.body / req.query / req.params를 검증하는 미들웨어 팩토리.
//
// 사용하는 모습:
//   router.post('/', validate({ body: createPostSchema }), postController.createPost)
//
// 힌트:
//  - 시그니처는 (schemas) => RequestHandler 형태입니다. 미들웨어를 '반환'하는 함수입니다.
//  - schema.safeParse(req.body) 결과가 실패면 400을 던지고, 성공이면 req.body에 파싱 결과를
//    덮어써 주세요. zod가 타입 변환(문자열 "1" -> 숫자 1)까지 해주기 때문에 이게 중요합니다.
//  - Express 5는 req.query가 getter라 재할당이 안 됩니다. 검증 결과를 따로 담을 곳이
//    필요한데, 이때 src/types/express.d.ts 에서 Request 인터페이스를 확장합니다.
