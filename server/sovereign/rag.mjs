// RAG 검색 로직만 따로 뺀 모듈. chat 라우트에서 가져다 쓴다.
import { readFileSync } from 'fs'

const knowledge = JSON.parse(
  readFileSync(new URL('../data/donghae-knowledge.json', import.meta.url))
)

export function searchKnowledge(query, maxHits = 3) {
  const scored = knowledge.map((item, idx) => {
    let score = 0
    for (const kw of item.keywords) {
      if (kw.length >= 2 && query.includes(kw)) {
        score += 2 // 키워드 전체가 질문에 들어 있으면 더 준다
      } else {
        for (const word of kw.split(' ')) {
          if (word.length >= 1 && query.includes(word)) score += 1
        }
      }
    }
    // 권역 요약과 코스처럼 여러 곳을 한 번에 설명하는 항목을 개별 스팟보다 위에 둔다
    return { item, score: score * (item.weight || 1), idx }
  })

  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score || a.idx - b.idx)
    .slice(0, maxHits)
    .map(s => s.item)
}

export function buildSystemPrompt(hits) {
  const context = hits.map(h => h.content).join('\n\n')
  const base = context
    ? `너는 동해시 관광 안내 AI 동해사이 도우미다. 아래 동해 자료집 내용만 근거로 답하라. 자료집에 없는 정보는 지어내지 말고 확인되지 않았다고 말하라.\n\n동해 자료집:\n${context}`
    : `너는 동해시 관광 안내 AI 동해사이 도우미다. 지금 질문과 관련된 동해 자료집 항목이 없다. 확인되지 않았다고 답하고 지어내지 마라.`
  return base + `\n\n답변 규칙.
별표나 샵이나 콜론이나 마크다운 표를 쓰지 말고 평문으로 답하라.
한 문단은 두 문장에서 세 문장을 넘기지 마라. 문단이 바뀌면 빈 줄 하나를 넣어라.
여러 곳이나 여러 권역을 나열할 때는 한 줄에 한 곳씩 줄바꿈으로 끊어라.
소제목을 쓸 때는 짧은 한 줄로 따로 두고 강조 기호를 붙이지 마라.
전체 길이는 여섯 문장 안쪽으로 유지하라.`
}
