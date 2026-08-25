import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import RevealOnScroll from '../components/kareum/RevealOnScroll'
import Eyebrow from '../components/Eyebrow'
import { BRAND_HEX } from '../lib/designTokens'

const SECTION = 'container-page'
const H2 = 'type-section-title'

// 브랜드 색. 동해 블루와 무코 레드
const COLORS = [
  { name: '동해 블루', hex: BRAND_HEX.primary, klass: 'bg-primary', note: '주색. 바다와 새벽의 파랑' },
  { name: '무코 레드', hex: BRAND_HEX.accent, klass: 'bg-accent', note: '강조색. 캐릭터 무코의 색' }
]

// 무코 정면 캐릭터. 애셋이 없으면 브랜드 색 블록으로 채운다
function MukoFigure() {
  const [err, setErr] = useState(false)
  return (
    <div className="relative aspect-square w-full max-w-[440px] mx-auto rounded-2xl overflow-hidden
                    bg-accent-soft flex items-center justify-center">
      {!err ? (
        <img src="/images/character/muko-main.png" alt="동해사이 캐릭터 무코"
             onError={() => setErr(true)}
             className="w-full h-full object-contain p-4" />
      ) : (
        <span className="font-pretendard font-bold text-[28px] text-accent tracking-[-0.02em]">무코</span>
      )}
    </div>
  )
}

export default function AboutPage() {
  return (
    <div className="page-enter">
      <Helmet>
        <title>브랜드 소개 | 동해사이</title>
        <meta name="description" content="동해사이는 흩어진 장소와 시간과 사람을 잇는다. 캐릭터 무코와 선라이즈 링크 심볼로 머무는 여행을 만든다." />
        <meta property="og:title" content="브랜드 소개 | 동해사이" />
        <meta name="theme-color" content={BRAND_HEX.primary} />
      </Helmet>

      {/* 히어로 */}
      <section className="bg-black text-white">
        <div className={`${SECTION} py-16 md:py-20 lg:py-28 4xl:py-36`}>
          <Eyebrow>동해사이</Eyebrow>
          <h1 className="mt-4 type-display max-w-[900px]">
            <span className="text-accent">머무는 여행</span>, 이어지는 <span className="text-primary">동해</span>
          </h1>
          <p className="mt-5 max-w-[680px] font-pretendard font-normal
                        text-[15px] md:text-[17px] text-white/75 tracking-[-0.01em] leading-relaxed">
            동해사이는 흩어진 동해의 장소와 시간과 사람을 이어요. 당일로 스쳐 가던 하루를 하룻밤 더 머무는 여행으로 바꿔요.
          </p>
        </div>
      </section>

      {/* 브랜드명 뜻 */}
      <section className={`${SECTION} section-page`}>
        <RevealOnScroll>
          <h2 className={`${H2} text-text-pri`}>이름의 뜻</h2>
          <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-14 items-start">
            <p className="font-pretendard font-normal text-[16px] md:text-[18px] text-text-sec leading-relaxed tracking-[-0.01em]">
              <span className="font-bold text-text-pri">동해</span>와 <span className="font-bold text-text-pri">사이</span>.
              사이는 장소와 장소, 낮과 밤, 사람과 사람을 잇는 틈이에요.
              동해사이는 그 틈을 이어 하나의 여정으로 만들어요.
            </p>
            <div className="grid gap-3">
              {['숙소와 식당 사이', '낮과 밤 사이', '당일과 1박 사이', '사람과 장소 사이'].map((t) => (
                <div key={t} className="shadow-card rounded-xl px-5 py-4
                                        font-pretendard font-bold text-[16px] md:text-[17px] text-text-pri tracking-[-0.02em]">
                  {t}
                </div>
              ))}
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* 선라이즈 링크 심볼 */}
      <section className="bg-bg-card">
        <div className={`${SECTION} section-page`}>
          <RevealOnScroll>
            <div className="grid gap-10 lg:grid-cols-[280px_1fr] lg:gap-16 items-center">
              <div className="mx-auto w-full max-w-[240px] aspect-square rounded-2xl overflow-hidden bg-black
                              flex items-center justify-center p-10">
                <img src="/favicon.svg" alt="선라이즈 링크 심볼" className="w-full h-full" />
              </div>
              <div>
                <Eyebrow tone="accent">심볼</Eyebrow>
                <h2 className={`mt-3 ${H2} text-text-pri`}>선라이즈 링크</h2>
                <p className="mt-4 max-w-[620px] font-pretendard font-normal text-[15px] md:text-[16px] text-text-sec leading-relaxed tracking-[-0.01em]">
                  일출 반원과 물결, 그리고 양 끝의 점 두 개.
                  떠오르는 아침과 이어지는 바다 위에 사람과 장소를 잇는 두 점을 얹었다.
                  흩어진 동해를 하나의 선으로 잇는 동해사이의 약속이에요.
                </p>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* 캐릭터 무코 */}
      <section className={`${SECTION} section-page`}>
        <RevealOnScroll>
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
            <MukoFigure />
            <div>
              <Eyebrow tone="accent">캐릭터</Eyebrow>
              <h2 className={`mt-3 ${H2} text-text-pri`}>
                동해의 안내자, <span className="text-accent">무코</span>
              </h2>
              <p className="mt-4 max-w-[620px] font-pretendard font-normal text-[15px] md:text-[16px] text-text-sec leading-relaxed tracking-[-0.01em]">
                무코는 동해 바다에서 온 문어예요. 여덟 개의 팔로 흩어진 장소를 잇고,
                저녁부터 다음 날 아침까지 동해의 밤을 안내해요.
                무코의 색은 브랜드 강조색인 무코 레드예요.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {['동해 문어', '밤의 안내자', '무코 레드'].map((tag) => (
                  <span key={tag} className="inline-flex items-center h-8 px-3 rounded-full
                                             bg-accent-soft text-accent
                                             font-pretendard font-medium text-[13px]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* 색 시스템 */}
      <section className="bg-bg-card">
        <div className={`${SECTION} section-page`}>
          <RevealOnScroll>
            <h2 className={`${H2} text-text-pri`}>브랜드 색</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {COLORS.map((c) => (
                <div key={c.name} className="shadow-card rounded-2xl overflow-hidden bg-white">
                  <div className={`h-28 ${c.klass}`} />
                  <div className="p-5">
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="font-pretendard font-bold text-[17px] text-text-pri tracking-[-0.02em]">{c.name}</p>
                      <p className="font-pretendard font-medium text-[13px] text-text-meta tracking-[0.04em]">{c.hex}</p>
                    </div>
                    <p className="mt-1 font-pretendard font-normal text-[14px] text-text-sec">{c.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </RevealOnScroll>
        </div>
      </section>

    </div>
  )
}
