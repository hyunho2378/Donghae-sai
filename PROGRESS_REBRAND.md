# PROGRESS_REBRAND.md 리브랜딩 진행 추적

작성일 2026년 8월 24일. 마감 2026년 8월 26일. 작업 완료 시마다 이 문서를 갱신한다.

## 완료 (2026년 8월 24일 기준)

- 소버린 챗봇 백엔드. RAG 검색, Ollama 로컬 추론, Express 라우트, curl 검증
- 챗봇 화면 연결. SovereignChat 컴포넌트, Layout 등록
- 응답 스트리밍. 첫 토큰 0.3초, NDJSON 방식
- 카름스테이와 고운고성 비교 분석
- 리브랜딩 문서 세트 작성
- 스킬 설치. skills-main 6종을 .claude/skills에 배치. make-interfaces-feel-better는 zip 미보유로 설치 실패
- 홈 챗봇 히어로 V1. 다크 밤하늘 안. CHATBOT_HERO_V2.md로 폐기
- 홈 챗봇 히어로 V2. 흰 배경 클로바X식. 두 색 헤드라인, radius 2xl 대형 입력창, 세로 추천 질문 3행, 인라인 대화 패널, 근거 칩 primary-soft, 스트리밍 중 입력 잠금, 마크다운 정제 이중 방어, 홈 FAB 숨김. 별과 점과 선과 트월링 전부 제거
- 근거 라벨 맵 23개 항목 반영. 근거 칩은 4개까지 노출하고 나머지는 외 N개로 접음
- 스트리밍 로직을 hooks/useSovereignChat.js로 공유화. 히어로와 FAB가 같은 로직 사용
- RAG 튜닝. 키워드 점수 정렬 후 상위 3개만 반환, 답변 다섯 문장 제한. 프롬프트 2058자에서 778자로 축소, 첫 토큰 0.42초
- 프라이머리 대비 보정. 헤드라인 앞부분과 전송 버튼을 primary-hover로 올려 3.68대 1 확보
- 헤더 리브랜딩. 로고 동해사이, 메뉴 한글화, 중앙 검색바 제거
- 히어로에 권역 5개와 패스 바로가기 아이콘 줄 추가. 히어로 min-height로 첫 화면 채움
- 홈 첫 섹션 교체. 고성 벚꽃 슬라이더와 셀럽 셀렉션 제거, 동해사이 5개 권역 섹션 신설
- 정리 대상 전수 진단. 이모지 30줄, AI 티 112건, 고성 잔재 1601줄, 외부 이미지 494건
- 이미지 자산 로컬 배치. places 21, food 17, regions 5. 총 18MB
- 외부 이미지 493건을 로컬 places 경로로 전량 교체. client/src unsplash 0건
- 폰트 자가 호스팅. PretendardVariable.woff2를 client/public/fonts에 배치, index.html CDN 링크 제거, index.css에 font-face 선언
- Ollama keep_alive 30m 적용, server/warmup.sh 생성
- make-interfaces-feel-better 스킬 설치 완료

## 진행중

전면 리브랜딩 밤샘 세션 (2026년 8월 24일 새벽)

완료
- 1-1 stays.json. 원본 3종을 파서로 옮겨 104건 생성. EAT 72 SEE 26 PLAY 3 STAY 3. 5권역 매핑, 별점과 리뷰수 제거, 사진 35건 연결
- 1-2 packages.json. 자료집 course 8건을 1박 2일 코스로 교체. PackageCard와 PackageDetailPage를 코스용으로 개조하고 예약 결제 흐름 제거
- 1-3 membership_plans.json과 MembershipPage. 월 구독 3종을 패스 1일권 5,000원 2일권 8,000원 3일권 10,000원으로 교체. 페이지 전면 재작성
- 의존 화면 수정. StaysPage 필터 5권역과 EAT STAY PLAY SEE, StayCard 별점 제거, StayDetailPage 호스트와 후기 제거, lib/format.js 라벨 교체

- 1-4 journal 15건 카페와 소품샵과 책방, goods 8건 특산물, stories 5권역으로 축소, community 비움
- Footer AboutPage HomePage StoryListPage IconGroup SearchModal CheckoutPage AdminPage PassPage 잔재 제거
- 고성 잔재 client/src 전체 0건 달성. unsplash 0건 유지

- 2단계 이미지 로컬화. client/src unsplash 0건 유지, 외부 이미지 요청 0건
- 3단계 날짜 버그. 원인은 계산이 아니라 입력 제약 부재였다. 재현으로 확정
- 4단계 시스템 UI. DateRangePicker와 Select를 커스텀으로 전면 교체. 네이티브 select와 input type date 노출 0건
- 5단계 이모지 제거. 화면 노출 이모지 0건, 소스 이모지 0건, 가운데점 0건
- humanize-korean 스킬 설치 완료

원본 미수급
- 현지인맛집.md 한 종만 미수급. 맛집권역별_0824.md로 대체했다
- 관광코스기획안, 프로그램기획안, 패스가격설계 세 종은 2026년 8월 24일 오전 수급 완료. 원본자료 폴더에 배치

## 프로그램과 마이 패스 세션 (2026년 8월 24일 오전)

완료
- 프로그램 10개 데이터. 프로그램기획안_0824.md를 파서로 읽어 packages.json에 category program으로 병합. 코스 8건은 category course. 새 JSON과 새 페이지를 만들지 않고 라우트와 카드와 상세 레이아웃을 그대로 재사용했다
- 프로그램 전용 필드 신설. meal_options, breakfast_options, stay_options, signature_experience. 열 건 모두 식사 3곳과 아침 3곳과 숙소 3곳과 핵심 체험이 채워졌다
- 프로그램 이미지. 지어내지 않고 DAY1 일정에 등장하는 장소명을 stays.json 실데이터와 문자 대조해 매칭되는 로컬 사진만 붙였다. 매칭 실패 시 권역 사진
- PackagesPage에 코스 8과 프로그램 10 탭 신설. HomePage COURSE 섹션은 코스 3건과 프로그램 3건을 섞어 노출
- PackageCard 배지를 badges 배열 기반으로 교체. 프로그램은 이동수단 자료가 없어 권역으로 대체 노출
- 숙소 보강. 두 원본의 숙소 후보를 파서로 수집해 STAY 3건에서 21건으로 확대. 업체명이 아닌 후보군 표현 5개는 제외
- 마이 패스 개조. 관계인구 4단계를 전부 제거하고 스탬프 7종으로 교체. 권역 5개와 별빛과 완주
- 스탬프 시각화. 여권 도장형 원형 격자, 채운 것은 프라이머리 테두리와 primary-soft, 안 채운 것은 회색 외곽선. 진행률 막대와 4 나누기 7 숫자 병기
- StageBadge.jsx 삭제. format.js의 STAMP_LABEL을 STAMPS 7종 정의로 교체
- 서버 관계인구 잔재 제거. stageEnum 삭제, roleEnum을 뚜벅이와 자차 4종으로 교체, profiles.stage를 stamps 문자열로 교체, pass 라우트 응답 교체

발견하고 고친 구멍
- 마이 패스가 RequireAuth 뒤에 있었다. NeonDB 미연결이라 로그인이 불가능해 발표에서 화면을 열 수 없었다. 데모 데이터 기반 화면이므로 가드를 제거했다
- server/package.json의 Goun Goseong 표기와 reservations.js의 GP 패스 코드 접두사가 남아 있었다. 각각 동해사이와 DHS로 교체

실측 검증 (2026년 8월 24일 오전)
- 라우트 16개 렌더. 콘솔 에러 0, 깨진 이미지 0, 고성 잔재 0, 이모지 0, 가로 넘침 0
- 320 360 768 1024 1440 1920 2560 일곱 폭에서 /pass와 /packages와 프로그램 상세 가로 넘침 0
- 스탬프 터치 타깃 최소 변 44픽셀. 1024에서 44, 나머지 폭에서 61 이상
- 고성 계열 16개 단어 grep. client/src와 server 전체 0건
- unsplash 0건, 외부 이미지 URL 0건, 가운데점 0건
- packages 18건 (코스 8, 프로그램 10), stays 122건 (EAT 72, SEE 26, STAY 21, PLAY 3)

다음 작업
- 5-2 humanize-korean 윤문. 히어로와 권역과 코스와 프로그램과 패스와 About 카피 대상. 데이터가 다 들어왔으므로 이제 실행 가능
- 윤문 후 확정 수치 문자 대조. 5,000 8,000 10,000, 1,220만 9,032명, 14.2퍼센트
- 현지인맛집.md 수급 시 EAT 항목 보강
- 숙소 21건의 주소와 영업시간과 가격은 여전히 확인 안 됨. 업체 확인 후 채운다

## 다음 작업

홈 하단 섹션 재구성. 패키지 프로모션과 저널과 멤버십 배너를 동해사이 콘텐츠로 교체

## 발표 전 필수 처리 (전부 해결됨, 2026년 8월 24일)

- 외부 이미지: 해결. 6개 페이지 74장 오프라인 로드 확인, 깨짐 0
- 폰트: 해결. 로컬 woff2 자가 호스팅, 외부 요청 0건
- Ollama 워밍업: 해결. keep_alive 30m와 warmup.sh. 워밍업 후 첫 토큰 1.57초
- 권역 이미지: 해결. 5장 전부 실사진 표시

## 최종 검증 실측 (2026년 8월 24일 새벽)

1. 고성 잔재 0건. grep 대상 16개 단어 전부
2. unsplash 0건
3. 이모지 0건. 소스와 화면 모두
4. 네이티브 select와 input type date 노출 0건
5. box-shadow 0건, 그라데이션 0건
6. 데이터 JSON 7종 전부 동해사이 내용. stays 104건, packages 8건, membership 3건, journal 15건, goods 8건, stories 5건, community 0건
7. 날짜 버그 원인 확정. min max 속성 부재와 버튼 검증 부재. 커스텀 캘린더로 해결
8. 연도 선택 3x3 그리드 9칸 확인. 가로 스크롤 컨테이너 없음
9. 지어낸 사실 없음. 확인 안 됨 표기 유지
10. 320에서 2560까지 7단계 가로 스크롤 0. 5개 주요 페이지 전부
11. 14개 라우트 렌더 에러 0건, 깨진 이미지 0건

## 발표 당일 절차

1. ollama serve 실행
2. server 폴더에서 node index.js
3. server 폴더에서 ./warmup.sh 실행. 콜드 스타트라 약 27초 걸린다. 발표 5분 전에 돌린다
4. client 폴더에서 npm run dev
5. 와이파이 차단 후 시연

## 진행 순서 (발표 노출 우선)

1. 스킬 설치. SKILLS_SETUP.md
2. 홈 챗봇 히어로. CHATBOT_HERO.md. sources 표시, 입력 잠금, 마크다운 정제 포함
3. 홈 섹션 재구성. IA_DONGHAESAI.md 홈 구성 8개 섹션
4. 패스 구매 페이지 개조. /membership
5. 마이 패스 대시보드 개조. /pass
6. 제휴처와 프로그램 데이터 교체. 실데이터 도착 후
7. 전체 카피 윤문과 검수

## 실데이터 대기

- 권역별 맛집 25개
- 프로그램 2030 4개, 4050 4개
- 패스 구성 2030 10개, 4050 10개와 가격
- 관광 코스
- 로컬 사람 실명과 인터뷰 인용 동의

## 확정 필요 (현호 님 결정 대기)

- 커뮤니티 메뉴 라벨. 지시서에 없어 커뮤니티로 한글화함. 발표 범위 포함 여부에 따라 제거 가능
- make-interfaces-feel-better 스킬 zip 수급

- 네비 메뉴 라벨 한글화 여부
- 메인 태그라인 최종안
- 테마 큐레이션 확정 3개
- EAT STAY PLAY SEE 배지 색 단색안과 4색안
- 저널 탭 구조
- 커뮤니티 페이지 발표 범위 포함 여부
- 패스 카드 회전 스타일 유지 여부

## 발표 후 로드맵 (이번 범위 아님)

- 검색 벡터 전환. 자료집 확장 시
- threeui와 liquidGL 검토. 다크스카이 시뮬레이터 결합
- NeonDB 실연결과 NFC 실물 태그
- 관리자 대시보드의 흐름 통계
