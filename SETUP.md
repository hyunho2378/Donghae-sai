# SETUP.md — 최초 폴더 및 파일 구조 세팅

이 문서는 클로드 코드가 고운고성(Goun Goseong) 프로젝트를 시작할 때 가장 먼저 실행해야 할 폴더 구조와 초기 파일 세팅을 정의한다. 이 문서대로 세팅을 완료한 후에야 다른 md 파일을 읽고 본격적인 개발에 들어간다.

---

## 작업 순서 (반드시 이 순서로 실행)

### STEP 1. 최상위 폴더 구조 생성

```
g-local-station/
├── client/
├── server/
├── docs/
├── .gitignore
└── README.md
```

### STEP 2. client 폴더 초기 세팅 (Vite + React)

```bash
cd client
npm create vite@latest . -- --template react
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install lucide-react react-router-dom zustand html2canvas
npm install date-fns clsx
```

스택 고정 사항
- 빌드: Vite
- 라이브러리: React 18
- 라우팅: react-router-dom v6
- 상태: Zustand
- 스타일: Tailwind CSS + index.css 토큰
- 아이콘: lucide-react 단독 (다른 아이콘 라이브러리 혼용 금지)
- 유틸: clsx, date-fns
- 패키지 매니저: npm (yarn, pnpm 사용 금지)

### STEP 3. server 폴더 초기 세팅 (Express + NeonDB)

```bash
cd server
npm init -y
npm install express cors dotenv
npm install @neondatabase/serverless drizzle-orm
npm install -D drizzle-kit nodemon
```

server/package.json에 scripts 추가
```json
"scripts": {
  "dev": "nodemon index.js",
  "start": "node index.js",
  "db:generate": "drizzle-kit generate",
  "db:push": "drizzle-kit push"
}
```

### STEP 4. .gitignore 작성 (루트)

```
node_modules/
.env
.env.local
.env.development.local
.env.production.local
dist/
build/
.DS_Store
.vercel
.vscode/
*.log
drizzle/
```

### STEP 5. client 내부 구조

```
client/
├── public/
│   └── images/
│       ├── stays/        (거점 이미지)
│       ├── packages/     (패키지 이미지)
│       ├── journal/      (저널 썸네일)
│       └── icons/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── layout/
│   │   ├── nav/
│   │   ├── card/
│   │   ├── button/
│   │   └── feedback/
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── StaysPage.jsx
│   │   ├── StayDetailPage.jsx
│   │   ├── PackagesPage.jsx
│   │   ├── PackageDetailPage.jsx
│   │   ├── JournalPage.jsx
│   │   ├── JournalDetailPage.jsx
│   │   ├── MembershipPage.jsx
│   │   ├── PassPage.jsx
│   │   ├── GoodsPage.jsx
│   │   ├── AuthPage.jsx
│   │   └── AdminPage.jsx
│   ├── data/
│   │   ├── stays.json
│   │   ├── packages.json
│   │   └── journal.json
│   ├── hooks/
│   ├── store/
│   │   ├── useAuthStore.js
│   │   └── useReservationStore.js
│   ├── lib/
│   │   ├── api.js
│   │   └── format.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
└── package.json
```

### STEP 6. server 내부 구조

```
server/
├── routes/
│   ├── stays.js
│   ├── packages.js
│   ├── reservations.js
│   ├── journal.js
│   ├── pass.js
│   └── admin.js
├── db/
│   ├── schema.js
│   └── index.js
├── middleware/
│   └── auth.js
├── lib/
│   └── neon.js
├── index.js
├── drizzle.config.js
├── .env.example
└── package.json
```

### STEP 7. tailwind.config.js 토큰 설정

DESIGN.md의 색상, 폰트, 브레이크포인트, 스페이싱 토큰을 그대로 반영한다. 토큰 추가/변형 절대 금지.

### STEP 8. index.css 기본 설정

`@tailwind base, components, utilities` 선언과 함께 Pretendard CDN 로드를 head에 포함한다. fallback 폰트 추가 금지. system-ui, sans-serif 절대 사용 금지.

### STEP 9. index.html head 설정

```html
<link rel="stylesheet" as="style" crossorigin
      href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css" />
```

뷰포트 메타태그
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
```

### STEP 10. .env.example 작성 (server)

```
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
PORT=3000
NODE_ENV=development
```

### STEP 11. 검증 체크

다음 항목이 모두 통과해야 PHASE 1으로 진입할 수 있다.

- [ ] `cd client && npm run dev` 정상 실행 (포트 5173)
- [ ] `cd server && npm run dev` 정상 실행 (포트 3000)
- [ ] Tailwind 클래스 `bg-white` `text-black` 적용 확인
- [ ] Pretendard 폰트 로드 확인 (개발자 도구 Network 탭)
- [ ] 토큰 색상 `bg-primary` `text-text-pri` 정상 동작
- [ ] React Router 기본 라우트 응답
- [ ] CORS 설정으로 client → server 통신 가능

---

## 완료 후 다음 단계

SETUP 완료 후 반드시 다음 순서로 md 파일을 읽고 작업을 진행한다.

1. CLAUDE.md (행동 지침)
2. DESIGN.md (디자인 시스템 + 외부 자원 정책)
3. IA.md (정보 구조)
4. COMPONENTS.md (컴포넌트 명세)
5. PATTERNS.md (재사용 JSX 패턴)
6. AGENTS.md (에이전트 실행 구조 및 검증)
7. PROGRESS.md (진행 상황 추적)

이 순서를 어기면 디자인 토큰을 알지 못한 채 컴포넌트를 작성하는 사고가 발생한다. 절대 순서 변경 금지.

---

## 주의사항

- pnpm, yarn 사용 금지. npm으로 통일.
- TypeScript 사용하지 않음. JSX 단독.
- 시작 시 client와 server는 별도 터미널 두 개로 실행.
- Vite 템플릿 생성 시 `react` 선택 (react-ts 아님).
- Drizzle 사용은 권장이나, NeonDB 직접 SQL 쿼리도 허용. 단 한 프로젝트 내에서 혼용 금지.