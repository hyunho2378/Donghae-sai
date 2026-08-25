import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Check } from 'lucide-react'
import staysData from '../data/stays.json'
import packagesData from '../data/packages.json'
import { formatPrice, calcNights } from '../lib/format'

// 동해사이 패스 3종. 자료집 확정 가격
const PASSES = [
  { key: '1day', name: '1일권', price: 5000, desc: '하루 동안 제휴처 할인과 스탬프를 이용해요.' },
  { key: '2day', name: '2일권', price: 8000, desc: '저녁부터 다음 날 아침까지 이틀을 이어 가요.' },
  { key: '3day', name: '3일권', price: 10000, desc: '사흘 동안 동해 다섯 권역을 둘러봐요.' }
]

// 결제 수단 8종. 로고 파일은 client/public/images/pay 의 각 svg. 부재 시 텍스트 폴백
const PAY_METHODS = [
  { key: 'applepay', label: '애플페이' },
  { key: 'alipay', label: '알리페이' },
  { key: 'visa', label: '비자', card: true },
  { key: 'mastercard', label: '마스터카드', card: true },
  { key: 'paypal', label: '페이팔' },
  { key: 'amex', label: '아멕스', card: true },
  { key: 'jcb', label: 'JCB', card: true },
  { key: 'unionpay', label: '유니온페이', card: true }
]

const isCard = (key) => PAY_METHODS.find((m) => m.key === key)?.card

function PayLogo({ pkey, label }) {
  const [err, setErr] = useState(false)
  if (err) {
    return <span className="font-pretendard font-medium text-[12px] text-text-sec text-center leading-tight">{label}</span>
  }
  return (
    <img src={`/images/pay/${pkey}.svg`} alt={label}
      onError={() => setErr(true)}
      className="max-h-11 max-w-full object-contain" />
  )
}

function mockGenOrderId() {
  const rand = Math.floor(Math.random() * 1e6).toString(36).toUpperCase().padStart(4, '0')
  return `DHS-${rand}`
}

const FIELD = 'w-full h-12 px-4 rounded-lg bg-bg-card font-pretendard text-[15px] text-text-pri placeholder:text-text-ter outline-none focus:ring-2 focus:ring-primary transition-shadow duration-150'

export default function CheckoutPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()

  const type = params.get('type') || ''
  const itemId = params.get('id') || ''
  const checkin = params.get('checkin') || ''
  const checkout = params.get('checkout') || ''
  const guests = Number(params.get('guests')) || 1

  const item = type === 'stay'
    ? staysData.find((s) => s.id === itemId)
    : type === 'package'
      ? packagesData.find((p) => p.id === itemId)
      : null

  const [selectedPass, setSelectedPass] = useState('')
  const [payMethod, setPayMethod] = useState('')
  const [refundAgreed, setRefundAgreed] = useState(false)
  const [card, setCard] = useState({ number: '', expiry: '', cvc: '', name: '' })
  const [processing, setProcessing] = useState(false)

  const pass = PASSES.find((p) => p.key === selectedPass)
  const total = pass?.price || 0
  const nights = calcNights(checkin, checkout)
  const cardSelected = isCard(payMethod)

  const canPay = !!selectedPass && !!payMethod && refundAgreed
  const missing = !selectedPass ? '패스를 선택하세요'
    : !payMethod ? '결제 수단을 선택하세요'
      : !refundAgreed ? '환불 규정에 동의하세요'
        : ''

  const setCardField = (k) => (e) => setCard((c) => ({ ...c, [k]: e.target.value }))

  const onPay = () => {
    if (!canPay || processing) return
    setProcessing(true)
    const orderId = mockGenOrderId()
    setTimeout(() => {
      navigate(`/checkout/complete?orderId=${orderId}&name=${encodeURIComponent(pass.name)}&type=pass&checkin=${checkin}&checkout=${checkout}&guests=${guests}&price=${total}`)
    }, 700)
  }

  return (
    <div className="page-enter container-page
                    py-8 lg:py-12">
      <Helmet>
        <title>결제하기 | 동해사이</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <h1 className="type-page-title text-text-pri mb-8">
        결제하기
      </h1>

      <div className="lg:grid lg:grid-cols-[1fr_380px] lg:gap-10">

        {/* 좌측 요약 */}
        <div className="space-y-6">

          {/* 이용권 선택 */}
          <section>
            <h2 className="type-section-title text-text-pri mb-4">패스 선택</h2>
            <div className="space-y-3">
              {PASSES.map((p) => (
                <button key={p.key} type="button"
                  onClick={() => setSelectedPass(p.key)}
                  aria-pressed={selectedPass === p.key}
                  className={`w-full text-left rounded-xl p-4 lg:p-5 shadow-card transition-shadow duration-150
                                    ${selectedPass === p.key ? 'ring-2 ring-primary' : 'hover:ring-1 hover:ring-border-def'}`}>
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="font-pretendard font-bold text-[17px] text-text-pri">{p.name}</p>
                    <p className="font-pretendard font-bold text-[17px] text-primary tabular-nums">{p.price.toLocaleString()}원</p>
                  </div>
                  <p className="mt-1 font-pretendard font-normal text-[13px] text-text-sec">{p.desc}</p>
                </button>
              ))}
            </div>
          </section>

          {/* 선택 요약 */}
          <section className="bg-white shadow-depth rounded-2xl p-5">
            <h2 className="type-section-title text-text-pri mb-4">선택 요약</h2>
            <dl className="space-y-3 font-pretendard text-[14px] tabular-nums">
              {item && (
                <div className="flex justify-between gap-4">
                  <dt className="font-medium text-text-meta">예약 항목</dt>
                  <dd className="font-medium text-text-pri text-right">{item.name}</dd>
                </div>
              )}
              {type === 'stay' && checkin && (
                <>
                  <div className="flex justify-between gap-4">
                    <dt className="font-medium text-text-meta">일정</dt>
                    <dd className="font-medium text-text-pri text-right">{checkin} ~ {checkout}</dd>
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
              <div className="flex justify-between gap-4 pt-3 border-t border-border-sub">
                <dt className="font-medium text-text-meta">선택 패스</dt>
                <dd className="font-bold text-text-pri">{pass ? pass.name : '미선택'}</dd>
              </div>
            </dl>
          </section>

          {/* 결제 수단 */}
          <section className="bg-white shadow-depth rounded-2xl p-5">
            <h2 className="type-section-title text-text-pri mb-4">결제 수단</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PAY_METHODS.map((m) => (
                <button key={m.key} type="button"
                  onClick={() => setPayMethod(m.key)}
                  aria-pressed={payMethod === m.key}
                  className={`h-20 md:h-[88px] rounded-xl bg-white flex items-center justify-center px-4 shadow-card transition-shadow duration-150
                                    ${payMethod === m.key ? 'ring-2 ring-primary' : 'hover:ring-1 hover:ring-border-def'}`}>
                  <PayLogo pkey={m.key} label={m.label} />
                </button>
              ))}
            </div>

            {/* 카드 계열 선택 시 카드 폼. 검증 없음 */}
            {cardSelected && (
              <div className="mt-5 space-y-3">
                <input className={FIELD} placeholder="카드 번호" value={card.number} onChange={setCardField('number')} aria-label="카드 번호" />
                <div className="grid grid-cols-2 gap-3">
                  <input className={FIELD} placeholder="만료 (MM/YY)" value={card.expiry} onChange={setCardField('expiry')} aria-label="만료" />
                  <input className={FIELD} placeholder="CVC" value={card.cvc} onChange={setCardField('cvc')} aria-label="CVC" />
                </div>
                <input className={FIELD} placeholder="카드 소유자 이름" value={card.name} onChange={setCardField('name')} aria-label="카드 소유자 이름" />
              </div>
            )}

            <p className="mt-4 font-pretendard font-normal text-[12px] text-text-meta">
              이 화면에서는 결제 정보가 전송되지 않아요
            </p>
          </section>
        </div>

        {/* 우측 스티키 결제 */}
        <div className="mt-6 lg:mt-0">
          <div className="lg:sticky lg:top-[92px] bg-white shadow-depth rounded-2xl p-5 space-y-5">

            <div>
              <h2 className="type-section-title text-text-pri mb-3">금액 내역</h2>
              <dl className="space-y-2 font-pretendard text-[14px] tabular-nums">
                <div className="flex justify-between gap-4">
                  <dt className="font-normal text-text-meta">{pass ? pass.name : '패스 미선택'}</dt>
                  <dd className="font-medium text-text-pri">{formatPrice(total)}</dd>
                </div>
                <div className="flex justify-between gap-4 pt-3 border-t border-border-sub">
                  <dt className="font-bold text-[16px] text-text-pri">총 결제금액</dt>
                  <dd className="font-bold text-[20px] text-primary">{formatPrice(total)}</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-xl bg-primary-soft px-4 py-3">
              <p className="font-pretendard font-medium text-[13px] text-primary-hover leading-relaxed">
                패스 하나로 제휴처 할인과 스탬프를 함께 이용할 수 있어요
              </p>
            </div>

            <div>
              <h3 className="type-card-title text-text-pri mb-2">취소 및 환불</h3>
              <p className="font-pretendard font-normal text-[13px] text-text-sec leading-relaxed">
                시작 48시간 전까지 취소하면 전액 환불해요. 48시간 이내에는 환불하지 않아요
              </p>
              {/* 체크박스 행 전체가 히트 영역이다. 높이 44px 확보.
                  빈 상태에서도 2px 테두리로 또렷이 보이게 한다. 브라우저 기본 체크박스를 쓰지 않는다 */}
              <button type="button"
                role="checkbox"
                aria-checked={refundAgreed}
                onClick={() => setRefundAgreed((v) => !v)}
                className="mt-3 -mx-2 px-2 w-[calc(100%+1rem)] min-h-11 rounded-full
                                 flex items-center gap-3 text-left
                                 hover:bg-bg-mute
                                 transition-[background-color] duration-150 motion-reduce:transition-none">
                <span aria-hidden="true"
                  className={`w-5 h-5 rounded-sm shrink-0 border-2
                                  flex items-center justify-center
                                  transition-[background-color,border-color] duration-150 motion-reduce:transition-none
                                  ${refundAgreed
                      ? 'bg-primary border-primary'
                      : 'bg-white border-border-def'}`}>
                  <Check size={16} strokeWidth={2.5}
                    className={`text-white transition-[opacity,transform,filter] duration-150 motion-reduce:transition-none
                                ${refundAgreed ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-75 blur-[1px]'}`} />
                </span>
                <span className={`font-pretendard text-[14px]
                                  ${refundAgreed ? 'font-medium text-text-pri' : 'font-normal text-text-sec'}`}>
                  취소 및 환불 규정에 동의합니다
                </span>
              </button>
            </div>

            <div>
              <button
                onClick={onPay}
                disabled={!canPay || processing}
                className="w-full h-14 rounded-xl
                           bg-text-pri text-white
                           font-pretendard font-bold text-[16px] tabular-nums
                           hover:bg-black transition-colors duration-150
                           disabled:opacity-40 disabled:cursor-not-allowed">
                {processing ? '처리 중…' : `${formatPrice(total)} 결제하기`}
              </button>
              {!canPay && (
                <p className="mt-2 font-pretendard font-normal text-[12px] text-text-meta text-center">
                  {missing}
                </p>
              )}
              <button
                onClick={() => navigate(-1)}
                className="mt-3 w-full h-12 rounded-xl
                           bg-bg-card text-text-pri
                           font-pretendard font-medium text-[15px]
                           hover:bg-bg-mute transition-colors duration-150">
                수정하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
