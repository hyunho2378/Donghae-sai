# SKILLS_SETUP.md 스킬 4종 설치와 사용 시점

작성일 2026년 8월 24일

## 짚고 갈 사실

zip을 프로젝트 폴더에 넣는다고 클로드 코드가 자동으로 해체하지 않는다. 압축을 풀어 정해진 위치에 넣어야 인식한다. 아래 명령으로 한 번에 처리한다.

## 4종 정체 (2026년 8월 24일 압축 해제 확인 기준)

- skills-main: 애니메이션과 디자인 스킬 모음. improve-animations, review-animations, find-animation-opportunities, animation-vocabulary, apple-design, emil-design-eng 6종
- make-interfaces-feel-better-main: 인터페이스 디테일 검수 스킬. 타이포, 아이콘, hover, 옵티컬 정렬, radius, 히트 영역
- im-not-ai-main: humanize-korean 플러그인. AI가 쓴 한글을 사람 글로 윤문. 10대 카테고리 70개 AI 티 패턴 탐지
- liquidGL-main: 스킬이 아니다. WebGL 유리 효과 JS 라이브러리다. 스킬 폴더에 넣지 않는다. CHATBOT_HERO.md 판단에 따라 발표까지 보류

## 설치 명령

zip 4개가 다운로드 폴더에 있다고 가정한다. 실제 파일명은 다운로드 시점에 따라 다를 수 있으므로 ls로 먼저 확인한다. 프로젝트 루트에서 실행한다.

```
cd "/Users/juhyunho/Desktop/00. 26-2학기/04. 성우킴/01. 동해시 AX 연구/06. 리빙랩/04. 프로토타입/G-Local-Station-main"

mkdir -p .claude/skills

unzip -q ~/Downloads/skills-main.zip -d /tmp/sk
cp -r /tmp/sk/skills-main/skills/* .claude/skills/

unzip -q ~/Downloads/make-interfaces-feel-better-main.zip -d /tmp/mi
cp -r /tmp/mi/make-interfaces-feel-better-main/skills/make-interfaces-feel-better .claude/skills/

rm -rf /tmp/sk /tmp/mi
ls .claude/skills
```

humanize-korean은 플러그인 형식이므로 클로드 코드에서 아래로 설치한다. 오프라인이거나 실패하면 im-not-ai-main 폴더 안 INSTALL.md의 수동 설치를 따른다.

```
claude plugin install epoko77-ai/im-not-ai
```

설치 확인은 클로드 코드 세션에서 스킬 목록 조회로 한다. ls .claude/skills 결과에 improve-animations와 make-interfaces-feel-better 등이 보이면 성공이다.

## 사용 시점 (작업 순서에 묶는다)

- 화면 작업 완료 직후: make-interfaces-feel-better로 해당 화면 검수. quick 모드로 시작
- 챗봇 히어로 모션 작업 시: improve-animations와 review-animations
- 모든 화면 텍스트 확정 후: humanize-korean으로 윤문. 윤문 후 확정 수치와 실명이 바뀌지 않았는지 문자 대조 필수
- 검수 제안이 DESIGN.md 금지 항목과 충돌하면 DESIGN.md 우선. DESIGN_DELTA.md 참조
