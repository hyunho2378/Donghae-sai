# IA.md — 정보 구조

## 사이트 타입

React Router 기반 멀티페이지 SPA. 반응형 단일 코드베이스.

## URL 구조

```
/                       — 인트로 (히어로 슬라이더 + 카드 그리드)
/stays                  — 거점 리스트 (6개 핵심 거점 + 객실)
/stays/:id              — 거점 상세 (이미지, 설명, 호스트, 예약)
/packages               — 체류형 패키지 리스트
/packages/:id           — 패키지 상세 + 결제 진입
/journal                — 저널/매거진 리스트 (관계인구 콘텐츠)
/journal/:id            — 저널 본문
/membership             — G-Pass 멤버십 안내
/pass                   — 마이 G-Pass 대시보드 (인증 필요)
/goods                  — 로컬 굿즈 / 농산물 스토어
/goods/:id              — 굿즈 상세
/community              — 커뮤니티 (관계 단계 사용자)
/auth                   — 로그인 / 가입
/admin                  — 청년 크루 운영 대시보드 (operator 권한)
/about                  — 프로젝트 소개
```

---

## 글로벌 네비게이션 (스테이폴리오 벤치마크)

좌측 로고 → 중앙 검색바 → 우측 텍스트 메뉴 + 아이콘 그룹

### 우측 텍스트 메뉴 4개
1. **FIND STAY** → /stays (거점 찾기)
2. **PACKAGES** → /packages (체류 패키지)
3. **JOURNAL** → /journal (저널)
4. **MEMBERSHIP** → /membership (G-Pass + 굿즈 진입점)

### 우측 아이콘 그룹
- 로그인 / 마이페이지 (User)
- 북마크 (Bookmark)
- 언어 전환 (Globe)

---

## 페이지별 역할

### HomePage (/)
스테이폴리오 메인 구조 미러링.

상단부터 순서
1. 풀와이드 히어로 슬라이더 (5~6장, 1920×800 비율)
   - 메인 카피 (예: 고성에서, 다시 시작되는 연결)
   - 서브 카피
   - 슬라이드 인디케이터 (01 / 06)
2. 셀럽들이 사로잡은, 취향과 감도가 보장된 6곳 (셀렉션 1)
3. 패키지 PROMOTION 영역
4. JOURNAL 최근 글 3개
5. 6개 핵심 거점 미리보기
6. 멤버십 + 굿즈 진입 배너
7. 푸터

### StaysPage (/stays)
거점 리스트.

- 좌측 필터 사이드바 (데스크탑) / 상단 필터 칩 (모바일)
  - 거점 유형 (숙박, 코워킹, 식사, 액티비티)
  - 지역 (화진포, 거진, 초도, 찻골, 달홀)
  - 가격대
  - 가용 날짜
- 우측 카드 그리드
  - 1열 (모바일) / 2열 (태블릿) / 3열 (데스크탑) / 4열 (xl 이상)
  - 카드: 이미지 + 배지 + 타이틀 + 호스트명 + 가격 + 북마크

### StayDetailPage (/stays/:id)
거점 상세.

- 상단: 이미지 갤러리 (좌측 메인 + 우측 4분할 또는 캐러셀)
- 타이틀 + 지역 + 평점
- 호스트 소개 (얼굴, 한 줄 소개)
- 본문: 거점 스토리, 시설, 주변 정보
- 우측 또는 하단 고정 영역: 예약 카드 (날짜, 인원, 가격 합계, 예약하기 CTA)
- 하단: 비슷한 거점 추천

### PackagesPage (/packages)
3종 패키지 표시.

1. 체류형 Solo 2박3일 (24~55만원)
2. 체류형 Extended 5박6일 (50~100만원)
3. B2B ESG 워케이션 2박3일 (1인 45~80만원, 최소 10명)

각 카드는 큰 이미지 + 가격 + 포함 내역 + 타겟 페르소나 배지(2030 노마드 / 5060 시니어 / 기업) + CTA.

### PackageDetailPage (/packages/:id)
패키지 상세.

- 일정표 (Day 1, Day 2, Day 3 형식)
- 포함 사항 / 불포함 사항
- 호스트 인터뷰
- 후기
- 결제 진입 (TossPayments 또는 임시 폼)

### JournalPage (/journal)
스테이폴리오 JOURNAL 탭 미러링. TRAVEL / MAGAZINE / PICK 탭 구조.

- TRAVEL: 거점 추천 모음
- MAGAZINE: 호스트 인터뷰, 마을 이야기, 관계인구 사례
- PICK: 운영팀 큐레이션

카드 그리드 형식. 16:9 이미지 + 카테고리 메타 + 타이틀 + 본문 1~2줄 발췌 + 작성자.

### JournalDetailPage (/journal/:id)
저널 본문.

- 풀와이드 헤더 이미지
- 타이틀, 부제, 작성자, 날짜
- max-width 720px 본문 영역 (Pretendard Regular 17px, 행간 1.7)
- 인라인 이미지 허용
- 하단: 다음 글, 추천 거점

### MembershipPage (/membership)
G-Pass 멤버십 안내.

- 멤버십 혜택 (우선 예약권, 할인, 커뮤니티, 뉴스레터)
- 가격 (월 2~5만원, 연간 할인)
- 4단계 관계인구 진행 도식 (방문 → 연결 → 관계 → 정착)
- 가입 CTA

### PassPage (/pass) [인증 필요]
마이 G-Pass 대시보드.

- 상단: 사용자 카드
  - 이름
  - 현재 단계 배지 (방문/연결/관계/정착)
  - 누적 방문 횟수
  - QR 코드 (가맹점 결제용)
- 다음 예약 일정
- 거래 내역 (G-Pass 사용 기록)
- 추천 다음 단계 액션

### GoodsPage (/goods)
로컬 굿즈 / 농산물.

- 카테고리 (NFC 앨범, 계절 큐레이션 박스, 농산물, 가공식품)
- 카드 그리드 (정사각형 이미지 + 상품명 + 가격)

### CommunityPage (/community)
커뮤니티 (관계 단계 사용자 대상).

- 호스트 모집글
- 살아보기 후기
- 정기 모임 일정
- 뉴스레터 구독

### AdminPage (/admin) [operator 권한]
청년 크루 운영 대시보드.

- 오늘 예약 현황
- 입실 예정 / 체크아웃 예정
- 호스트 정산 계산기
- 누적 매출 (일/주/월)
- G-Pass 발급 패널

### AuthPage (/auth)
로그인 / 가입.

- 가입 시 역할 선택 (디지털 노마드 / 액티브 시니어 / 기업 담당자 / 청년 크루)
- 이메일 + 패스워드 (서버 사이드 처리)
- 또는 카카오 OAuth

---

## 사용자 흐름 (관계인구 4단계)

### 1단계: 방문 (Visit)
첫 방문 → 거점 또는 패키지 둘러보기 → 예약 → 결제 → 방문 완료

진입점
- 검색 / 카드 그리드 / 추천 슬라이더

전환 지표
- 첫 예약 완료
- G-Pass 발급

### 2단계: 연결 (Connect)
G-Pass 멤버십 가입 → 우선 예약권 + 뉴스레터 → 재방문

진입점
- 첫 방문 후 추천 모달
- 멤버십 페이지 직접 진입

전환 지표
- 멤버십 결제 완료
- 2회 이상 방문

### 3단계: 관계 (Relationship)
커뮤니티 참여 → 호스트 모임 → 정기 방문

진입점
- 커뮤니티 페이지
- 뉴스레터 링크

전환 지표
- 커뮤니티 게시글 작성
- 정기 모임 참여 1회 이상

### 4단계: 정착 (Settlement)
1개월 살아보기 패키지 → 빈집 투어 → 귀촌 상담 연계

진입점
- 마이페이지 추천 액션
- 청년 크루 1:1 상담

전환 지표
- 1개월 패키지 결제
- 귀촌 상담 신청

각 단계는 사용자 메타데이터에 기록되며, 진입 시 다음 단계로 자연스럽게 유도하는 CTA가 표시된다.

---

## 데이터 구조 (NeonDB)

### 테이블 1. profiles
```
id            UUID PK
auth_id       VARCHAR (외부 인증 ID)
email         VARCHAR
name          VARCHAR
role          ENUM (nomad, senior, corporate, operator)
stage         ENUM (visit, connect, relationship, settlement)
total_visits  INTEGER DEFAULT 0
created_at    TIMESTAMP
```

### 테이블 2. stays
```
id              UUID PK
name            VARCHAR
type            ENUM (lodging, cowork, dining, activity)
host_id         UUID FK
region          VARCHAR
description     TEXT
images          JSONB (URL 배열)
price_per_night INTEGER (단위: 원)
lat             FLOAT
lng             FLOAT
is_active       BOOLEAN
created_at      TIMESTAMP
```

### 테이블 3. packages
```
id              UUID PK
name            VARCHAR
tier            ENUM (solo, extended, b2b)
base_price      INTEGER
duration_nights INTEGER
target_persona  ENUM (nomad, senior, corporate)
included_stays  JSONB (stay id 배열)
description     TEXT
images          JSONB
is_active       BOOLEAN
```

### 테이블 4. reservations
```
id          UUID PK
user_id     UUID FK profiles
stay_id     UUID FK stays (nullable)
package_id  UUID FK packages (nullable)
check_in    DATE
check_out   DATE
total_price INTEGER
status      ENUM (pending, confirmed, completed, cancelled)
pass_code   VARCHAR (G-Pass QR용 코드)
created_at  TIMESTAMP
```

### 테이블 5. transactions
```
id          UUID PK
user_id     UUID FK
amount      INTEGER
type        ENUM (credit, debit)
description VARCHAR
created_at  TIMESTAMP
```

### 테이블 6. journal_posts
```
id         UUID PK
title      VARCHAR
subtitle   VARCHAR
category   ENUM (travel, magazine, pick)
cover_image VARCHAR
body       TEXT (마크다운)
author     VARCHAR
published_at TIMESTAMP
```

### 테이블 7. goods
```
id         UUID PK
name       VARCHAR
category   ENUM (nfc_album, curation_box, produce, processed)
price      INTEGER
images     JSONB
description TEXT
stock      INTEGER
```

초기 단계에서는 `data/*.json`으로 더미 데이터를 사용하고, NeonDB 연결은 PHASE 2 REVIEW 에이전트가 담당한다.

---

## 검색 동작

상단 검색바 (어디로 떠날까요?) 입력 시
- 거점명 매치 → /stays 결과 페이지
- 지역명 매치 → /stays?region=화진포
- 패키지명 매치 → /packages 결과
- 결과 없음 → 추천 거점 6곳

---

## 인증 정책

### 비인증 접근 가능
- 모든 / (홈, stays, packages, journal, membership 안내, goods, about)

### 인증 필요
- /pass (마이 G-Pass)
- /community (글 작성 시)
- 결제 진입 (예약 확정 단계)

### 권한 필요
- /admin (operator 역할만)

인증되지 않은 사용자가 인증 페이지에 접근 시 /auth로 리다이렉트하고 redirect 쿼리스트링으로 원래 경로 보존.

---

## 이미지 저장 (마이 G-Pass 카드)

마이페이지에서 G-Pass 카드를 이미지로 저장하는 기능.
html2canvas로 카드 영역 캡처 → 자동 다운로드.
파일명: `g-pass-{사용자명}-{YYYYMMDD}.png`