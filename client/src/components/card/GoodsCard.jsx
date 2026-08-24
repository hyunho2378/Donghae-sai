import { formatPrice, GOODS_CATEGORY_LABEL } from '../../lib/format'

export default function GoodsCard({ name, category, price, images }) {
  const image = images?.[0]
  return (
    <article className="group cursor-pointer">
      <div className="aspect-square overflow-hidden rounded-xl bg-bg-card">
        {image && (
          <img src={image} alt={name}
               className="w-full h-full object-cover
                          transition-transform duration-[600ms] ease-out
                          group-hover:scale-[1.04]" />
        )}
      </div>
      <div className="pt-3">
        <span className="font-pretendard font-light text-[12px] text-text-meta">
          {GOODS_CATEGORY_LABEL[category]}
        </span>
        <h3 className="mt-1 font-pretendard font-medium text-[16px] text-text-strong line-clamp-2">
          {name}
        </h3>
        <p className="mt-1 font-pretendard font-bold text-[16px] text-text-pri">
          {formatPrice(price)}
        </p>
      </div>
    </article>
  )
}
