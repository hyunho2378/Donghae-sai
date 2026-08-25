import test from 'node:test'
import assert from 'node:assert/strict'
import {
  buildRetrievalQuery,
  buildSystemPrompt,
  findMentionedSources,
  isFollowUpQuery,
  searchKnowledge
} from './rag.mjs'

const firstQuestion = '묵호에서 가장 인기있는 맛집이랑 소품샵 정리해줘'
const firstAnswer = [
  '**거동탕수육**은 문어탕수육을 맛볼 수 있어요.',
  '**부흥횟집**은 물회를 먹기 좋아요.',
  '**무코야선물가게**는 묵호 굿즈를 고르기 좋아요.'
].join('\n')

test('지시어형 후속 질문은 직전 문답을 RAG 검색어에 포함한다', () => {
  const followUp = '위에서 설명한 거에서 각각 1개씩 골라봐'
  const query = buildRetrievalQuery(followUp, [
    { role: 'user', content: firstQuestion },
    { role: 'assistant', content: firstAnswer }
  ])

  assert.equal(isFollowUpQuery(followUp), true)
  assert.match(query, /거동탕수육/)
  assert.match(query, /무코야선물가게/)
  assert.ok(searchKnowledge(query, 8).some((hit) => hit.id === 'sai-030'))
  assert.ok(searchKnowledge(query, 8).some((hit) => hit.id === 'sai-066'))
})

test('일반 질문은 이전 대화로 검색어를 오염시키지 않는다', () => {
  const question = '추암에서 산책할 곳 알려줘'
  assert.equal(buildRetrievalQuery(question, [{ role: 'assistant', content: firstAnswer }]), question)
})

test('근거는 검색 상위 hit가 아니라 최종 답변에 등장한 개별 장소로 만든다', () => {
  const answerWithIncidentalPlace = `${firstAnswer}\n무코야선물가게는 묵호항 근처에서 들르기 좋아요.`
  const sources = findMentionedSources(answerWithIncidentalPlace, searchKnowledge(firstQuestion))
  assert.deepEqual(
    new Set(sources.map((source) => source.id)),
    new Set(['sai-030', 'sai-066', 'sai-083'])
  )
  assert.equal(sources.some((source) => source.id === 'sai-005'), false)
  assert.ok(sources.every((source) => source.link?.startsWith('/stays/')))
})

test('각각 하나를 고르는 후속 질문은 추가 장소를 금지한다', () => {
  const prompt = buildSystemPrompt([], true, '위에서 설명한 거에서 각각 1개씩 골라봐')
  assert.match(prompt, /요청한 분류마다 정확히 한 곳만/)
  assert.match(prompt, /직전 답변에 없던 장소/)
  assert.match(prompt, /후속 질문은 붙이지 않는다/)
})
