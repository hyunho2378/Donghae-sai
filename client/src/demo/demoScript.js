// 자동 시연 대본. 판넬의 서비스 흐름 순서를 따른다.
// 탐색(AI 챗봇, 로컬 자원, 여행 코스, 스토리) → 패스 → 구매 → NFC 인증 → 스탬프 → 다음 여행지 추천 → 마이페이지
// 각 장면은 독립적이다. 요소를 못 찾으면 그 장면만 건너뛰고 다음으로 넘어간다
import { STOP } from './demoKit'

export async function runDemo({ kit, navigate, cap, auth, count }) {
  const {
    sleep, sleepReal, $, $$, byText, byExact, waitFor, click, hover, typeInto,
    scrollToY, scrollToEl, tourPage, waitStable
  } = kit

  window.__dhsDemoLog = []
  const step = async (name, fn) => {
    window.__dhsDemoLog.push({ name, at: Math.round(performance.now()) })
    try { await fn() } catch (e) {
      if (e === STOP) throw e
      console.warn('[demo] 건너뜀:', name, e)
    }
  }
  const atPath = (p) => waitFor(() => window.location.pathname.startsWith(p), 8000)
  const goNav = async (label, path) => {
    const link = byExact('header nav a', label)
    if (link) await click(link)
    else navigate(path)
    await atPath(path)
    await sleep(700)
  }
  const copyCount = () => $$('[aria-label="복사"]').length
  const bodyLen = () => document.body.innerText.length
  const waitAnswer = async (before) => {
    await waitFor(() => copyCount() > before, 30000)
    await waitStable(bodyLen, 900, 15000)
    await sleep(500)
  }

  // ===== 0. 초기화. 매번 같은 화면에서 시작한다 =====
  localStorage.removeItem('goun_user')
  localStorage.removeItem('goun_bookmarks')
  auth.getState().logout()
  if (window.location.pathname !== '/') navigate('/')
  await sleep(800)

  // ===== 0-1. 녹화 시작 신호. 챗봇을 한 번 열고 5초 세고 닫는다. 이 뒤부터 본 시연이다 =====
  await step('00 시작 신호', async () => {
    const chip = await waitFor(() => byText('button', '아이랑 코스'), 6000)
    if (!chip) return
    await click(chip)
    await waitFor(() => $('button[aria-label="새 대화"]'), 6000)
    for (let i = 5; i > 0; i--) { count(i); await sleepReal(1000) }
    count(null)
    const fresh = $('button[aria-label="새 대화"]')
    if (fresh) await click(fresh)
    await waitFor(() => $('textarea[aria-label="동해사이 도우미에게 질문하기"]'), 6000)
    await sleep(1500)
  })

  // ===== 1. 홈. AI 챗봇 '사이' =====
  await step('01 홈 AI 챗봇', async () => {
    cap('AI CHATBOT', "동해 자료만 읽는 AI 챗봇 '사이'")
    const ta = await waitFor(() => $('textarea[aria-label="동해사이 도우미에게 질문하기"]'))
    await sleep(1400)
    await typeInto(ta, '오늘 밤 묵호에서 뭐 하면 좋을까요')
    await sleep(500)
    const before = copyCount()
    await click($('button[aria-label="전송"]'))
    await waitAnswer(before)
    cap('AI CHATBOT', '답변마다 근거 장소를 함께 제시')
    const cards = $$('main a[href^="/stays/"], main a[href^="/packages/"]').filter((a) => kit.isVisible(a)).slice(0, 2)
    for (const c of cards) { await hover(c); await sleep(1100) }
    await sleep(1200)
  })

  // ===== 2. 로컬 자원 =====
  await step('02 로컬 자원', async () => {
    await goNav('로컬 자원', '/stays')
    cap('LOCAL', '권역별 로컬 자원')
    await waitFor(() => $('main a[href^="/stays/"]'))
    await sleep(1500)
    await scrollToY(window.innerHeight * 0.7, 1200)
    await sleep(1000)
    await scrollToY(0, 900)
    const chip = byExact('main button', '묵호')
    if (chip) { await click(chip); await sleep(1300) }
    const link = $('a[href="/stays/sai-001"]') || $('main a[href^="/stays/"]')
    await click(link)
    await atPath('/stays/')
    await sleep(1200)
    cap('LOCAL', '장소 상세와 저장')
    await sleep(1300)
    const save = await waitFor(() => $('button[aria-label="저장"]'), 3000)
    if (save) { await click(save); await sleep(1300) }
    await tourPage({ stepVh: 0.75, dwell: 1300, maxSteps: 3 })
  })

  // ===== 3. 여행 코스. 페이지 안에서 챗봇 버튼도 보여 준다 =====
  await step('03 여행 코스', async () => {
    await goNav('여행 코스', '/packages')
    cap('COURSE', '타깃별 1박 2일 코스')
    await waitFor(() => $('main a[href^="/packages/"]'))
    await sleep(2600)
    const fab = $('button[aria-label="동해사이 도우미 열기"]')
    if (fab) {
      cap('AI CHATBOT', '어느 화면에서나 AI 챗봇')
      await click(fab)
      const inp = await waitFor(() => $('input[placeholder="동해 여행에 대해 물어보세요"]'), 4000)
      if (inp) {
        await typeInto(inp, '아이랑 가기 좋은 코스 알려줘요', 65)
        await sleep(300)
        const before = copyCount()
        await click($('button[aria-label="전송"]'))
        await waitAnswer(before)
        await sleep(2200)
      }
      const close = $('button[aria-label="동해사이 도우미 닫기"]')
      if (close) { await click(close); await sleep(500) }
    }
    const tab = byText('main button', '프로그램')
    if (tab) {
      await click(tab)
      cap('COURSE', '숙박, 식사, 체험을 묶은 프로그램')
      await sleep(2400)
    }
    const card = $('main a[href^="/packages/"]')
    if (card) {
      await click(card)
      await atPath('/packages/')
      await sleep(1200)
      cap('COURSE', '코스 상세')
      await tourPage({ stepVh: 0.75, dwell: 1300, maxSteps: 3 })
    }
  })

  // ===== 4. 동해 스토리 =====
  await step('04 동해 스토리', async () => {
    await goNav('동해 스토리', '/story')
    cap('STORY', '권역과 사람과 음식으로 읽는 동해')
    await waitFor(() => $('main a[href^="/story/"]'))
    await sleep(1600)
    await scrollToY(window.innerHeight * 0.6, 1100)
    await sleep(900)
    await scrollToY(0, 800)
    const s = $('main a[href^="/story/"]')
    if (s) {
      await click(s)
      await atPath('/story/')
      await sleep(1200)
      cap('STORY', '스토리 상세')
      await tourPage({ stepVh: 0.75, dwell: 1200, maxSteps: 3 })
    }
  })

  // ===== 5. 패스 상품 =====
  await step('05 패스 상품', async () => {
    await goNav('패스', '/membership')
    cap('PASS', '동해사이 NFC 패스')
    await sleep(2600)
    const sections = [
      ['3가지 NFC 태그', '3가지 NFC 태그'],
      ['사용 흐름', '구매부터 태그까지 사용 흐름'],
      ['스탬프 네 단계', 'STAY EAT PLAY SEE 스탬프 네 단계']
    ]
    for (const [key, label] of sections) {
      const h = $$('h2').find((x) => x.textContent.includes(key))
      if (h) { cap('PASS', label); await scrollToEl(h, 110, 1100); await sleep(2000) }
    }
    const faq = $$('h2').find((x) => x.textContent.includes('자주 묻는 질문'))
    if (faq) {
      cap('PASS', '자주 묻는 질문')
      await scrollToEl(faq, 110, 1100)
      await sleep(600)
      for (const q of ['개인정보를 내야', '스탬프를 다 모으면']) {
        const b = byText('button[aria-expanded]', q)
        if (b) { await click(b); await sleep(1800) }
      }
    }
    await scrollToY(0, 1100)
    await sleep(600)
  })

  // ===== 6. 구매. 로그인 → 결제 → 완료 =====
  await step('06 패스 구매', async () => {
    cap('STEP 01', '패스 구매')
    const buys = $$('main a').filter((a) => kit.norm(a.textContent) === '구매하기')
    await click(buys[1] || buys[0])
    const id = await waitFor(() => $('input[placeholder="아이디"]'), 8000)
    if (id) {
      cap('STEP 01', '로그인 후 구매')
      await sleep(900)
      await typeInto(id, '여행자')
      await typeInto($('input[placeholder="비밀번호"]'), '1234', 90)
      await click($('button[type="submit"]'))
    }
    await waitFor(() => $('button[aria-pressed]'), 8000)
    await sleep(900)
    cap('STEP 01', '이용권과 결제 수단 선택')
    const plans = $$('button[aria-pressed]')
    await click(plans[1] || plans[0])
    await sleep(500)
    const pay = plans.find((b) => b.querySelector('img[alt="애플페이"]')) || plans[3]
    await click(pay)
    await sleep(500)
    await click($('[role="checkbox"]'))
    await sleep(500)
    const payBtn = await waitFor(() => $$('button').find((b) => b.textContent.includes('결제하기') && !b.disabled), 4000)
    await click(payBtn)
    await atPath('/checkout/complete')
    cap('STEP 01', '구매 완료')
    await sleep(2800)
    await click(byText('a', '내 패스 보기'))
    await atPath('/pass')
    await sleep(900)
  })

  // ===== 7. 내 패스 → NFC 인증 → 스탬프 → 다음 여행지 추천 =====
  await step('07 NFC 인증부터 추천까지', async () => {
    cap('MY PASS', '내 패스와 스탬프 여권')
    await sleep(1800)
    const h = $$('h2').find((x) => x.textContent.includes('스탬프 여권'))
    if (h) { await scrollToEl(h, 110, 1000); await sleep(1800); await scrollToY(0, 900) }
    await sleep(400)
    const nfc = byText('button', 'NFC 태그 체험')
    await click(nfc)
    const dlg = () => $('[role="dialog"]')
    await waitFor(() => dlg(), 4000)
    cap('STEP 02', 'NFC로 간편 인증')
    await waitFor(() => (dlg()?.innerText || '').includes('방문을 확인'), 8000)
    await sleep(700)
    await waitFor(() => (dlg()?.innerText || '').includes('스탬프 획득'), 8000)
    cap('STEP 03', '스탬프 적립')
    await sleep(3200)
    const next = byText('button', '다음 코스 추천')
    if (next) await click(next)
    cap('STEP 04', '다음 여행지 추천')
    await sleep(3800)
    const go = byText('a', '길찾기')
    if (go) {
      await click(go)
      await atPath('/stays/')
      await sleep(1200)
      cap('STEP 04', '추천 장소로 이동')
      await sleep(1600)
      await tourPage({ stepVh: 0.75, dwell: 1200, maxSteps: 2 })
    }
  })

  // ===== 8. 마이페이지와 저장한 장소 =====
  await step('08 마이페이지', async () => {
    const acc = await waitFor(() => $('button[aria-label="내 계정"]'), 4000)
    if (acc) {
      await click(acc)
      await sleep(600)
      await click(byExact('a', '마이페이지'))
    } else navigate('/mypage')
    await atPath('/mypage')
    cap('MY PAGE', '마이페이지')
    await sleep(2200)
    const saved = byText('main a', '저장한 장소')
    if (saved) {
      await click(saved)
      await atPath('/bookmarks')
      cap('MY PAGE', '저장한 장소')
      await sleep(2800)
    }
  })

  // ===== 9. 브랜드 소개 =====
  await step('09 동해사이 소개', async () => {
    await goNav('동해사이', '/about')
    cap('ABOUT', '동해사이 브랜드')
    await sleep(1800)
    await tourPage({ stepVh: 0.8, dwell: 1500, maxSteps: 5 })
  })

  // ===== 10. 마무리. 다시 홈의 챗봇 =====
  await step('10 마무리', async () => {
    const logo = $$('header a').find((a) => a.getAttribute('href') === '/')
    if (logo) await click(logo); else navigate('/')
    await waitFor(() => $('textarea[aria-label="동해사이 도우미에게 질문하기"]'), 6000)
    await sleep(1200)
    cap('AI CHATBOT', '뚜벅이 1박 2일 코스 추천')
    const chip = byText('button', '뚜벅이 1박')
    if (chip) {
      const before = copyCount()
      await click(chip)
      await waitAnswer(before)
      await sleep(2600)
    }
    cap('', '하루와 하루 사이, 동해')
    await sleep(3200)
  })
}
