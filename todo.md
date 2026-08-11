# Ragnarok Universe - TODO (원본 소스 기반 재구축)

## 소스 파일 교체
- [x] client/src/pages/ - 원본 소스 12개 페이지 전체 교체
- [x] client/src/components/Layout.tsx - 원본 소스로 교체
- [x] client/src/components/PrivacySettingsDialog.tsx - 원본 소스로 교체
- [x] client/src/components/ManusDialog.tsx - 원본 소스로 교체
- [x] client/src/App.tsx - 원본 소스로 교체
- [x] client/src/index.css - 원본 소스로 교체
- [x] client/src/const.ts - 원본 소스로 교체
- [x] client/index.html - 원본 소스로 교체
- [x] server/routers.ts, server/db.ts - 원본 소스로 교체
- [x] drizzle/schema.ts, relations.ts - 원본 소스로 교체
- [x] shared/const.ts, types.ts - 원본 소스로 교체

## 이미지 스토리지
- [x] 29개 이미지 파일 소스 참조 파일명(해시 포함)으로 manus-storage 업로드
- [x] 소스 코드 내 이미지 경로 62건 실제 업로드 경로로 일괄 치환 (7개 파일)

## DB 마이그레이션
- [x] files 테이블 마이그레이션 적용 (0001_steady_sentinel.sql)

## 검증
  - [x] TypeScript 타입 체크 통과
  - [x] vitest 테스트 통과 (auth.logout)
  - [x] 전체 페이지 시각 검증 (Home, News, Notice, GameInfo, PointShop, Login, NewsDetail, NoticeDetail)

## Shop (RU Cash) 개발
- [x] DB 스키마: ruCashProducts, ruCashTransactions, ruCashBalances 테이블 추가
- [x] 서버 API: shop 라우터 (상품 목록, 잔액 조회, 충전 내역, 사용 내역, 관리자 CRUD)
- [x] 프론트 Shop 페이지: 좌측 메뉴(현재 소지 상태/충전/구매 내역/사용 내역) + 충전 상품 8종 카드
- [x] 헤더에 RU Cash / Bonus RU Cash 잔액 표기 (로그인 후, 마이페이지 버튼 왼쪽)
- [x] 관리자 페이지: Shop 메뉴 추가 (상품 관리, 충전 내역, 사용 내역, 잔액 조회)
- [x] 관리자 Shop 상품 관리: 목록/등록/수정/삭제 (USD 기준가, RU Cash량, Bonus RU Cash량, 활성 여부, 순서)
- [x] 관리자 Shop 충전 내역: 목록 조회 (Excel 저장)
- [x] 관리자 Shop 사용 내역: 목록 조회 (Excel 저장)
- [x] 관리자 Shop 잔액 조회: 회원별 RU Cash / Bonus RU Cash 잔액 조회 + 수동 조정
- [x] 포인트 표기 규칙: 콤마 포함 최대 9자(예: 9,999,999), 소지 한도 적용
- [x] 타입 점검 및 체크포인트 저장
