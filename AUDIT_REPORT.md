# 동해사이 전 사이트 디자인 시스템 감사 보고서

작성일: 2026-08-25  
검수 모드: full  
상태: 1단계 감사 완료, 제품 코드 수정 전 기준선  
대상: `client/src/pages`의 20개 파일과 이 페이지들이 직접 사용하는 공용 컴포넌트

## 기준과 경계

- 우선순위는 `KAREUM_MIRROR.md` → `DESIGN_DELTA.md` → `DESIGN.md` → `make-interfaces-feel-better` 순으로 적용했다. 현재 작업 지시가 문서와 충돌하는 경우 현재 작업 지시를 우선했다.
- `make-interfaces-feel-better`의 `SKILL.md`, `typography.md`, `surfaces.md`, `animations.md`, `icons.md`, `performance.md`를 모두 읽었다.
- 요청한 `im-not-ai` 스킬과 `WRITING_GUIDE.md`는 저장소와 설치된 스킬 경로에 없었다. 대체 기준으로 저장소의 `humanize-korean` 스킬 및 `quick-rules.md`, `diagnosis-rules.md`, `rewriting-playbook.md`를 읽었다.
- 감사 시작 시 사용자 소유 변경으로 `client/src/pages/StaysPage.jsx`가 수정 상태였다. 해당 diff는 로컬 자원 유형 진입 카드 제거이며, 감사와 수정 과정에서 되돌리지 않는다.
- 사업 로직, 가격, 예약 조건, 데이터 구조, 사진 매핑은 수정 대상에서 제외한다. 확인되지 않은 값은 새로 만들지 않고 화면에서 숨기거나 “가격 문의”처럼 사실을 추가하지 않는 방문자용 표현으로 바꾼다.
- `GoodsPage.jsx`는 라우트가 없고 `AdminPage.jsx`는 operator 권한 없이는 렌더할 수 없다. 두 파일은 정적 전수 검수는 했지만 실제 화면 검증에는 한계가 있다.

## 검수 범위

| 범주 | 확인한 증거 | 기준선 결과 |
| --- | --- | --- |
| 타이포 | 20개 페이지와 카드·아이브로우·설명 컴포넌트의 h1/h2/h3, weight, 색, wrap, 숫자 | 위반 4군 |
| 표면 | hex, shadow, radius, 중첩 radius, transition, scale 전수 검색 | 위반 4군 |
| 여백 | 컨테이너 선언, 페이지·섹션 py/pt/pb, 실측 left 좌표와 scrollHeight | 위반 3군 |
| 레이아웃 | 7개 폭, 공개 16경로와 보호 5경로, sticky·grid·overflow·hit area | 위반 3군 |
| 라이팅 | 페이지 리터럴, 데이터 placeholder가 렌더되는 경로, 용어·영문 라벨·문체 | 위반 4군 |
| 모션 | keyframe, transition, reduced motion, 목록 등장, 상태 아이콘 | 위반 4군 |
| 아이콘 | lucide import, size, strokeWidth, currentColor, 상태 표현 | 위반 3군 |
| 성능 | `transition-all`, `will-change`, 빌드 번들 | `transition-all` 0건, 500kB 초과 번들 경고 1건 |

## 페이지별 위반 지도

코드는 아래 상세 표의 finding ID를 가리킨다. “없음”은 정적 코드와 렌더 가능한 화면에서 해당 범주의 위반을 찾지 못했다는 뜻이다.

| 페이지 | A 타이포 | B 시스템 | C 여백 | D 레이아웃 | E 라이팅 | F 모션 | G 아이콘 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| HomePage | 없음, 홈 히어로 예외 | B1 | 없음 | D1 공용 헤더 | 없음 | F1 | G1 공용 |
| AboutPage | A1 A2 A3 | B1 B2 B3 | C2 | D1 | E1 E2 | F1 | 없음 |
| StaysPage | A1 A2 A4 | B1 | C3 | D1 | E2 E3 | F1 F2 | G1 공용 |
| StayDetailPage | A1 A2 A4 | B1 B2 B3 | 없음 | D1 D2 | E3 E4 | F1 F3 F4 | G1 G2 |
| PackagesPage | A1 A2 A4 | B1 | 없음 | D1 | E1 E2 | F1 F2 | G1 공용 |
| PackageDetailPage | A1 A2 A4 | B1 B2 B3 | 없음 | D1 D2 | E1 E3 E4 | F1 F3 | G1 G2 |
| StoryListPage | A3 A4 | 없음 | 없음 | D1 | E1 | F1 F2 | G1 공용 |
| StoryDetailPage | A1 A2 | 없음 | 없음 | D1 D2 | E4 | F1 | G1 G2 |
| MembershipPage | A1 A2 | B1 B2 B3 | C2 | D1 | E2 | F1 F4 | G1 G2 |
| MyPage | A1 A2 A4 | B2 B3 | 없음 | D1 D2 | E1 E3 | F1 | G1 |
| PrivacyPage | A1 A2 | B1 | 없음 | D1 | E2 | F1 | G1 공용 |
| AuthPage | A1 A2 | 없음 | C1 | D1 | E3 | F1 | G1 공용 |
| CheckoutPage | A1 A2 A4 | B2 B3 B4 | 없음 | D1 D2 | E1 E3 E4 | F1 F4 | G1 G2 |
| CheckoutCompletePage | A1 A2 A4 | 없음 | C1 | D1 | E2 E3 | F1 | G1 |
| BookmarksPage | A1 A2 A4 | 없음 | 없음 | D1 | E2 E4 | F1 | G1 |
| JournalPage | A2 | 없음 | 없음 | D1 | E1 E2 | F1 | G1 공용 |
| JournalDetailPage | A2 A3 A4 | 없음 | C1 | D1 D2 | E1 | F1 | G1 공용 |
| PassPage | A2 | B2 B3 | 없음 | D1 D2 | E1 E2 E3 | F1 | G1 G2 |
| GoodsPage | A1 A2 A4 | 없음 | 없음 | D3 | E3 | F1 | G1 공용 |
| AdminPage | A4 | 없음 | 없음 | D3 | 없음 | F1 | G1 공용 |

## A. 타이포 위계

| ID | 심각도 | 위치 | 현재 | 수정 방향 | 이유 |
| --- | --- | --- | --- | --- | --- |
| A1 | MEDIUM | `StaysPage.jsx:43-52`, `PackagesPage.jsx:38-43`, `MyPage.jsx:40`, `CheckoutPage.jsx:101-112`, `CheckoutCompletePage.jsx:30`, `BookmarksPage.jsx:21-54`, `PrivacyPage.jsx:39-52`, `MembershipPage.jsx:71,97-118`, `AboutPage.jsx:7,48-63`, `PackageCarousel.jsx:13-17`, `GoodsCard.jsx:26`, `PackageCard.jsx:23` | 같은 역할의 H1이 모바일 22–30px, 1280px 실측 28–52px이며 H2가 16–30px, 카드 H3가 15–19px로 분산 | 일반 페이지 H1 `24/28/32/36`, H2 `20/22/24/28`, 카드 H3 `17/18/19/20`을 공용 클래스에 모으고 상세 히어로만 별도 display 스케일 사용 | 같은 단계가 페이지마다 다른 중요도로 보인다 |
| A2 | MEDIUM | `StaysPage.jsx:55`, `PackagesPage.jsx:43`, `JournalPage.jsx:25`, `GoodsPage.jsx:21-25`, `AuthPage.jsx:45`, `PrivacyPage.jsx:44`, `CheckoutPage.jsx:124,190,222`, `CheckoutCompletePage.jsx:33`, `MyPage.jsx:99-110`, `PassPage.jsx:142,161` | 읽어야 하는 설명·상태 문구에 `text-text-meta` 또는 `text-text-ter` 사용 | 본문·상태는 `text-text-sec`, 날짜·저자·캡션·disabled만 meta/ter 유지 | 보조색이 정보의 가독성을 낮춘다 |
| A3 | LOW | `AboutPage.jsx:45,92,111`, `JournalDetailPage.jsx:20` | 공용 `Eyebrow` 대신 12–14px, tracking 0.06–0.18em 인라인 모사 | 공용 `Eyebrow` 사용 | 아이브로우 크기·weight·tracking 단일화가 깨진다 |
| A4 | MEDIUM | `Counter.jsx:19`, `GoodsPage.jsx:25`, `PackagesPage.jsx:57`, `StoryListPage.jsx:45-48,77-78`, `BookmarksPage.jsx:24,43-54`, `MyPage.jsx:20`, `CheckoutPage.jsx:122,143-158,203-260`, `CheckoutCompletePage.jsx:40-65`, `AdminPage.jsx:31-58`, `Carousel.jsx:80-82`, `SourcePanel.jsx:19-71` | 동적 가격·개수·날짜·카운터 일부에 `tabular-nums` 없음 | 동적 숫자 텍스트에 `tabular-nums` 추가 | 값 변경 때 폭이 흔들릴 수 있다 |

확인 결과 `font-light`는 pages/components에서 0건이었다. 제목 라벨에 Light가 잘못 쓰인 위반은 없다. `index.css:28-37`이 h1–h4에 `text-wrap: balance`, p/li/dd 등에 `text-wrap: pretty`를 전역 적용하므로 개별 클래스가 없어도 computed style은 적용된다.

## B. 디자인 시스템 일관성

| ID | 심각도 | 위치 | 현재 | 수정 방향 | 이유 |
| --- | --- | --- | --- | --- | --- |
| B1 | LOW | `HomePage.jsx:19`, `AboutPage.jsx:11-12,39`, `StaysPage.jsx:35`, `PackagesPage.jsx:31`, `PackageDetailPage.jsx:46`, `StoryDetailPage.jsx:47`, `MembershipPage.jsx:88`, `PrivacyPage.jsx:35`, `StayDetailPage.jsx:112` | pages/components에 hex 11건. 임의색은 아니지만 토큰 경유 원칙과 grep 0건 기준 위반 | 브랜드 메타·표시값을 중앙 상수 토큰으로 이동 | 색 변경 시 페이지별 문자열이 어긋날 수 있다 |
| B2 | MEDIUM | `AboutPage.jsx:19,87`, `MyPage.jsx:51`, `MembershipPage.jsx:127`, `PassPage.jsx:74`, `PassCard.jsx:8`, `PackageDetailPage.jsx:283`, `StayDetailPage.jsx:299`, `CheckoutPage.jsx:164,198`, `DateRangePicker.jsx:126` | `rounded-3xl`, `rounded-[28px]`, `rounded-[32px]`, `rounded-[36px]` 사용 | 카드·모달은 정의된 `rounded-2xl`로 통일하고 20px 자체도 arbitrary 대신 토큰 사용 | 프로젝트 radius 6/10/12/16/20/full 범위를 벗어난다 |
| B3 | MEDIUM | `MyPage.jsx:54,78-81`, `PackageCarousel.jsx:30-35` | `drop-shadow-md`, hover shadow 강화, 카드 자체 translate/scale | 임의 drop-shadow 제거, 카드 표면은 정적 정의 토큰만 사용, 카드 자체 transform 제거 | 정의된 깊이 토큰과 카드 자체 scale 금지 규칙 위반 |
| B4 | LOW | `CheckoutPage.jsx:164-172,198` | outer 36px, inner 12px, padding 20px. 공식값은 12+20=32px | 중첩을 같은 surface로 보지 않도록 구조를 단순화하고 토큰 radius로 통일 | 동심원 radius가 맞지 않는다 |

`transition-all`과 `transition: all`은 0건이다. scale 값은 눌림 `0.96`과 이미지 hover `1.04` 외 다른 값이 없다. `shadow-card`, `shadow-depth`, `shadow-float` 계열은 Tailwind에 정의돼 있으며 임의 인라인 box-shadow는 0건이다.

## C. 여백과 마진

| ID | 심각도 | 위치 | 현재 | 수정 방향 | 이유 |
| --- | --- | --- | --- | --- | --- |
| C1 | MEDIUM | `AuthPage.jsx:33-36`, `CheckoutCompletePage.jsx:19-22`, `JournalDetailPage.jsx:19` | 페이지 루트가 `mx-auto max-w`와 개별 px를 직접 선언 | 바깥은 `container-page`, 안쪽에 `max-w` 텍스트/폼 컨테이너를 둔다 | 페이지 기준선 정책이 우회된다. 768px에서 Journal 상세 H1 x=17px, 일반 페이지 x=32px로 실측됐다 |
| C2 | LOW | `AboutPage.jsx:44,61,84,106,136,159`, `MembershipPage.jsx:93,117,179,200,218,241`, `ChoiceCuration.jsx:29-30` | 같은 서브페이지 섹션이 mobile 24–64px, desktop 32–96px로 분산 | 히어로·구매 비교처럼 첫 화면 목적이 있는 예외를 남기고 일반 섹션은 `py-12 md:py-18 lg:py-24` 사용 | 같은 성격의 섹션 호흡이 페이지마다 달라진다 |
| C3 | MEDIUM | `StaysPage.jsx:68-77` | 148개 카드를 한 번에 렌더. 320px scrollHeight 50,747px, 390px 58,369px | 이 감사에서는 데이터/페이지네이션을 바꾸지 않는다. 후속으로 페이지네이션 또는 점진 로딩 결정 필요 | 과도한 스크롤이지만 사업·데이터 흐름 변경이 필요해 이번 시각 감사 범위 밖이다 |

## D. 위치와 레이아웃

| ID | 심각도 | 위치 | 현재 | 수정 방향 | 이유 |
| --- | --- | --- | --- | --- | --- |
| D1 | HIGH | `NavMenu.jsx:14-26`, `Logo`를 감싼 링크, `Counter.jsx:8-30`, `StayDetailPage.jsx:233-259,418-420`, `StoryDetailPage.jsx:227-243`, `JournalDetailPage.jsx:43`, `MyPage.jsx:62-69`, `AnswerText.jsx:181-201`, `SovereignChat.jsx:47-52` | 실제 1280px에서 헤더 메뉴 링크 높이 23px, 로고 링크 24px. Counter·모달 닫기·액션바는 32–36px | 모바일 44px, 밀집 데스크톱 40px 최소 히트 영역 확보 | 작은 링크와 아이콘 버튼은 터치·키보드 사용성이 낮다 |
| D2 | MEDIUM | `StayCard.jsx:12-29` | 전체 카드 `Link` 안에 `BookmarkButton` button 중첩 | 링크와 저장 버튼을 형제 overlay로 분리 | 중첩 인터랙티브 요소는 클릭·키보드 동작이 충돌한다 |
| D3 | MEDIUM | `App.jsx:6-24,55-74`, `GoodsPage.jsx`, `AdminPage.jsx` | GoodsPage는 import·route가 없어 `/goods`가 홈으로 리디렉션. Admin은 operator UI 진입 경로가 없어 실측 불가 | 기능·권한 정책 결정 후 별도 처리. 이번 감사에서는 파일 정적 검수만 수행 | “전 페이지” 실제 화면 검증을 막는 라우팅 경계다 |

통과 항목:

- 320, 390, 768, 1024, 1280, 1536, 1920에서 렌더 가능한 모든 경로의 전역 가로 overflow는 0건이었다.
- 헤더 콘텐츠 높이는 mobile 60px+border, desktop 80px+border였다. 1024–1920에서 로고와 메뉴 중심선은 모두 y=40px로 일치했다.
- 1280px에서 1000px 스크롤 후 Stay 예약 aside y=94px, Package tab y=84px와 aside y=96px, Checkout aside y=96px로 헤더 바로 아래에 고정됐다.
- 카드 aspect는 Stay/Story 4:3, Package 16:9, Goods 1:1로 역할별 일관성을 유지했다.

## E. UX 라이팅

| ID | 심각도 | 위치 | 현재 | 수정 방향 | 이유 |
| --- | --- | --- | --- | --- | --- |
| E1 | MEDIUM | `AboutPage.jsx:45,92,111`, `StoryListPage.jsx:24`, `JournalPage.jsx:23`, `JournalDetailPage.jsx:20`, `MyPage.jsx:32`, `PassPage.jsx:43`, `ColorBlockCarousel.jsx:34`, `format.js:93-97` | 한국어 화면에 donghae sai, SYMBOL, CHARACTER, JOURNAL, my page, my pass, PROGRAM, TRAVEL/MAGAZINE/PICK 노출 | 고유 약어가 아닌 UI 라벨을 자연스러운 한국어로 통일 | 화면 언어가 섞여 정보 위계가 아니라 장식처럼 보인다 |
| E2 | MEDIUM | `StaysPage.jsx:46`, `PackagesPage.jsx:13-14`, `PassPage.jsx:49-50,78-79,131-132,161-162`, `CheckoutPage.jsx:11-13,191,215-223`, `AboutPage.jsx:55,65-68,94-97,115-118`, `PrivacyPage.jsx:44-46` | 방문자 안내가 “한다/이다/받는다/붙는다” 독백체로 끝남 | 브랜드 서사는 간결한 해요체, 행동 안내는 청유형으로 국소 수정 | 다른 화면의 해요체와 register가 섞인다 |
| E3 | HIGH | `AuthPage.jsx:65-67`, `CheckoutPage.jsx:190-192`, `StayDetailPage.jsx:43,318-320`, `PackageDetailPage.jsx:112-115,218-220`, `PackageCarousel.jsx:26,65-67`, `format.js:7-13`, `data/stays.json`, `data/packages.json` | “프로토타입”, “아무 값이나”, “요금 미정”, “미정”, “재확인 필요”, “가격 자료 대기”가 방문자 화면에 노출될 수 있음 | 개발 용어는 방문자 설명으로 바꾸고 미상 데이터는 숨기거나 “가격 문의”로 처리 | 내부 제작 상태가 서비스 카피처럼 노출된다 |
| E4 | MEDIUM | `BookmarksPage.jsx:21-54`, `StoryDetailPage.jsx:65,261`, `CheckoutPage.jsx:77,110-112,157-158,204`, `PassPage.jsx:43-47`, `NavMenu.jsx:5-9` | “북마크/저장한 장소”, “스테이/숙소”, “이용권/패스”, “마이 패스/내 패스” 혼용 | 각각 “저장한 장소”, “숙소”, “패스”, “내 패스”로 통일 | 같은 개념을 다시 해석해야 한다 |

이모지는 pages/components/data에서 0건이었다. 반점 3개 이상 명사 나열은 `Description`의 `asList` 경로에서 칩 목록으로 변환되고 있으나 직접 렌더되는 데이터 문자열은 수정 단계에서 다시 확인한다.

## F. 인터랙션과 모션

| ID | 심각도 | 위치 | 현재 | 수정 방향 | 이유 |
| --- | --- | --- | --- | --- | --- |
| F1 | MEDIUM | `index.css:68-82,104-108`, 모든 `.page-enter` 페이지 | pageEnter와 loadingDot keyframe이 reduced-motion media에서 정지하지 않음 | `.page-enter`, loading dot 3종을 reduced-motion에서 animation none | 시스템 모션 최소화 설정을 무시한다 |
| F2 | LOW | `StoryListPage.jsx:54-97`, `RevealOnScroll.jsx` | 카드별 Reveal이 동시에 시작하고 stagger 지연이 없음 | 한 화면 열 단위로 0/100/200ms stagger, reduced motion에서는 지연 제거 | 목록 위계가 한 덩어리로 나타난다 |
| F3 | MEDIUM | `PackageCard.jsx:15-16`, `PackageDetailPage.jsx:251-253`, `RegionSection.jsx:48-49` | 이미지 zoom transform에 reduced-motion 대응 없음 | `motion-reduce:transition-none motion-reduce:transform-none` 추가 | 모션 최소화에서도 확대가 남는다 |
| F4 | MEDIUM | `BookmarkButton.jsx:25-38`, `StayDetailPage.jsx:161-170`, `CheckoutPage.jsx:235-243`, `AnswerText.jsx:185-201` | 즐겨찾기·체크·평가 아이콘이 fill 또는 mount로 순간 전환 | 동일 SVG의 outline/fill 상태를 opacity/scale/blur로 교차 전환하고 색 상태도 유지 | 상태 변화가 갑작스럽고 모션이 유일한 피드백이 되기 쉽다 |

hover/open/close의 상태 전환은 CSS transition을 사용하며, keyframe은 페이지 진입·로딩 같은 one-shot/반복 로딩에만 사용한다. `transition-all`은 0건이다.

## G. 아이콘

| ID | 심각도 | 위치 | 현재 | 수정 방향 | 이유 |
| --- | --- | --- | --- | --- | --- |
| G1 | MEDIUM | pages/components의 lucide `size` 전수. 대표: `SourcePanel.jsx:60`, `StoryDetailPage.jsx:231,242`, `DateRangePicker.jsx:137`, `MyPage.jsx:82`, `StayDetailPage.jsx:235,257,385,420`, `TopNav.jsx:34,49`, `CheckoutCompletePage.jsx:29`, `AnswerText.jsx:187-201` | 허용값 밖 size 38건: 13×1, 14×2, 15×8, 18×6, 22×8, 56×1 등 | 16/20/24/32/48px 단계로 반올림하고 같은 위치는 같은 크기 사용 | 프로젝트 아이콘 스케일이 깨진다 |
| G2 | LOW | `CheckoutPage.jsx:242`, `MembershipPage.jsx:153`, `PassPage.jsx:120` | strokeWidth 3.5, 2.5, 상태별 1.5/2 혼용 | regular 1.5, medium/semibold 2, 강조 standalone 2.5 원칙에 맞춰 인접 텍스트 기준으로 통일 | 아이콘의 시각 무게가 주변 글자와 다르다 |
| G3 | LOW | `BookmarkButton.jsx:33-38`, `StayDetailPage.jsx:168-169` | 한 SVG의 currentColor 사용은 맞지만 outline/fill 상태 변화가 즉시 일어남 | currentColor 유지 + 상태 교차 전환 | 색 상속 원칙은 통과하지만 상태 표현 완성도가 부족하다 |

lucide-react 외 다른 아이콘 라이브러리는 pages/components에서 발견되지 않았다. 색은 currentColor 상속과 Tailwind 텍스트 토큰을 사용한다.

## 브라우저 기준선과 빌드

| 폭 | 공개 라우트 | 보호·예약 라우트 | 전역 overflow | container left 기준 | 헤더 |
| --- | ---: | ---: | ---: | --- | --- |
| 320 | 16 | 5 | 0 | 20px | 60px+1px |
| 390 | 16 | 5 | 0 | 20px | 60px+1px |
| 768 | 16 | 5 | 0 | 32px | 60px+1px |
| 1024 | 16 | 5 | 0 | 48px | 80px+1px |
| 1280 | 16 | 5 | 0 | 64px | 80px+1px |
| 1536 | 16 | 5 | 0 | 64px | 80px+1px |
| 1920 | 16 | 5 | 0 | 249px 또는 scrollbar 없는 화면 256px | 80px+1px |

- 총 147개 route-width 조합을 측정했다. `/goods`는 모든 폭에서 `/`로, `/admin`은 일반 로그인 상태에서 `/`로 리디렉션됐다.
- 1280px H1 computed font-size 예: About 52px, Stay/Package 목록 30px, Journal/Story 목록 32px, Membership 38px, Privacy 36px, Checkout 28px. 이 차이는 A1의 실제 근거다.
- 기준선 빌드 `npm run build` 성공: 1,953 modules, CSS 46.68kB, JS 723.37kB. JS chunk 500kB 초과 경고가 있으나 코드 분할은 새 구조·성능 작업이므로 이번 시각 감사에서는 변경하지 않는다.

## 고려했지만 제외한 변경

| 위치 | 후보 | 제외 이유 |
| --- | --- | --- |
| `SovereignHero.jsx` | 홈 H1과 대화 전환 레이아웃을 일반 페이지 스케일로 변경 | `KAREUM_MIRROR`가 홈 챗봇 히어로를 완성 상태로 두고 건드리지 말라고 명시한다 |
| `StaysPage.jsx` | 148개 항목을 임의로 잘라 스크롤 높이 축소 | 페이지네이션·노출 수는 사업·데이터 흐름 결정이며 이번 감사의 시각 범위를 넘는다 |
| `GoodsPage.jsx`, `AdminPage.jsx` | route 또는 권한 우회 추가 | 새 기능과 권한 정책 변경이므로 정적 검수만 한다 |
| `PrivacyPage.jsx` | 미확정 법률 문안을 새로 작성 | 검증되지 않은 법률 내용을 만들 수 없다. 확정 원문이 오면 교체해야 한다 |
| 모든 카드 | 그림자 제거 또는 강화 | 현재 작업 지시는 정의된 `shadow-card/depth/float` 사용을 허용한다. 임의 그림자와 카드 hover 강화만 정리한다 |

## 1단계 판정

**Needs changes.** HIGH 2군(D1, E3), MEDIUM 18군, LOW 8군이 있다. 2단계에서는 A → B → C → D → E → F → G 순서로 수정하고 각 단계 완료 후 grep·빌드·브라우저 computed style을 `PROGRESS.md`에 기록한다.
