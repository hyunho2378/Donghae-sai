import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { CheckCircle } from 'lucide-react'
import { formatPrice } from '../lib/format'

export default function CheckoutCompletePage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()

  const orderId = params.get('orderId') || ''
  const name = params.get('name') || ''
  const type = params.get('type') || 'stay'
  const checkin = params.get('checkin') || ''
  const checkout = params.get('checkout') || ''
  const guests = Number(params.get('guests')) || 1
  const price = Number(params.get('price')) || 0

  return (
    <div className="page-enter container-page max-w-[600px]
                    py-16 lg:py-24">
      <Helmet>
        <title>구매 완료 | 동해사이</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="text-center">
        <CheckCircle size={48} className="text-primary mx-auto mb-6" />
        <h1 className="type-page-title text-text-pri">
          예약이 완료되었습니다
        </h1>
        <p className="mt-3 font-pretendard font-normal text-[15px] text-text-sec">
          동해에서 만나요
        </p>
      </div>

      <div className="mt-10 shadow-card rounded-xl p-5 lg:p-6 space-y-3 font-pretendard text-[14px] tabular-nums">
        <div className="flex justify-between gap-4">
          <span className="font-medium text-text-meta">예약 번호</span>
          <span className="font-bold text-text-pri tracking-[0.04em]">{orderId}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="font-medium text-text-meta">예약 장소</span>
          <span className="font-medium text-text-pri text-right">{name}</span>
        </div>
        {type === 'stay' && checkin && (
          <>
            <div className="flex justify-between gap-4">
              <span className="font-medium text-text-meta">체크인</span>
              <span className="font-medium text-text-pri">{checkin}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="font-medium text-text-meta">체크아웃</span>
              <span className="font-medium text-text-pri">{checkout}</span>
            </div>
          </>
        )}
        <div className="flex justify-between gap-4">
          <span className="font-medium text-text-meta">인원</span>
          <span className="font-medium text-text-pri">{guests}명</span>
        </div>
        <div className="flex justify-between gap-4 pt-3 border-t border-border-sub">
          <span className="font-bold text-[16px] text-text-pri">결제 금액</span>
          <span className="font-bold text-[18px] text-primary">{formatPrice(price)}</span>
        </div>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <Link
          to="/pass"
          className="w-full sm:flex-1 h-12 inline-flex items-center justify-center
                     bg-text-pri text-white rounded-lg
                     font-pretendard font-medium text-[15px]
                     hover:bg-black transition-colors duration-150">
          내 예약 보기
        </Link>
        <button
          onClick={() => navigate('/')}
          className="w-full sm:flex-1 h-12 inline-flex items-center justify-center
                     bg-white text-text-pri border border-border-def rounded-lg
                     font-pretendard font-medium text-[15px]
                     hover:border-text-pri transition-colors duration-150">
          홈으로
        </button>
      </div>
    </div>
  )
}
