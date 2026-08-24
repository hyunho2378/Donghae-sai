# PROGRESS_CHATBOT_B — 챗봇 좌우 분할 레이아웃

## 롤백 방법 (실패 시 즉시 복구)

이 작업은 `chat-layout-panel-v2` 브랜치에서만 한다. 인라인 출처 버튼 버전은 `main`(커밋 34a8928)에 그대로 있다.

```
# 작업 폐기하고 인라인 버전으로 복귀
git checkout main

# 브랜치째 버리기
git branch -D chat-layout-panel-v2
```

과거 세션 B 1차 시도는 remote `origin/chat-layout-panel`(커밋 a3039f7)에 백업으로 남아 있다. 그 브랜치는 오래된 base(챗봇A) 위라 stale. 이번 v2는 최신 main 위에서 재작성한다.

---

## 무엇을 하는가

네이버 클로바X식 좌우 분할. 홈 히어로에서 질문을 보내면 좌측에 대화, 우측에 출처(장소/코스/패스/프로그램) 카드 패널이 뜬다. 인라인 출처 칩을 우측 카드로 옮긴다. link 필드와 라우트 매핑은 그대로 재사용한다(킬러 기능 유지).

## 데이터/서버 사실 (검증됨)

- 출처는 서버 `server/sovereign/chat.js`가 `{type:'sources', sources:[id], links:{id:route}}` 한 줄로 먼저 흘린다.
- link 라우트 분포: `/stays`(150) `/packages`(22) `/story`(7) `/membership`(5). `/pass`는 없음 → 패스는 `/membership`로 간다.
- 라우트 매핑(App.jsx): `/stays/:id` `/packages/:id` `/story/:slug` `/membership`.
- 카드 필드: stays `main_image`/`gallery[0]`+`short_description`, packages `main_image`+`short_description`+`category`, stories `cover_image`+`subtitle`.
- packages category: `program`→프로그램, `course`/`walk`→코스.

## 열린 질문 / 데이터 공백 (현호 확인 요청)

- **stays 148개 중 113개가 이미지 없음**(`main_image`, `gallery[0]` 둘 다 없음). 이미지 없는 스팟 카드는 사진 대신 placeholder(프라이머리 톤 박스 + 종류 라벨)로 뜬다. 클릭 이동은 정상. 데이터를 임의로 지어내지 않았다. 스팟 사진을 채우려면 원본 이미지가 필요하다.
- packages(22), stories(7)는 이미지 전부 있음. 문제 없음.

## 로그인/온보딩

- 실제 로그인 기능은 zustand `useAuthStore`로 존재(로컬 전용). 온보딩은 비로그인 시 추천 질문 + `/auth` 안내를 보여주는 수준. 로그인 버튼은 `/auth`로 연결만 하고 별도 신규 동작은 없다.

## 대화 상태 유지 정책

- HomePage가 `<SovereignHero key={location.key} />`로 마운트 → 홈을 떠났다 돌아오면 새 key로 리셋(초기 화면). 네이버 AI탭이 독립적인 것과 같은 자연스러운 동작이라 유지한다. 홈 안에서는 "새 대화"로만 초기화.

## 로컬 검증 한계

- 챗봇 백엔드는 로컬 Ollama/Gemma(`gemma4:e4b`)가 있어야 답과 sources가 온다. 이 환경엔 백엔드가 없어 실제 답변/카드까지의 라이브 스크린샷은 못 찍는다.
- 대신: (1) `resolveSources` 매핑 로직 self-check(node)로 스팟/코스/스토리/패스 카드 생성 검증, (2) 프론트 빌드 통과, (3) 레이아웃 전환은 백엔드 없이도 phase 전환으로 동작하므로 프론트 단독 확인 가능.

## 진행 상태

- [x] 브랜치 분리 + 롤백 문서
- [x] resolveSources 포팅 (useSovereignChat.js) — link 라우트→stays/packages/stories/membership 매칭, 중복 라우트 접힘
- [x] AnswerText showActions 분리 — 칩(sources)은 우측 패널로, 액션바(복사/공유/투표)는 좌측 답변에 유지
- [x] SourcePanel.jsx — 사진/종류/이름/2줄 설명 카드, 상위 3개 + `모두 보기 +N`, box-shadow 없이 톤 구분, 이미지 없으면 placeholder
- [x] SovereignHero 좌우 분할 재작성 — idle 중앙 → 전송 시 좌 대화 + 우 패널. 상단 좌측 새 대화, 하단 버튼 제거, 비로그인 온보딩
- [x] 빌드 통과 (`npm run build`)
- [x] self-check 통과 (`node client/scripts/check-source-cards.mjs`) — 4종 카드 생성 확인

## 완료 기준 대비 검증 결과

| 기준 | 상태 | 방법 |
|---|---|---|
| 1 첫 화면 중앙 챗봇 | 코드 확인 | phase idle 중앙 정렬 유지 |
| 2 전송 시 좌 대화 + 우 패널 전환 | 코드 확인 | phase idle→leaving→chat, 백엔드 없이도 전환 |
| 3 카드 사진/이름/2~3줄 | self-check | resolveSources 4종 생성, packages/stories 이미지 있음 |
| 4 카드 클릭 상세 이동 | self-check | 스팟 `/stays/:id` 코스 `/packages/:id` 스토리 `/story/:slug` 패스 `/membership` 라우트 검증 |
| 5 출처 다수 시 +N 접힘 | 코드 확인 | SourcePanel VISIBLE=3, 초과분 `모두 보기 +N` |
| 6 온보딩 동해 카피 | 코드 확인 | 네이버 카피 없음, 묵호/아이/뚜벅이 추천질문 |
| 7 하단 새 대화 제거, 좌측 진입 | 코드 확인 | 좌 컬럼 상단 새 대화 버튼, 하단 버튼 없음 |
| 8 데스크톱/모바일 | 코드 확인 | lg 우측 컬럼, 모바일은 대화 아래 카드 스택 |

## 스크린샷 못 남긴 이유 (정직하게)

- Claude 브라우저 확장(claude-in-chrome)이 이 환경에 연결 안 됨 → 브라우저 조작/캡처 불가.
- 챗봇 백엔드(로컬 Ollama `gemma4:e4b`)도 없음 → 실제 답변과 sources 스트림이 안 와서, 설령 브라우저가 있어도 카드가 채워진 라이브 화면은 못 만든다.
- 그래서 (1) 프론트 빌드, (2) 매핑 self-check, (3) 코드 트레이스로 검증했다. 라이브 캡처는 현호 님이 로컬에서 백엔드 켜고 `npm run dev` 로 확인해야 한다.

## 다음 (현호 확인 후)

- 스팟 이미지 공백 113/148 채울지 결정.
- 라이브 확인 후 문제 없으면 `chat-layout-panel-v2` → `main` 머지(그때 Vercel 배포). 지금은 머지 안 함.
