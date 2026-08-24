# KAREUM_MIRROR.md 카름 미러링 규칙과 컴포넌트 규격

작성일 2026년 8월 24일. 대상은 서브 페이지 리디자인이다. 홈 챗봇 히어로는 완성으로 두고 건드리지 않는다.

이 문서가 이번 리디자인의 단일 기준이다. 기존 DESIGN.md와 DESIGN_DELTA.md는 유효하되, 아래 개정 조항이 충돌하는 지점에서는 이 문서가 우선한다.

옮기는 것은 레이아웃 구조와 인터랙션 기법이다. 카름스테이의 사진과 문구와 로고와 일러스트는 복제하지 않는다. 사진은 동해 사진, 카피는 동해사이 카피, 캐릭터는 동해사이 문어로 채운다.

## 0. 목표 화면과 컴포넌트 대응

- 프로그램 페이지 상단: 기존 HeroSlider 투입
- 권역 5개: RegionBlobSection 신규
- 프로그램 10개: ColorBlockCarousel 신규
- 코스 8개: PackageCarousel 신규
- 이야기 페이지: HeroSlider 투입과 카드 등장 애니메이션 적용
- 공용: Carousel, RevealOnScroll, KareumHeader, CurvedCaption, ScatterIllust 신규

## 1. DESIGN.md 개정 조항

기존 DESIGN.md에서 아래만 개정한다. 나머지 색 토큰과 타이포 스케일과 반응형과 접근성은 그대로 지킨다.

### 1-1. box-shadow 허용 (기존 일체 금지에서 개정)

카름의 깊이감을 위해 옅은 그림자 한 종을 허용한다. 임의 그림자는 계속 금지한다. tailwind.config.js에 토큰 하나만 추가한다.

- shadow-card: 0 1px 2px rgba(0,0,0,0.04), 0 6px 16px rgba(0,0,0,0.06)
- 적용 대상은 블롭 카드와 컬러블록 사진과 패키지 카드로 한정한다
- hover 시 그림자 강화 금지. 그림자는 정적으로만 쓴다
- 그 외 화면은 기존대로 그림자 없이 간다

### 1-2. 콘텐츠 페이지 일러스트 허용 (문어 한정)

기존 DESIGN.md는 카드 그리드 일러스트를 금지한다. 동해사이 문어 캐릭터만 예외로 허용한다.

- 문어 애셋만 허용한다. 다른 일러스트는 계속 EmptyState와 로그인과 404에만 쓴다
- 문어는 블롭 카드 주변과 섹션 여백에 흩뿌린다. 카드 내용 위를 덮지 않는다
- 문어 색은 원본 애셋 색을 유지한다. 카드 사진과 겹칠 때 가독성을 해치지 않는 크기로 제한한다
- 애셋 경로는 client/public/images/character 로 고정한다

### 1-3. 컬러블록 색 (임시 프라이머리 계열)

컬러블록은 카름의 강한 단색 자리다. 브랜드 색 확정 전까지 프라이머리 계열로 간다. 색은 나중에 토큰 교체로 바꾼다.

- 컬러블록 배경은 bg-primary-soft 를 기본으로 하고 텍스트는 text-text-pri 와 text-primary 를 쓴다
- 강한 단색이 필요하면 bg-primary 배경에 text-white 를 쓴다
- 프로그램마다 색을 바꾸지 않는다. 색 다양화는 브랜드 색 확정 후 별도로 판단한다
- 그라데이션은 계속 금지한다

### 1-4. 블롭 마스킹과 곡선 카피 (SVG 허용)

DESIGN.md가 금지하는 것은 WebGL과 3D와 parallax다. SVG는 금지 대상이 아니다. 블롭과 곡선 카피는 SVG로 구현한다.

- 블롭은 SVG clipPath 로 사진을 마스킹한다
- 곡선 카피는 SVG path 와 textPath 로 얹는다
- 반응형은 viewBox 와 preserveAspectRatio 로 잡는다. 픽셀 고정 좌표를 쓰지 않는다

### 1-5. scale 유지

카드 hover 이미지 zoom scale 1.04 는 기존 예외 그대로 쓴다. 카드 자체 scale 은 계속 금지한다.

### 1-6. 자동 슬라이드 유지

HeroSlider 자동 6초를 그대로 쓴다. 5초 미만 금지 원칙을 지킨다.

## 2. 신규 컴포넌트 규격

### 2-1. KareumHeader

카름 마을 섹션 헤더다. 좌측 제목, 가운데 긴 가로 구분선, 우측 개수 표기를 한 줄에 놓는다.

- props: title, count, countLabel
- 레이아웃: flex items-center. 제목은 font-bold text-[20px] md:text-[24px]. 구분선은 flex-1 border-t border-border-def mx-4. 개수는 font-medium text-[13px] text-text-meta
- 기존 SectionHeader 는 전체보기 화살표용으로 남기고 이 컴포넌트를 별도로 둔다

### 2-2. Carousel (공용)

가로 스크롤 캐러셀 기반이다. 블롭과 패키지와 컬러블록이 공통으로 쓴다.

- 구현은 scroll-snap-x 로 한다. transform 슬라이드 대신 네이티브 스크롤 스냅을 쓴다. 반응형에 안전하고 접근성이 좋다
- overflow-x-auto scrollbar-hide snap-x snap-mandatory. 각 아이템 snap-start
- 데스크탑에서 좌우 화살표 버튼을 띄운다. 모바일은 스와이프만
- 화살표는 기존 HeroSlider 화살표 스타일을 따른다. w-12 h-12 rounded-full bg-black/40
- 아이템 폭은 컨텐츠별로 다르게 받는다. props itemClassName

### 2-3. RevealOnScroll

스크롤 진입 등장 래퍼다. DESIGN.md 인터랙션 정책 그대로 쓴다.

- IntersectionObserver 로 뷰포트 진입 감지. 한 번 보이면 유지한다
- 진입 전 opacity-0 translate-y-2. 진입 후 opacity-100 translate-y-0. transition 400ms ease-out
- prefers-reduced-motion 이면 애니메이션 없이 바로 표시한다
- transform 과 opacity 외 속성 금지를 지킨다

### 2-4. CurvedCaption

블롭 사진 위 곡선 카피다.

- SVG viewBox 안에 path 를 정의하고 textPath 로 텍스트를 흘린다
- path 는 블롭 상단 곡선을 따라가는 완만한 곡선으로 둔다
- 폰트는 Pretendard, weight medium, 크기는 컨테이너 비율로 잡는다
- 텍스트는 15자 안팎. CONTENT_GUIDE 톤을 따른다. 활동을 먼저 말한다
- 색은 카드 사진 위에서 대비가 나오게 text-white 또는 text-text-pri 중 사진 밝기로 정한다

### 2-5. ScatterIllust

문어 흩뿌림 배치다.

- props: items 배열. 각 항목은 src 와 위치와 크기와 회전
- 문어 애셋이 없으면 아무것도 렌더하지 않는다. 자리를 비운다
- position absolute 로 부모 기준 배치한다. 카드 내용과 겹치지 않는 여백에만 놓는다
- 회전은 정적 각도만 준다. 애니메이션 회전은 금지 원칙 그대로다

### 2-6. RegionBlobSection (RegionSection 대체)

권역 5개 블롭 카드 캐러셀이다. 기존 RegionSection 을 대체한다.

- KareumHeader 로 제목과 개수를 얹는다. 제목은 마을에서 만나는 진짜 동해 대신 동해사이 카피로 둔다
- Carousel 안에 BlobCard 5장을 넣는다
- 카드마다 블롭 모양과 세로 위치를 다르게 해 지그재그로 흐르게 한다. 세로 오프셋은 홀짝으로 번갈아 준다
- 데이터는 기존 RegionSection 의 REGIONS 배열을 그대로 쓴다. 이미지는 images/regions 5장

BlobCard 구성:
- SVG clipPath 블롭 마스킹 사진
- CurvedCaption 곡선 카피
- ScatterIllust 문어 흩뿌림
- 아래 권역명 font-bold text-[18px]
- 그 아래 설명 두 줄 text-text-sec
- 블롭 path 는 권역마다 다른 5종을 준비한다

### 2-7. ColorBlockCarousel (프로그램)

프로그램 시그니처 컬러블록 캐러셀이다.

- 풀블리드 컬러블록 배경. 1-3 색 규칙을 따른다
- 좌측 큰 사진, 우측에 아이브로우와 제목 두 줄과 설명 세 줄과 해시태그와 자세히보기 버튼
- Carousel 로 프로그램 10건을 넘긴다. 하단에 인디케이터와 화살표
- 데이터는 packages 의 category program 10건. main_image 18건 완비라 사진 결손 없음
- 사진은 aspect 16:9 또는 4:3. rounded-2xl. shadow-card 적용
- 아이브로우는 lucide 아이콘과 라벨. 제목은 font-bold. 해시태그는 tags 필드

### 2-8. PackageCarousel (코스)

코스 패키지 2열 가로 캐러셀이다.

- KareumHeader 로 제목과 개수. 우측에 전체보기 링크
- Carousel 로 course 8건을 넘긴다. 데스크탑 2열이 보이는 폭
- 카드는 상단 사진에 하단 색 언더라인 border-b-2 border-primary. 하단 설명 두 줄과 해시태그와 우측 정렬 가격
- 가격은 원가와 할인가가 있을 때만 취소선과 강조가를 쓴다. 없으면 단일 표기. 동해사이 데이터는 무료와 확인되지 않음이 많으므로 가격 없는 카드도 처리한다
- 기존 PackageCard 를 캐러셀용으로 개조하거나 PackageCarouselCard 를 새로 둔다

## 3. 데이터와 자산 처리

- packages program 10건은 이미지 완비. ColorBlockCarousel 에 바로 넣는다
- packages course 8건도 이미지 완비. PackageCarousel 에 바로 넣는다
- regions 5장은 RegionBlobSection 과 HeroSlider 소스로 쓴다
- stays 122건 중 이미지 있는 것은 35건이다. 블롭 카드는 권역 5개에만 쓰고 stays 상세 리스트는 기존 StayCard 그리드를 유지한다. 사진 없는 87건을 블롭으로 노출하지 않는다
- stories 5건 cover_image 는 regions 사진으로 채워져 있다. 배포본이 구버전이라 회색으로 보였다. 재배포로 해결한다
- 문어 애셋은 아직 없다. images/character 에 파일이 들어오기 전까지 ScatterIllust 는 빈 채로 둔다

## 4. 검증 체크리스트

- box-shadow 는 shadow-card 토큰만 존재한다. 임의 그림자 0건
- 문어 외 콘텐츠 페이지 일러스트 0건
- 그라데이션 0건, backdrop-blur 0건, WebGL 0건
- 카드 자체 scale 0건. 이미지 zoom scale 1.04 만 존재
- 색 토큰 외 hex 직접 입력 0건
- 320 390 768 1024 1280 1536 1920 2560 각 폭에서 블롭과 곡선 카피 안 깨짐. 가로 스크롤 전역 0
- prefers-reduced-motion 에서 등장 애니메이션 정지
- 이모지 0건. 가운데점과 줄표 0건
