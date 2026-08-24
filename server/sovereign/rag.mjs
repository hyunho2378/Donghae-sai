// RAG 검색 로직만 따로 뺀 모듈. chat 라우트에서 가져다 쓴다.
import { readFileSync } from 'fs'

const knowledge = JSON.parse(
  readFileSync(new URL('../data/donghae-knowledge.json', import.meta.url))
)

export function searchKnowledge(query, maxHits = 3) {
  const scored = knowledge.map(item => {
    let score = 0
    for (const kw of item.keywords) {
      for (const word of kw.split(' ')) {
        if (word.length >= 1 && query.includes(word)) score += 1
      }
    }
    return { item, score }
  })

  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxHits)
    .map(s => s.item)
}

export function buildSystemPrompt(hits) {
  const context = hits.map(h => h.content).join('\n\n')
  const base = context
    ? `너는 동해시 관광 안내 AI 동해사이 도우미다. 아래 동해 자료집 내용만 근거로 답하라. 자료집에 없는 정보는 지어내지 말고 확인되지 않았다고 말하라.\n\n동해 자료집:\n${context}`
    : `너는 동해시 관광 안내 AI 동해사이 도우미다. 지금 질문과 관련된 동해 자료집 항목이 없다. 확인되지 않았다고 답하고 지어내지 마라.`
  return base + `\n\n답변 규칙. 별표나 샵이나 마크다운 기호를 쓰지 말고 평문으로 답하라. 세 문장에서 다섯 문장 안쪽으로 짧게 답하라. 목록이 필요하면 줄바꿈으로만 정리하라.`
}
