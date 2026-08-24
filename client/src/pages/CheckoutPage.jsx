import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Check } from 'lucide-react'
import staysData from '../data/stays.json'
import packagesData from '../data/packages.json'
import { formatPrice, calcNights } from '../lib/format'

const PAYMENT_METHODS = [
  { key: 'kakao', label: '카카오페이' },
  { key: 'toss', label: '토스페이' },
  { key: 'card', label: '신용카드' }
]

const AGREEMENTS = [
  { key: 'terms', label: '이용약관 동의 (필수)' },
  { key: 'privacy', label: '개인정보 수집 이용 동의 (필수)' },
  { key: 'refund', label: '환불 규정 확인 (필수)' }
]

function mockGenOrderId() {
  const d = new Date()
  const date = `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `GG-${date}-${rand}`
}

export default function CheckoutPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()

  const type = params.get('type') || 'stay'
  const itemId = params.get('id') || ''
  const checkin = params.get('checkin') || ''
  const checkout = params.get('checkout') || ''
  const guests = Number(params.get('guests')) || 1
  const price = Number(params.get('price')) || 0

  const item = type === 'stay'
    ? staysData.find((s) => s.id === itemId)
    : packagesData.find((p) => p.id === itemId)

  const [payMethod, setPayMethod] = useState('kakao')
  const [agreed, setAgreed] = useState({ terms: false, privacy: false, refund: false })
  const [processing, setProcessing] = useState(false)

  const nights = calcNights(checkin, checkout)
  const allAgreed = Object.values(agreed).every(Boolean)

  const toggleAgreed = (key) => setAgreed((p) => ({ ...p, [key]: !p[key] }))

  const onPay = () => {
    if (!allAgreed || processing) return
    setProcessing(true)
    const orderId = mockGenOrderId()
    setTimeout(() => {
      navigate(`/checkout/complete?orderId=${orderId}&name=${encodeURIComponent(item?.name || '')}&type=${type}&checkin=${checkin}&checkout=${checkout}&guests=${guests}&price=${price}`)
    }, 800)
  }

  if (!item) return (
    <div className="page-enter mx-auto w-full px-5 max-w-[1400px] py-20 text-center">
      <p className="font-pretendard font-medium text-[16px] text-text-meta">예약 정보를 찾을 수 없습니다.</p>
    </div>
  )

  const heroImage = item.main_image || item.gallery?.[0]

  return (
    <div className="page-enter mx-auto w-full
                    px-5 md:px-8 lg:px-12 xl:px-16 3xl:px-24
                    max-w-[1400px] 2xl:max-w-[1600px]
                    py-8 lg:py-12">
      <Helmet>
        <title>결제하기 | 동해사이</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <h1 className="font-pretendard font-bold text-[24px] lg:text-[28px] text-text-pri tracking-[-0.02em] mb-8">
        결제하기
      </h1>

      <div className="lg:grid lg:grid-cols-[1fr_380px] lg:gap-10">

        {/* 좌측 주문 요약 */}
        <div className="space-y-6">
          <section className="shadow-card rounded-xl p-5 lg:p-6">
            <h2 className="font-pretendard font-bold text-[16px] text-text-pri mb-4">예약 정보</h2>
            <div className="flex gap-4">
              {heroImage && (
                <img src={heroImage} alt={item.name}
                     className="w-20 h-20 rounded-lg object-cover shrink-0 bg-bg-card" />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-pretendard font-bold text-[17px] text-text-pri truncate">{item.name}</p>
                <p className="font-pretendard font-normal text-[13px] text-text-meta mt-1">{item.tagline}</p>
              </div>
            </div>
            <dl className="mt-5 space-y-3 font-pretendard text-[14px]">
              {type === 'stay' && checkin && (
                <>
                  <div className="flex justify-between gap-4">
                    <dt className="font-medium text-text-meta">체크인</dt>
                    <dd className="font-medium text-text-pri">{checkin}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="font-medium text-text-meta">체크아웃</dt>
                    <dd className="font-medium text-text-pri">{checkout}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="font-medium text-text-meta">숙박</dt>
                    <dd className="font-medium text-text-pri">{nights}박</dd>
                  </div>
                </>
              )}
              <div className="flex justify-between gap-4">
                <dt className="font-medium text-text-meta">인원</dt>
                <dd className="font-medium text-text-pri">{guests}명</dd>
              </div>
            </dl>
          </section>

          <section className="shadow-card rounded-xl p-5 lg:p-6">
            <h2 className="font-pretendard font-bold text-[16px] text-text-pri mb-4">결제 수단</h2>
            <div className="space-y-3">
              {PAYMENT_METHODS.map(({ key, label }) => (
                <label key={key} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payMethod"
                    value={key}
                    checked={payMethod === key}
                    onChange={() => setPayMethod(key)}
                    className="w-4 h-4 accent-primary" />
                  <span className="font-pretendard font-medium text-[15px] text-text-pri">{label}</span>
                </label>
              ))}
            </div>
          </section>

          <section className="shadow-card rounded-xl p-5 lg:p-6">
            <h2 className="font-pretendard font-bold text-[16px] text-text-pri mb-4">약관 동의</h2>
            <div className="space-y-3">
              {AGREEMENTS.map(({ key, label }) => (
                <label key={key} className="flex items-center gap-3 cursor-pointer">
                  <button
                    type="button"
                    onClick={() => toggleAgreed(key)}
                    aria-pressed={agreed[key]}
                    className={`w-5 h-5 rounded flex items-center justify-center shrink-0 border transition-colors duration-150
                                ${agreed[key] ? 'bg-primary border-primary' : 'bg-white border-border-def'}`}>
                    {agreed[key] && <Check size={12} className="text-white" strokeWidth={3} />}
                  </button>
                  <span className="font-pretendard font-normal text-[14px] text-text-sec">{label}</span>
                </label>
              ))}
            </div>
          </section>
        </div>

        {/* 우측 가격과 결제 버튼 */}
        <div className="mt-6 lg:mt-0">
          <div className="lg:sticky lg:top-24 shadow-card rounded-xl p-5 lg:p-6 space-y-4">
            <h2 className="font-pretendard font-bold text-[16px] text-text-pri">결제 금액</h2>
            <dl className="space-y-2 font-pretendard text-[14px]">
              {type === 'stay' && nights > 0 && (
                <div className="flex justify-between gap-4">
                  <dt className="font-normal text-text-meta">1박 × {nights}박</dt>
                  <dd className="font-medium text-text-pri">{formatPrice(price)}</dd>
                </div>
              )}
              {type === 'package' && (
                <div className="flex justify-between gap-4">
                  <dt className="font-normal text-text-meta">프로그램 참가비</dt>
                  <dd className="font-medium text-text-pri">{formatPrice(price)}</dd>
                </div>
              )}
              <div className="flex justify-between gap-4 pt-3 border-t border-border-sub">
                <dt className="font-bold text-[16px] text-text-pri">최종 결제금액</dt>
                <dd className="font-bold text-[20px] text-primary">{formatPrice(price)}</dd>
              </div>
            </dl>

            <button
              onClick={onPay}
              disabled={!allAgreed || processing}
              className="w-full h-14 rounded-xl
                         bg-text-pri text-white
                         font-pretendard font-bold text-[16px]
                         hover:bg-black transition-colors duration-150
                         disabled:opacity-40 disabled:cursor-not-allowed">
              {processing ? '처리 중…' : `${formatPrice(price)} 결제하기`}
            </button>

            {!allAgreed && (
              <p className="font-pretendard font-normal text-[12px] text-text-meta text-center">
                모든 약관에 동의해야 결제할 수 있습니다
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
