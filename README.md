# 고운고성 (Goun Goseong) × G-Pass

체류형 로컬 플랫폼 + 관계인구 멤버십 (G-Pass).

## 구조

- `client/` — Vite + React 18 (반응형 SPA, 320px ~ 2560px)
- `server/` — Express + NeonDB (Drizzle ORM)
- `docs/` — 보조 문서 (루트 .md 7종이 단일 진실 공급원)

## 실행

```bash
# 별도 터미널 두 개로 실행
cd client && npm run dev   # http://localhost:5173
cd server && npm run dev   # http://localhost:3000
```

## 문서 읽는 순서

`SETUP.md → CLAUDE.md → DESIGN.md → IA.md → COMPONENTS.md → PATTERNS.md → AGENTS.md → PROGRESS.md`
