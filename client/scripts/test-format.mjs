// 반점 나열 판별과 말줄임 정리. 스토리 상세 설명이 이 두 함수에 걸려 있다
import assert from 'node:assert/strict'
import { asList, cleanCopy, endSentence } from '../src/lib/format.js'

// 매달린 말줄임과 반점을 걷어낸다
assert.equal(cleanCopy('청옥호, 금곡호, 라벤더정원,...'), '청옥호, 금곡호, 라벤더정원')
assert.equal(cleanCopy('생선산채정식'), '생선산채정식')

// 짧은 명사 나열은 항목으로 끊는다
assert.deepEqual(asList('59미터 스카이워크, 스카이사이클, 자이언트슬라이드'),
  ['59미터 스카이워크', '스카이사이클', '자이언트슬라이드'])

// 천 단위 반점은 자르지 않는다
assert.equal(asList('동굴 총 길이 약 1,400미터'), null)

// 항목이 둘 이하면 문장으로 읽는다
assert.equal(asList('된장과 고추장을 섞는다'), null)

// 문장이 섞이면 목록으로 보지 않는다
assert.equal(asList('1991년 천곡 신시가지 조성 과정에서 발견, 1994년 일반 공개, 동굴 총 길이 약 1,400미터'), null)

// 끊긴 원문에 마침표를 붙인다. 이미 맺힌 문장은 그대로 둔다
assert.equal(endSentence('무릉계곡 백숙'), '무릉계곡 백숙.')
assert.equal(endSentence('밤 10시까지 열린다.'), '밤 10시까지 열린다.')

console.log('format helpers ok')
