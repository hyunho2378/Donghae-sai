# DESIGN_DELTA.md 디자인 변경 사항

작성일 2026년 8월 24일. 기존 DESIGN.md는 계속 유효하다. 이 문서는 리브랜딩으로 달라지는 것만 담는다. 여기 없는 규칙은 전부 기존 DESIGN.md를 따른다.

## 유지 (변경 없음)

- 색 전체. 프라이머리 #60A5FA, hover #3B82F6, soft #EFF6FF, 배경과 텍스트와 경계선 토큰 전부
- Pretendard 단독, 타이포 스케일, 간격, radius 7종
- box-shadow 금지, 그라데이션 금지, backdrop-blur 금지, WebGL 금지
- lucide-react 단독 아이콘

동해사이 브랜드 색은 별도 확정 전까지 현재 토큰을 그대로 쓴다. 나중에 브랜드 색이 확정되면 tailwind.config.js의 primary 계열 토큰 값만 교체한다. 하드코딩이 없으므로 토큰 교체만으로 전체 적용된다.

## 추가

- 다크 히어로 섹션: 홈 최상단 챗봇 히어로에 한해 #000000 배경을 쓴다. 기존 DESIGN.md의 다크 섹션 배경 허용 범위 안이다
- 점과 선 그래픽: 흰색 원 점과 흰색 20퍼센트 불투명 1px 선. SVG로만 구현. 홈 히어로와 마이 패스 스탬프 진행 시각화에 쓴다
- 배지 4종: EAT STAY PLAY SEE. 색 배정은 확정 필요. 후보는 프라이머리 단색 유지에 라벨 텍스트로만 구분하는 안과, 4색 배정안. 기존 DESIGN.md의 색 제한을 고려하면 단색에 텍스트 구분안을 권장한다
- 스탬프 진행 컴포넌트: 7개 점을 선으로 잇고 완료 점은 프라이머리 채움, 미완료 점은 border-def 외곽선

## 제거

- 별점과 리뷰수 표기 전체
- 관계인구 단계 배지
- 멤버십 카드의 검정 회전 카드 스타일은 패스 카드로 개조하되 회전 각도는 유지 여부 확정 필요

## 인터페이스 디테일 검수

리브랜딩 화면 작업 완료 후 make-interfaces-feel-better 스킬로 검수한다. SKILLS_SETUP.md 참조. 검수 결과 중 기존 DESIGN.md 금지 항목과 충돌하는 제안은 DESIGN.md를 우선한다. 예를 들어 스킬이 그림자 추가를 제안해도 거부한다.

## 모션

기존 DESIGN.md 인터랙션 정책 유지. 추가로 improve-animations 스킬 검수를 챗봇 히어로에만 적용한다. 별 점 트월링과 대화 패널 확장 정도가 대상이며 transform과 opacity 외 속성 금지는 그대로다.

## 브랜드 색 확정 (2026-08-24, P1)

브랜드 가이드 확정값을 토큰에 반영했다. 임시 파랑을 걷어냈다.

- 주색 동해 블루 primary #4AB8CD. hover #3699AE, soft #E8F6F9. 기존 임시 #60A5FA 계열 대체
- 강조색 무코 레드 accent #FC5048. hover #E23B33, soft #FFECEA. 캐릭터 무코 색. 필수 배지와 강조 포인트에만 쓴다. 남용 금지
- 색은 tailwind.config.js 토큰 경유로만 쓴다. hex 직접 입력 금지 원칙 유지. theme-color 메타와 focus outline 도 토큰 값으로 맞췄다
- shadow-card 토큰을 boxShadow.card 로 실제 추가했다. KAREUM_MIRROR 1-1 값 그대로. 회색 카드 테두리를 걷어낸 자리의 깊이를 이 그림자나 배경 톤으로 준다
- 폰트는 Pretendard 단독. 헤드라인 SemiBold, 본문 Regular
