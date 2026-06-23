# Ragnarok Universe Homepage - WebDev 마이그레이션 TODO

## 분석
- [x] 기존 프로젝트 구조/설정/의존성 상세 분석 (App.tsx, vite.config, tsconfig, const.ts 등) - tsconfig/alias 공통(동일) 확인
- [x] 기존 vs WebDev 템플릿 차이 분석 (순수 프론트엔드/localStorage mock, 백엔드 미사용)

## 에셋 마이그레이션
- [x] client/public/images 사용 이미지 33개 WebDev 스토리지 업로드 완료
- [x] 이미지 경로 매핑 테이블 생성 (48개 참조 -> 스토리지) /tmp/final_replace.txt

## 설정/스타일/공유 파일
- [x] index.css (테마/Tailwind 토큰/애니메이션) 마이그레이션
- [x] client/index.html (Poppins 폰트/메타/한글 lang/타이틀) 마이그레이션
- [x] 의존성 점검 (기존 deps 전부 WebDev 템플릿에 포함됨 - 추가 설치 불필요)
- [x] ThemeContext/hooks/lib/utils/ErrorBoundary 템플릿과 동일 확인
- [x] shared/const.ts 호환 확인 (COOKIE_NAME/ONE_YEAR_MS 일치)
- [x] drizzle schema files 테이블 추가 및 마이그레이션 적용 (CREATE TABLE files 성공)

## 페이지/컴포넌트 마이그레이션
- [x] 페이지 12개 복사: Home, Login, MyPage, Notice, NoticeDetail, News, NewsDetail, GameInfo, PointShop, PrivacyPolicy, TermsOfService, CookiePolicy
- [x] NotFound 페이지 복사
- [x] 커스텀 컴포넌트 복사: Layout, Map, ManusDialog, PrivacySettingsDialog
- [x] App.tsx 라우팅 구성 (기존과 동일한 12개 라우트 + 404)
- [x] client/src/const.ts 미사용 확인 (WebDev const.ts 유지)
- [x] 이미지 경로 일괄 치환 (총 62건, /images/ -> /manus-storage/)
- [x] 괄호 포함 파일명 2건 수동 치환

## 검증
- [x] TypeScript 타입 체크 통과 (pnpm check)
- [x] 개발 서버 정상 구동 (포트 3000)
- [x] 옛 프로젝트 dev 서버 종료 (포트 충돌 해소)
- [x] 전체 페이지 시각 검증 (Home/News/NewsDetail/Notice/GameInfo/PointShop/Login/정책)
- [x] 이미지 스토리지 서빙 200 OK 확인
- [x] 남은 /images/ 참조 0건 확인

## 마무리
- [x] 단위 테스트(vitest) 통과 (auth.logout)
- [x] 최종 타입 체크 통과
- [x] 체크포인트 저장 (version 86ebfe1e)
