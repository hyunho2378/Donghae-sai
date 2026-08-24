# PROGRESS_CHATBOT_B.md 챗봇 레이아웃 대공사 (세션 B)

## 롤백 방법 (맨 위에 둔다)

이 작업은 브랜치 `chat-layout-panel` 에서 했다. 인라인 출처 버튼 버전은 `main @ 03aa9d0`(세션 A 끝) 에 그대로 있다.

- 되돌리기: `git checkout main` (인라인 버전 즉시 복구). 브랜치는 남겨둔다
- 이 작업 채택: 로컬에서 확인 후 `git checkout main && git merge chat-layout-panel`
- main 은 아직 안 건드렸다. 프로덕션 배포는 그대로 인라인 버전이다

## 실행 환경 한계 (먼저 밝힘)

이 환경에는 연결된 브라우저 확장도, Gemma/Ollama 백엔드(localhost:3000/11434)도 없다.
따라서 좌우 분할 전환과 카드 클릭 이동의 실제 스크린샷은 남기지 못했다. 대신 아래로 검증했다.
- 클라이언트 vite build 통과
- 출처 리졸버 단위 검증: stays 코스 스토리 패스 네 종류가 실제 데이터와 라우트로 카드가 생성됨 확인
  - stays → 장소 카드(사진+설명) /stays/sai-019
  - packages → 코스 카드(사진+설명) /packages/course-2030-walk-mukho
  - story → 스토리 카드(사진) /story/people-mukho
  - membership → 패스 카드(사진 폴백) /membership
- 금지 요소 0(box-shadow, gradient, backdrop-blur, 이모지, 가운데점, 줄표)
현호 님 로컬(Ollama 구동 + `npm run dev`, 세션 A 프롬프트 반영 위해 서버 재기동)에서 완료 기준 8개를 육안 확인하고 스크린샷 남기면 된다.

## 한 일

### 좌우 분할 레이아웃 (SovereignHero 재작성)

- 첫 화면(idle): 중앙 입력창 + 온보딩(헤드라인, 서브, 추천 질문 3개, 로그인 안내). 기존 중앙 챗봇 유지
- 질문 전송 시 phase idle→leaving→chat 로 전환. 대화 상태에서 좌우 분할로 바뀐다
- 좌: 대화(사용자 질문 우측 정렬, 답변 좌측) 스크롤 + 하단 고정 입력창. 무코는 대화 중 입력창 옆에만
- 우(데스크톱 lg 이상): 출처 카드 패널 340px. 모바일은 대화 아래에 카드를 쌓는다(lg:hidden)
- 상단 바 좌측에 새 대화 버튼. 하단 새 대화 버튼은 제거

### 우측 출처 카드 (SourcePanel 신규 + resolveSources)

- useSovereignChat 에 resolveSources(sources, links) 추가. 검증된 link 라우트로 원본 데이터를 찾아 사진 이름 설명 종류를 붙인다
  - /stays/ → staysData(main_image, short_description, 종류 장소)
  - /packages/ → packagesData(main_image, short_description, 종류 코스/프로그램)
  - /story/ → storiesData(cover_image, subtitle, 종류 스토리)
  - /membership /pass → 패스 카드(사진 없으면 브랜드 폴백)
  - 라우트 없는 개념 항목(포지셔닝 등)은 카드로 못 만들어 건너뛴다
- SourcePanel: 카드 사진 + 이름(볼드) + 설명 2줄(line-clamp-2) + 우상단 화살표. 카드 전체가 Link 로 상세페이지 이동
- 상위 3개 노출, 더 있으면 "출처 N건 전체보기"로 펼침. box-shadow 없이 bg-bg-card 톤으로 구분

### 킬러 기능(출처→상세) 보존

- 인라인 출처 칩을 없앤 게 아니라 우측 카드로 옮겼다. link 필드와 라우트 매핑을 그대로 재사용
- 히어로 답변은 인라인 칩 끔(showSources false), 액션바는 유지(showActions). FAB(SovereignChat)는 우측 패널이 없으므로 기존 인라인 칩 유지
- 스트리밍 로직 미변경

### 온보딩과 카피 (동해 맥락, 네이버 카피 미사용)

- 헤드라인 "오늘 밤 동해, 무엇이든 물어보세요", 서브 "동해 로컬 데이터로 오늘의 여행을 안내해요"
- 추천 질문 오늘 밤 묵호에서 뭐 하지 / 아이랑 가기 좋은 코스 알려줘 / 뚜벅이인데 1박 2일 추천해줘
- 로그인은 시각 안내 수준. /auth(P4 목업 로그인, 아무 값 통과)로 연결. 실제 세션 저장은 없음
- 더욱 풍부해진 답변 같은 네이버 문구 없음

### 탭 전환 동작

- HomePage 가 SovereignHero 에 key={location.key} 를 줘서, 홈을 벗어났다 돌아오면 챗봇이 초기(idle)로 리셋된다. 홈=챗봇, 홈 밖=일반 사이트. 자연스러운 기본값이라 유지

## DESIGN 준수

- box-shadow 금지 준수: 새 챗봇 요소는 shadow-card 제거, R1 웜 배경 위 흰 톤으로만 구분. 포커스 시 민트 링
- 유채색 프라이머리(민트)와 accent(코랄) 범위. Pretendard. lucide 아이콘만. 이모지 가운데점 줄표 0

## 수정/신규 파일

- client/src/components/SovereignHero.jsx (분할 레이아웃 재작성)
- client/src/components/SourcePanel.jsx (신규)
- client/src/components/AnswerText.jsx (showActions 분리)
- client/src/hooks/useSovereignChat.js (resolveSources 추가)

## 남은 작업 / 확인 필요 (현호 님)

- [ ] 로컬에서 좌우 분할 전환 육안 + 스크린샷
- [ ] 카드 클릭 이동 스팟/코스/패스/프로그램 각 1회 테스트
- [ ] 데스크톱/모바일 폭 레이아웃 확인
- [ ] 확인 후 main 병합 여부 결정. 병합 전까지 프로덕션은 인라인 버전
- [ ] (범위 밖 발견) Layout.jsx 가 bg-white 로 감싸 R1 웜 배경을 덮는다. 레이아웃 정리 시 함께 볼 것

## 데이터 관련 (임의 생성 안 함)

- 카드 사진/설명은 stays packages stories 의 기존 필드(main_image/cover_image, short_description/subtitle)를 그대로 사용. 데이터 미변경
- 패스 항목은 상세 데이터가 없어 사진 폴백 + 고정 안내 문구. 데이터를 지어내지 않았다
