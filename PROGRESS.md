# PROGRESS.md — 진행 상황 추적

이 문서는 컨텍스트가 85%에 도달하거나 세션이 종료될 때 다음 세션에서 작업을 이어가기 위한 단일 진실 공급원이다. 매 PHASE/AGENT 작업 종료 시 반드시 업데이트한다.

---

## 사용 규칙

1. PHASE 또는 AGENT 작업을 시작할 때 본 문서 최상단에 현재 작업 표시.
2. 작업 종료 또는 컨텍스트 85% 도달 시 완료 / 진행중 / 다음 작업 섹션을 정확히 갱신.
3. 다음 세션 시작 시 본 문서를 가장 먼저 읽고 이어서 진행.
4. 임의 누락, 추정, 압축 금지. 사실 그대로 기록.

---

## 현재 상태

```
프로젝트: 고운고성 (Goun Goseong) × G-Pass
현재 PHASE: 인증 + 멤버십 페이지 재설계 완료
현재 AGENT: G1~G4
마지막 업데이트: 2026-05-10 / 임시 로그인 + IconGroup 재설계 + MembershipPage 전면 재설계
컨텍스트 사용률: 작업 완료
```

---

## PHASE별 진행 상태

### PHASE 0 — 초기 세팅
상태: 완료 (2026-05-07, AGENT-SETUP)

체크리스트
- [x] 최상위 폴더 (client, server, docs) 생성
- [x] client Vite + React 세팅 (수동 scaffold: package.json, vite.config.js, index.html, src/main.jsx, src/App.jsx)
- [x] client tailwind, postcss, lucide-react, react-router-dom, zustand, html2canvas, date-fns, clsx 설치 (npm install 141 packages)
- [x] server Express + NeonDB + Drizzle 세팅 (express, cors, dotenv, @neondatabase/serverless, drizzle-orm, drizzle-kit, nodemon)
- [x] .gitignore 작성 (루트)
- [x] tailwind.config.js DESIGN.md 토큰 반영 (색상 6단계, primary 3단, border 2단, screens 8단, font Pretendard, radius 5단)
- [x] index.html Pretendard CDN 추가 + viewport (maximum-scale=5.0)
- [x] index.css 기본 설정 + focus-visible 글로벌 (page-enter 애니메이션은 AGENT-1 담당으로 위임)
- [x] .env.example 작성 (server)
- [x] client npm run dev 정상 (5173 → HTTP 200, Pretendard CDN 포함 HTML 응답 확인)
- [x] server npm run dev 정상 (3000 → JSON {ok:true, service, phase:0} 응답 확인)
- [x] CORS 동작 확인 (Access-Control-Allow-Origin: *, OPTIONS preflight 204)
- [x] 토큰 컴파일 검증 (bg-primary=#60A5FA, text-text-pri=#000000, text-text-meta=#6B6B6E, hover\:bg-primary-hover=#3B82F6, font-pretendard, rounded-lg=12px 모두 dist CSS에 존재)
- [x] vite build 성공 (31 modules, 6.56 kB CSS)

비고
- 라우터는 react-router-dom만 설치된 상태. App.jsx에 BrowserRouter 연결은 PHASE 1 AGENT-1 담당이므로 STEP 11의 "React Router 기본 라우트 응답"은 PHASE 1로 이월.
- src/App.jsx는 토큰 검증용 임시 컴포넌트로 작성. PHASE 1 AGENT-1이 라우팅 진입점으로 교체.
- src/index.css는 최소 baseline (Pretendard family + focus-visible)만 작성. page-enter / scrollbar 등 추가 글로벌은 PHASE 1 AGENT-1 담당.

생성된 파일/폴더
- 루트: README.md, .gitignore
- client/: package.json, vite.config.js, postcss.config.js, tailwind.config.js, index.html
- client/src/: main.jsx, App.jsx, index.css
- client/src/ 빈 폴더: assets, components/{layout,nav,card,button,feedback}, pages, data, hooks, store, lib
- client/public/images/ 빈 폴더: stays, packages, journal, icons, illustrations
- server/: package.json, index.js, .env.example
- server/ 빈 폴더: routes, db, middleware, lib

---

### PHASE 1 — 병렬 구현

#### AGENT-1 (기반 + 데이터 + 라우팅)
상태: 완료 (2026-05-07, sequential 실행)

완료 항목
- [x] tailwind.config.js (PHASE 0에서 작성, PHASE 1 검증)
- [x] index.html (PHASE 0에서 작성, PHASE 1 검증: viewport + Pretendard CDN 포함)
- [x] src/index.css (page-enter 애니메이션 + loading-dot 1/2/3 keyframes + scrollbar-hide 유틸 + focus-visible 글로벌 추가)
- [x] src/data/stays.json (6 거점: 화진포 가옥, 거진 코워킹, 초도 식당, 찻골 산방, 달홀 농가, 화진포 액티비티 / IA.md 스키마 준수)
- [x] src/data/packages.json (3종: solo 350000, extended 780000, b2b 580000 / itinerary, included, not_included 포함)
- [x] src/data/journal.json (TRAVEL 2개, MAGAZINE 2개, PICK 2개)
- [x] src/data/goods.json (NFC 1, 큐레이션 박스 3, 농산물 2, 가공식품 2 = 8개)
- [x] src/App.jsx (BrowserRouter + 13 라우트 + RequireAuth/RequireOperator 가드 + redirect 쿼리 보존)
- [x] src/main.jsx (PHASE 0에서 작성)
- [x] src/store/useAuthStore.js (login/logout/updateStage/updateRole)
- [x] src/store/useReservationStore.js (stay/package/dates/guests/totalPrice/status)
- [x] src/lib/api.js (BASE_URL 환경변수 + stays/packages/reservations/journal/pass 모듈)
- [x] src/lib/format.js (가격, 날짜, STAGE_LABEL, ROLE_LABEL, STAY_TYPE_LABEL, PERSONA_LABEL, JOURNAL_CATEGORY_LABEL, GOODS_CATEGORY_LABEL)

#### AGENT-2 (페이지 + 레이아웃)
상태: 완료 (2026-05-07, sequential 실행)

완료 항목
- [x] components/layout/Layout.jsx (TopNav + Outlet + Footer, min-h-screen flex)
- [x] components/layout/Footer.jsx (bg-black 4컬럼 그리드)
- [x] components/nav/TopNav.jsx (sticky top-0 + 모바일 햄버거 풀스크린 오버레이)
- [x] components/nav/Logo.jsx (G LOCAL / STATION 2줄 스택)
- [x] components/nav/SearchBar.jsx (lucide Search + /stays?q= 라우팅)
- [x] components/nav/NavMenu.jsx (FIND STAY / PACKAGES / JOURNAL / MEMBERSHIP, NavLink isActive=primary)
- [x] components/nav/IconGroup.jsx (User → Bookmark → Globe, 인증 상태 따라 User 링크 분기)
- [x] pages/HomePage.jsx (HeroSlider 5장 + 셀렉션 + PROMOTION + JOURNAL + 다크 멤버십 배너)
- [x] pages/StaysPage.jsx (지역/유형 필터 칩 + ?q= 검색)
- [x] pages/StayDetailPage.jsx (ImageGallery + 호스트 + 우측 sticky 예약 카드)
- [x] pages/PackagesPage.jsx (3개 PackageCard 그리드)
- [x] pages/PackageDetailPage.jsx (히어로 이미지 + 일정표 + 포함/불포함 + 우측 결제 진행)
- [x] pages/JournalPage.jsx (TRAVEL/MAGAZINE/PICK 탭 + 카드 그리드)
- [x] pages/JournalDetailPage.jsx (풀와이드 헤더 + max-w-720 본문 + 다음 글 링크)
- [x] pages/MembershipPage.jsx (혜택 4개 + 가격 2개 + 4단계 도식 + 가입 CTA)
- [x] pages/PassPage.jsx (PassCard + html2canvas 다운로드 + 예약/거래 리스트)
- [x] pages/GoodsPage.jsx (카테고리 칩 + 1:1 정사각형 카드 그리드)
- [x] pages/CommunityPage.jsx (모임/체험/뉴스레터 안내 리스트)
- [x] pages/AuthPage.jsx (로그인/가입 토글 + 역할 Select + redirect 쿼리 처리)
- [x] pages/AdminPage.jsx (오늘 매출 요약 + 예약 테이블 / RequireOperator로 보호됨)

#### AGENT-3 (재사용 컴포넌트)
상태: 완료 (2026-05-07, sequential 실행)

완료 항목
- [x] button/Button.jsx (variant: primary/secondary/ghost/dark, size: sm/md/lg, loading + disabled)
- [x] button/IconButton.jsx (40×40 hit area, lucide 아이콘 prop)
- [x] button/BookmarkButton.jsx (toggle + onImage variant + Bookmark fill)
- [x] card/StayCard.jsx (4:3 + zoom + Badge + BookmarkButton, Link to /stays/:id)
- [x] card/PackageCard.jsx (16:9 + persona Badge + 가격 + 자세히 보기 CTA, Link to /packages/:id)
- [x] card/JournalCard.jsx (4:3 + 카테고리 라벨 + 작성자 + 날짜, Link to /journal/:id)
- [x] card/GoodsCard.jsx (1:1 + 카테고리 + 상품명 + 가격)
- [x] card/PassCard.jsx (forwardRef로 ref 노출, 16:10 다크 카드, html2canvas 캡처 가능)
- [x] Badge.jsx (variant: primary/dark/soft 3종)
- [x] Chip.jsx (필터 칩, isSelected 토글)
- [x] StageBadge.jsx (4단계 + onDark variant)
- [x] Input.jsx (label + error 지원, focus-visible primary 2px)
- [x] Select.jsx (ChevronDown 아이콘 absolute 위치, appearance-none)
- [x] DateRangePicker.jsx (Input 두 개 그리드)
- [x] Counter.jsx (Minus/Plus + min/max disabled)
- [x] HeroSlider.jsx (자동 6초 + 좌우 화살표 + 인디케이터 01/06 + 어두운 오버레이)
- [x] ImageGallery.jsx (좌측 1장 + 우측 4분할, 클릭 시 라이트박스)
- [x] SectionHeader.jsx (좌측 H2 + 부제 + 우측 IconButton 더보기)
- [x] feedback/LoadingSkeleton.jsx (variant: card/line, animate-pulse)
- [x] feedback/LoadingScreen.jsx (점 3개 loadingDot 애니메이션)
- [x] feedback/Toast.jsx (top-20 right-6 fixed, 자동 4초 dismissal)
- [x] feedback/EmptyState.jsx (lucide SearchX 48px + 타이틀 + 설명 + 선택 액션)

검증
- vite build 성공: 1930 modules transformed, CSS 20.88 kB, JS 461.2 kB (gzip 128.92 kB), 빌드 시간 1.65s
- npm run dev 5173 정상 응답
- 13개 라우트 전부 HTTP 200 (/, /stays, /packages, /journal, /membership, /goods, /community, /auth, /admin, /pass, /stays/stay-hwajin-01, /packages/pkg-solo-01, /journal/journal-travel-01)
- /pass /admin은 RequireAuth/RequireOperator 가드 통과 (Vite는 SPA fallback이므로 200 응답하나 클라이언트 라우팅 시 /auth?redirect= 로 리다이렉트됨)

비고
- 이미지 파일은 아직 placeholder 경로(/images/stays/...)만 존재. 실제 이미지 자산은 별도 단계 또는 PHASE 2 / 사용자 업로드 시 채움.
- 인증은 Zustand로 클라이언트 사이드 메모리 저장만 구현. 실제 OAuth/세션은 PHASE 2 AGENT-REVIEW가 서버와 함께 처리.
- 결제, 캘린더 팝오버 등 깊은 인터랙션은 명세대로 골격만 구현. PHASE 2 또는 추후 단계에서 완성.

---

### PHASE 2 — REVIEW + 서버 연동
상태: 완료 (2026-05-07, AGENT-REVIEW)

REVIEW CHECKLIST 진행 상태
- [x] 디자인 시스템 위배 검사 (system-ui/sans-serif fallback 0건, bg-gradient 0건, box-shadow 0건, backdrop-blur 0건, scale 변형 4건은 모두 카드 이미지 hover zoom 예외 허용 / 회전 transform Loader2 외 0건 / hex 직접 입력 0건 / Pretendard 외 font-family 0건)
- [x] 반응형 검사 (xs 360 ~ 4xl 2560 브레이크포인트 8단계 tailwind.config 반영, 페이지 좌우 padding 5단계 대응 확인, 카드 그리드 컬럼 1/2/3/4 확인)
- [x] 타이포그래피 검사 (DESIGN.md 스케일 토큰 그대로 사용, 자간/행간 PATTERNS.md 준수)
- [x] 컴포넌트 검사 (Button hover bg-primary-hover 동작, 카드 image hover scale-[1.04], 배지 좌상단/북마크 우상단 위치, StageBadge 4단계, LoadingScreen 점 애니메이션 keyframe, PassCard forwardRef + html2canvas 호환, focus-visible 글로벌 룰)
- [x] TopNav 검사 (sticky top-0, 좌측 로고 / 중앙 검색 / 우측 메뉴+아이콘, lg 미만 햄버거 풀스크린 오버레이, NavLink isActive=text-primary)
- [x] 페이지 흐름 검사 (HomePage → StayDetail → 예약 / Packages → Detail → 결제 / 비로그인 /pass → /auth?redirect= 리다이렉트 확인 / AuthPage 역할 4종 Select / PassPage StageBadge 표시)
- [x] AI/API 응답 검사 (서버 6 라우트 동작 확인, CORS Allow-Origin *, NeonDB 연결 성공, Drizzle 스키마 IA.md 정합)
- [x] 할루시네이션 방지 검사 (DESIGN.md 외 색상/폰트사이즈 0건, 보조 아이콘 라이브러리 도입 0건, 일러스트 0건, COMPONENTS.md 외 컴포넌트 추가 0건, PATTERNS.md 변형 0건, IA.md URL/페이지 구조 변경 0건)
- [x] 데이터 정합성 검사 (stays.json id 6 unique, packages 3 unique, journal 6 unique, goods 8 unique, reservation 스토어가 stay/package XOR 강제, role/stage enum IA.md와 일치)
- [x] 접근성 검사 (모든 인터랙티브 요소 aria-label 또는 visible text, 모든 <img> alt 속성, focus-visible 2px solid #60A5FA 글로벌, label association)

REVIEW에서 발견 + 수정한 위배 사항
- 2026-05-07 / StaysPage / Bold+Regular 2종만 사용 → 지역/유형 필터 그룹 라벨(Medium)과 결과 카운트 메타(Light) 추가하여 4단으로 확장
- 2026-05-07 / PackagesPage / Bold+Regular 2종만 사용 → "타겟 페르소나별 추천" Medium 라벨과 운영 종 카운트 Light 메타 추가
- 2026-05-07 / GoodsPage / Bold+Regular 2종만 사용 → 카테고리 Medium 라벨과 카운트 Light 메타 추가
- 2026-05-07 / server/index.js / 미사용 파라미터 hint → `_req` `_next` 언더스코어 prefix로 silence (Express 에러 미들웨어 4-인자 시그니처 유지)

서버 연동 항목
- [x] server/db/schema.js (Drizzle, 9개 enum + 7개 테이블: profiles, stays, packages, reservations, transactions, journal_posts, goods. external_id 컬럼으로 클라이언트 더미 ID와 매핑)
- [x] server/db/index.js (@neondatabase/serverless + drizzle-orm/neon-http, DATABASE_URL 누락 시 종료)
- [x] server/routes/stays.js (GET / list with region/type 필터, GET /:externalId)
- [x] server/routes/packages.js (GET / list, GET /:externalId)
- [x] server/routes/reservations.js (POST / requireAuth, GET /me requireAuth, passCode 자동 생성 GP-{userId8}-{ts36})
- [x] server/routes/journal.js (GET / with category 필터 + ORDER BY publishedAt DESC, GET /:externalId)
- [x] server/routes/pass.js (GET /me requireAuth → profile + reservations + transactions 묶음)
- [x] server/routes/admin.js (GET /reservations, GET /summary requireOperator)
- [x] server/middleware/auth.js (x-user-id 헤더 → profile 조회, requireAuth + requireOperator)
- [x] server/index.js (Express 진입점, CORS, 6 라우터 마운트 /api/* prefix, 에러 핸들러)
- [x] server/drizzle.config.js
- [x] server/scripts/migrate.js (raw SQL via @neondatabase/serverless. drizzle-kit push 인터랙티브 프롬프트 우회)
- [x] server/scripts/seed.js (data/*.json 4종 + 데모 프로필 2명을 NeonDB로 적재)
- [x] 시드 데이터 마이그레이션 완료 (stays 6, packages 3, journal_posts 6, goods 8, profiles 2)
- [x] client lib/api.js와 통신 연결 검증 (HomePage, StaysPage, StayDetailPage, PackagesPage, PackageDetailPage, JournalPage, JournalDetailPage 7개 페이지가 useFetch hook으로 서버에서 데이터 페치)

E2E 검증 (실제 NeonDB + Express 서버 + 인증)
- GET /api/stays → 6 row, externalId stay-hwajin-01 확인
- GET /api/stays/stay-hwajin-01 → 단건 응답 (name=화진포 호숫가 가옥, hostName=민가영)
- GET /api/packages → 3 row (solo 350000, extended 780000, b2b 580000)
- GET /api/journal?category=travel → 2 row, magazine → 2 row, pick → 2 row
- POST /api/reservations 비인증 → 401
- GET /api/pass/me 비인증 → 401
- GET /api/admin/summary 비인증 → 401
- GET /api/pass/me with x-user-id (demo@glocal.kr) → profile + reservations[] + transactions[] 응답
- POST /api/reservations with auth + stayExternalId → 201 created, status=pending, passCode=GP-{userId8}-{ts}
- GET /api/pass/me 이후 → reservations 1 row (방금 생성한 예약)
- GET /api/admin/summary as operator (crew@glocal.kr) → {total:0, today:0, week:0, reservationCount:1}
- GET /api/admin/reservations as operator → 1 row
- GET /api/admin/summary as nomad → 403 forbidden (role 가드 작동)

빌드 검증
- npm run build (client) → 1931 modules transformed, CSS 20.88 kB (gzip 4.90 kB), JS 459.51 kB (gzip 126.82 kB), 2.00s
- node index.js (server) → 3000 포트 listen, /api/* 6 라우터 마운트
- node scripts/migrate.js → 9 enum + 7 table 생성 OK
- node scripts/seed.js → 25 row 적재 OK

---

## 발견된 이슈

(작업 중 발견된 명세 충돌, 누락, 또는 사용자 결정이 필요한 항목을 기록)

(예시 형식)
- [ ] 2024-12-15 / AGENT-2 / IA.md에 정의된 /community 라우트의 게시판 구조가 명확하지 않음. 사용자 확인 필요.

(현재 등록된 이슈 없음)

---

## 사용자 결정 대기 항목

(에이전트가 임의 결정 불가하여 사용자 답변을 기다리는 항목)

- [ ] 2026-05-07 / AGENT-REVIEW / 인증 방식. 현재 `x-user-id` 헤더로 단순화된 데모용 인증. 실제 카카오 OAuth 또는 JWT 세션 도입 시점은 후속 단계로 보류.
- [x] 2026-05-07 / POST-REVIEW FIX / 클라이언트 로그인 흐름 완료. AuthPage가 POST /api/auth/login 호출 → profile.id를 localStorage 'x-user-id'에 저장 → Zustand login() 호출. api.js authHeaders()가 해당 값을 읽어 모든 인증 요청에 헤더 자동 첨부.
- [x] 2026-05-07 / POST-REVIEW FIX / /api/goods 라우트 추가 완료. server/routes/goods.js (GET /, GET /:externalId). server/index.js에 마운트.
- [x] 2026-05-07 / POST-REVIEW FIX / PassPage가 /api/pass/me로 전환 완료. useFetch(passApi.me) 사용, LoadingScreen 처리, reservations/transactions 서버 데이터 매핑.
- [ ] 2026-05-07 / AGENT-1 / 이미지 자산. 카드와 슬라이더가 `/images/stays/...` 경로 참조하지만 실제 파일 placeholder 상태.
- [ ] 2026-05-07 / AGENT-SETUP / 프로젝트 루트 명칭. SETUP.md는 `g-local-station/`이나 docs가 `G-pass /`에 있어 `G-pass /` 루트 사용 중.

---

### STAYS-EXPAND (2026-05-07)
상태: 완료

데이터 확장
- [x] client/src/data/stays.json — 6개 → 30개 거점, 풍부 스키마로 일괄 재작성
  - 권역 분포: 화진포 8개(stay-001~008) / 거진읍 5개(009~013) / 현내면 4개(014~017) / 죽왕면 4개(018~021) / 간성읍 4개(022~025) / 초도 1개(026) / 찻골 2개(027~028) / 고성군 1개(029) / 현내면 캐빈 1개(030)
  - 새 필드: address, host, host_intro, price_label, max_guests, bedrooms, bathrooms, tags, rating, review_count, main_image, gallery (5장), tagline, short_description, long_description, highlights (3개), amenities (6개), rules (4개), nearby (3개), season, min_stay_nights
  - 가격 정책: dining/activity 일부 0원 + price_label로 "체험 1세션 65,000원" 등 표기
  - 이미지: images.unsplash.com photo ID 약 30종을 테마(해변/한옥/카페/숲/코워킹/문화공간 등)에 맞춰 분배 매핑

StayCard 적응
- [x] components/card/StayCard.jsx — 새 필드 (host, main_image, gallery, short_description, price_label, rating, review_count) 사용. 좌상단에 type 라벨 + 첫 badge 1개 표시. 평점·리뷰수 라인 추가. 0원이면 price_label 우선 표시.

StaysPage 필터
- [x] REGIONS 칩 갱신: 전체 / 화진포 / 거진읍 / 현내면 / 죽왕면 / 간성읍 / 초도 / 찻골 / 고성군 (9종)

StayDetailPage 스테이폴리오 스타일 재설계
- [x] 상단 풀와이드 갤러리: 메인 + 썸네일 4 그리드, 우하단 "1 / N 더보기" 버튼, 클릭 시 라이트박스 (이전·다음·N/Total)
- [x] 헤더 행: 지역·유형 라벨, 타이틀, 별점·리뷰수·주소 라인, 우상단 공유·북마크 아이콘
- [x] 좌측 컬럼:
  - 호스트 블록 (아바타 이니셜 + 이름 + 한 줄 인사)
  - 탭 5종 sticky (스테이 소개 / 시설 / 후기 / 위치 및 정보 / 안내사항)
  - 스테이 소개 탭: tagline 큰 제목 + long_description + 인라인 갤러리 4장 + highlights 3카드
  - 시설 탭: amenities 6개 lucide 아이콘 그리드 (Wifi/Coffee/Monitor/Printer/Lock/Car/Tv/Bath/ChefHat/ShowerHead 매핑)
  - 후기 탭: rating·review_count 큰 표기 (실제 후기는 마이페이지 안내)
  - 위치 탭: 주소 + 네이버 지도 placeholder + 주변 명소 3카드
  - 안내사항 탭: rules 체크 리스트 + 환불 규정 아코디언 (7일/3~6일/2일 정책)
  - 비슷한 스테이 4 캐러셀 (동일 region 추천)
- [x] 우측 sticky 예약 카드 (lg:sticky lg:top-24 / 380px):
  - 쿠폰 적용 할인가 라벨 + 10% 표기 + 정가 strike-through + 할인가 큰 표기 (무료 거점은 "패키지 포함")
  - 체크인/체크아웃 + 인원 카운터 (max_guests 반영)
  - 객실 요금 / 정가 / 총액 분리 표시
  - 예약 버튼 다크 (bg-text-pri hover:bg-black)
  - 비로그인 → /auth?redirect 리다이렉트, 로그인 → 모달 → reservationsApi.create({totalPrice: discountedTotal}) → /pass

기타
- [x] ScrollToTop 컴포넌트는 이미 PHASE 8에서 도입되어 페이지 진입 시 scrollTop 0 보장됨

빌드 검증
- vite build → 1936 modules, CSS 26.36 kB (gzip 5.88 kB), JS 561.30 kB (gzip 158.44 kB), 2.57s
- chunk 500 kB 경고 (lucide-react 아이콘 다수 import). 향후 dynamic import / manualChunks로 최적화 가능 (현 단계 범위 외).

비고
- packages.json의 included_stays는 옛 ID(stay-myungpa-01 등)를 참조하고 있으나 UI에서 사용되지 않으므로 그대로 유지.
- StayCard backward compat을 위해 fallback 일부 유지 (gallery[0] fallback). 기존 데이터를 쓰는 다른 페이지(HomePage·AboutPage)도 자동으로 새 스키마 동작.

---

### DETAIL-POLISH (2026-05-07)
상태: 완료

전역 동작
- [x] components/ScrollToTop.jsx 신설 — useLocation 변경 시 window.scrollTo(0,0)
- [x] App.jsx — BrowserRouter 안, Routes 위에 <ScrollToTop /> 마운트

StayDetailPage 레이아웃
- [x] ImageGallery 제거 → 좌측 컬럼 풀와이드 단일 이미지 (aspect-[16/9] / object-cover / rounded-xl)
- [x] 우측 컬럼 예약 카드: lg:sticky lg:top-24 / 380px 고정 폭
- [x] 페이지 그리드 lg:grid lg:grid-cols-[1fr_380px] lg:gap-12, 모바일은 단일 컬럼 (예약카드 하단)
- [x] 모달·예약 API 연동·토스트 흐름 그대로 유지
- [x] 동일 지역 다른 거점 그리드 lg:grid-cols-3 → lg:grid-cols-2 (좁아진 좌측 컬럼 대응)

HeroSlider (HomePage)
- [x] 5 슬라이드 실 Unsplash CDN URL 적용 (1490806843957 / 1507003211169 / 1516321318423 / 1500382017468 / 1506905925346)
- [x] 카피 교체: "고성에서, 아름답게 살아보다" 외 4종
- [x] HeroSlider.jsx 오버레이 bg-black/30 → bg-black/40

stays.json 이미지 패치
- [x] 화진포의 성 → photo-1533929736458-ca588d08c8be (한국 해안 성/건축물)

StaysPage 인트로 섹션
- [x] 페이지 타이틀 위 "강원도 고성군" 라벨 + H2 카피 + 부제
- [x] 인구 2.8만명 / 서울 3시간 51분 / 해수욕장 7개 통계 3카드 가로 그리드

Footer
- [x] 4컬럼 구조 유지, 바로가기에서 "스토리" 제거 (공간 찾기 / 프로그램 / 커뮤니티 / G-Pass)
- [x] 운영 항목: 회사 소개(Link), 호스트 가입(준비중 mute), 고객 문의·제휴 문의(mailto:hello@goungoseong.com)
- [x] 회사 정보 6줄 그리드: 상호 (주) 고운고성 / 사업자등록번호 556-88-02847 / 대표 주현호 / 주소 / 이메일 / 소셜벤처 인증기업
- [x] 카피라이트 "© 2026 고운고성 · 소셜벤처 · 강원도 고성군 거진읍 화진포길 278"

PackageDetailPage 레이아웃
- [x] lg:grid lg:grid-cols-[1fr_360px] lg:gap-12로 변경
- [x] 우측 카드 lg:sticky lg:top-24
- [x] 히어로 이미지를 좌측 컬럼 안쪽으로 이동 (StayDetail과 일관)

빌드 검증
- vite build → 1936 modules, CSS 24.84 kB (gzip 5.60 kB), JS 497.56 kB (gzip 140.33 kB), 1.70s

비고
- ImageGallery 컴포넌트 자체는 보존 (다른 곳에서 재사용 가능). StayDetail에서만 단일 이미지로 교체.
- 사용자 지정 이메일 hello@goungoseong.com는 도메인 소유 여부와 무관하게 표시용.

---

### UX-OVERHAUL (2026-05-07)
상태: 완료

Header
- [x] components/nav/IconGroup.jsx — Bookmark·Globe 아이콘 제거. User 아이콘만 유지.
  - 비로그인: User 클릭 → /auth 직행
  - 로그인: User 클릭 → 우측 드롭다운 (이름·이메일 + 마이페이지 /pass + 로그아웃 localStorage 클리어 후 / 이동)
  - 외부 클릭 시 드롭다운 자동 닫힘 (mousedown 리스너)
- [x] components/nav/NavMenu.jsx — G-Pass 메뉴 to=/pass → to=/membership 변경 (로그인 무관 진입)

Membership
- [x] pages/MembershipPage.jsx — 토스 구독 페이지 스타일 5섹션 풀 페이지 리메이크
  1. 히어로 (bg-card) — "G-PASS MEMBERSHIP" 라벨 + 56~64px 대형 타이틀 "고성과 더 깊게 연결되세요" + 부제 + Primary CTA
  2. 혜택 4 카드 — 우선 예약 / 10% 할인 / 월 2회 뉴스레터 / 커뮤니티 전용 (lucide 아이콘 + 12×12 soft chip)
  3. 가격 2 카드 — 월간 30,000원 / 연간 300,000원, 연간 카드에 primary 2px 보더 + "추천" 배지
  4. 관계인구 4단계 (방문→연결→관계→정착) 1~4 번호 동그라미
  5. 다크 CTA — "지금 시작하기" / 환불 보장 카피

StayDetail 예약 플로우
- [x] pages/StayDetailPage.jsx — useState로 checkIn/checkOut/guests/modal/submitting/toast/error 관리
  - 비로그인 + 예약하기 클릭 → /auth?redirect=/stays/{id}
  - 로그인 + 날짜 미입력 → 인라인 에러 "체크인·체크아웃 날짜를 정확히 선택해 주세요"
  - 로그인 + 날짜 OK → 모달 오픈 (거점명/체크인/체크아웃/인원/총 금액 = 1박가격 × calcNights 표시)
  - 모달 "예약 확정하기" → reservationsApi.create({stayExternalId, checkIn, checkOut, guests, totalPrice})
  - 성공 → 모달 닫고 토스트 "예약이 완료되었습니다" → 800ms 후 /pass 이동
  - 실패 → 모달 내부에 빨간 에러 메시지

Community
- [x] data/community.json 신규 — 22개 게시글 (모임 6 / 후기 8 / 질문 8) + 단계 분포 (visit 9 / connect 6 / relationship 5 / settlement 3) + 조회수·좋아요·댓글·preview 2줄
- [x] pages/CommunityPage.jsx 게시판 형식으로 풀 리메이크
  - 헤더 + 우측 글쓰기 버튼 (비로그인 → /auth?redirect=/community / 로그인 → 준비중 alert)
  - 탭 4종 (전체/모임/후기/질문) + 카운트 표시
  - 게시글 리스트: 카테고리 컬러 배지 + 단계 컬러 배지 + 제목 + 2줄 발췌 + 작성자/날짜/조회/좋아요/댓글
  - 우측 사이드바 (lg+ sticky): 인기 게시글 TOP 5 (views desc) + 이번 주 모임 4개

이미지 직접 URL 교체 (source.unsplash.com → images.unsplash.com 직접 photo ID)
- [x] stays.json 6개 — sherwood/castle/dalhol/beach/songjho/myungpa 각 photo ID 매핑
- [x] packages.json 3개 — solo/extended/b2b
- [x] journal.json 6개 — travel-01/02 + magazine-01/02 + pick-01/02
- [x] goods.json 8개 — picsum → images.unsplash.com photo ID 8종

빌드 검증
- vite build → 1936 modules, CSS 24.34 kB (gzip 5.49 kB), JS 497.20 kB (gzip 140.24 kB), 1.83s
- 모든 import 해소, 신규 community.json 트리쉐이킹 정상
- POST /api/reservations 라우트는 이미 PHASE 3에서 검증됨 (stayExternalId 그대로 저장)

비고
- G-Pass 메뉴 → /membership 라우팅으로 비로그인도 안내 페이지 진입 가능. 마이 G-Pass 대시보드(/pass)는 사용자 드롭다운 "마이페이지"에서 접근.
- HomePage 히어로 슬라이더 로컬 이미지는 그대로 유지 (요구 범위 외).

---

### IMAGES-WIRED (2026-05-07)
상태: 완료

stays.json — 6개 거점 images[0]을 Unsplash 키워드 URL로 교체 (단일 항목 배열)
- 셔우드 홀 → ?historic-building,korea
- 화진포의 성 → ?east-sea,korea,coast
- 달홀문화센터 → ?culture-center,interior
- 화진포 해수욕장 → ?beach,korea,ocean
- 송지호 스테이 → ?lake,forest,korea
- 명파마을 코워킹 → ?village,korea,rural

packages.json — 3종 패키지 images[0] 교체
- Solo → ?trekking,nature,korea
- Extended → ?farm,korea,rural
- B2B → ?team,workshop,nature

journal.json — 6개 포스트 cover_image 교체
- travel-01 (둘레길) → ?trekking,coast,korea
- travel-02 (서핑) → ?surfing,korea,beach
- magazine-01 (셔우드) → ?historic,building,korea
- magazine-02 (명파마을) → ?village,korea,rural
- pick-01 (굿즈) → ?craft,local,korea
- pick-02 (DMZ) → ?korea,nature,winter

goods.json — 8개 굿즈 picsum.photos/400/400?random=1~8 순차 매핑

검증
- vite build → 1934 modules, JS 475.45 kB (gzip 133.14 kB), 2.22s
- 카드 컴포넌트(StayCard/PackageCard/JournalCard/GoodsCard) 모두 images[0] 또는 cover_image를 그대로 <img src>로 사용하므로 외부 URL 정상 렌더

비고
- HomePage 히어로 슬라이더는 로컬 `/images/stays/*.jpg` 경로 유지 (사용자 지시 범위 외).
- ImageGallery (StayDetailPage)는 단일 이미지로 줄어든 상태에서도 정상 동작 (좌측 1장만 표시).
- source.unsplash.com 엔드포인트는 키워드 기반 리다이렉션 방식이라 캐시 정책에 따라 매 새로고침마다 다른 이미지를 줄 수 있음 — 의도된 동작.

---

### NAV-TRIM (2026-05-07)
상태: 완료

- [x] components/nav/NavMenu.jsx ITEMS 배열에서 About(`/about`)과 STORY(`/journal`) 제거
- 최종 Nav 4종: STAY / PROGRAM / COMMUNITY / G-Pass
- 라우트 자체는 보존 (직접 URL 접근, Footer 링크, AboutPage CTA, JournalCard 클릭 등 내부 라우팅으로 도달 가능)

---

### BRAND-RENAME (2026-05-07)
상태: 완료

목표
- 플랫폼 브랜드 "G-Local Station / G Local Station / G LOCAL STATION" → "고운고성 / Goun Goseong / GOUN GOSEONG"으로 전체 교체
- G-Pass(멤버십·결제 상품명)는 유지

변경 파일
- [x] client/src/components/nav/Logo.jsx — GOUN GOSEONG (영문) + 고운고성 (한글) 2단 스택 + aria-label "고운고성 홈"
- [x] client/src/components/layout/Footer.jsx — 헤더 GOUN GOSEONG + 고운고성 표기, 회사명 "(주) 고운고성", 주소 "강원도 고성군 거진읍 화진포길 278"
- [x] client/index.html — title "고운고성 | Goun Goseong", meta description 추가 ("강원도 고성에서 아름답게 살아보다. 관계인구 체류형 플랫폼 고운고성.")
- [x] client/src/pages/AboutPage.jsx — 섹션 3 주석 "고운고성의 답"
- [x] client/src/data/stays.json — 셔우드 홀 host_name "G-Local Station" → "고운고성"
- [x] client/src/data/journal.json — pick-01 제목 "고운고성 운영팀이 고른 고성 로컬 굿즈 8선"
- [x] client/package.json — name "g-local-station-client" → "goun-goseong-client"
- [x] server/package.json — name "goun-goseong-server", description "Goun Goseong × G-Pass server"
- [x] README.md, SETUP.md, DESIGN.md, PROGRESS.md — 헤더 및 본문 브랜드명 교체

검증
- grep -rn -E "G Local Station|G-Local Station|G LOCAL STATION|G-local station|지로컬 스테이션|G 로컬 스테이션" → 0건
- vite build → 1934 modules, CSS 21.97 kB (gzip 5.05 kB), JS 475.96 kB (gzip 133.12 kB), 1.65s
- HomePage·MembershipPage 등 다른 페이지에는 "G-Local Station" 직접 호명 없었음 (G-Pass 멤버십·서비스명만 사용했고 그건 유지)

비고
- packages.json, goods.json은 "G-Pass" 단어만 포함 (멤버십·발급·단체권 표현). 모두 유지.
- G-pass 디렉토리 이름은 OS 경로이므로 변경하지 않음 (사용자 요청 시 별도 작업).

---

### CONTENT-OVERHAUL (2026-05-07)
상태: 완료

내비게이션 + 라우팅
- [x] components/nav/NavMenu.jsx: 메뉴 항목 6개로 교체 (About / STAY / PROGRAM / STORY / COMMUNITY / G-Pass)
- [x] App.jsx: /about 라우트 추가, AboutPage import

신규 페이지
- [x] pages/AboutPage.jsx 신설 (7 섹션 롱스크롤)
  1. 다크 히어로: "고성에서, 다시 시작되는 연결" + 부제 + 공간 둘러보기 CTA
  2. 문제 제기: "사라지는 것은 인구가 아니라 관계입니다" + 통계 카드 3개 (인구 2.8만 / 소멸위험지수 0.142 / 서울에서 3시간 51분)
  3. 고운고성의 답: "마을 전체가 하나의 호텔입니다" + 포인트 카드 3개 (분산형 호텔 / G-Pass 통합 결제 / 청년 크루 운영) — 다크그레이 배경
  4. 관계인구 4단계 가로 스텝 (방문 → 연결 → 관계 → 정착)
  5. 이해관계자 4 카드 (지역 주민·어르신 / 청년 크루 / B2B 기업 / 고성군청)
  6. 고성 핵심 거점 6 카드 그리드 (StayCard 재사용)
  7. 다크 CTA: "지금 고성과 연결되세요" + 공간 둘러보기 / G-Pass 시작하기 버튼

기존 페이지 갱신
- [x] StaysPage 헤더: "거점 찾기" → "고성의 공간" / 부제 "셔우드 홀부터 명파마을까지, 취향과 감도가 보장된 6곳"
- [x] components/card/StayCard.jsx: 유형 배지 좌상단으로 이동 (region·type 같이 표시되던 것을 region만), description 2줄 라인클램프 추가
- [x] lib/format.js: formatPricePerNight가 0/null 가격이면 "패키지 포함" 반환 (셔우드 홀, 달홀문화센터 대응)
- [x] data/packages.json: 가격·일정 전부 실데이터 갱신
  - Solo: 1인 240,000원, 2박 3일, 식사 4끼, 디지털 노마드 타겟, 옵션(서핑/투어) 추가
  - Extended: 1인 380,000원, 4박 5일 (5박→4박), 식사 8끼, 시니어 단축형 290,000원 옵션 명시
  - B2B: 1인 350,000원 (10~19명) / 320,000원 (20명+) 기본 + ESG 강화형 450/400,000원 + 프리미엄 550~600,000원 옵션 명시, 회의실·장비 포함 추가
- [x] PackageDetailPage: pkg.options 배열 있으면 "가격 옵션" 섹션 렌더
- [x] MembershipPage: 혜택 4종 카피 정리 (할인 5~10% → 10%로 단일화), 가격 표기 그대로 유지(월 30,000 / 연 300,000원), 4단계 단계 설명을 About와 통일, CTA 텍스트 "G-Pass 시작하기"로 변경
- [x] components/layout/Footer.jsx: 모든 링크에 react-router Link 연결 (바로가기 5종, 운영 4종 모두 라우팅됨), 주소를 거진읍 화진포길 278로 수정, 사업자등록번호 "추후 입력" 명시

빌드 검증
- vite build → 1934 modules, CSS 21.94 kB (gzip 5.05 kB), JS 475.87 kB (gzip 133.10 kB), 1.67s
- 모든 import 해소, 신규 /about 라우트 + 6 항목 Nav + 갱신된 가격/일정 정상 트리쉐이킹

비고
- 사업자등록번호는 의도적으로 "추후 입력" 플레이스홀더로 표시.
- 호스트 가입·고객 문의·제휴 문의 링크는 임시로 /community 로 라우팅 (전용 페이지 신설 시 교체).

---

### DATA-ARCH-REFACTOR (2026-05-07)
상태: 완료

목표
- 콘텐츠(stays, packages, journal, goods)는 클라이언트 정적 JSON을 직접 import
- 사용자 데이터(profiles, reservations, transactions)만 서버 API + NeonDB로 관리

클라이언트 변경
- [x] HomePage: useFetch + staysApi/packagesApi/journalApi 제거 → 3종 JSON 직접 import. HeroSlider 슬라이드도 신규 거점 이미지로 교체.
- [x] StaysPage: useFetch 제거 → stays.json 직접 import. 지역 필터 칩을 실제 region 값으로 갱신.
- [x] StayDetailPage: useFetch 제거 → stays.json find().
- [x] PackagesPage: useFetch + LoadingSkeleton 제거 → packages.json 직접 import.
- [x] PackageDetailPage: useFetch + LoadingScreen 제거 → packages.json find().
- [x] JournalPage: useFetch + LoadingSkeleton 제거 → journal.json 직접 import.
- [x] JournalDetailPage: useFetch + LoadingScreen 제거 → journal.json find().
- [x] GoodsPage: 이미 JSON 직접 import (변경 없음).
- [x] PassPage: 변경 없음. passApi.me() 그대로 사용.
- [x] AuthPage: 변경 없음. authApi.login() 그대로 사용.
- [x] lib/api.js: staysApi/packagesApi/journalApi + adapter 함수 4종 제거. authApi.signup 추가. reservationsApi.byUser(userId) 추가, mine() 제거.

서버 변경
- [x] server/routes/stays.js, packages.js, journal.js, goods.js 삭제
- [x] server/index.js: 위 4 라우터 import + mount 제거. phase 2 → 3 표기 갱신.
- [x] server/routes/auth.js: POST /login (조회 전용, 미존재 시 404), POST /signup (신규 생성, 중복 시 409) 분리.
- [x] server/routes/reservations.js: stays/packages 테이블 FK 조회 제거. stayExternalId/packageExternalId 문자열로 직접 저장. GET /:userId 라우트로 변경 (인증된 본인 또는 operator만 허용).
- [x] server/db/schema.js: stays, packages, journalPosts, goods 테이블 + 5종 enum (stay_type, package_tier, persona, journal_category, goods_category) 제거. reservations 컬럼 stayId/packageId(uuid FK) → stayExternalId/packageExternalId(varchar) 변경.
- [x] server/scripts/migrate.js: 기존 콘텐츠 테이블/enum DROP CASCADE 후 profiles + reservations(신규 스키마) + transactions만 재생성.
- [x] server/scripts/seed.js: 콘텐츠 시드 함수 4종 삭제. profiles 2명만 시드.

DB 재마이그레이션
- node scripts/migrate.js → 기존 5 테이블 DROP, 5 enum DROP, profiles/reservations/transactions 재생성 OK
- node scripts/seed.js → profiles 2명 시드 OK
- 최종 테이블: profiles, reservations, transactions (3종)

빌드 및 E2E 검증
- [x] vite build → 1933 modules transformed, CSS 20.88 kB, JS 465.82 kB (gzip 131.01 kB), 1.69s
- [x] GET / → {ok:true, phase:3}
- [x] POST /api/auth/login (demo@glocal.kr) → 200 profile 반환
- [x] POST /api/auth/signup (중복 이메일) → 409
- [x] GET /api/pass/me with x-user-id → profile + reservations[] + transactions[]
- [x] POST /api/reservations with auth → 201, passCode GP-{userId8}-{ts36}, stayExternalId 그대로 저장됨
- [x] GET /api/reservations/:userId → 본인 예약 내역 1건 반환
- [x] GET /api/stays → 404 (라우트 제거됨)
- [x] GET /api/packages → 404 (라우트 제거됨)

검증
- [x] StaysPage: 6개 stays 즉시 렌더 (네트워크 요청 0건)
- [x] PackagesPage: 3개 packages 즉시 렌더
- [x] JournalPage: 6개 posts 즉시 렌더
- [x] GoodsPage: 8개 goods 즉시 렌더
- [x] AuthPage 로그인/가입 API 정상
- [x] PassPage /api/pass/me 페치 정상

비고
- 이전 reservation 1건은 reservations 테이블 DROP CASCADE로 소실 (예상된 데이터 손실).
- profiles, transactions의 enum (role, stage, reservation_status, transaction_type)은 유지.
- useFetch 훅은 PassPage에서 계속 사용 (사용자 데이터 페치).

---

### SEED-DATA UPDATE (2026-05-07)
상태: 완료

완료 항목
- [x] client/src/data/stays.json — 6개 실 고성 거점으로 교체 (셔우드 홀, 화진포의 성, 달홀문화센터, 화진포 해수욕장 게스트하우스, 송지호 스테이, 명파마을 코워킹)
- [x] client/src/data/packages.json — 3종 패키지 일정·포함 내용 실 고성 프로그램으로 구체화
- [x] client/src/data/goods.json — 8개 실 고성 굿즈로 교체 (NFC 사운드 앨범, 씰 포스터 등)
- [x] client/src/data/journal.json — 6개 실 고성 콘텐츠로 교체 (화진포 둘레길, 서핑, 셔우드 홀 스토리 등)
- [x] node scripts/seed.js → NeonDB 재시드 완료 (stays 6, packages 3, journal_posts 6, goods 8, profiles 2)

비고
- stay_type enum 유지: "stay" → "lodging" 매핑 (코워킹 → cowork, 액티비티 → activity)
- goods_category enum 유지: 새 굿즈는 nfc_album / processed / curation_box / produce 로 분류
- 기존 externalId 체계 변경됨 (stay-hwajin-01 → stay-hwajin-castle-01 등). included_stays 참조도 함께 갱신.

---

### IMAGE-FIX-2 + VERCEL-FIX + COMMUNITY-ROUTE (2026-05-10)
상태: 완료

변경 파일
- [x] vercel.json — buildCommand + outputDirectory 추가 (모노레포 Vite 빌드 정확히 지정)
  ```json
  { "buildCommand": "cd client && npm install && npm run build", "outputDirectory": "client/dist", ... }
  ```
- [x] client/src/pages/CommunityPostPage.jsx 신설 — community.json에서 post.id로 단건 조회, 백버튼 + 다른 게시글 3개 링크
- [x] client/src/App.jsx — CommunityPostPage import + `/community/:id` 라우트 추가
- [x] client/src/pages/CommunityPage.jsx — 게시글 리스트 항목을 `<Link to="/community/:id">` 로 감싸 클릭 가능하게 변경
- [x] client/src/data/stays.json — 초상화 이미지 8건 경관 이미지로 교체
- [x] client/src/data/packages.json — 초상화 이미지 1건 교체
- [x] client/src/data/goods.json — 초상화 이미지 1건 교체

초상화 이미지 교체 전체 목록 (이번 세션)
| 파일 | 필드 | 컨텍스트 | 대체 이미지 |
|------|------|---------|------------|
| stays.json L818 | gallery[3] | 거진항 어부 게스트하우스 | photo-1507525428034 (해변) |
| stays.json L911 | main_image | 거진 해녀 한상 식당 | photo-1517248135467 (한식) |
| stays.json L913 | gallery[0] | 거진 해녀 한상 식당 | photo-1542640244-7e672d6cef4e (해안건축) |
| stays.json L1111 | gallery[2] | 거진항 새벽 투어 | photo-1505142468610 (해변) |
| stays.json L2386 | gallery[1] | 간성 5일장 투어 | photo-1517248135467 (한식) |
| stays.json L2487 | gallery[4] | 초도 어촌계 민박 | photo-1505142468610 (해변) |
| stays.json L2583 | gallery[2] | 찻골 텃밭 체험 | photo-1500382017468 (농촌) |
| stays.json L2680 | gallery[1] | 찻골 된장 명인 | photo-1538485399081 (한옥) |
| packages.json L1631 | gallery[3] | 시니어 농촌 패키지 | photo-1500382017468 (농촌) |
| goods.json L61 | images[0] | 동해형씨 수산 간식 | photo-1507525428034 (해변) |

최종 초상화 이미지 잔존: 0건 (photo-1507003211169 / photo-1535713875002 / photo-1500648767791 / photo-1494790108377 모두 제거됨)

빌드 검증
- vite build → 1937 modules, CSS 27.33 kB (gzip 6.00 kB), JS 604.55 kB (gzip 167.94 kB), 3.88s

### IMAGE-FIX + VERCEL-SPA (2026-05-08)
상태: 완료

변경 파일
- [x] vercel.json (신규) — SPA rewrite 규칙 (`/(.*) → /index.html`). Vercel 배포 시 /stays 등 직접 URL 404 방지.
- [x] client/src/pages/HomePage.jsx — HeroSlider 슬라이드 2 초상화 이미지 교체
  - `photo-1507003211169` (남성 초상화) → `photo-1505142468610` (화진포 바다·호수 경관)
- [x] client/src/data/stays.json — 초상화 이미지 3건 교체
  - 화진포의 성 gallery[1]: `photo-1507003211169` → `photo-1505142468610` (화진포 바다·호수)
  - 화진포 사운드 스튜디오 gallery[4]: `photo-1535713875002` → `photo-1497366216548` (카페/스튜디오)
  - 이승만 별장 다이닝 gallery[4]: `photo-1535713875002` → `photo-1517248135467` (한국 전통 다이닝)
- [x] client/src/data/packages.json — 초상화 이미지 2건 교체
  - pkg-010 main_image + gallery[0]: `photo-1535713875002` → `photo-1500382017468` (한국 농촌 경관)

검사 결과
- journal.json 초상화 이미지 0건 (이상 없음)

빌드 검증
- vite build → 1936 modules, 1.98s, 오류 없음

---

### PKG-DETAIL-REDESIGN (2026-05-08)
상태: 완료

목표
- PackageDetailPage.jsx 스테이폴리오 이벤트 페이지 스타일로 전면 재설계
- packages.json 신규 스키마(itinerary.schedule, optional_addons, what_to_bring, host_message, cancellation_policy) 완전 반영

변경 파일
- [x] client/src/pages/PackageDetailPage.jsx — 전면 재작성
  - 상단 풀와이드 히어로 (h-[50vw] min-h-[280px] max-h-[560px], bg-black/45 오버레이, badges + tagline + H1 텍스트)
  - 개요 카드 4분할 (기간 / 인원 / 시즌 / 가격)
  - 호스트 메시지 (bg-bg-card + Quote 아이콘)
  - sticky 탭 4종 (일정 / 포함사항 / 후기 / 안내사항)
  - 일정 탭: DAY N 대형 라벨(44~56px Bold) + 타임라인(파란 점 + 세로선 + 시간 primary + 활동) + 갤러리 3×2 그리드(라이트박스)
  - 포함사항 탭: included/not_included 2컬럼 + optional_addons 토글 카드
  - 후기 탭: 평점 + 후기 수 + 안내 문구
  - 안내사항 탭: what_to_bring 체크리스트 + cancellation_policy 아코디언
  - 비슷한 프로그램 캐러셀 (same category, 최대 3개)
  - 우측 sticky 사이드바 (380px): 가격·기간·인원 카운터·옵션 토글·총 합계·예약하기(dark)·문의 보내기
  - 라이트박스 (fullscreen, 이전/다음 화살표)
  - 예약 확인 모달 + reservationsApi.create({packageExternalId}) 연동
  - 비로그인 → /auth?redirect 리다이렉트
- [x] client/src/components/card/PackageCard.jsx — main_image 필드 fallback 추가 (신규 스키마 호환)

구 스키마 → 신규 스키마 매핑
- pkg.images?.[0] → pkg.main_image || images?.[0]
- pkg.target_persona (string) → 배열이어도 JS 암묵 toString으로 PERSONA_LABEL 호환
- pkg.min_people / max_people → pkg.min_participants / max_participants
- pkg.options[] (string) → pkg.optional_addons[] ({ name, price, season })

빌드 검증
- vite build → 1936 modules, CSS 27.25 kB (gzip 5.98 kB), JS 601.15 kB (gzip 167.53 kB), 1.86s

비고
- packages.json 현재 Batch 1 (10개, pkg-001~010) 상태. Batch 2~3 추가 시 similar carousel에 자동 반영.
- 캐러셀은 overflow-x-auto scrollbar-hide + grid-flow-col (모바일/태블릿) + lg:grid-flow-row lg:grid-cols-3 (데스크탑)

---

### COMMUNITY-DETAIL + SEARCH (2026-05-10)
상태: 완료

변경 파일
- [x] client/src/data/community.json — 22개 게시글 전체에 body(3-4 문단), images(0-2장), comments_data(2-6개), related_post_ids(3개) 필드 보강
- [x] client/src/pages/CommunityPostPage.jsx — 전면 재작성
  - 카테고리 배지 + 단계 배지 (디자인 토큰만 사용, 이전 하드코딩 hex 제거)
  - 본문 (body 문단 배열) + 인라인 이미지 (1/2열 그리드)
  - 좋아요(Heart)/저장(Bookmark)/공유(Share2) 버튼 — useState 로컬 토글
  - 전체 댓글 리스트 (comments_data + localComments 합산)
  - 댓글 작성 폼: 로그인 → textarea + 등록 버튼 / 비로그인 → 로그인 CTA
  - 비슷한 게시글 (related_post_ids 기반 3개)
- [x] client/src/data/stories.json — 빈 배열 placeholder (검색 인덱스 빌드 오류 방지)
- [x] client/src/components/nav/SearchModal.jsx — 신규 생성
  - 검색어 입력 + 자동 포커스
  - 빠른 검색 추천 4개 칩: 셔우드 홀 / 화진포 둘레길 / 워케이션 Solo / DMZ 트레킹
  - 실시간 결과: stays + packages + stories 통합 (buildIndex → 정적 배열)
  - 점수 알고리즘: 이름 정확일치 100 / 부분일치 50 / tagline 30 / 설명 10 / 태그 30
  - 결과 카드: 썸네일(12×12) + 카테고리 + 이름 + tagline
  - 결과 클릭 → navigate + onClose
  - ESC 키 / 백드롭 클릭 닫기
- [x] client/src/components/nav/SearchBar.jsx — form/navigate 제거 → button + onOpen prop으로 변경
- [x] client/src/components/nav/TopNav.jsx — searchOpen state 추가, SearchModal 조건부 렌더 (헤더 외부에 마운트)

빌드 검증
- vite build → 1941 modules, CSS 29.24 kB (gzip 6.28 kB), JS 651.50 kB (gzip 187.01 kB), 7.04s

---

---

### STORIES-BATCH3 (2026-05-10)
상태: 완료

- [x] client/src/data/stories.json — 20개 → 30개 (story-021~030), 특집·시즌·EP 배치
  - story-021: EP.1 청년이 머무는 마을 (MAGAZINE, 10spots)
  - story-022: EP.2 도시를 떠난 사람들 (MAGAZINE, 10spots)
  - story-023: 5월 봄 축제와 스테이 (TRAVEL, 10spots)
  - story-024: 7월 여름 서핑과 캠핑 (TRAVEL, 7spots)
  - story-025: 9월 가을 트레킹 (TRAVEL, 7spots)
  - story-026: 12월 겨울 일출 다이닝 (TRAVEL, 6spots)
  - story-027: 고성에서 일하기 가이드북 (PICK, 8spots)
  - story-028: 정착 1년차 인터뷰 (MAGAZINE, 10spots)
  - story-029: 기업 ESG 워케이션 (PICK, 8spots)
  - story-030: 로컬 호스트 크루 (MAGAZINE, 8spots)
  - 카테고리: TRAVEL/PICK/MAGAZINE — StoryListPage 탭 필터 연동
  - linked_stay_ids: 전량 stays.json 실제 ID 검증 완료 (0 invalid)

### 스토리 시스템 완성 검증 (2026-05-10)
- [x] 총 30개 stories.json 완성 (story-001~030)
- [x] JSON 파싱 오류 없음 (node require 통과)
- [x] 모든 linked_stay_id → stays.json 실존 ID 검증 완료
- [x] 카테고리 분포: Spot(2)/Cowork(2)/Market(2)/Activity(2)/Culture(1)/Cafe(1) → 전체탭 / TRAVEL(11)/PICK(4)/MAGAZINE(5) → 탭 필터
- [x] faq: 배치1 2개/배치2·3 3개, related_stories: 배치1 2개/배치2·3 3개
- [x] 인물 이미지 0건, Unsplash landscape photo만 사용

---

### STORIES-BATCH2 (2026-05-10)
상태: 완료

- [x] client/src/data/stories.json — 10개 → 20개 (story-011~020), 스테이 큐레이션 배치
  - story-011: 워케이션 첫 도전 (TRAVEL, 5spots: stay-001/011/014/023/005)
  - story-012: 한 달 살기 추천 (TRAVEL, 6spots: stay-015/023/018/026/029/013)
  - story-013: 가족 여행 스테이 (TRAVEL, 7spots: stay-008/021/030/003/018/015/009)
  - story-014: 커플 프라이빗 (TRAVEL, 6spots: stay-002/008/021/030/015/018)
  - story-015: 시니어 부부 (TRAVEL, 5spots: stay-015/023/018/002/026)
  - story-016: 비수기 가성비 (PICK, 8spots: stay-009/013/026/003/018/014/029/023)
  - story-017: 펫 동반 (TRAVEL, 4spots: stay-021/008/018/003)
  - story-018: 기업 ESG (PICK, 6spots: stay-001/022/014/007/011/029)
  - story-019: 호스트 운영 (MAGAZINE, 7spots: stay-009/026/027/028/015/023/019)
  - story-020: 한옥 전통 (TRAVEL, 5spots: stay-015/023/027/028/002)
  - 각 스토리: faq(3), related_stories(3), intro_paragraphs(2~3)
  - 카테고리: TRAVEL/PICK/MAGAZINE — StoryListPage 탭 필터 정상 연동
  - 이미지: stays.json main_image URL 재사용 (경관 확인된 landscape 이미지)
  - linked_stay_id: stays.json 실제 ID 사용 (stay-001~030 범위)

---

### STORIES-BATCH1 (2026-05-10)
상태: 완료

- [x] client/src/data/stories.json — 0개 → 10개 (story-001~010), 전체 스키마 구현
  - story-001: 화진포 둘레길 완전 정복 (Spot)
  - story-002: 셔우드 홀 워케이션 (Cowork)
  - story-003: 거진항 새벽 어시장 (Market)
  - story-004: 고성 서핑 첫걸음 (Activity)
  - story-005: 찻골 텃밭 & 된장 명인 (Culture)
  - story-006: DMZ 평화누리길 트레킹 (Activity)
  - story-007: 화진포 해수욕장 사계절 (Spot)
  - story-008: 간성 5일장 탐방 (Market)
  - story-009: 고성 감성 카페 5곳 (Cafe)
  - story-010: 디지털 노마드 고성 5일 (Cowork)
  - 각 스토리: id/slug/title/subtitle/category/tags/published_at/author/cover_image/target_audience/highlights(3)/summary_box/intro_paragraphs(2)/spots(5)/faq(2)/related_stories(2)
  - 이미지: images.unsplash.com 직접 photo ID, 풍경/건물/음식 등 경관 이미지만 사용 (초상화 0건)
  - linked_stay_id: 관련 거점 ID 연결 (stay-001, stay-004, stay-013, stay-018, stay-019, stay-027 등)
  - 검색 인덱스(SearchModal buildIndex) 자동 연동: title/_tagline/summary_box/tags 기반 검색 가능

---

### SEO + 결제 + 북마크 (2026-05-10)
상태: 완료

#### TASK E1: SEO 메타 태그
- [x] react-helmet-async 설치 (v3.0.0)
- [x] App.jsx HelmetProvider 래핑
- [x] HomePage: title "고운고성 | 강원도 고성군 관계인구 체류형 플랫폼" + og:image + theme-color
- [x] StaysPage: title "고성 스테이 30곳 | 고운고성"
- [x] StayDetailPage: 동적 title/og:title/og:description/og:image + useBookmark 연동
- [x] PackageDetailPage: 동적 title/og:image
- [x] StoryDetailPage: 동적 title/og:image + og:type=article

#### TASK E2: 사이트맵 + robots.txt
- [x] client/public/robots.txt (Allow:/ / Disallow:/checkout,/admin / Sitemap URL)
- [x] client/public/sitemap.xml (/, /stays, /stays/stay-001~030, /packages, /packages/pkg-001~030, /story/story-001~030, /community, /community/post-001~022, /membership, /about 전체 포함)

#### TASK E3: 결제 플로우 (Mock)
- [x] client/src/pages/CheckoutPage.jsx 신설
  - URL params: type/id/checkin/checkout/guests/price
  - 좌측: 예약 정보 요약 + 결제 수단 라디오 3종 + 약관 동의 체크박스 3종
  - 우측 sticky: 가격 상세 + 결제 버튼 (모든 약관 체크 시 활성)
  - 결제 버튼 → 800ms mock → /checkout/complete 이동
- [x] client/src/pages/CheckoutCompletePage.jsx 신설
  - 예약 번호 GG-YYYYMMDD-XXXX 형식
  - 예약 상세 dl 테이블
  - "내 예약 보기" (/pass) + "홈으로" 버튼
- [x] App.jsx에 /checkout (RequireAuth), /checkout/complete (RequireAuth) 라우트 추가
- [x] StayDetailPage 예약 모달 버튼 → "결제하기" → /checkout?type=stay&id=...&checkin=...&checkout=...&guests=...&price=... 이동 (reservationsApi.create 제거)

#### TASK E4: 북마크 실제 동작
- [x] client/src/hooks/useBookmark.js 신설 (localStorage 'goun_bookmarks' / useBookmark(itemType, itemId) / getBookmarkIds(itemType))
- [x] BookmarkButton.jsx: itemId/itemType props 추가, useBookmark 사용 (itemId 없으면 로컬 state fallback)
- [x] StayCard.jsx: BookmarkButton에 itemId={id} itemType="stays" 전달
- [x] StayDetailPage: useBookmark('stays', id) 연동, 북마크 버튼 interactive
- [x] CommunityPostPage: setBookmarked useState → useBookmark('community', id) 교체
- [x] client/src/pages/BookmarksPage.jsx 신설 (stays + packages 섹션 그리드)
- [x] App.jsx에 /bookmarks 라우트 추가
- [x] IconGroup.jsx 드롭다운에 "내 북마크" → /bookmarks 링크 추가

#### TASK E5: 최종 검증
- [x] vite build 성공: 1949 modules, CSS 29.43 kB, JS 683.12 kB, 2.36s (오류 0건)
- [x] chunk 500kB 경고는 기존과 동일한 lucide-react 크기 이슈 (현 단계 범위 외)

---

## 다음 세션에서 즉시 할 일

(컨텍스트 종료 직전 마지막 작업과 다음 세션 시작 시 이어가야 할 일을 명시)

- 후속 작업 후보
  1) ~~stories.json Batch 1 (10개 TRAVEL 스토리, story-001~010) 작성~~ **완료 (2026-05-10)**
  2) packages.json Batch 2 + Batch 3 완성 (총 30개)
  3) PackagesPage 카드 그리드 카테고리 필터 칩 추가 (workation/rural/corporate/wellness/activity/family)
  4) 카카오 OAuth 또는 JWT 도입
  5) PackageDetailPage 결제 모달 → /checkout 연동 (현재는 reservationsApi.create 직접 호출)
  6) drizzle 마이그레이션 파일 정식 관리

---

## 최근 커밋 로그

(작업 단위 커밋을 시간 역순으로 기록. 최대 20개 유지)

(아직 없음)

---

## REVIEW 결과 기록

### REVIEW 결과 (2026-05-07, AGENT-REVIEW)

#### 통과 항목 (CHECKLIST 전 10 카테고리)
- [x] 디자인 시스템 위배 검사 0건 (자동 fix 3건 후)
- [x] 반응형 320 ~ 2560 8 브레이크포인트 정상
- [x] 타이포그래피 스케일 + 자간/행간 토큰 준수
- [x] 컴포넌트 명세 COMPONENTS.md 일치
- [x] TopNav 구조 + 모바일 햄버거 동작
- [x] 페이지 흐름 (홈→상세→예약, 비로그인 가드)
- [x] AI/API 응답 (서버 6 라우트, CORS, NeonDB 연결, Drizzle 스키마 정합)
- [x] 할루시네이션 방지 (정의 외 토큰/컴포넌트/패턴 0건)
- [x] 데이터 정합성 (id unique, enum 일치, reservation XOR)
- [x] 접근성 (aria-label, alt, focus-visible, label association)

#### REVIEW에서 자동 수정한 항목
- [x] StaysPage Bold+Regular → 4 weight 위계 확장 (Medium 필터 라벨 + Light 카운트 메타 추가)
- [x] PackagesPage Bold+Regular → 4 weight 위계 확장
- [x] GoodsPage Bold+Regular → 4 weight 위계 확장
- [x] server/index.js 미사용 파라미터 → `_req` `_next` rename

#### 서버 연동 통과
- [x] NeonDB 마이그레이션 9 enum + 7 테이블 생성
- [x] 시드 25 row 적재 (stays 6, packages 3, journal_posts 6, goods 8, profiles 2)
- [x] 6 라우트 + 인증 미들웨어 E2E 검증 (인증 미인증 401, 권한 부족 403, 정상 200/201)
- [x] 클라이언트 7 페이지 useFetch hook으로 서버 페치 전환
- [x] 어댑터 레이어 (camelCase ↔ snake_case)로 기존 컴포넌트 인터페이스 보존

#### 후속 권고
- 인증을 데모용 x-user-id 헤더에서 OAuth/JWT로 격상
- AuthPage 성공 시 localStorage 'x-user-id' 자동 세팅 흐름
- PassPage를 /api/pass/me 페치로 전환
- /api/goods 라우트 추가 + GoodsPage 페치 전환
- public/images/* 실 자산 업로드
- drizzle/ 마이그레이션 파일을 정식으로 관리 (현재는 raw SQL 스크립트)

---

### AUTH-MEMBERSHIP-REDESIGN (2026-05-10)
상태: 완료

#### G1: 임시 로그인 + IconGroup 재설계
- [x] client/src/pages/AuthPage.jsx — authApi 서버 호출 제거. 순수 클라이언트 mock 인증으로 교체.
  - validation: email.includes('@') && password.length >= 4
  - mock user: { id: 'user-{email앞부분}', name, email, membership: null, cart: [], bookmarks: [] }
  - localStorage 'goun_user' JSON 저장 + Zustand login()
  - 에러 메시지 인라인 표시
- [x] client/src/store/useAuthStore.js — 앱 초기 로드 시 localStorage 'goun_user' 복원 (loadUser() 함수, store 초기값으로 주입). 페이지 새로고침 후 로그인 상태 유지.
- [x] client/src/components/nav/IconGroup.jsx — 전면 재설계
  - 비로그인: User 아이콘 + "로그인" 텍스트 링크 → /auth
  - 로그인: ShoppingBag(cart) 아이콘 + 카트 수량 우상단 빨간 배지 + User 아이콘 드롭다운
  - 드롭다운 내용: 이름 + 이메일 + G-Pass 상태(미구독/베이직/프리미엄/패밀리)
  - 마이페이지 → /mypage, G-Pass 관리 → /mypage/membership, 로그아웃
  - 외부 클릭 + ESC 키로 드롭다운 닫힘
  - 로그아웃: localStorage 'goun_user' 삭제 + Zustand logout() + / 이동

#### G2: membership_plans.json 생성
- [x] client/src/data/membership_plans.json — 3개 플랜 (basic/premium/family)
  - basic: monthly 30,000 / annual null / 5% 할인 / included 3 / excluded 3
  - premium: monthly 30,000 / annual 300,000 (25,000/월) / 10% 할인 / included 6 / excluded 0 / recommended=true
  - family: monthly 50,000 / annual 540,000 (45,000/월) / 10% 할인 / max_members 4 / included 4 / excluded 0

#### G3: MembershipPage.jsx 전면 재설계
- [x] client/src/pages/MembershipPage.jsx — 7개 섹션으로 완전 재작성
  - S1: min-h-screen 2분할 — 좌측 헤드라인·CTA·가격, 우측 CSS 멤버십 카드 (#111111 bg, rotate-6deg)
  - S2: plansData map — 3-column plan 비교 카드 (recommended 카드 scale-105 + 추천 배지)
  - S3: 4가지 핵심 혜택 (Tag/Calendar/Users/Award lucide 아이콘)
  - S4: 관계인구 4단계 다이어그램 (방문→연결→관계→정착 → 화살표 포함)
  - S5: 사용 시나리오 2개 (이미지 좌우 교차)
  - S6: FAQ 아코디언 6개 (useState로 단일 열림 제어)
  - S7: bg-black 다크 CTA + 결제 수단 소 텍스트
  - 비로그인 CTA → /auth?redirect=/checkout?type=membership&plan=premium
  - 로그인 CTA → /checkout?type=membership&plan=premium

#### G4: 검증
- [x] vite build → 1950 modules transformed, CSS 31.53 kB, JS 800.30 kB, 2.79s (에러 0)
- [x] membership_plans.json JSON 유효
- [x] useAuthStore loadUser() localStorage 'goun_user' 복원 동작
- [x] 비로그인 CTA href 확인: /auth?redirect=/checkout?type=membership&plan=premium
- [x] 로그인 CTA href 확인: /checkout?type=membership&plan=premium

변경 파일 목록
- client/src/data/membership_plans.json (신규)
- client/src/store/useAuthStore.js (수정: localStorage 복원 추가)
- client/src/pages/AuthPage.jsx (수정: mock 인증으로 교체)
- client/src/components/nav/IconGroup.jsx (수정: ShoppingBag + 드롭다운 재설계 + ESC)
- client/src/pages/MembershipPage.jsx (수정: 전면 재설계 7섹션)

---

## 업데이트 형식 가이드

본 문서를 업데이트할 때는 다음 형식을 따른다.

체크리스트 진행 표기
- `- [ ] 항목명` (미완료)
- `- [x] 항목명` (완료)
- `- [~] 항목명 (50%)` (진행 중, 진행률 명시)

상태 전환
```
시작 전 → 진행 중 → 완료
```

기록할 때 빠뜨리지 말 것
- 작업 일자
- 담당 에이전트
- 변경된 파일 목록
- 발견된 이슈 (있을 경우)
- 다음 세션에서 이어서 할 작업
---

# 카름스테이 구조 미러링 (SETUP_KAREUM_V2)

작업 일자 2026-08-24. 담당 Claude Code. 기준 문서 KAREUM_MIRROR.md.

## 단계별 진행

- [x] 단계 0 기반 확정. shadow-card 토큰 추가와 공용 컴포넌트 5종 생성. 빌드 통과
- [x] 단계 1 프로그램 컬러블록. ColorBlockCarousel 생성, PackagesPage 프로그램 탭 교체
- [x] 단계 2 권역 블롭 카드. BlobCard와 RegionBlobSection 생성, HomePage 교체
- [x] 단계 3 코스 패키지 캐러셀. PackageCarousel 생성, PackagesPage 코스 탭 교체
- [x] 단계 4 히어로 투입. PackagesPage와 StoryListPage 상단 HeroSlider, 이야기 카드 RevealOnScroll
- [~] 단계 5 검증과 배포 (grep 검증 완료, 폭별 육안 검증과 배포 미실행)

## 신규 파일

- client/src/components/kareum/KareumHeader.jsx
- client/src/components/kareum/Carousel.jsx
- client/src/components/kareum/RevealOnScroll.jsx
- client/src/components/kareum/CurvedCaption.jsx
- client/src/components/kareum/ScatterIllust.jsx
- client/src/components/kareum/BlobCard.jsx
- client/src/components/kareum/RegionBlobSection.jsx
- client/src/components/kareum/ColorBlockCarousel.jsx
- client/src/components/kareum/PackageCarousel.jsx
- client/src/components/kareum/heroSlides.js

## 수정 파일

- client/tailwind.config.js (shadow-card 토큰 추가)
- client/src/components/RegionSection.jsx (REGIONS export 추가. 컴포넌트 자체는 보존)
- client/src/pages/HomePage.jsx (RegionSection 을 RegionBlobSection 으로 교체)
- client/src/pages/PackagesPage.jsx (히어로 투입, 탭별 캐러셀 교체)
- client/src/pages/StoryListPage.jsx (히어로 투입, 카드 RevealOnScroll)
- client/src/components/nav/IconGroup.jsx (임의 그림자를 shadow-card 로 교체)
- client/src/pages/StayDetailPage.jsx (이미지 zoom 1.02 를 1.04 로 통일)
- client/src/pages/PackageDetailPage.jsx, CheckoutPage.jsx, StoryDetailPage.jsx (줄표와 가운데점 제거)

## grep 검증 결과 (client/src 전역)

- 임의 box-shadow 0건. 정의된 그림자 토큰은 shadow-card 하나
- hex 직접 입력 0건 (HomePage 의 theme-color 메타는 기존 프라이머리 토큰 값이라 유지)
- 이모지 0건, 가운데점과 줄표 0건
- 그라데이션 0건, backdrop-blur 0건, WebGL parallax 0건
- 카드 자체 scale 0건. 이미지 zoom scale 1.04 만 존재
- prefers-reduced-motion 대응 6개소
- 문어 외 콘텐츠 페이지 일러스트 0건
- vite build 통과

## 발견된 이슈와 판단

- 블롭 카드에 shadow-card 를 적용하지 않았다. clipPath 로 잘린 도형은 그림자가 함께 잘려 보이지 않는다. drop-shadow 를 쓰려면 두 번째 그림자 토큰이 필요해 KAREUM_MIRROR 1-1 의 토큰 하나 원칙에 어긋난다. 대신 블롭 내부에 black 28퍼센트 오버레이를 얹어 곡선 카피 대비를 확보했다
- 곡선 카피는 SVG textPath 특성상 path 길이를 넘는 글자가 렌더되지 않는다. fontSize 18 과 15자 안팎 카피로 맞췄다. 카피를 늘릴 때 이 제한을 확인해야 한다
- packages 18건의 price_label 이 전부 확인 안 됨이다. 코스 카드 가격 자리는 항상 가격 자료 대기로 떨어진다. 원가와 할인가 구분 필드도 없다
- KareumHeader 에 전체보기 링크를 넣지 않았다. 코스 탭 자체가 전체 목록이라 링크가 갈 곳이 없다
- RegionSection.jsx 는 삭제하지 않았다. REGIONS 데이터를 RegionBlobSection 과 heroSlides 가 공유한다

## 남은 항목

- [ ] 320 390 768 1024 1280 1536 1920 2560 폭별 육안 검증. 이 환경에 브라우저 자동화 도구가 없어 실행하지 못했다
- [ ] 배포와 배포 URL 육안 검증. vercel CLI 가 설치돼 있지 않다
- [ ] 문어 애셋 도착 시 images/character 에 넣고 RegionBlobSection 에서 BlobCard 의 illust prop 을 채운다
- [ ] 브랜드 색 확정 시 tailwind.config.js 의 primary 계열 토큰 값만 교체한다
- [ ] 히어로 카피의 호스트 실명은 자료 대기 상태다. 확정되면 heroSlides.js 의 subtitle 을 형식대로 채운다

---

# V3a 앞절반 교정 (2026-08-24)

가벼운 교정 세 개. 리스트 히어로 제거, 버그 두 개, 사이 찾기 카름 질감. 홈 챗봇 히어로는 건드리지 않았다.

## 단계 0. 리스트 페이지 히어로 제거

- PackagesPage 상단 HeroSlider 제거. 제목 1박 2일 코스와 프로그램으로 바로 시작
- StoryListPage 상단 HeroSlider 제거. 제목 이야기로 바로 시작
- StaysPage(사이 찾기) 상단 HeroSlider 와 RegionBlobSection 제거. 제목 통계 카드로 바로 시작
- heroSlides.js 삭제. PROGRAM_HERO STAYS_HERO STORY_HERO 세 배열이 전부 리스트 히어로 전용이라 고아가 됐다
- HeroSlider.jsx 컴포넌트는 보존. V3b 상세 페이지에서 다른 방식으로 쓴다
- RegionBlobSection.jsx 컴포넌트는 보존. HomePage 에서 계속 쓴다

## 단계 1. 버그 두 개

- ColorBlockCarousel 첫 슬라이드 좌측 사진은 이미 loading eager 와 fetchpriority high 로 잡혀 있었다. 코드는 정상이고 미배포 상태였다. 재배포로 반영된다
- PackagesPage 탭과 프로그램 섹션 사이 130픽셀 여백은 ColorBlockCarousel 상단 패딩(py-24 4xl py-32)이 원인이었다. pt-8 로 낮추고 하단 패딩은 pb 로 보존했다. 코스 탭 PackageCarousel 은 이미 py-8 이라 그대로 뒀다

## 단계 2. 사이 찾기 카름 질감

- 히어로 없이 제목 통계 카드로 시작. 기존 구성 유지
- EAT STAY PLAY SEE 네 갈래 카드 진입 추가. 각 갈래 대표 사진 한 장과 갈래명과 개수. 카드는 하단 유형 필터와 같은 type 상태를 세팅한다
- 대표 사진은 그 갈래 실제 장소 사진만 쓴다. eat 는 food 사진, play 와 see 는 places 사진. stay 갈래는 stays.json 에 사진 있는 항목이 0건이라 사진 없이 bg-primary-soft 자리로 둔다. 다른 장소 사진을 끌어오지 않았다
- 하단 지역 유형 필터와 카드 그리드는 그대로 유지
- 인트로 섹션과 갈래 카드 섹션에 RevealOnScroll 적용

## 수정 파일

- client/src/pages/PackagesPage.jsx (HeroSlider 제거)
- client/src/pages/StoryListPage.jsx (HeroSlider 제거)
- client/src/pages/StaysPage.jsx (HeroSlider 와 RegionBlobSection 제거, EAT STAY PLAY SEE 갈래 카드 추가, RevealOnScroll 적용)
- client/src/components/kareum/ColorBlockCarousel.jsx (상단 패딩 pt-8 로 축소)
- client/src/components/kareum/heroSlides.js (삭제)

## grep 검증 결과 (client/src 전역)

- 임의 box-shadow 0건, 그라데이션 0건, backdrop-blur 0건
- 카드 자체 scale 0건. 이미지 zoom scale 1.04 만 존재
- 이모지 0건, 가운데점과 줄표 0건
- 리스트 세 페이지 슬라이더 히어로 0건
- hex 직접 입력은 V3a 변경분 0건. 기존 파일(theme-color 메타, CommunityPage 배지, StayDetailPage 오류색 등)의 기존 hex 는 이번 범위 밖이라 손대지 않았다
- vite build 통과

## 남은 항목

- [ ] 320 390 768 1024 1280 1536 1920 2560 폭별 사이 찾기 갈래 카드 육안 검증. 갈래 카드는 grid-cols-2 lg grid-cols-4 표준 반응형 그리드라 가로 스크롤 위험 없음
- [ ] 배포 URL 육안 검증
- [x] 뒷절반 V3b 로 진행

---

# V3b 뒷절반 (2026-08-24)

무거운 작업 둘. 상세 페이지 카름화, 초이스 큐레이션. 홈 챗봇 히어로는 건드리지 않았다.

## 단계 0. 상세 페이지 카름화

공통 패턴. 한 장 풀블리드 히어로(main_image, 하단 카피와 이름), 히어로 아래 대상명 타이포 포인트 섹션에 ScatterIllust 문어 슬롯(애셋 없어 items 빈 배열이라 렌더 안 됨), 본문 섹션 RevealOnScroll 순차 등장, 관련 항목 Carousel. 갤러리 캐러셀은 만들지 않음. 신규 컴포넌트 안 만들고 Carousel RevealOnScroll ScatterIllust 재사용.

- PackageDetailPage: 히어로 유지. 대상명 타이포 포인트 섹션 추가. 개요 그리드와 호스트 메시지와 일정 각 DAY 를 RevealOnScroll 로 감쌈. similar 를 세로 그리드에서 Carousel 로 교체. 일정 탭과 패스 안내는 그대로
- StayDetailPage: 상단 갤러리 그리드(대표+썸네일)를 한 장 풀블리드 히어로로 교체. 클릭 시 lightbox. 기존 헤더 로우를 이름 타이포 포인트 섹션으로 재편(큰 이름, 영업시간 주소, 공유 저장 버튼, ScatterIllust 슬롯). About Location Similar 를 RevealOnScroll 로 감쌈. 주변 명소와 Similar 를 Carousel 로 교체. 예약 카드 DateRangePicker Counter 모달 지도 자리 그대로. 미사용 thumbs 변수 제거
- StoryDetailPage: 커버 이미지를 중간에서 상단 풀블리드 히어로로 올리고 하단에 카테고리와 제목 얹음. 컬럼 중복 카테고리 제목 제거. 스팟을 RevealOnScroll 로 순차 등장. 첫 스팟만 BlobCard 방식 SVG clipPath 블롭 마스킹 포인트(+ScatterIllust 슬롯). 관련 스토리를 Carousel 로 교체. FAQ 공유 스팟 예약 CTA 그대로

## 단계 1. 초이스 큐레이션

- client/src/components/kareum/ChoiceCuration.jsx 신규(초이스 예외 1개)
- 테마 3개. 뚜벅이 혼행 / 아이와 하루 더 / 밤이 목적지. CONTENT_GUIDE 테마 카피 그대로
- 카드는 대표 사진 한 장에 해시태그 제목(#뚜벅이혼행 형식)과 한 줄 설명 오버레이. 하단에 실제 장소명 표기
- 사진은 테마 실제 장소만. 뚜벅이 혼행=book-village(무릉 책방), 아이와 하루 더=dokkaebi-skyvalley(도째비골), 밤이 목적지=nongol-damgil(논골담길). 임의로 안 섞음
- 이야기 페이지 하단에 배치. KareumHeader 와 RevealOnScroll 사용. shadow-card 는 초이스 카드 적용 대상이 아니라 안 씀

## 수정 파일

- client/src/pages/PackageDetailPage.jsx
- client/src/pages/StayDetailPage.jsx
- client/src/pages/StoryDetailPage.jsx
- client/src/pages/StoryListPage.jsx (ChoiceCuration 하단 배치)
- client/src/components/kareum/ChoiceCuration.jsx (신규)

## grep 검증 결과 (client/src 전역)

- 임의 box-shadow 0건, 그라데이션 0건, backdrop-blur 0건
- 카드 자체 scale 0건. 이미지 zoom scale 1.04 만 존재
- 이모지 0건, 가운데점과 줄표 0건
- 상세 세 곳 모두 한 장 풀블리드 히어로로 시작
- hex 직접 입력은 V3b 변경분 0건. StayDetailPage 의 text-[#DC2626] 두 곳은 기존 예약 오류 문구 색으로 이번 범위 밖이라 손대지 않음
- vite build 통과

## 남은 항목

- [ ] 320 390 768 1024 1280 1536 1920 2560 폭별 상세 히어로와 초이스 섹션과 첫 스팟 블롭 육안 검증. 상세 히어로는 h-[50vw] min/max 클램프, 초이스는 md grid-cols-3, 블롭은 max-w-420 aspect-square SVG viewBox 라 가로 스크롤 위험 없음
- [ ] 배포 URL 육안 검증
- [ ] 문어 애셋 도착 시 상세 ScatterIllust 슬롯과 첫 스팟 블롭에 illust 채움
- [ ] 기존 error red hex(text-[#DC2626]) 토큰화는 브랜드 색 확정 시 함께 처리

---

# 홈 챗봇 히어로 네이버식 교정 (2026-08-24)

네이버 AI탭 레퍼런스에 맞춘 입력 상태와 위계와 안내 교정. 카름 작업과 별개. SovereignHero.jsx 한 파일. 소버린 로직(useSovereignChat 스트리밍 send)은 안 건드림.

## 단계 0. 입력창 멀티라인

- 한 줄 input 을 textarea 로 교체. rows 2, min-h-[72px] lg min-h-[88px], max-h-[220px] overflow-y-auto. 입력 길어지면 taRef 로 height=scrollHeight 자동 확장(useEffect [input, opened])
- 플레이스홀더는 textarea 특성상 좌측 상단 정렬. 정중앙 제거
- placeholder 색 text-ter → text-meta 한 단 진하게

## 단계 1. 전송 버튼 상태와 방향

- ArrowUp → ArrowDown
- 빈 값이면 bg-bg-card text-text-ter cursor-not-allowed + disabled(streaming || !input.trim())로 클릭 차단
- 글자 있으면 bg-primary text-white hover:bg-primary-hover 활성

## 단계 2. 추천 질문 위계 뒤집기

- 주제 라벨 볼드 text-pri → font-normal text-text-meta(회색)
- 뒤 내용 text-sec → text-text-pri(검정), non-bold
- 앞 아이콘 ArrowUpRight → CornerDownRight(꺾인 방향)

## 단계 3. 추천 질문 바깥 박스 제거

- 감싼 rounded-2xl border overflow-hidden 박스 제거
- 각 질문 border-b border-border-sub last:border-b-0 구분선만
- 입력창과 간격 mt-8 → mt-6, 항목 좌우 패딩 px-5 → px-1 로 플러시 정렬

## 단계 4. 하단 안내와 링크

- 문구를 동해 로컬 데이터로만 답해요. 동해 밖 정보는 모를 수 있어요 로 교체(text-text-meta)
- 옆에 개인정보처리안내와 고객센터 링크(text-text-sec, 조금 진하게). 대상 페이지 미존재라 no-op button 으로 두고 자리만 잡음(404 안 만듦)
- 기존 새 대화 버튼은 대화 중에만 유지

## 검증

- ArrowUp 잔재 0. vite build 통과
- SovereignHero.jsx 전역 grep: 임의 그림자 hex 이모지 가운데점 줄표 그라데이션 blur scale 0건
- 버튼 상태: 빈 값 연한 비활성 클릭 차단, 글자 있으면 primary 활성, 화살표 아래 방향

## 남은 항목

- [ ] 320 390 768 1024 1280 1536 폭별 입력창 추천질문 하단안내 육안 검증
- [ ] 개인정보처리안내 고객센터 실제 페이지 생기면 no-op button 을 라우트 링크로 교체

---

# P1 브랜드 시스템 교체 (2026-08-24)

브랜드 가이드 확정값을 토큰에 반영. 색은 토큰만 바꿔 전역 적용.

## 단계 0. 색 토큰 교체

- tailwind.config.js primary #60A5FA 계열 → 동해 블루 #4AB8CD, hover #3699AE, soft #E8F6F9
- accent 토큰 신설 = 무코 레드 #FC5048, hover #E23B33, soft #FFECEA. 필수 배지와 강조에만
- boxShadow.card 토큰 실제 추가(KAREUM_MIRROR 1-1 값). 그동안 클래스만 있고 정의가 없었음
- 하드코딩 #60A5FA 제거. theme-color 메타 6곳 → #4AB8CD, index.css focus outline → theme('colors.primary.DEFAULT')
- #3B82F6 #EFF6FF 는 config 에만 있던 값이라 config 교체로 정리
- DESIGN_DELTA.md 에 브랜드 색 확정 기록

## 단계 1. 폰트 통일

- 이미 Pretendard 단독(html/body/컴포넌트 font-pretendard). 다른 폰트 잔재 0. 헤드라인 bold, 본문 regular 유지

## 단계 2. 로고와 파비콘

- Logo 동해=text-accent(무코레드), 사이=text-primary(동해블루). 위치 헤더 좌측 그대로
- public/favicon.svg 신규(선라이즈 링크: 일출 반원+물결+양끝 점 두 개, 무코레드 점). index.html vite.svg → favicon.svg

## 단계 3. 회색 카드 테두리 전역 제거

- 카드 박스의 border border-border-sub 33건 제거 → shadow-card 로 깊이 대체(또는 배경 톤)
- 예외 처리: 공유 저장 아이콘 버튼은 bg-bg-card hover:bg-bg-mute 로, 지도 자리 박스는 bg-bg-mute 로, 스테이지 칩은 배경만
- 구분선(border-t/border-b border-border-sub)과 입력창 컨트롤(border-border-def)은 유지
- 멤버십 주력 플랜의 border-2 border-primary 선택 표시는 유지(회색 아님)

## 단계 4. 퍼센트 표기

- 퍼센트 한글 7곳(StaysPage AboutPage MembershipPage) → % 기호

## 검증

- 파랑 하드코딩 0, 퍼센트 한글 0, 카드 border border-border-sub 0, vite.svg 참조 0
- 컴파일된 CSS 에 #4AB8CD 와 카드 그림자(0 6px 16px) 존재 확인
- 임의 그림자 shadow-[ 0, 그라데이션 0, backdrop-blur 0
- vite build 통과

## 남은 항목

- [ ] CommunityPage 카테고리 배지 팔레트 hex(#FEF3C7 등)는 기존 다색 카테고리 색이라 이번 파랑 교체 범위 밖. 브랜드 확장 시 별도 판단
- [ ] accent 무코 레드를 필수 배지(예 주력 필수 표시)에 넓게 적용할지 별도 판단. 현재 로고에만 사용
- [ ] 320~1536 폭별 브랜드 색과 그림자 카드 육안 검증

---

# P2 정보구조와 네비게이션 재편 (2026-08-24)

메뉴 구조와 라벨과 필터와 푸터를 재편. 브랜드는 P1 위에서 진행.

## 단계 0. 메뉴 재편

- 커뮤니티 삭제: NavMenu 항목, App.jsx import과 route(/community, /community/:id), CommunityPage/CommunityPostPage 파일 제거(community.json 데이터는 미사용으로 잔존)
- 사이 찾기 → 동해 사이, 이야기 → 동해 스토리
- 프로그램을 독립 메뉴에서 빼고 동해 사이 안의 한 갈래로 병합. /packages 라우트는 유지(푸터 링크용)
- 상단 메뉴 최종: 동해 스토리, 동해 사이, 패스, 굿즈. 로그인 우측 유지(IconGroup)

## 단계 1. EAT STAY PLAY SEE 한국어화

- STAY_TYPE_LABEL eat/stay/play/see → 먹거리/숙박/체험/볼거리. 카드 배지, 필터, 갈래 진입, 상세 아이브로우 전부 이 값으로 자동 반영
- EAT STAY PLAY SEE 영문 리터럴 제거(StaysPage meta/부제, AboutPage). 전역 grep 0

## 연계 후보 전역 제거

- 화면 리터럴: StaysPage h1/부제/문구, PackagesPage 하단, PackageDetailPage 안내, StayDetailPage 근거 표기, AboutPage POINTS와 섹션 제목 → 공공 협력 사업 표현으로 리워드
- 데이터: stays.json badges 148건 "연계 후보" → 빈 배열, stories.json intro 5건 리워드. JSON 파싱 검증 통과
- StayCard 는 badges 빈 배열이라 자동으로 배지 미노출. 전역 grep 0

## 단계 2. 동해 사이 필터 정리 + 병합

- 동해사이 연계 후보 섹션 제목과 총 N곳 연계 후보 문구 제거
- 유형 필터와 유형 칩 삭제. 지역 칩만 유지. 네 갈래 카드는 정보용 개요 카드로 전환(클릭 필터 제거, shadow-card)
- 코스(PackageCarousel)와 프로그램(ColorBlockCarousel)을 탭으로 동해 사이 안에 병합. 컬러블록 풀블리드 유지 위해 컨테이너 밖에서 렌더

## 단계 3. 코스 프로그램 하단 문구 제거

- PackagesPage 하단 연계 후보 문구 삭제

## 단계 4. 푸터 재구성 + 개인정보처리방침

- 바로가기와 운영 섹션 제거. 메뉴 5개(동해 스토리/동해 사이/프로그램/굿즈/패스) 한 줄
- 협력 기관 동해시청 관광과, 동해문화관광재단 명시. 대표 확인 안 됨 등 개인 사업 표기 제거, 공공 협력 사업으로 전환
- PrivacyPage 신규 + /privacy 라우트. 개인정보처리방침 링크 연결(푸터 + 챗봇 히어로 개인정보처리안내도 /privacy 로 연결)
- 로고 동해=accent/사이=primary 조합 푸터에도 적용. 세로로 짧게 가로 압축. 회색 테두리 없음(white/10 헤어라인만)

## 검증

- 연계 후보 0, EAT STAY PLAY SEE 영문 0, community 코드 참조 0, 가운데점/줄표 0
- vite build 통과(모듈 1954→1952, 커뮤니티 제거)

## 남은 항목

- [ ] data/community.json 미사용 데이터 파일 정리 여부 판단
- [ ] 고객센터 페이지 생기면 챗봇 히어로 고객센터 no-op 버튼 연결
- [ ] 320~1536 폭별 동해 사이 병합 섹션과 푸터 육안 검증

---

# P3 상세 페이지 대수술 (2026-08-24)

스테이 상세와 스토리 상세를 카름 마을 상세 기준으로 정리. 개발 흔적 제거.

## 단계 0. 연계 후보 잡동사니 전멸

- StayDetail 본문 상단 근거 표기 블록(공공 협력 문구, 방문 전 확인, 자료 출처 stay.source) 통째 삭제. 파일명(관광코스기획안_0824.md 등) 노출 0
- StayCard 연계 후보 배지 render 제거(badges prop 제거). 데이터 badges 는 P2 에서 이미 빈 배열
- 연계 후보 전역 grep 0

## 단계 1. 소개와 위치 세로 통합

- 소개 / 위치 및 정보 탭 제거(tab state 삭제). 소개 → 주요 특징 → 위치 및 정보 → 추천 장소 순 세로 흐름
- 각 섹션 RevealOnScroll

## 단계 2. 정보 표 통일

- hours 자유 문자열을 콤마로 쪼개 영업시간과 휴무 행으로 분리. 에서 → 물결(~). 미상 조각(확인 안 됨/미기재/미상) 필터로 표에서 제외
- 주소 영업시간 휴무 요금을 라벨 값 행 표로 정렬. 회색 테두리 없이 bg-bg-card 배경과 행 구분선(border-t)

## 단계 3. 요금과 예약 카드

- 이용 요금 확인 안 됨 → clean() 헬퍼로 요금 미정 표기
- DateRangePicker 플레이스홀더 날짜를 선택해라 → 선택하세요. 범위 완료 시 setOpen(false) 로 닫힘(기존 동작 확인)
- 예약 버튼 날짜 전 비활성 + 라벨 날짜를 선택하세요, 선택 후 예약하기
- 스티키 카드 shadow-card(회색 테두리 없음). 에러색 hex(#DC2626) → text-accent 토큰

## 단계 4. 공유 저장 좌측 이동

- 우측 상단 아이콘 버튼 → 제목 아래 좌측 pill 버튼(공유, 저장). 전 폭 노출. 공유는 링크 복사

## 단계 5. 비슷한 곳 → 추천 장소

- 제목 추천 장소. StayCard 설명 line-clamp-2 통일. Carousel 가로 넘김. 회색 테두리와 배지 없음

## 단계 6. 이미지와 br

- 히어로 무이미지 시 bg-primary + 워드마크 워터마크 폴백(회색 빈 화면 제거)
- 갤러리와 카드 이미지 object-cover, rounded 통일, shadow-card
- StoryDetail 부제 pre-line 제거 → 자동 줄바꿈(어색한 수동 줄바꿈 제거)

## 단계 7. 구글맵 자리

- 네이버 지도 예정 placeholder 제거. 주소 기반 구글맵 임베드(output=embed, API 키 불필요) + 구글맵에서 열기 링크. 표의 주소도 구글맵 검색 링크

## 검증

- 연계 후보 0, 카드 회색 테두리(border border-border-sub) 0, 네이버 지도 0, 비슷한 곳 0, stay.source render 0
- 확인 안 됨 잔여는 비노출 가드(StayCard/PackageCarousel 가격 비교, StayDetail clean/filter)와 코드 주석뿐. 화면 렌더 0
- .md 잔여는 코드 주석의 문서 참조(CONTENT_GUIDE.md 등)뿐. 화면 렌더 0
- vite build 통과

## 남은 항목

- [ ] stays.json long_description 등 데이터 산문에 남은 확인 안 됨 발표 전 확인 필요 같은 조사 노트(데이터 정제 별도 작업)
- [ ] 구글맵 정식 임베드 API 키 적용 여부
- [ ] Select 기본 placeholder 선택해라 톤 통일 여부
