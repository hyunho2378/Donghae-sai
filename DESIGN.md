# DESIGN.md — 고운고성(Goun Goseong) 디자인 시스템

## 플랫폼

반응형 웹앱. 320px (소형 모바일) ~ 2560px (4K 32인치 모니터)까지 단일 코드베이스로 대응.

스테이폴리오(stayfolio.com) 디자인 언어를 벤치마크한다. 큰 사진, 깨끗한 흰 배경, 명확한 타이포그래피 위계, 절제된 인터랙션.

---

## 톤앤매너 원칙

깔끔하고 신뢰감 있으며 콘텐츠(사진, 거점 정보, 패키지)가 주인공이 되도록 한다. UI는 가능한 한 사라진다. 화려한 그라데이션, 그림자, 일러스트 일체 금지. 정보 위계와 사용자 흐름이 가장 중요하다.

---

## 색상 (이 외 절대 사용 금지)

### 배경
| 역할 | Tailwind | HEX |
|------|---------|-----|
| 메인 배경 | bg-white | #FFFFFF |
| 카드 배경 | bg-bg-card | #FAFAFA |
| 섹션 구분 배경 | bg-bg-mute | #F5F5F5 |
| 다크 섹션 배경 | bg-black | #000000 |

### 텍스트
| 역할 | Tailwind | HEX | 사용처 |
|------|---------|-----|--------|
| 주 텍스트 | text-text-pri | #000000 | 본문, 타이틀 |
| 강조 텍스트 | text-text-strong | #171719 | 카드 타이틀, 가격 |
| 보조 텍스트 | text-text-sec | #333333 | 설명, 부제 |
| 메타 텍스트 | text-text-meta | #6B6B6E | 캡션, 날짜, 라벨 |
| 비활성 텍스트 | text-text-ter | #979799 | placeholder, disabled |
| 다크 배경 위 | text-white | #FFFFFF | 다크 섹션 |

### 프라이머리 (브랜드 키컬러)
| 역할 | Tailwind | HEX |
|------|---------|-----|
| 프라이머리 | text-primary, bg-primary | #60A5FA |
| 프라이머리 hover | bg-primary-hover | #3B82F6 |
| 프라이머리 약색상 (선택 배경) | bg-primary-soft | #EFF6FF |

### 경계선
| 역할 | Tailwind | HEX |
|------|---------|-----|
| 얇은 구분선 | border-border-sub | #EAEAEA |
| 기본 경계선 | border-border-def | #DCDCDC |
| 강조 경계선 (선택) | border-primary | #60A5FA |

### 시스템 컬러 (최소 사용)
| 역할 | HEX | 사용처 |
|------|-----|--------|
| 성공 | #16A34A | 결제 완료 토스트 |
| 경고 | #F59E0B | 잔여석 부족 |
| 에러 | #DC2626 | 폼 검증 실패 |

#### 절대 금지 사항

- #FFFFFF, #000000 외 다른 흰색/검정 변형값 사용 금지 (#FAFAFA, #F5F5F5는 카드/섹션 배경 한정 허용. 그 외 #FEFEFE, #0A0A0A 등 변형값 일체 금지)
- 누리끼리한 톤 (#FFF8E7, #FFFAF0 등) 일체 금지
- 회색 변형값 임의 추가 금지 (정의된 6단계 외 사용 금지)
- 그라데이션 일체 금지 (`bg-gradient-*` 클래스 전부 금지)
- 다중 색상 텍스트 금지

---

## 폰트 (Pretendard 단독)

### 로드
```html
<link rel="stylesheet" as="style" crossorigin
      href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css" />
```

### Tailwind font-family 설정
```js
fontFamily: {
  pretendard: ['"Pretendard Variable"', '"Pretendard"']
}
```

fallback에 system-ui, sans-serif, -apple-system, Roboto 등 일체 추가 금지. Pretendard 변종 두 개로 끝.

### 폰트 weight 매핑 (네 단계 모두 능동적으로 사용)

| Weight | 값 | 사용처 |
|--------|-----|--------|
| Bold | 700 | 페이지 타이틀, 카드 타이틀, 가격, 핵심 강조 |
| Medium | 500 | 섹션 헤딩, 버튼, 네비게이션, 카테고리 라벨 |
| Regular | 400 | 본문, 카드 설명, 일반 텍스트 |
| Light | 300 | 메타 정보, 캡션, 부가 설명 (한 페이지에 1~2 영역만) |

#### 절대 원칙

- 한 페이지에 한 weight만 죄다 적용하는 것 금지. 위계는 weight로 명확하게 구분한다.
- Bold와 Regular만 쓰는 것도 금지. Medium을 능동적으로 사용해 위계 단을 늘린다.
- Light는 절제 사용. 메타 영역 한정.
- font-weight를 className으로 명시 (font-bold, font-medium, font-normal, font-light) 또는 토큰 클래스로 일관성 유지.

---

## 타이포그래피 스케일

### 기본 본문 사이즈
- 모바일 기본: 15px
- 태블릿/데스크탑: 16px
- 4K (2560px+): 17px

### 스케일 토큰

| 역할 | Weight | 모바일 | 태블릿 | 데스크탑 | 4K |
|------|--------|--------|--------|----------|-----|
| Display (히어로) | 700 | 32px | 44px | 56px | 72px |
| H1 페이지 타이틀 | 700 | 24px | 28px | 32px | 36px |
| H2 섹션 헤딩 | 700 | 20px | 22px | 24px | 28px |
| H3 카드 타이틀 | 700 | 17px | 18px | 19px | 20px |
| H4 서브 타이틀 | 500 | 15px | 16px | 16px | 17px |
| Body Large | 400 | 16px | 17px | 17px | 18px |
| Body | 400 | 15px | 16px | 16px | 17px |
| Body Small | 400 | 14px | 14px | 14px | 15px |
| Caption | 500 | 12px | 12px | 13px | 13px |
| Meta | 300 | 12px | 12px | 13px | 13px |
| Label | 500 | 11px | 11px | 12px | 12px |

### 자간 (letter-spacing)
- 본문: -0.01em
- 제목 (H1~H3): -0.02em
- 라벨/메타 (uppercase 사용 시): 0.06em

### 행간 (line-height)
- 본문: 1.7 (`leading-relaxed`)
- 제목: 1.25 (`leading-tight`)
- 카드 설명: 1.6

---

## 반응형 브레이크포인트

```js
screens: {
  'xs':  '360px',
  'sm':  '640px',
  'md':  '768px',
  'lg':  '1024px',
  'xl':  '1280px',
  '2xl': '1536px',
  '3xl': '1920px',
  '4xl': '2560px'
}
```

### 콘텐츠 max-width 정책

| 컨테이너 | max-width | 사용처 |
|----------|-----------|--------|
| 페이지 컨테이너 (기본) | 1400px | 일반 페이지 본문 |
| 와이드 컨테이너 | 1600px | 카드 그리드, 갤러리 |
| 풀와이드 | 100% | 히어로 슬라이더, 다크 섹션 |
| 텍스트 컨테이너 | 720px | 저널 본문, 약관 |

4K 모니터에서 콘텐츠가 한쪽으로 늘어지지 않도록 max-width로 중앙 정렬한다.

### 페이지 좌우 padding (px)

| 브레이크포인트 | padding-x |
|---------------|-----------|
| xs ~ sm | 20px |
| md | 32px |
| lg | 48px |
| xl ~ 2xl | 64px |
| 3xl ~ 4xl | 96px |

### 그리드 컬럼 (카드 그리드 기준)

| 브레이크포인트 | 컬럼 |
|---------------|------|
| xs ~ sm | 1 |
| md | 2 |
| lg ~ xl | 3 |
| 2xl ~ 3xl | 4 |
| 4xl | 4 (max-width로 제한, 컬럼 늘리지 않음) |

---

## Spacing 스케일

Tailwind 기본 스페이싱 사용 + 추가 토큰

| 토큰 | 값 |
|------|-----|
| 0.5 | 2px |
| 1 | 4px |
| 2 | 8px |
| 3 | 12px |
| 4 | 16px |
| 5 | 20px |
| 6 | 24px |
| 8 | 32px |
| 10 | 40px |
| 12 | 48px |
| 16 | 64px |
| 20 | 80px |
| 24 | 96px |
| 32 | 128px |

### 섹션 상하 간격 (py)
- 모바일: 48px (py-12)
- 태블릿: 72px (py-18)
- 데스크탑: 96px (py-24)
- 4K: 128px (py-32)

상하 여백을 충분히 줘서 콘텐츠 간 호흡을 확보한다. 답답하게 붙이지 않는다.

### 카드 내부 패딩
- 모바일: 16px
- 데스크탑: 20px
- 카드 간 gap: 16px (모바일) / 24px (데스크탑)

---

## 모서리 (border-radius)

| 토큰 | 값 | 사용처 |
|------|-----|--------|
| sm | 6px | 작은 배지, 인풋 |
| md | 10px | 버튼 보조, 작은 카드 |
| lg | 12px | 기본 버튼, 옵션 박스 |
| xl | 16px | 카드 |
| 2xl | 20px | 큰 카드, 모달 |
| full | 9999px | 칩, 아바타 |

이 7개 외 임의 radius 값 사용 금지.

---

## 페이지 구조 (스테이폴리오 벤치마크)

### 헤더 (TopNav)
- 좌측: 로고 (스택형 또는 가로형)
- 중앙: 검색바 (어디로 떠날까요? 형식)
- 우측: 텍스트 메뉴 (FIND STAY / PACKAGES / JOURNAL / MEMBERSHIP) + 아이콘 그룹 (로그인, 북마크, 언어)
- 헤더 높이: 80px (데스크탑), 60px (모바일)
- 배경: 흰색, 하단 1px solid #EAEAEA

### 히어로
- 풀와이드 슬라이더 (16:9 또는 21:9 비율)
- 슬라이드 인디케이터 우측 하단 (01 / 06 형식)
- 좌우 화살표 네비게이션
- 슬라이드 위 텍스트는 어두운 이미지 위에만 사용 (대비 충분히 확보)

### 카드 그리드
- 이미지 우선 (16:9 또는 4:3)
- 이미지 좌상단에 배지 (마감할인, 프로모션, 단독소개)
- 이미지 우상단에 북마크 아이콘
- 이미지 하단에 카테고리/지역 메타 (12px Light)
- 그 아래 카드 타이틀 (17px Bold)
- 그 아래 부제/설명 (15px Regular)
- 마지막에 제공자 (14px Medium)

### 푸터
- 어두운 배경 또는 흰 배경 + 상단 1px 구분선
- 회사 정보, 운영 정보, SNS 링크
- 패딩 상하: 64px (데스크탑)

---

## 인터랙션 정책

### 허용
| 효과 | duration | 대상 |
|------|----------|------|
| opacity 0→1 + translateY 8→0 | 400ms ease-out | 페이지 진입 |
| background 변화 | 150ms ease | 버튼 hover |
| border 변화 | 150ms ease | 카드/옵션 hover |
| color 변화 | 100ms ease | 링크 hover |
| 이미지 zoom (scale 1→1.04) | 600ms ease | 카드 이미지 hover (이미지 한정 예외) |
| 슬라이더 transform | 400ms ease | 히어로 슬라이드 |

### 금지
- box-shadow 일체 금지
- 카드/버튼에 scale transform 금지 (이미지 zoom 한정 예외만 허용)
- backdrop-blur 금지
- 회전 transform 금지
- WebGL, 3D, parallax 일체 금지
- 자동 슬라이드 5초 미만 금지 (사용자 인지 시간 확보)
- 그라데이션 텍스트 금지

---

## 외부 자원 (아이콘 / 일러스트 라이브러리)

### 아이콘 라이브러리

기본 사용 (필수)
- lucide-react — https://lucide.dev
  모든 인터페이스 아이콘은 여기서만 가져온다.

보조 허용 (사용 시 사용자 사전 승인 필요)
- Bootstrap Icons — https://icons.getbootstrap.com
- react-icons — https://react-icons.github.io/react-icons
- Heroicons — https://heroicons.com

규칙
- 한 페이지 내에서 아이콘 라이브러리 섞어 쓰지 않는다. 보조 라이브러리 도입 시 해당 페이지 내 모든 아이콘을 동일 라이브러리로 통일한다.
- AGENT는 임의로 보조 라이브러리 도입 금지. 사용자 승인 후에만 추가.
- 아이콘 사이즈 16 / 20 / 24 / 32 / 48px 다섯 단계만 사용. 임의 사이즈 금지.
- 아이콘 색상은 정의된 텍스트 토큰 (text-text-pri, text-text-sec, text-text-meta, text-primary, text-white) 중 하나만 사용.

### 일러스트 라이브러리

허용
- unDraw — https://undraw.co/illustrations
  컬러 변경 가능한 SVG 일러스트.

규칙
- 일러스트 사용 위치는 EmptyState, 가입/로그인 페이지, 온보딩 화면, 404/500 에러 페이지로 한정.
- 카드 그리드, 거점 상세, 패키지 상세 등 콘텐츠 페이지에서 일러스트 사용 금지.
- 일러스트 + 사진 한 화면 혼용 금지. 둘 중 하나만.
- 일러스트 메인 컬러는 프라이머리 #60A5FA 또는 흑백으로 통일. unDraw에서 다운로드 시 컬러를 #60A5FA로 변경한 후 사용. 알록달록한 다색 일러스트 절대 금지.
- 일러스트 파일은 SVG로 저장하여 `client/public/images/illustrations/` 에 보관.

---

## 콘텐츠 작성 규칙

### UI 텍스트
- 명확하고 간결하게.
- 동사형으로 끝내거나 명사형 명령으로 통일 (혼용 금지).
- "여행을 시작합니다" (X) → "여행 시작하기" (O)

### AI 응답 / 추천 텍스트
다음 기호 절대 사용 금지
- 별표 *
- 콜론 :
- 작은따옴표 '
- em-dash —, 하이픈 ㅡ
- 이모티콘 일체

### 톤
- 시니어/노마드 모두를 아우르는 차분한 안내 톤
- 권유형 종결어미 사용 (~보세요, ~해보세요, ~하실 수 있어요)
- AI 자기 언급 금지 (저는 AI입니다 등)
- 전문 용어 대신 쉬운 말로 풀어 설명

---

## 접근성 (WCAG 2.2 AA 기준)

- 모든 인터랙티브 요소는 키보드 포커스 가능
- focus-visible 스타일 명시 (2px solid #60A5FA, offset 2px)
- 텍스트 색상 대비 4.5:1 이상 (큰 텍스트는 3:1)
- 이미지 alt 속성 필수
- 링크와 버튼 명확히 구분
- 폼 라벨 association 필수

---

## 절대 금지 사항 (체크리스트)

- [ ] Pretendard 외 다른 폰트 사용 없음
- [ ] system-ui, sans-serif fallback 추가 없음
- [ ] #FFFFFF, #000000 외 임의 흰색/검정 변형 없음 (정의된 카드/섹션 회색 외)
- [ ] 그라데이션 (bg-gradient, text-gradient) 일체 없음
- [ ] box-shadow 일체 없음
- [ ] scale 변형 (이미지 zoom 외) 없음
- [ ] 이모티콘 (모든 .jsx, .json, .md) 없음
- [ ] AI 응답에 별표, 콜론, 작은따옴표, em-dash 없음
- [ ] 한 페이지에 단일 weight만 사용된 곳 없음 (위계 명확)
- [ ] Light weight 남발 없음 (메타 영역 한정)
- [ ] 정의된 색상 토큰 외 hex 직접 입력 없음
- [ ] 정의된 폰트 스케일 외 임의 크기 없음