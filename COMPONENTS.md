# COMPONENTS.md — 컴포넌트 명세 및 재사용 패턴

이 문서는 컴포넌트 트리, 컴포넌트별 스펙, 그리고 자주 쓰이는 JSX 패턴을 함께 다룬다. PATTERNS 영역은 별도 문서가 아니라 본 문서 후반부에 통합되어 있다.

---

## 컴포넌트 트리

```
App
├── Layout
│   ├── TopNav
│   │   ├── Logo
│   │   ├── SearchBar
│   │   ├── NavMenu
│   │   └── IconGroup (User, Bookmark, Globe)
│   ├── Outlet (페이지 콘텐츠)
│   └── Footer
├── HomePage
│   ├── HeroSlider
│   ├── SectionHeader
│   ├── StayCardGrid
│   ├── PackagePromoBlock
│   ├── JournalPreviewBlock
│   └── MembershipBanner
├── StaysPage
│   ├── FilterSidebar (데스크탑)
│   ├── FilterChipBar (모바일)
│   └── StayCardGrid
├── StayDetailPage
│   ├── ImageGallery
│   ├── HostBlock
│   ├── DescriptionBlock
│   └── ReservationCard
├── PackagesPage
│   └── PackageCardGrid
├── PackageDetailPage
│   ├── DayItinerary
│   ├── IncludedList
│   └── CheckoutButton
├── JournalPage
│   ├── JournalTabs (TRAVEL / MAGAZINE / PICK)
│   └── JournalCardGrid
├── JournalDetailPage
│   ├── CoverImage
│   └── ArticleBody
├── MembershipPage
│   ├── BenefitList
│   ├── PriceCard
│   └── StageDiagram
├── PassPage [auth]
│   ├── PassCard
│   ├── StageBadge
│   ├── ReservationTimeline
│   └── TransactionList
├── GoodsPage
│   └── GoodsCardGrid
├── CommunityPage
├── AdminPage [operator]
│   ├── ReservationTable
│   ├── RevenueOverview
│   └── PayoutCalculator
└── AuthPage
    ├── LoginForm
    └── SignupForm (역할 선택)
```

---

## Layout 영역

### Layout.jsx
역할: 전체 페이지 컨테이너.

스펙
- `<div>` width 100%
- 자식: TopNav + Outlet + Footer
- min-height 100vh
- bg-white

### TopNav.jsx
역할: 글로벌 네비게이션 바.

스펙
- 좌측: Logo (스택형 STAY-FOLIO 스타일 차용 가능, 또는 가로 G-LOCAL STATION)
- 중앙: SearchBar (어디로 떠날까요? placeholder)
- 우측: NavMenu + IconGroup
- 높이: 80px (lg 이상), 60px (md 이하)
- 배경: bg-white, 하단 1px solid border-border-sub
- sticky top-0, z-40
- 모바일: 검색바를 햄버거 메뉴로 접고, 클릭 시 풀스크린 검색 오버레이

### Logo.jsx
- 텍스트 로고 G LOCAL / STATION (2줄 스택) 또는 G-LOCAL STATION (가로)
- font-bold tracking-tight
- 클릭 시 / 이동

### SearchBar.jsx
- height 48px (데스크탑) / 40px (모바일)
- bg-bg-card, rounded-full
- 좌측 lucide Search 아이콘
- placeholder: 어디로 떠날까요?
- focus-visible: outline 2px solid primary

### NavMenu.jsx
4개 항목: FIND STAY, PACKAGES, JOURNAL, MEMBERSHIP.
- font-medium, 14px (데스크탑), uppercase 또는 한국어 (혼용 금지, 통일)
- 항목 간 gap 32px
- 활성 라우트는 text-primary, 비활성은 text-text-pri
- hover 시 text-primary로 100ms 전환
- 모바일: 햄버거 메뉴 안에 세로 정렬

### IconGroup.jsx
순서: User → Bookmark → Globe.
- 각 아이콘 lucide-react 24px
- 버튼 hit area 40×40px
- hover: 배경 bg-bg-card, rounded-full

### Footer.jsx
- bg-black, text-white
- padding-y 64px (lg 이상) / 40px (모바일)
- 4개 컬럼 (lg 이상) / 1컬럼 stack (모바일)
- 회사 정보, 빠른 링크, 법적 고지, SNS

---

## 카드 컴포넌트

### StayCard.jsx
역할: 거점 카드.

스펙
- 이미지 비율 4:3 또는 16:9 (그리드 통일)
- 이미지 좌상단: Badge (마감할인, 프로모션, 단독소개)
- 이미지 우상단: BookmarkButton
- 이미지 hover: 1.04 zoom 600ms
- 이미지 아래 16px 패딩
- 카테고리/지역 메타 (12px Light, text-text-meta)
- 카드 타이틀 (17px Bold, text-text-strong, 2줄 ellipsis)
- 호스트명 (14px Medium, text-text-sec)
- 가격 (16px Bold, 1박 N원 형식)

Props
```
{ id, image, badges, region, type, title, host, pricePerNight, isBookmarked }
```

### PackageCard.jsx
역할: 패키지 카드.

스펙
- 이미지 비율 16:9
- 이미지 상단 좌측: 페르소나 배지 (2030 노마드 / 5060 시니어 / 기업)
- 이미지 하단 텍스트 영역: padding 20px (24px lg)
- 패키지명 (19px Bold)
- 기간 + 인원 (14px Medium, text-text-meta)
- 포함 내역 미리보기 (3개 점 리스트, 14px Regular)
- 가격 (1인 N원, 22px Bold)
- CTA: 자세히 보기 (Secondary Button)

### JournalCard.jsx
역할: 저널 카드.

스펙
- 이미지 비율 4:3
- 카테고리 라벨 (TRAVEL / MAGAZINE / PICK, 11px Medium uppercase, text-primary)
- 타이틀 (18px Bold, 2줄 ellipsis)
- 본문 발췌 (14px Regular, text-text-sec, 2줄 ellipsis)
- 작성자 (13px Medium, text-text-meta)
- 날짜 (13px Light, text-text-meta)

### GoodsCard.jsx
역할: 굿즈 카드.

스펙
- 이미지 비율 1:1 정사각형
- 카테고리 라벨 (12px Light)
- 상품명 (16px Medium)
- 가격 (16px Bold)

### PassCard.jsx
역할: 마이 G-Pass 카드.

스펙
- bg-black, text-white
- border-radius 20px
- aspect 16:10
- 좌상단: 사용자명 (Bold 22px)
- 좌상단 아래: 단계 배지 (StageBadge 컴포넌트)
- 우하단: QR 코드 (96×96px)
- 좌하단: 누적 방문 N회 (14px Medium)
- 다크 카드 한정 예외로 사용 (다른 곳에 다크 카드 적용 금지)
- html2canvas 캡처 가능하도록 ref 노출

---

## 버튼 컴포넌트

### Button.jsx (통합)
Props로 variant 분기. variant 종류: primary, secondary, ghost, dark.

#### primary
- bg-primary, text-white
- height 48px (md 이상) / 44px (모바일)
- padding-x 24px
- font-medium 16px
- rounded-lg (12px)
- hover bg-primary-hover (#3B82F6)
- transition-colors 150ms

#### secondary
- bg-white, text-primary, border 1px solid primary
- 같은 사이즈 토큰
- hover bg-primary-soft (#EFF6FF)

#### ghost
- bg-transparent, text-text-sec
- hover text-text-pri

#### dark
- bg-black, text-white
- hover bg-text-strong (#171719)

#### 공통 사이즈 변종
- size: sm (height 36px, padding-x 16px, 14px), md (default), lg (height 56px, 18px)

#### 공통 상태
- disabled: opacity 0.4, cursor-not-allowed
- loading: 좌측에 lucide Loader2 회전 (animate-spin)

### IconButton.jsx
역할: 아이콘 단독 버튼 (북마크, 공유, 설정).

스펙
- 40×40px hit area
- icon 24px lucide
- hover bg-bg-card, rounded-full
- aria-label 필수

### BookmarkButton.jsx
- IconButton 베이스
- 활성 상태: lucide Bookmark fill, text-primary
- 비활성 상태: lucide Bookmark outline, text-white (이미지 위) 또는 text-text-pri

---

## 배지 / 칩 / 라벨

### Badge.jsx
역할: 카드 위 작은 배지 (마감할인, 프로모션, 단독소개).

스펙
- bg-primary, text-white (기본)
- 또는 bg-black, text-white (강조)
- height 26px
- padding-x 10px
- font-medium 12px
- rounded-md (10px)

variant: primary, dark, soft (bg-primary-soft, text-primary)

### Chip.jsx
역할: 필터 칩 (선택 가능).

스펙
- height 36px
- padding-x 16px
- bg-white, border 1px solid border-border-def
- font-medium 14px
- rounded-full
- hover border-primary
- selected bg-primary, text-white, border-primary

### StageBadge.jsx
역할: 관계인구 단계 배지.

스펙
- 4개 단계 (방문 / 연결 / 관계 / 정착)
- bg-primary-soft, text-primary
- height 28px, padding-x 12px
- font-medium 13px
- rounded-full
- 마이 G-Pass에서는 다크 배경 위에서 사용되므로 bg-white/10 backdrop 변종 허용 (단 backdrop-blur 없이 단색 alpha만)

---

## 입력 컴포넌트

### Input.jsx
역할: 텍스트 입력.

스펙
- height 48px
- padding-x 16px
- bg-white, border 1px solid border-border-def
- rounded-lg
- font-normal 16px
- placeholder text-text-ter
- focus-visible: border-2 border-primary, outline none
- error: border-red-500 (시스템 에러 컬러)

### Select.jsx
- 동일 스타일 + 우측 ChevronDown 아이콘

### DateRangePicker.jsx
- 날짜 두 개 (체크인 / 체크아웃)
- 클릭 시 캘린더 팝오버 (bg-white, border-border-sub, rounded-xl)

### Counter.jsx
역할: 인원 수 +/- 버튼.

스펙
- IconButton 두 개 (Minus, Plus) + 가운데 숫자
- 숫자 영역 width 32px, text-center, font-medium 16px

---

## 슬라이더 / 갤러리

### HeroSlider.jsx
역할: 홈 메인 풀와이드 슬라이더.

스펙
- aspect 16:9 또는 21:9 (md 이상)
- aspect 4:3 (모바일)
- 슬라이드 5~6장
- 자동 재생 6초 간격 (5초 미만 금지)
- 좌우 화살표 (lucide ChevronLeft/Right, 흰색, 반투명 검정 원 배경)
- 인디케이터 우측 하단 (01 / 06 형식, 흰색 14px Medium)
- 슬라이드 위 텍스트 영역
  - 메인 카피 Display 사이즈 (3xl: 56px, 4xl: 72px)
  - 서브 카피 17~18px Regular
  - 이미지가 어두울 경우만 사용. 밝은 이미지 위에는 어두운 오버레이 (#000000 30% alpha) 추가

### ImageGallery.jsx
역할: 거점 상세 페이지 갤러리.

스펙
- 데스크탑: 좌측 큰 이미지 1장 + 우측 4분할 (총 5장 노출)
- 모바일: 풀와이드 캐러셀 + 인디케이터
- 클릭 시 라이트박스 (전체 화면 어두운 배경, 좌우 화살표)

---

## 진행 / 피드백

### LoadingSkeleton.jsx
역할: 비동기 데이터 로딩 표시.

스펙
- bg-bg-card 베이스
- animate-pulse (Tailwind 기본)
- 카드 형태에 따라 ImagePlaceholder + LinePlaceholder 조합

### LoadingScreen.jsx
역할: 풀스크린 로딩.

스펙
- 전체 화면 중앙 정렬
- 점 3개 애니메이션 (각 8px, gap 8px, bg-primary)
- opacity 0.3 → 1 순차 (총 1.5s loop)
- 텍스트: 잠시만 기다려 주세요 (Pretendard Medium 16px, text-text-sec)

### Toast.jsx
역할: 상단 알림 배너.

스펙
- 화면 상단 우측 고정 (top-20 right-6)
- bg-text-strong, text-white
- padding 16px 20px
- rounded-xl
- 자동 제거 4초

### EmptyState.jsx
역할: 결과 없음 화면.

스펙
- 중앙 정렬
- 큰 아이콘 (lucide, 48px, text-text-ter)
- 타이틀 (18px Medium, text-text-pri)
- 서브 (15px Regular, text-text-sec)
- CTA 버튼 (선택)

---

## 페이지 특수 컴포넌트

### SectionHeader.jsx
역할: 섹션 위 큰 타이틀 + 부제 + 더보기.

스펙
- 좌측: H2 타이틀 (Bold) + 부제 (15px Regular text-text-meta)
- 우측: 더보기 화살표 (lucide ChevronRight, IconButton)
- 하단 24px 띄우고 그리드 시작

### FilterSidebar.jsx (데스크탑)
- width 280px 고정
- bg-white
- 필터 그룹 (지역, 유형, 가격대, 날짜)
- 각 그룹 사이 32px 간격
- 적용 버튼 하단 sticky

### FilterChipBar.jsx (모바일)
- 가로 스크롤 (overflow-x-auto, scrollbar-hide)
- Chip 컴포넌트 가로 정렬
- 클릭 시 바텀시트 모달

### ReservationCard.jsx (거점 상세)
- 데스크탑: 우측 sticky 영역 width 380px
- 모바일: 하단 고정 바텀바 (간략 가격 + 예약 버튼)
- 가격 (24px Bold)
- 1박 (14px Light)
- DateRangePicker
- Counter (인원)
- 합계 가격 (Bold)
- 예약하기 CTA (Primary 풀와이드)

### DayItinerary.jsx (패키지 상세)
- 좌측: Day 1, Day 2 라벨 (Bold 18px)
- 우측: 시간대별 활동 리스트
- Day 사이 32px 간격

### StageDiagram.jsx (멤버십 페이지)
- 4단계 가로 도식 (방문 → 연결 → 관계 → 정착)
- 각 단계: 원형 번호 + 라벨 + 짧은 설명
- 모바일: 세로 스택
- 활성화된 단계는 bg-primary, 비활성은 bg-bg-card

### ReservationTimeline.jsx (마이 G-Pass)
- 다가오는 예약 세로 리스트
- 각 항목: 날짜 + 거점명 + 인원 + 상태 배지

### TransactionList.jsx (마이 G-Pass)
- 테이블 또는 리스트
- 날짜, 항목, 금액, 잔액

---

## 아이콘 라이브러리

lucide-react 단독 사용. 다른 라이브러리 혼용 금지.

자주 쓰는 아이콘
- Search, Bookmark, User, Globe (네비게이션)
- ChevronLeft, ChevronRight, ChevronDown (네비)
- Check, X, Plus, Minus (액션)
- MapPin, Calendar, Users, Clock (메타)
- Loader2 (로딩)
- Download, Share2, ExternalLink (액션)
- Heart, Star (피드백)


---

## 아이콘 / 일러스트 라이브러리 정책

본 프로젝트의 아이콘 및 일러스트 라이브러리 정책(URL, 사용 규칙, 사이즈, 색상)은 **DESIGN.md의 외부 자원 섹션**에서 단일 출처로 관리한다. 컴포넌트 작성 시 반드시 그쪽을 참조한다.

요약
- 아이콘은 lucide-react 단독 사용. 보조 라이브러리(Bootstrap Icons, react-icons, Heroicons)는 사용자 사전 승인 필요.
- 일러스트는 unDraw에서 가져오되 EmptyState, Auth, Onboarding, Error 페이지로 한정. 메인 컬러는 #60A5FA로 통일.

---

# 재사용 JSX 패턴

JSX 패턴 모음은 별도 문서 `PATTERNS.md`로 분리되어 있다. 컴포넌트 작성 시 PATTERNS.md를 그대로 가져다 사용하며 임의 변형 금지. 변형이 필요해 보일 경우 즉시 작업을 멈추고 사용자 승인을 받는다.

본 문서에서는 컴포넌트 트리, 컴포넌트별 스펙, 아이콘 라이브러리 정책 요약만 다룬다.

---

# 절대 금지 패턴

자세한 금지 패턴은 PATTERNS.md 하단 절대 금지 패턴 섹션을 참조한다. 핵심 요약은 다음과 같다.

- box-shadow 일체 금지
- 그라데이션 일체 금지
- 카드/버튼 scale 금지 (이미지 hover zoom만 한정 허용)
- backdrop-blur 금지
- 이모티콘 일체 금지
- DESIGN.md 토큰 외 임의 색상/폰트 사이즈 사용 금지
- system-ui, sans-serif fallback 추가 금지
- 단일 weight 페이지 금지, Light weight 본문 사용 금지