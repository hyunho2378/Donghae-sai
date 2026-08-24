// resolveSources 매핑 self-check. 서버 knowledge 의 실제 link 라우트가
// stays/packages/stories/membership 레코드로 풀려 카드(route+name)를 만드는지 검증한다.
// 실행: node client/scripts/check-source-cards.mjs
import assert from 'node:assert'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const load = (p) => JSON.parse(readFileSync(join(here, p)))

const stays = load('../src/data/stays.json')
const packages = load('../src/data/packages.json')
const stories = load('../src/data/stories.json')
const knowledge = load('../../server/data/donghae-knowledge.json')

// useSovereignChat.resolveSources 와 동일한 4분기 매핑 (테스트용 복제)
function resolve(sources, links) {
  const seen = new Set()
  return sources.map((id) => {
    const route = links[id]
    if (route?.startsWith('/stays/')) {
      const s = stays.find((x) => x.id === route.split('/')[2])
      if (s) return { id, name: s.name, image: s.main_image || s.gallery?.[0] || null, route, kind: '장소' }
    }
    if (route?.startsWith('/packages/')) {
      const p = packages.find((x) => x.id === route.split('/')[2])
      if (p) return { id, name: p.name, image: p.main_image || null, route, kind: p.category === 'program' ? '프로그램' : '코스' }
    }
    if (route?.startsWith('/story/')) {
      const t = stories.find((x) => x.slug === route.split('/')[2])
      if (t) return { id, name: t.title, image: t.cover_image || null, route, kind: '스토리' }
    }
    if (route?.startsWith('/membership') || route?.startsWith('/pass')) {
      return { id, name: id, image: null, route: '/membership', kind: '패스' }
    }
    return null
  }).filter(Boolean).filter((c) => (seen.has(c.route) ? false : seen.add(c.route)))
}

// knowledge 에서 타입별 실제 링크를 하나씩 뽑아 카드가 생기는지 본다
const byPrefix = (pfx) => knowledge.find((k) => k.link?.startsWith(pfx))
const pick = { stay: byPrefix('/stays/'), pkg: byPrefix('/packages/'), story: byPrefix('/story/'), pass: byPrefix('/membership') }
for (const [k, v] of Object.entries(pick)) assert.ok(v, `knowledge 에 ${k} 링크가 있어야 한다`)

const ids = Object.values(pick).map((k) => k.id)
const links = Object.fromEntries(Object.values(pick).map((k) => [k.id, k.link]))
const cards = resolve(ids, links)

assert.equal(cards.length, 4, `스팟 코스 스토리 패스 4종이 모두 카드가 되어야 한다 (실제 ${cards.length})`)
const kinds = new Set(cards.map((c) => c.kind))
assert.ok(kinds.has('장소'), '스팟 카드')
assert.ok(['코스', '프로그램'].some((x) => kinds.has(x)), '패키지 카드')
assert.ok(kinds.has('스토리'), '스토리 카드')
assert.ok(kinds.has('패스'), '패스 카드')
for (const c of cards) {
  assert.ok(c.route?.startsWith('/'), `${c.id} route 존재`)
  assert.ok(c.name, `${c.id} name 존재`)
}

// 중복 라우트 접힘 확인. 같은 membership 링크 3개 → 카드 1개
const dupPass = resolve(['a', 'b', 'c'], { a: '/membership', b: '/membership', c: '/membership' })
assert.equal(dupPass.length, 1, '같은 목적지 중복 출처는 카드 하나로 합쳐야 한다')

// 라우트 없는 개념 항목은 카드가 안 생긴다
assert.equal(resolve(['positioning'], {}).length, 0, '라우트 없는 항목은 건너뛴다')

const withImg = cards.filter((c) => c.image).length
console.log(`OK. 카드 ${cards.length}종 생성 (이미지 있음 ${withImg}/${cards.length}). 종류: ${[...kinds].join(', ')}`)
