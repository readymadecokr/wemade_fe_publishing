# Ragnarok Universe 관리자 페이지 소스 패키지

이 패키지는 **관리자 페이지**를 중심으로 검토·수정·API 연동하기 위한 전체 실행 소스입니다. 관리자 UI는 `/admin` 경로이며, 주 구현 파일은 `client/src/pages/AdminPage.tsx`입니다. 관리자 API는 `server/routers.ts`, 권한 검증은 `server/_core/trpc.ts`와 `server/adminCredentials.ts`에서 확인할 수 있습니다.

## 빠른 실행

```bash
pnpm install
pnpm dev
```

로컬 환경 변수는 배포 환경과 별도로 설정해야 합니다. `DATABASE_URL`, `JWT_SECRET`, OAuth 관련 변수와 스토리지·API 키는 제공하지 않으므로, 별도 보안 채널로 전달받아 `.env`에 설정해야 합니다.

## 주요 화면과 코드

| 기능 | 경로 | 주요 파일 |
|---|---|---|
| 관리자 페이지 | `/admin` | `client/src/pages/AdminPage.tsx` |
| 쿠폰 관리 API | tRPC `coupon.*` | `server/routers.ts`, `server/couponSystem.ts` |
| 관리자 계정 인증 | tRPC `adminAccounts.*` | `server/adminCredentials.ts`, `server/_core/trpc.ts` |
| 데이터 스키마 | DB | `drizzle/schema.ts`, `drizzle/*.sql` |

> 이 패키지에는 서비스 페이지 파일도 함께 포함됩니다. 현재 프로젝트는 하나의 React 애플리케이션에서 관리자와 서비스를 라우팅으로 분리하기 때문입니다. 서비스 코드 삭제 없이 `/admin` 기능만 독립적으로 수정·빌드할 수 있습니다.
