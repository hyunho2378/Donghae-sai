// 3단계: 동해 자료집 검색 후 로컬 LLM에 컨텍스트로 주입한다.
// 검색은 키워드를 낱말 단위로 쪼개 겹치면 매칭한다.
import { readFileSync } from 'fs'

const OLLAMA_URL = 'http://localhost:11434/api/chat'
const MODEL = 'gemma4:e4b'

const knowledge = JSON.parse(readFileSync(new URL('../data/donghae-knowledge.json', import.meta.url)))

function search(query) {
  return knowledge.filter(item =>
    item.keywords.some(kw =>
      kw.split(' ').some(word => word.length >= 1 && query.includes(word))
    )
  )
}

const question = process.argv.slice(2).join(' ')
  || '동해에서 별 보기 좋은 데 알려줘'

const hits = search(question)
const context = hits.map(h => h.content).join('\n\n')

console.log('질문:', question)
console.log('검색된 자료 수:', hits.length)
if (hits.length > 0) console.log('검색된 항목:', hits.map(h => h.id).join(', '))
console.log('')

const systemPrompt = context
  ? `너는 동해시 관광 안내 AI다. 아래 동해 자료집 내용만 근거로 답하라. 자료집에 없는 정보는 지어내지 말고 확인되지 않았다고 말하라.\n\n동해 자료집:\n${context}`
  : `너는 동해시 관광 안내 AI다. 지금 질문과 관련된 동해 자료집 항목이 없다. 확인되지 않았다고 답하고 지어내지 마라.`

const res = await fetch(OLLAMA_URL, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: question }
    ],
    stream: false,
    think: false
  })
})

const data = await res.json()
console.log('답변:\n', data.message?.content ?? JSON.stringify(data, null, 2))
