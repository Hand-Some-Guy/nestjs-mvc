# 프로젝트 실행

이 문서는 **Auth Service**와 **Event Service**를 포함한 프로젝트를 도커 환경에서 실행하고, `curl` 명령어로 테스트하는 방법을 한국어로 설명합니다. 프로젝트는 사용자 인증, 이벤트 관리, 보상 지급 기능을 제공하며, Gateway를 통해 API 호출을 처리합니다.

## 1. 프로젝트 개요
- **구성 요소**:
  - **Auth Service**: 사용자 등록, 로그인, 리프레시 토큰, 역할 업데이트, 활동 타입별 개수 조회.
  - **Event Service**: 이벤트 추가, 검색, 상세 조회, 보상 추가, 보상 요청, 보상 이력 조회.
- **기술 스택**:
  - NestJS, MongoDB, RabbitMQ, JWT 인증, 도커.
- **Gateway**: `http://localhost:3000/api`에서 실행.
- **권한**: `USER`, `ADMIN`, `OPERATOR`, `AUDITOR`.

## 2. 실행 준비

### 2.1. 도커 실행
1. **도커 컴포즈 파일 확인**:
   - `docker-compose.yml`이 프로젝트 루트 디렉토리에 있는지 확인.
   - 주요 서비스: `mongodb`, `rabbitmq`, `user-service`, `event-service`, `gateway`.

2. **도커 실행**:
   ```bash
   docker-compose up --build
   ```

3. **로그 확인**:
   ```bash
   docker logs user-service
   docker logs event-service
   docker logs gateway
   또는
   docker compose logs user-service
   ```

### 2.2. MongoDB 데이터 초기화
테스트용 데이터 삽입:
```javascript
// mongoDB 컨테이너 접속 
sudo docker exec -it mongodb mongosh

// user-service 데이터베이스
use user-service;
db.users.insertOne({
  uid: "test@example.com",
  password: "$2b$10$...hashed_password...",
  role: "USER"
});
db.activityHistories.insertMany([
  { uid: "test@example.com", type: "LOGIN", date: ISODate("2025-05-20"), time: "12:00:00" },
  { uid: "test@example.com", type: "LOGIN", date: ISODate("2025-05-20"), time: "13:00:00" },
  { uid: "test@example.com", type: "TEST", date: ISODate("2025-05-20"), time: "14:00:00" }
]);

// event-service 데이터베이스
use event-service;
db.events.insertOne({
  title: "Test Event",
  dateAdded: ISODate("2025-05-19"),
  dateStart: ISODate("2025-05-20"),
  duration: 1,
  state: "ACTIVE",
  condition: ["<", ">"],
  conditionNum: [5, 2],
  conditionType: ["LOGIN", "TEST"]
});
db.rewards.insertOne({
  eid: "<event_id>",
  items: ["item1"],
  amount: [1]
});
```

## 3. 테스트 Curl 명령어

### 3.1. Auth Service 테스트

1. **사용자 등록**
   - 설명: 새로운 사용자 생성, 활동 이력에 `TEST` 추가.
   ```bash
   curl -X POST http://localhost:3000/api/register \
   -H "Content-Type: application/json" \
   -d '{"id":"test@example.com","password":"password123"}'
   ```
   - 응답: `{ "id": "test@example.com", "role": "USER" }`

2. **로그인**
   - 설명: 사용자 인증, 토큰 발급, 활동 이력에 `LOGIN` 추가.
   ```bash
   curl -X POST http://localhost:3000/api/login \
   -H "Content-Type: application/json" \
   -d '{"id":"test@example.com","password":"password123"}'
   ```
   - 응답: `{ "accessToken": "<jwt_token>", "refreshToken": "<jwt_token>" }`
   - 저장: `export ACCESS_TOKEN=<jwt_token>`

3. **리프레시 토큰**
   - 설명: 새로운 `accessToken` 발급.
   ```bash
   curl -X POST http://localhost:3000/api/refresh \
   -H "Content-Type: application/json" \
   -d '{"refreshToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}'
   ```
   - 응답: `{ "accessToken": "<new_jwt_token>" }`

4. **역할 업데이트**
   - 설명: 사용자 역할 변경 (ADMIN 권한 필요).
   ```bash
   curl -X POST http://localhost:3000/api/update-role \
   -H "Authorization: Bearer $ACCESS_TOKEN" \
   -H "Content-Type: application/json" \
   -d '{"id":"test@example.com","role":"ADMIN"}'
   ```
   - 응답: `{ "id": "test@example.com", "role": "ADMIN" }`

5. **활동 타입 개수 조회**
   - 설명: 사용자 활동 타입별 개수 조회 (ADMIN 권한, `rewardRequest` 조건 확인용).
   ```bash
   curl -X POST http://localhost:3000/api/active-type-count \
   -H "Authorization: Bearer $ACCESS_TOKEN" \
   -H "Content-Type: application/json" \
   -d '{"uid":"test@example.com"}'
   ```
   - 응답: `{ "LOGIN": 2, "TEST": 1 }`

### 3.2. Event Service 테스트

1. **이벤트 추가**
   - 설명: 이벤트 생성 (OPERATOR/ADMIN 권한, 조건 포함).
   ```bash
   curl -X POST http://localhost:3000/api/events \
   -H "Authorization: Bearer $ACCESS_TOKEN" \
   -H "Content-Type: application/json" \
   -d '{"title":"Test Event","dateAdded":"2025-05-20","dateStart":"2025-05-21","duration":1,"state":"ACTIVE","condition":["<", ">"],"conditionNum":[5,2],"conditionType":["LOGIN","TEST"]}'
   ```
   - 응답: `{ "eid": "<event_id>", "title": "Test Event", ... }`
   - 저장: `export EVENT_ID=<event_id>`

2. **이벤트 검색**
   - 설명: 모든 이벤트 조회 (OPERATOR/ADMIN 권한).
   ```bash
   curl -X GET http://localhost:3000/api/events \
   -H "Authorization: Bearer $ACCESS_TOKEN" \
   -H "Content-Type: application/json" \
   -d '{}'
   ```
   - 응답: `[{ "eid": "<event_id>", "title": "Test Event", ... }, ...]`

3. **이벤트 상세 조회**
   - 설명: 특정 이벤트 조회 (USER/ADMIN 권한).
   ```bash
   curl -X GET http://localhost:3000/api/events/$EVENT_ID \
   -H "Authorization: Bearer $ACCESS_TOKEN" \
   -H "Content-Type: application/json" \
   -d '{"eid":"$EVENT_ID"}'
   ```
   - 응답: `{ "event": { "eid": "<event_id>", "title": "Test Event", ... }, "reward": null }`

4. **보상 추가**
   - 설명: 보상 추가 (AUDITOR/ADMIN 권한).
   ```bash
   curl -X POST http://localhost:3000/api/rewards \
   -H "Authorization: Bearer $ACCESS_TOKEN" \
   -H "Content-Type: application/json" \
   -d '{"eid":"$EVENT_ID","items":["item1"],"amount":[1]}'
   ```
   - 응답: `{ "rid": "<reward_id>", "eid": "<event_id>", ... }`
   - 저장: `export REWARD_ID=<reward_id>`

5. **보상 검색**
   - 설명: 특정 보상 조회 (USER/ADMIN 권한).
   ```bash
   curl -X GET http://localhost:3000/api/rewards/$REWARD_ID \
   -H "Authorization: Bearer $ACCESS_TOKEN" \
   -H "Content-Type: application/json" \
   -d '{"rid":"$REWARD_ID"}'
   ```
   - 응답: `{ "rid": "<reward_id>", "eid": "<event_id>", ... }`

6. **보상 요청**
   - 설명: 보상 지급 요청 (USER/ADMIN 권한, 조건 확인).
   ```bash
   curl -X POST http://localhost:3000/api/rewards/request \
   -H "Authorization: Bearer $ACCESS_TOKEN" \
   -H "Content-Type: application/json" \
   -d '{"uid":"test@example.com","rid":"$REWARD_ID","eid":"$EVENT_ID"}'
   ```
   - 응답:
     - 조건 충족: `{ "cid": "<claim_id>", "state": "awarded", ... }`
     - 조건 미충족: `{ "message": "Condition not met: TEST must be greater than 2, got 1" }`
   - 참고: 조건 (`LOGIN < 5`, `TEST > 2`) 충족 여부 확인.

7. **보상 이력 조회**
   - 설명: 보상 이력 조회 (USER/ADMIN 권한).
   ```bash
   curl -X POST http://localhost:3000/api/claims/search \
   -H "Authorization: Bearer $ACCESS_TOKEN" \
   -H "Content-Type: application/json" \
   -d '{"id":"test@example.com","filterType":"uid"}'
   ```
   - 응답: `[{ "cid": "<claim_id>", "uid": "test@example.com", ... }, ...]`

## 4. 문제 해결 가이드
- **401 Unauthorized**:
  - `ACCESS_TOKEN` 확인: `login`으로 새 토큰 획득.
  - `JWT_SECRET` 일치 여부 점검.
  - 권한 확인: `USER`, `ADMIN`, `OPERATOR`, `AUDITOR`.
- **404 Not Found**:
  - `EVENT_ID`, `REWARD_ID` 확인.
  - MongoDB 데이터 확인:
    ```javascript
    db.events.find().pretty();
    db.rewards.find().pretty();
    ```
- **400 Bad Request**:
  - 조건 미충족 오류 확인 (예: `TEST > 2`).
  - 활동 이력 확인:
    ```javascript
    db.activityHistories.find({ uid: "test@example.com" }).pretty();
    ```
- **서비스 연결 문제**:
  - RabbitMQ: `docker logs rabbitmq`, `RABBITMQ_URL` 확인.
  - MongoDB: `docker logs mongodb`, `MONGO_URI` 확인.

## 5. 기타타
- **Postman**:
  - 컬렉션 생성, 변수 (`ACCESS_TOKEN`, `EVENT_ID`, `REWARD_ID`) 설정.
  - 순서: `register` → `login` → `update-role` → `events` → `rewards` → `active-type-count` → `rewards/request` → `claims/search`.
- **로그 확인**:
  - 조건 확인 로그:
    ```bash
    docker logs event-service | grep "Checking condition"
    ```