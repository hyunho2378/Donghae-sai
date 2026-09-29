// 시연용 도구 모음. 가짜 커서로 움직이고 클릭하고 입력하고 스크롤한다.
// 실제 사용자 조작과 똑같은 DOM 이벤트를 쓰므로 서비스 코드는 시연 여부를 몰라도 된다
export const STOP = Symbol('demo-stop')

export function createKit({ cursor, layer, speed = 1, isStopped }) {
  const guard = () => { if (isStopped()) throw STOP }

  // 100ms 단위로 쪼개 기다린다. Esc 를 누르면 바로 멈춘다
  const sleepRaw = async (ms) => {
    const end = performance.now() + ms
    for (;;) {
      guard()
      const left = end - performance.now()
      if (left <= 0) break
      await new Promise((r) => setTimeout(r, Math.min(100, left)))
    }
  }
  const sleep = (ms) => sleepRaw(ms / speed)

  const $ = (sel, root = document) => root.querySelector(sel)
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)]
  const isVisible = (el) => {
    const r = el.getBoundingClientRect()
    const cs = getComputedStyle(el)
    return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'
  }
  const norm = (s) => (s || '').replace(/\s+/g, ' ').trim()
  const byText = (sel, text, root = document) =>
    $$(sel, root).find((el) => isVisible(el) && norm(el.textContent).includes(text))
  const byExact = (sel, text, root = document) =>
    $$(sel, root).find((el) => isVisible(el) && norm(el.textContent) === text)

  const waitFor = async (fn, timeout = 8000) => {
    const t0 = performance.now()
    while (performance.now() - t0 < timeout) {
      let v = null
      try { v = fn() } catch { v = null }
      if (v) return v
      await sleepRaw(100)
    }
    return null
  }

  // ----- 커서 -----
  let cx = window.innerWidth * 0.62
  let cy = window.innerHeight * 0.72
  const setCursor = (x, y, ms) => {
    cx = x; cy = y
    cursor.style.transition = `transform ${Math.round(ms / speed)}ms cubic-bezier(.22,.61,.36,1)`
    cursor.style.transform = `translate(${x - 5}px, ${y - 3}px)`
  }
  setCursor(cx, cy, 0)

  const ripple = (x, y) => {
    const d = document.createElement('div')
    d.style.cssText = `position:absolute;left:${x - 22}px;top:${y - 22}px;width:44px;height:44px;border-radius:50%;
      border:3px solid #4AB8CD;background:rgba(74,184,205,.18);pointer-events:none`
    layer.appendChild(d)
    const a = d.animate(
      [{ transform: 'scale(.35)', opacity: 1 }, { transform: 'scale(1.5)', opacity: 0 }],
      { duration: 560, easing: 'ease-out' }
    )
    a.onfinish = () => d.remove()
    const svg = cursor.firstElementChild
    if (svg) svg.animate([{ transform: 'scale(1)' }, { transform: 'scale(.82)' }, { transform: 'scale(1)' }], { duration: 240 })
  }

  // ----- 스크롤 -----
  const pageMax = () => Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
  const scrollToY = (y, ms = 900) => new Promise((resolve, reject) => {
    const start = window.scrollY
    const target = Math.max(0, Math.min(pageMax(), y))
    if (Math.abs(target - start) < 2) { resolve(); return }
    const dur = Math.max(1, ms / speed)
    const t0 = performance.now()
    const step = (now) => {
      if (isStopped()) { reject(STOP); return }
      const t = Math.min(1, (now - t0) / dur)
      const e = t < 0.5 ? 4 * t * t * t : 1 - ((-2 * t + 2) ** 3) / 2
      window.scrollTo(0, start + (target - start) * e)
      if (t < 1) requestAnimationFrame(step); else resolve()
    }
    requestAnimationFrame(step)
  })
  const elTop = (el) => window.scrollY + el.getBoundingClientRect().top
  const scrollToEl = (el, offset = 120, ms = 1000) => scrollToY(elTop(el) - offset, ms)

  const settle = async (el) => {
    let last = -1e9
    let same = 0
    for (let i = 0; i < 30 && same < 3; i++) {
      const t = el.getBoundingClientRect().top
      same = Math.abs(t - last) < 0.5 ? same + 1 : 0
      last = t
      await sleepRaw(60)
    }
  }
  // 요소가 화면 밖이면 보이는 곳까지 부드럽게 스크롤한다
  const reveal = async (el) => {
    const r = el.getBoundingClientRect()
    if (r.top >= 96 && r.bottom <= window.innerHeight - 70) return
    if (pageMax() > 4) {
      await scrollToY(elTop(el) - window.innerHeight / 2 + r.height / 2, 800)
    } else {
      el.scrollIntoView({ block: 'center', behavior: 'smooth' })
      await settle(el)
    }
  }

  const moveTo = async (el, { dx = 0.5, dy = 0.5, ms = 850 } = {}) => {
    const r = el.getBoundingClientRect()
    setCursor(r.left + r.width * dx, r.top + r.height * dy, ms)
    await sleep(ms + 60)
  }
  const hover = async (el, opts) => { await reveal(el); await moveTo(el, opts) }
  const click = async (el, opts) => {
    await hover(el, opts)
    ripple(cx, cy)
    await sleep(160)
    el.click()
    await sleep(260)
  }

  // ----- 입력 -----
  const setNative = (el, value) => {
    const proto = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype
    Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, value)
    el.dispatchEvent(new Event('input', { bubbles: true }))
  }
  const typeInto = async (el, text, perChar = 70) => {
    await hover(el)
    ripple(cx, cy)
    el.focus()
    await sleep(250)
    for (let i = 1; i <= text.length; i++) {
      setNative(el, text.slice(0, i))
      await sleep(perChar + Math.random() * 45)
    }
    await sleep(300)
  }

  // 페이지를 위에서 아래로 훑고 다시 위로 올린다
  const tourPage = async ({ stepVh = 0.7, dwell = 1400, maxSteps = 4, back = true } = {}) => {
    const step = window.innerHeight * stepVh
    for (let i = 0; i < maxSteps; i++) {
      if (window.scrollY >= pageMax() - 4) break
      await scrollToY(window.scrollY + step, 1100)
      await sleep(dwell)
    }
    if (back) { await scrollToY(0, 1000); await sleep(400) }
  }

  // 글자 수가 멈출 때까지 기다린다. 스트리밍 답변이 끝났는지 볼 때 쓴다
  const waitStable = async (getLen, quiet = 900, timeout = 30000) => {
    const t0 = performance.now()
    let last = -1
    let since = performance.now()
    while (performance.now() - t0 < timeout) {
      const n = getLen()
      if (n !== last) { last = n; since = performance.now() }
      else if (performance.now() - since >= quiet) return true
      await sleepRaw(120)
    }
    return false
  }

  return {
    sleep, sleepReal: sleepRaw, $, $$, byText, byExact, waitFor, click, hover, moveTo, typeInto,
    scrollToY, scrollToEl, tourPage, waitStable, isVisible, norm
  }
}
