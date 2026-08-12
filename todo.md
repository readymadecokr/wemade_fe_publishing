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

## Shop UI 개선 (PDF 5·12·14·16페이지 반영)
- [x] 서비스 헤더 캐시 표기: "RU Cash: 17,245 | Bonus RU Cash: 1,250 [ 마이페이지 ]" 형식으로 변경
- [x] 충전 상품 DB 업데이트: PDF 5페이지 기준 8종 ($1/$5/$10/$15/$20/$30/$50/$100, RUC/Bonus 값)
- [x] 충전 탭 UI: PDF 12페이지 - 상단 잔액 바(RU Cash | Bonus RU Cash), 상품 카드($금액/RUC/+Bonus 형식)
- [x] 구매 내역 UI: PDF 14페이지 - 컬럼(게임코드/TIME/충전전 RUC/충전전 Bonus/PG/Price/충전량 RUC/충전량 Bonus/충전후 RUC/충전후 Bonus)
- [x] 사용 내역 UI: PDF 16페이지 - 컬럼(게임코드/TIME/사용전 RUC/사용전 Bonus/Item Name/QTY/Item Price/Total Price/잔량 RUC/잔량 Bonus)

## 관리자 회원관리 상태 탭 개편
- [x] 상태 풀다운을 회원관리 상단 탭(회원 관리/이용 정지 관리/영구 정지 관리)으로 변경
- [x] 회원 관리 탭에서 전체 회원 목록 표시
- [x] 이용 정지 관리 탭에서 이용정지 회원만 목록 표시 및 CS Code 검색 추가
- [x] 영구 정지 관리 탭에서 영구정지 회원만 목록 표시 및 CS Code 검색 추가
- [x] 타입 검사 및 화면 동작 검증

## 관리자 회원관리 CS Code 보완
- [x] 이용 정지 관리·영구 정지 관리 목록에서 Nickname 오른쪽에 CS Code 표시
- [x] 제재 탭에서 Nickname 또는 CS Code로 통합 검색
- [x] 기존 이용정지·영구정지 회원은 기존 CS Code를 유지하도록 고정
- [x] 타입 검사 및 화면 동작 검증

## 관리자 회원관리 CS Code 누락 보완
- [x] 기존 이용정지·영구정지 회원의 누락된 CS Code 발급 및 저장
- [x] 제재 목록 조회 시 누락 CS Code 자동 보완 처리
- [x] 자동 보완 후 CS Code 표시·검색 및 타입 검사 검증

## 관리자 이용 제한 회원 관리 통합
- [x] 이용 정지 관리·영구 정지 관리를 이용 제한 회원 관리 탭으로 통합
- [x] 회원 관리 탭 검색 항목 풀다운: Nickname, User ID
- [x] 이용 제한 회원 관리 탭 검색 항목 풀다운: Nickname, User ID, CS Code
- [x] 타입 검사 및 API 동작 검증

## 관리자 회원 상세 이용제한 정보
- [x] 회원 관리 탭 검색 항목 풀다운에 CS Code 추가
- [x] 회원 관리 목록 Nickname 오른쪽에 CS Code 표시
- [x] 회원정보 조회 팝업의 이용정지 상태에 정지 기간 표시
- [x] 상태 하단 이용제한 이력 영역 및 예시 이력 데이터 추가
- [x] 타입 검사 및 데이터·화면 동작 검증
