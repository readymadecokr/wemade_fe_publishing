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
