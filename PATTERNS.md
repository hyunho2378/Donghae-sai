# PATTERNS.md — 재사용 JSX 패턴

이 문서는 컴포넌트 작성 시 그대로 가져다 쓸 JSX 템플릿 모음이다. AGENT는 본 패턴을 임의로 변형해서 사용하지 않는다. 변형이 필요해 보일 경우 즉시 작업을 멈추고 사용자 승인을 받는다.

---

## 1. 페이지 컨테이너

```jsx
<div className="min-h-screen bg-white">
  <div className="mx-auto w-full
                  px-5 md:px-8 lg:px-12 xl:px-16 3xl:px-24
                  max-w-[1400px] 2xl:max-w-[1600px]">
    {/* 페이지 콘텐츠 */}
  </div>
</div>
```

풀와이드 섹션이 필요한 경우만 max-width 제거하고 외부 div 분리.

---

## 2. 페이지 타이틀 (H1)

```jsx
<h1 className="font-pretendard font-bold
               text-[24px] md:text-[28px] lg:text-[32px] 4xl:text-[36px]
               text-text-pri tracking-[-0.02em] leading-tight">
  타이틀
</h1>
```

---

## 3. 섹션 헤딩 (H2 + 부제)

```jsx
<h2 className="font-pretendard font-bold
               text-[20px] md:text-[22px] lg:text-[24px] 4xl:text-[28px]
               text-text-pri tracking-[-0.02em] mb-2">
  섹션 제목
</h2>
<p className="font-pretendard font-normal text-[14px] md:text-[15px]
              text-text-meta">
  부제
</p>
```

---

## 4. 카드 타이틀 (H3)

```jsx
<h3 className="font-pretendard font-bold
               text-[17px] md:text-[18px] lg:text-[19px]
               text-text-strong tracking-[-0.02em]
               line-clamp-2">
  카드 타이틀
</h3>
```

---

## 5. 본문 텍스트

```jsx
<p className="font-pretendard font-normal
              text-[15px] md:text-[16px] 4xl:text-[17px]
              text-text-sec leading-relaxed tracking-[-0.01em]">
  본문 내용
</p>
```

---

## 6. 메타 텍스트 (Light 활용처)

```jsx
<span className="font-pretendard font-light text-[12px] md:text-[13px]
                 text-text-meta">
  2024년 12월 15일
</span>
```

Light는 이런 메타 영역 전용. 본문에 Light 적용 금지.

---

## 7. Primary CTA

```jsx
<button onClick={onClick}
        className="h-12 lg:h-14 px-6 lg:px-8
                   bg-primary text-white
                   font-pretendard font-medium text-[16px]
                   rounded-lg
                   hover:bg-primary-hover
                   transition-colors duration-150
                   disabled:opacity-40 disabled:cursor-not-allowed">
  버튼 텍스트
</button>
```

---

## 8. Secondary CTA

```jsx
<button onClick={onClick}
        className="h-12 lg:h-14 px-6 lg:px-8
                   bg-white text-primary
                   border border-primary
                   font-pretendard font-medium text-[16px]
                   rounded-lg
                   hover:bg-primary-soft
                   transition-colors duration-150">
  버튼 텍스트
</button>
```

---

## 9. Ghost CTA

```jsx
<button onClick={onClick}
        className="h-12 px-4
                   bg-transparent text-text-sec
                   font-pretendard font-medium text-[15px]
                   hover:text-text-pri
                   transition-colors duration-100">
  버튼 텍스트
</button>
```

---

## 10. Dark CTA (다크 섹션 한정)

```jsx
<button onClick={onClick}
        className="h-12 lg:h-14 px-6 lg:px-8
                   bg-black text-white
                   font-pretendard font-medium text-[16px]
                   rounded-lg
                   hover:bg-text-strong
                   transition-colors duration-150">
  버튼 텍스트
</button>
```

---

## 11. IconButton (40×40 hit area)

```jsx
<button aria-label="북마크"
        className="w-10 h-10 inline-flex items-center justify-center
                   rounded-full hover:bg-bg-card
                   transition-colors duration-150">
  <Bookmark size={24} className="text-text-pri" />
</button>
```

---

## 12. 카드 베이스 (이미지 + 텍스트)

```jsx
<article className="group cursor-pointer">
  <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-bg-card">
    <img src={image} alt={title}
         className="w-full h-full object-cover
                    transition-transform duration-[600ms] ease-out
                    group-hover:scale-[1.04]" />
    {badge && (
      <span className="absolute top-3 left-3
                       h-[26px] px-2.5
                       bg-primary text-white
                       font-pretendard font-medium text-[12px]
                       rounded-md inline-flex items-center">
        {badge}
      </span>
    )}
    <button aria-label="북마크"
            className="absolute top-3 right-3
                       w-10 h-10 rounded-full
                       bg-black/40 hover:bg-black/60
                       inline-flex items-center justify-center
                       transition-colors duration-150">
      <Bookmark size={20} className="text-white" />
    </button>
  </div>
  <div className="pt-4">
    <span className="font-pretendard font-light text-[12px] md:text-[13px]
                     text-text-meta">
      {region} · {type}
    </span>
    <h3 className="mt-1 font-pretendard font-bold
                   text-[17px] md:text-[18px] lg:text-[19px]
                   text-text-strong tracking-[-0.02em]
                   line-clamp-2">
      {title}
    </h3>
    <p className="mt-1 font-pretendard font-medium text-[14px] text-text-sec">
      {host}
    </p>
    <p className="mt-2 font-pretendard font-bold text-[16px] text-text-pri">
      1박 {pricePerNight.toLocaleString()}원
    </p>
  </div>
</article>
```

---

## 13. 카드 그리드 (반응형 컬럼)

```jsx
<div className="grid gap-4 md:gap-6
                grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
  {items.map(item => <StayCard key={item.id} {...item} />)}
</div>
```

4xl(2560px+)에서도 4컬럼 유지하고 max-width로 제한한다. 5컬럼 이상으로 늘리지 않는다.

---

## 14. 섹션 헤더 (좌측 타이틀 + 우측 더보기)

```jsx
<header className="flex items-end justify-between mb-6 lg:mb-8">
  <div>
    <h2 className="font-pretendard font-bold
                   text-[20px] md:text-[22px] lg:text-[24px]
                   text-text-pri tracking-[-0.02em]">
      셀렉션 타이틀
    </h2>
    <p className="mt-1 font-pretendard font-normal text-[14px] md:text-[15px]
                  text-text-meta">
      부제 한 줄
    </p>
  </div>
  <Link to="/stays" aria-label="전체 보기"
        className="w-10 h-10 rounded-full hover:bg-bg-card
                   inline-flex items-center justify-center
                   transition-colors duration-150">
    <ChevronRight size={24} className="text-text-pri" />
  </Link>
</header>
```

---

## 15. 풀와이드 섹션 (다크 배경)

```jsx
<section className="bg-black text-white py-16 lg:py-24 4xl:py-32">
  <div className="mx-auto px-5 md:px-8 lg:px-12 xl:px-16
                  max-w-[1400px] 2xl:max-w-[1600px]">
    {/* 콘텐츠 */}
  </div>
</section>
```

---

## 16. 입력 필드 (Input + Label)

```jsx
<label className="block">
  <span className="block font-pretendard font-medium text-[14px]
                   text-text-pri mb-2">
    체크인
  </span>
  <input type="date"
         className="w-full h-12 px-4
                    bg-white border border-border-def rounded-lg
                    font-pretendard font-normal text-[16px] text-text-pri
                    placeholder:text-text-ter
                    focus:outline-none focus:border-2 focus:border-primary
                    transition-colors duration-150" />
</label>
```

---

## 17. Select 필드

```jsx
<div className="relative">
  <select className="w-full h-12 pl-4 pr-10 appearance-none
                     bg-white border border-border-def rounded-lg
                     font-pretendard font-normal text-[16px] text-text-pri
                     focus:outline-none focus:border-2 focus:border-primary
                     transition-colors duration-150">
    <option value="">선택하세요</option>
  </select>
  <ChevronDown size={20}
               className="absolute right-3 top-1/2 -translate-y-1/2
                          text-text-meta pointer-events-none" />
</div>
```

---

## 18. Chip (필터 칩)

```jsx
<button onClick={onClick}
        className={`h-9 px-4 rounded-full
                   font-pretendard font-medium text-[14px]
                   transition-colors duration-150
                   ${isSelected
                     ? 'bg-primary text-white border border-primary'
                     : 'bg-white text-text-pri border border-border-def hover:border-primary'}`}>
  {label}
</button>
```

---

## 19. Badge (카드 위 작은 배지)

```jsx
<span className="h-[26px] px-2.5
                 bg-primary text-white
                 font-pretendard font-medium text-[12px]
                 rounded-md inline-flex items-center">
  마감할인
</span>
```

variant: `bg-primary text-white` / `bg-black text-white` / `bg-primary-soft text-primary` 세 종류만 허용.

---

## 20. StageBadge (관계인구 단계)

```jsx
<span className="h-[28px] px-3
                 bg-primary-soft text-primary
                 font-pretendard font-medium text-[13px]
                 rounded-full inline-flex items-center">
  방문 단계
</span>
```

마이 G-Pass 다크 카드 위에서는 `bg-white/10 text-white` 변종 허용.

---

## 21. Counter (인원 +/-)

```jsx
<div className="inline-flex items-center gap-3">
  <button aria-label="감소"
          className="w-9 h-9 rounded-full border border-border-def
                     inline-flex items-center justify-center
                     hover:border-primary
                     transition-colors duration-150">
    <Minus size={16} className="text-text-pri" />
  </button>
  <span className="w-8 text-center font-pretendard font-medium text-[16px]
                   text-text-pri">
    {count}
  </span>
  <button aria-label="증가"
          className="w-9 h-9 rounded-full border border-border-def
                     inline-flex items-center justify-center
                     hover:border-primary
                     transition-colors duration-150">
    <Plus size={16} className="text-text-pri" />
  </button>
</div>
```

---

## 22. EmptyState (결과 없음)

```jsx
<div className="flex flex-col items-center justify-center py-16 lg:py-24">
  <SearchX size={48} className="text-text-ter" />
  <h3 className="mt-4 font-pretendard font-medium text-[18px] text-text-pri">
    결과가 없어요
  </h3>
  <p className="mt-1 font-pretendard font-normal text-[15px] text-text-sec">
    조건을 바꿔서 다시 검색해 보세요
  </p>
</div>
```

---

## 23. LoadingScreen (점 3개)

```jsx
<div className="flex items-center justify-center min-h-screen">
  <div className="flex flex-col items-center">
    <div className="flex gap-2">
      <span className="w-2 h-2 rounded-full bg-primary animate-loading-dot-1" />
      <span className="w-2 h-2 rounded-full bg-primary animate-loading-dot-2" />
      <span className="w-2 h-2 rounded-full bg-primary animate-loading-dot-3" />
    </div>
    <p className="mt-6 font-pretendard font-medium text-[16px] text-text-sec">
      잠시만 기다려 주세요
    </p>
  </div>
</div>
```

index.css 애니메이션 정의
```css
@keyframes loadingDot {
  0%, 80%, 100% { opacity: 0.3; }
  40% { opacity: 1; }
}
.animate-loading-dot-1 { animation: loadingDot 1.5s infinite ease-in-out; }
.animate-loading-dot-2 { animation: loadingDot 1.5s infinite ease-in-out 0.16s; }
.animate-loading-dot-3 { animation: loadingDot 1.5s infinite ease-in-out 0.32s; }
```

---

## 24. Toast (상단 알림)

```jsx
<div role="status" aria-live="polite"
     className="fixed top-20 right-6 z-50
                px-5 py-4 max-w-[360px]
                bg-text-strong text-white
                font-pretendard font-medium text-[15px]
                rounded-xl">
  {message}
</div>
```

---

## 25. 페이지 진입 fade

페이지 최상단 div에만 적용
```jsx
<div className="page-enter">
```

index.css에 정의
```css
.page-enter {
  animation: pageEnter 400ms ease-out;
}
@keyframes pageEnter {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

---

## 26. focus-visible 글로벌 룰

index.css에
```css
*:focus { outline: none; }
*:focus-visible {
  outline: 2px solid #60A5FA;
  outline-offset: 2px;
  border-radius: 4px;
}
```

---

## 27. PassCard (다크 카드, html2canvas 캡처용)

```jsx
<div ref={cardRef}
     className="relative aspect-[16/10] w-full max-w-[480px]
                bg-black text-white rounded-[20px]
                p-6 lg:p-8
                overflow-hidden">
  <div>
    <p className="font-pretendard font-bold text-[22px]">{userName}</p>
    <span className="mt-2 inline-flex items-center h-7 px-3
                     bg-white/10 text-white
                     font-pretendard font-medium text-[13px] rounded-full">
      {stageLabel} 단계
    </span>
  </div>
  <p className="mt-auto font-pretendard font-medium text-[14px]">
    누적 방문 {totalVisits}회
  </p>
  <div className="absolute bottom-6 right-6 w-24 h-24 bg-white rounded-md
                  flex items-center justify-center">
    <QRCode value={passCode} />
  </div>
</div>
```

다크 카드는 PassCard 한정 예외 사용. 다른 곳에 다크 카드 도입 금지.

---

## 절대 금지 패턴

- box-shadow 일체 금지
- 그라데이션 배경 금지 (bg-gradient-* 클래스 일체 금지)
- 카드/버튼에 scale 금지 (이미지 hover zoom만 한정 허용)
- backdrop-blur 금지
- 회전 transform 금지
- 그라데이션 텍스트 금지
- 이모티콘 삽입 금지
- 임의 폰트 사이즈 (DESIGN.md 스케일 외) 금지
- 임의 색상 hex 직접 입력 금지
- system-ui, sans-serif fallback 추가 금지
- 한 페이지에 단일 weight만 사용 금지
- Light weight를 본문에 적용 금지
- 본 문서의 패턴을 임의로 변형 금지 (변형 필요 시 사용자 승인)