# PROGRESS_CHATBOT — 챗봇 레이아웃 통합 수정 (main 직접)

7개 문제 수정. 좌우 분할·카드 클릭 이동·스트리밍·온보딩·추천질문 미변경. 데이터 미변경.

## 1. 우측 맨 위로 가기 화살표 제거

**제거할 버튼이 코드에 없다.** 전역 grep 결과 위 방향 화살표는 전송 버튼(`ArrowUp`) 하나뿐. `ScrollToTop.jsx`는 라우트 변경 시 `window.scrollTo(0,0)`만 하고 UI 를 렌더하지 않는다(App 의 페이지 이동 스크롤 리셋용). 지우면 페이지 네비 스크롤이 깨지므로 유지. 사용자가 본 위 화살표는 이미 없는 상태이거나 전송 버튼. → 실제 조치는 문제 6 아래 버튼 추가.

## 2. 처음부터 2단 고정 (점프 제거)

원인: 우측 aside 를 `panelSources > 0` 일 때만 렌더 → 첫 카드 등장 시 대화 컬럼이 340px 줄며 좌측 점프.
수정: 고정 우측 aside 제거. 대화 영역을 `mx-auto max-w-[1140px]` 안에서 **답변마다 `lg:grid-cols-[minmax(0,1fr)_340px]`** 2단 행으로. 근거가 없어도 우측 340 트랙이 항상 예약되어 카드가 나중에 생겨도 좌측 폭이 안 바뀐다 → 점프 없음. idle→chat 전환만 애니메이션.

## 3. 전송 화살표 세로 정렬

입력창 컨테이너 `items-end` → `items-center`. 버튼이 입력 높이 안에서 수직 중앙. `self-stretch` 제거.

## 4. 전송 버튼 버튼감

빈 입력: `bg-bg-card`(거의 안 보임) → `bg-primary-soft text-primary`(옅은 프라이머리 원형). 입력 있으면 `bg-primary text-white`. box-shadow 없이 배경+라운드로만.

## 5. 질문 후 입력창 자동 포커스

전송 직후 `taRef.focus()` + 효과 `useEffect(opened && !streaming → focus)` 로 답변 완료 후에도 포커스 유지. idle→chat 첫 전환은 textarea 리마운트라 후자 효과가 잡는다.

## 6. 아래로 가기 버튼

스크롤 컨테이너 `onScroll` 로 맨 아래 거리 추적. `dist > 160` 이면 `ArrowDown` 버튼 표시(스크롤 영역 하단 중앙 absolute), 누르면 smooth 로 맨 아래. 맨 아래 근처면 숨김. 자동 따라가기는 `atBottomRef` 가 참일 때만 → 위로 올려 읽는 중엔 안 끌어내림. 새 질문 전송 시 `atBottomRef=true` 로 맨 아래 복귀. box-shadow 없이 테두리로 구분.

## 7. 근거 카드를 각 답변에 종속 (구글 AI Studio 방식)

고정 우측 패널 폐기. 각 답변 메시지가 `[본문 1fr | 근거 340px]` 한 행. 여러 답변이 세로로 쌓이면 각자 근거가 각자 높이 우측에 붙는다. 전체가 하나의 스크롤 컨테이너 → 스크롤하면 대화와 근거가 같이 움직인다. 근거 없는 답변은 우측 빈칸(폭은 유지). `resolveSources` 는 답변별로 호출. 카드 클릭 → 상세페이지 이동 로직 그대로. 모바일(<lg)은 grid 접혀 근거가 본문 아래 스택.

## 수정 파일

`client/src/components/SovereignHero.jsx` 한 곳. (SourcePanel/AnswerText/스토어 미변경)

## 검증 한계

브라우저 확장 미연결 + 로컬 백엔드(Gemma) 없음 → 라이브 캡처 불가. 빌드 통과 + 코드 트레이스로 확인. 백엔드 없이도 볼 수 있는 것: 2단 확정(점프 없음), 전송 버튼 정렬/배경, 자동 포커스, 아래 버튼(대화 길 때). 카드 종속·다답변 근거는 백엔드 필요. 현호 님 로컬 `npm run dev` + Ollama 로 육안 확인.
