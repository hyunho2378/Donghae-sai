import { Link } from 'react-router-dom'
import Badge from '../Badge'
import BookmarkButton from '../button/BookmarkButton'
import { STAY_TYPE_LABEL, shortPrice, cleanCopy } from '../../lib/format'

export default function StayCard({
  id, name, type, region, main_image, gallery,
  price_label, short_description
}) {
  const image = main_image || gallery?.[0]
  return (
    <article className="relative">
      <Link to={`/stays/${id}`} className="group block">
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-bg-mute shadow-card">
          {image && (
            <img src={image} alt={name}
              loading="lazy"
              className="w-full h-full object-cover
                            transition-transform duration-[600ms] ease-out
                            motion-reduce:transition-none motion-reduce:transform-none group-hover:scale-[1.04]" />
          )}
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge variant="primary" className="font-semibold">{STAY_TYPE_LABEL[type]}</Badge>
          </div>
        </div>
        <div className="pt-4">
          <span className="font-pretendard font-semibold text-[12px] md:text-[13px] tracking-[0.08em] text-primary">
            {region}
          </span>
          <h3 className="mt-1 type-card-title text-text-strong line-clamp-2">
            {name}
          </h3>
          {short_description && (
            <p className="mt-2 font-pretendard font-normal text-[13px] md:text-[14px] text-text-sec line-clamp-2 leading-relaxed">
              {cleanCopy(short_description)}
            </p>
          )}
          {shortPrice(price_label) && (
            <p className="mt-2 font-pretendard font-bold text-[15px] text-text-pri tabular-nums">
              {shortPrice(price_label)}
            </p>
          )}
        </div>
      </Link>
      <div className="absolute top-2.5 right-2.5">
        <BookmarkButton onImage itemId={id} itemType="stays" />
      </div>
    </article>
  )
}
