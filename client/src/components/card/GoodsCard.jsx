import { formatPrice, shortPrice } from '../../lib/format'

// goods.json 은 category 가 이미 한글 라벨이고 images 가 비어 있는 항목이 많다
// 이미지 없으면 톤 블록으로 채워 카드가 비어 보이지 않게 한다
export default function GoodsCard({ name, category, price, price_label, images }) {
  const image = images?.[0]
  const priceText = price > 0 ? formatPrice(price) : (shortPrice(price_label) || '가격 문의')
  return (
    <article className="group">
      <div className="aspect-square overflow-hidden rounded-xl bg-bg-mute flex items-center justify-center">
        {image ? (
          <img src={image} alt={name}
               className="w-full h-full object-cover
                          transition-transform duration-[600ms] ease-out
                          motion-reduce:transition-none motion-reduce:transform-none group-hover:scale-[1.04]" />
        ) : (
          <span className="px-3 text-center font-pretendard font-semibold text-[12px] text-text-ter">
            {category || '동해 굿즈'}
          </span>
        )}
      </div>
      <div className="pt-3">
        <span className="font-pretendard font-medium text-[12px] text-text-meta">
          {category}
        </span>
        <h3 className="mt-1 type-card-title text-text-strong line-clamp-2">
          {name}
        </h3>
        <p className="mt-1 font-pretendard font-bold text-[15px] text-text-pri">
          {priceText}
        </p>
      </div>
    </article>
  )
}
