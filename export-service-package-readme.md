# Ragnarok Universe 서비스 페이지 소스 패키지

이 패키지는 **사용자 서비스 페이지**를 중심으로 검토·수정·API 연동하기 위한 전체 실행 소스입니다. 서비스 페이지는 Home, News, Game Info, Shop, My Page 및 Coupon 기능으로 구성됩니다.

## 빠른 실행

```bash
pnpm install
pnpm dev
```

로컬 환경 변수는 별도로 설정해야 합니다. `DATABASE_URL`, `JWT_SECRET`, OAuth 관련 변수와 스토리지·API 키는 보안상 포함하지 않았습니다.

## 주요 화면과 코드

| 기능 | 경로 | 주요 파일 |
|---|---|---|
| Home | `/` | `client/src/pages/Home.tsx` |
| 로그인·가입 | `/login` | `client/src/pages/Login.tsx` |
| My Page·Coupon | `/mypage` | `client/src/pages/MyPage.tsx` |
| Shop | `/point-shop` | `client/src/pages/PointShop.tsx` |
| 사용자 Coupon API | tRPC `coupon.redeem`, `coupon.myHistory` | `server/routers.ts` |
| 공통 UI·스타일 | 서비스 전체 | `client/src/components/Layout.tsx`, `client/src/index.css` |

> 이 패키지에는 관리자 페이지 파일도 함께 포함됩니다. 현재 프로젝트는 하나의 React 애플리케이션에서 서비스와 관리자 라우트를 함께 관리하기 때문입니다. 서비스 전용 수정은 `/admin` 외 라우트와 위 파일을 중심으로 진행하면 됩니다.
