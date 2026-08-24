// server/sovereign/ask.js
// 1단계: 로컬 Gemma 호출 검증. DB도 Express도 없다. 순수 로컬 추론만.

const OLLAMA_URL = 'http://localhost:11434/api/chat'
const MODEL = 'gemma3n:e4b'   // ★ ollama list 결과의 정확한 태그로 이 줄만 바꿔라

const question = process.argv.slice(2).join(' ')
  || '동해 묵호항 근처에서 저녁 먹을 데 하나 추천해줘'

console.log('질문:', question, '\n')

const res = await fetch(OLLAMA_URL, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: MODEL,
    messages: [{ role: 'user', content: question }],
    stream: false,
    think: false   // 사고과정 끄기 시도. 이 모델이 안 받으면 그냥 무시된다
  })
})

const data = await res.json()
console.log('답변:\n', data.message?.content ?? JSON.stringify(data, null, 2))