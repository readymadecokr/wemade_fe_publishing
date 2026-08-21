# Ragnarok Universe 쿠폰 API 연동 가이드

**대상 독자:** 포털·게임 서버·운영 도구를 연동하는 외부 프로그래머  
**기준 구현:** 현재 Ragnarok Universe 포털의 tRPC API 및 MySQL/TiDB 스키마  
**범위:** 관리자 쿠폰 관리, 서비스 My Page Coupon 등록, 사용 이력 및 Bonus rCoin 반영

> 이 문서는 현재 포털 구현을 기준으로 한 **논리 API 계약서**입니다. 서버는 REST가 아닌 **tRPC**를 사용합니다. TypeScript 연동 시에는 같은 `AppRouter` 타입을 공유하는 tRPC 클라이언트를 권장하며, 타 언어 서비스는 API Gateway 또는 REST 어댑터를 별도로 두는 방식을 권장합니다.

---

## 1. 전체 흐름

쿠폰은 관리자가 이벤트 단위로 생성하고, 서비스 사용자는 My Page의 Coupon 화면에서 서버·캐릭터·쿠폰 코드를 입력해 등록합니다. 난수 쿠폰은 발급 코드마다 한 번만 사용할 수 있으며, 같은 난수 이벤트도 계정당 한 번만 사용할 수 있습니다. 공용 쿠폰은 동일 코드의 사용 이력을 개별 계정 단위로 관리합니다.

| 단계 | 관리자 포털 | 서비스 포털 | 서버·DB 처리 |
|---|---|---|---|
| 1 | 이벤트와 보상·기간·서버 조건 생성 | - | `coupons`에 코드·보상·상태 저장 |
| 2 | 난수 쿠폰 대량 발급 또는 엑셀 업로드 | - | 난수별 고유 코드 생성 |
| 3 | 개별 쿠폰 현황·사용자 확인 | Coupon 코드 입력 | 코드·기간·서버·중복 여부 검증 |
| 4 | 사용 수량·User ID 확인 | 등록 성공·이력 표시 | `couponUses` 저장, `usedCount` 증가 |
| 5 | 보상 확인 | Bonus rCoin 잔액 반영 | `ruCashBalances`, `ruCashTransactions` 반영 |

---

## 2. 접속 방식과 인증

### 2.1 tRPC 엔드포인트

기본 경로는 다음과 같습니다.

```text
POST /api/trpc/<router>.<procedure>
GET  /api/trpc/<router>.<procedure>
```

현재 프런트는 `@trpc/client`와 `superjson`을 사용합니다. 날짜는 `Date`로 직렬화되므로, 외부 서비스는 날짜를 ISO 8601 문자열로 받고 보낼 수 있도록 어댑터를 두는 것이 안전합니다.

### 2.2 관리자 인증

관리자 쿠폰 API는 다음 헤더를 요구합니다.

```http
x-admin-key: <admin_username>:<admin_password>
```

관리자 계정은 `admins` 테이블에 저장되며 활성 계정(`isActive = 1`)만 허용됩니다. 관리자 로그인, 관리자 API 권한 확인, 비밀번호 변경은 동일한 DB 자격 증명 검증을 사용합니다. 외부 서비스는 관리자 비밀번호를 로그·URL·클라이언트 저장소에 남기지 말고 서버 측 비밀 관리 도구에 보관해야 합니다.

### 2.3 서비스 사용자 인증

`coupon.redeem`, `coupon.myHistory`는 포털 OAuth 세션의 로그인 사용자(`ctx.user`)가 필요합니다. 요청 본문으로 `userId`를 전달하지 않습니다. 서버가 세션의 사용자 ID를 기준으로 사용 이력을 생성하므로, 외부 게임 서버에서 호출할 때는 별도 서버 간 인증과 포털 사용자 매핑 계층이 필요합니다.

---

## 3. 데이터 모델

### 3.1 `coupons`

| 필드 | 형식 | 설명 |
|---|---|---|
| `id` | integer | 개별 쿠폰 PK |
| `gameCode` | string | 게임 코드. 기본값 `ROU` |
| `couponType` | `common` 또는 `random` | 공용 또는 난수 쿠폰 |
| `eventName` | string, 최대 20 bytes | 이벤트 묶음 식별자 |
| `code` | `NNNN-NNNN-NNNN` | 개별 쿠폰 코드 |
| `bonusRcoin` | integer | 즉시 지급할 Bonus rCoin |
| `rewardItems` | JSON text | `[{ "itemId": "501039", "quantity": 1 }]` |
| `serverCodes` | comma-separated string 또는 `null` | 허용 서버. `null`/빈 값은 전체 서버 |
| `validFrom`, `expiresAt` | timestamp 또는 `null` | 쿠폰 사용 기간 |
| `isActive` | `0` 또는 `1` | 운영자가 제어하는 사용 가능 여부 |
| `randomGenerated` | `0` 또는 `1` | 서버 자동 난수 발급 여부 |
| `issueQuantity` | integer | 발급 수량. 난수 쿠폰 행은 1 |
| `usedCount` | integer | 개별 코드 사용 수량 |

### 3.2 `couponUses`

| 필드 | 설명 |
|---|---|
| `couponId` | 사용한 `coupons.id` |
| `userId` | 포털 로그인 사용자 ID |
| `serverCode` | 사용자가 선택한 게임 서버 코드 |
| `characterName` | 보상을 받는 캐릭터명 |
| `couponCodeSnapshot` | 등록 당시의 코드 스냅샷 |
| `usedAt` | 사용 시각 |

### 3.3 rCoin 관련 테이블

Coupon 등록에서 `bonusRcoin > 0`이면 `ruCashBalances.bonusCash`가 증가하고, `ruCashTransactions`에 `type = charge`, `pgName = Coupon` 거래가 기록됩니다. 현재 `rewardItems`는 Coupon API 응답과 DB에 보존되지만, 게임 인벤토리 지급은 별도 게임 서버 연동이 필요합니다.

> **게임 서버 구현 필수 사항:** `rewardItems`를 실제 게임 우편함·인벤토리에 지급하는 작업은 현재 포털만으로 완료되지 않습니다. 게임 서버는 쿠폰 사용 성공 후 아이템 지급을 수행하고, 지급 결과를 중복 없이 기록해야 합니다.

---

## 4. 공통 요청 규칙

### 4.1 쿠폰 생성·수정 입력 객체

관리자 생성·수정 API의 공통 입력은 다음과 같습니다.

```ts
type CouponInput = {
  gameCode: string;                 // 예: "ROU"
  couponType: "common" | "random";
  eventName: string;                // UTF-8 기준 최대 20 bytes
  code: string;                     // 공용은 필수, 난수 신규 생성은 빈 문자열 허용
  validFrom?: string | null;        // ISO 8601 권장
  expiresAt?: string | null;
  serverCodes?: string | null;      // 예: "1,2,5"; null = 전체 서버
  bonusRcoin: number;               // 0 이상 정수
  rewardItems: Array<{
    itemId: string;
    quantity: number;               // 1 이상 정수
  }>;
  isActive: 0 | 1;
  randomGenerated: 0 | 1;
  issueQuantity: number;            // 1~500,000
};
```

보상 개수는 `Bonus rCoin`을 하나의 보상으로 계산하여 **총 1~5개**여야 합니다. 예를 들어 `bonusRcoin > 0`인 경우 `rewardItems`는 최대 4개입니다.

### 4.2 코드 규칙

```text
NNNN-NNNN-NNNN
```

각 블록은 대문자와 숫자 4자리입니다. 공용 쿠폰은 관리자가 직접 입력합니다. 난수 쿠폰은 서버가 자동 생성하며, 대량 발급 시 개별 행마다 고유 코드가 생성됩니다.

---

## 5. 관리자 Coupon API

### 5.1 이벤트 요약 목록 — `coupons.eventSummaries`

이벤트명 단위의 쿠폰 요약 목록을 반환합니다. 대량 발급된 난수 쿠폰도 SQL 집계로 조회하므로 전체 코드를 클라이언트로 가져오지 않습니다.

| 항목 | 값 |
|---|---|
| 인증 | `x-admin-key` 필요 |
| 입력 | `search?`, `startDate?`, `endDate?`, `page = 1`, `pageSize = 10` |
| `pageSize` | 1~100 |
| 검색 | 이벤트명, 게임 코드, 쿠폰 코드 |

**응답 예시**

```json
{
  "items": [
    {
      "id": 30001,
      "code": "A1B2-C3D4-E5F6",
      "eventName": "NEW YEAR GIFT",
      "gameCode": "ROU",
      "couponType": "random",
      "couponCount": 100000,
      "issueQuantity": 100000,
      "usedCount": 40000,
      "validFrom": "2026-09-01T00:00:00.000Z",
      "expiresAt": "2026-10-01T00:00:00.000Z",
      "bonusRcoin": 100000,
      "rewardItems": "[{\"itemId\":\"23084080\",\"quantity\":1}]",
      "serverCodes": "3",
      "isActive": 1,
      "status": "scheduled"
    }
  ],
  "total": 1
}
```

`status`는 날짜로 계산되는 `scheduled`, `active`, `expired`입니다. `isActive`는 별도로 운영자가 On/Off 하는 실제 사용 가능 제어값입니다.

### 5.2 개별 쿠폰 현황 — `coupons.list`

이벤트의 모든 개별 코드를 조회합니다. 사용된 코드는 사용일시·User ID·닉네임을, 미사용 코드는 `status = unused`를 반환합니다.

| 입력 | 설명 |
|---|---|
| `eventName?` | 특정 이벤트의 개별 코드 조회 |
| `search?` | 코드·이벤트·게임 코드 검색 |
| `startDate?`, `endDate?` | 생성일 기준 필터 |
| `page`, `pageSize` | `pageSize` 1~1,000 |

**개별 행 핵심 응답**

```json
{
  "id": 30001,
  "code": "A1B2-C3D4-E5F6",
  "eventName": "NEW YEAR GIFT",
  "couponType": "random",
  "usedAt": "2026-09-02T03:15:00.000Z",
  "userId": "42",
  "userNickname": "ValkyrieKnight",
  "status": "used"
}
```

### 5.3 이벤트 상세 — `coupons.eventDetail`

입력은 `{ "eventName": "NEW YEAR GIFT" }`입니다. 최신 행을 기준으로 게임 코드·보상·서버·기간·사용 수량을 반환합니다. 이벤트 정보를 별도 운영 도구에 표시할 때 사용합니다.

### 5.4 단건/이벤트 생성 — `coupons.create`

공통 `CouponInput`을 전달합니다.

| 쿠폰 타입 | 동작 |
|---|---|
| `common` | 입력한 단일 코드 1개 저장 |
| `random` | `issueQuantity`만큼 고유 난수 코드 생성 |

난수 대량 생성은 포털 UI가 `createRandomBatch`를 사용하므로, 외부 서비스에서는 아래 배치 API 사용을 권장합니다.

### 5.5 난수 배치 생성 — `coupons.createRandomBatch`

`CouponInput`에 다음 필드를 추가합니다.

```json
{
  "batchSize": 500,
  "totalQuantity": 100000
}
```

| 규칙 | 설명 |
|---|---|
| `couponType` | 반드시 `random` |
| `batchSize` | 1~1,000 |
| `totalQuantity` | 1~500,000. 전체 발급 수량 검증용 |
| 권장 배치 | 100,000개 이상은 500개, 그 외 250개 |
| 재시도 | 네트워크 오류 시 동일 배치는 최대 3회 재시도 권장 |

각 호출의 응답은 `{ "created": <batchSize> }`입니다. 외부 워커는 누적 생성 수를 독립 작업 테이블에 기록하고, 완료된 수만큼 다음 배치를 실행해야 합니다.

> 동일 배치를 재요청하면 새로운 난수 코드가 추가 생성될 수 있습니다. 재개 구현 시에는 요청 ID와 완료 수를 게임 서버 또는 작업 큐에 영속화하고, 이미 성공한 배치는 재전송하지 마세요.

### 5.6 이벤트 수정 — `coupons.update`

공통 `CouponInput`에 `id`를 추가합니다.

```json
{
  "id": 30001,
  "gameCode": "ROU",
  "couponType": "random",
  "eventName": "NEW YEAR GIFT",
  "code": "",
  "bonusRcoin": 100000,
  "rewardItems": [
    { "itemId": "23084080", "quantity": 1 },
    { "itemId": "4444444444", "quantity": 2 }
  ],
  "issueQuantity": 100000,
  "isActive": 1,
  "randomGenerated": 1
}
```

난수 이벤트 수정에서는 코드가 비어 있더라도 기존 대표 코드를 유지합니다. 보상·기간·서버·활성·수량 설정은 **해당 이벤트의 모든 개별 난수 쿠폰에 적용**되며 기존 각 코드 값은 변경하지 않습니다. 공용 쿠폰은 지정한 `id`의 단일 행을 수정합니다.

### 5.7 엑셀 업로드/갱신 — `coupons.bulkUpsert`

```json
{
  "items": [
    {
      "gameCode": "ROU",
      "couponType": "common",
      "eventName": "PARTNER GIFT",
      "code": "ABCD-EFGH-JKLM",
      "bonusRcoin": 100,
      "rewardItems": [],
      "issueQuantity": 1,
      "isActive": 1,
      "randomGenerated": 0
    }
  ]
}
```

한 요청에는 1~1,000개만 전달할 수 있습니다. 동일한 `code + eventName` 조합은 갱신됩니다. 외부 엑셀 처리기는 1,000행 단위로 분할 호출해야 합니다.

### 5.8 운영 제어 API

| Procedure | 입력 | 용도 |
|---|---|---|
| `coupons.updateEventActive` | `{ eventName, isActive: 0 \| 1 }` | 이벤트 전체 활성 On/Off |
| `coupons.delete` | `{ id }` | 단일 코드 삭제 |
| `coupons.deleteEvents` | `{ eventNames: string[] }` | 이벤트 전체 및 사용 이력 삭제 |
| `coupons.systemHistory` | 기간·AID·이벤트·페이지 | 전체 발급/사용 이력 조회 |
| `coupons.usageList` | `couponId?`, `used?`, 페이지 | 사용 또는 미사용 목록 조회 |

`deleteEvents`는 연결된 `couponUses`도 함께 삭제합니다. 운영 데이터 보존이 필요한 환경에서는 API 호출 전 별도 감사 로그 또는 백업을 권장합니다.

---

## 6. 서비스 My Page Coupon API

### 6.1 쿠폰 등록 — `coupon.redeem`

사용자 OAuth 세션이 필요합니다.

```json
{
  "code": "A1B2-C3D4-E5F6",
  "serverCode": "3",
  "characterName": "ValkyrieKnight"
}
```

**성공 응답**

```json
{
  "success": true,
  "eventName": "NEW YEAR GIFT",
  "couponCode": "A1B2-C3D4-E5F6",
  "bonusRcoin": 100000,
  "rewardItems": "[{\"itemId\":\"23084080\",\"quantity\":1}]"
}
```

**처리 순서**

1. 코드를 대문자로 정규화하고 개별 쿠폰을 찾습니다.
2. 활성 상태, 사용 기간, 사용 수량을 검증합니다.
3. `serverCodes`가 설정된 경우 선택 서버가 포함되는지 확인합니다.
4. 동일 코드의 재사용을 막고, 난수 쿠폰은 같은 이벤트의 계정당 중복 사용도 막습니다.
5. `couponUses`를 기록하고 `coupons.usedCount`를 1 증가시킵니다.
6. Bonus rCoin이 있으면 사용자 Bonus rCoin 잔액과 거래 이력을 갱신합니다.
7. 보상 아이템 정보를 응답합니다.

### 6.2 Coupon Use History — `coupon.myHistory`

입력은 `{ "page": 1, "pageSize": 20 }`이며 최대 페이지 크기는 20입니다. 로그인 사용자의 이력을 최신순으로 반환합니다.

```json
{
  "items": [
    {
      "id": 17,
      "eventName": "NEW YEAR GIFT",
      "couponCode": "A1B2-C3D4-E5F6",
      "characterName": "ValkyrieKnight",
      "registeredAt": "2026-09-02T03:15:00.000Z",
      "status": "Registered"
    }
  ],
  "total": 1
}
```

---

## 7. 오류 처리 계약

클라이언트는 tRPC 오류 메시지를 그대로 노출하지 말고 사용자 친화적인 화면 문구로 매핑하는 것을 권장합니다.

| 조건 | 현재 오류 메시지 | 권장 서비스 문구 |
|---|---|---|
| 로그인 세션 없음 | `Not authenticated` | Please sign in to use a coupon. |
| 코드 없음/비활성/기간 외/소진 | `This coupon code is invalid or unavailable.` | This coupon is invalid or unavailable. |
| 서버 불일치 | `This coupon code cannot be used on the selected server.` | This coupon is not available on the selected server. |
| 동일 코드 재사용 | `This coupon code has already been used.` | This coupon code has already been used. |
| 난수 이벤트 중복 | `This event coupon can only be used once per account.` | This event coupon can only be used once per account. |
| 보상 수 오류 | 보상은 1~5개 | Validate before calling the API. |
| 기간 역전 | 종료는 시작일 이후 | Validate date range before calling the API. |

---

## 8. 게임 서버 연동 권장 아키텍처

현재 포털 API는 포털 DB에서 사용 이력과 Bonus rCoin을 즉시 반영합니다. 실물 아이템 지급은 게임 서버가 담당해야 하므로, 다음 보상 전달 계약을 권장합니다.

1. 포털이 `coupon.redeem` 검증에 성공합니다.
2. 포털은 `couponId`, `userId`, `couponCodeSnapshot`, `serverCode`, `characterName`, `rewardItems`를 포함한 내부 지급 작업을 발행합니다.
3. 게임 서버는 `(couponId, userId)` 또는 `couponCodeSnapshot`을 멱등성 키로 삼아 우편함/인벤토리에 아이템을 지급합니다.
4. 게임 서버는 지급 성공·실패·재시도 상태를 별도 지급 로그에 기록합니다.
5. 실패 시 보상 재처리만 가능해야 하며, 포털의 쿠폰 중복 사용 검증을 우회해서는 안 됩니다.

**권장 지급 작업 메시지**

```json
{
  "idempotencyKey": "coupon:30001:user:42",
  "couponId": 30001,
  "couponCode": "A1B2-C3D4-E5F6",
  "eventName": "NEW YEAR GIFT",
  "portalUserId": 42,
  "serverCode": "3",
  "characterName": "ValkyrieKnight",
  "rewardItems": [
    { "itemId": "23084080", "quantity": 1 }
  ]
}
```

---

## 9. 구현 체크리스트

| 영역 | 필수 확인 사항 |
|---|---|
| 인증 | 관리자 API에는 `x-admin-key`, 서비스 API에는 로그인 세션 적용 |
| 난수 발급 | 250~500개 배치, 작업 수량 영속화, 재시도 시 중복 발급 방지 |
| 수정 | 난수 이벤트 수정은 코드를 유지하고 이벤트 전체 설정 갱신 |
| 사용 | 기간·활성·서버·중복·수량을 서버에서 재검증 |
| rCoin | Bonus rCoin 거래 이력과 잔액 변경을 같은 작업 단위로 처리 |
| 아이템 | 게임 서버 지급을 멱등 처리하고 별도 지급 상태 기록 |
| 관측성 | 생성 작업 ID, 이벤트명, 배치 번호, 성공/실패 수, 마지막 오류 기록 |
| 운영 | 이벤트 삭제 전 사용 이력 보존 정책과 백업 기준 확정 |

---

## 10. 구현 기준 파일

| 파일 | 역할 |
|---|---|
| `server/routers.ts` | `coupons.*`, `coupon.redeem`, `coupon.myHistory` API 계약 |
| `server/couponSystem.ts` | 쿠폰 코드·기간·보상 수 검증 및 상태 계산 |
| `drizzle/schema.ts` | `coupons`, `couponUses`, rCoin 관련 데이터 모델 |
| `client/src/pages/AdminPage.tsx` | 관리자 쿠폰 관리·대량 생성·엑셀 업로드 UI |
| `client/src/pages/MyPage.tsx` | 서비스 Coupon 등록·Coupon Use History UI |

> 외부 프로그래머가 API Gateway 또는 게임 서버 API를 추가할 때에는 이 문서의 논리 계약을 유지하고, 실제 공개 URL·토큰·서명 방식은 별도 보안 설계로 확정하세요.
