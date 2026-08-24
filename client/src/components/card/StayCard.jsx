import { Link } from 'react-router-dom'
import Badge from '../Badge'
import BookmarkButton from '../button/BookmarkButton'
import { STAY_TYPE_LABEL } from '../../lib/format'

export default function StayCard({
  id, name, type, region, main_image, gallery,
  price_label, short_description
}) {
  const image = main_image || gallery?.[0]
  return (
    <Link to={`/stays/${id}`} className="group block">
      <article>
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-bg-card">
          {image && (
            <img src={image} alt={name}
                 className="w-full h-full object-cover
                            transition-transform duration-[600ms] ease-out
                            group-hover:scale-[1.04]" />
          )}
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge variant="soft">{STAY_TYPE_LABEL[type]}</Badge>
          </div>
          <div className="absolute top-3 right-3">
            <BookmarkButton onImage itemId={id} itemType="stays" />
          </div>
        </div>
        <div className="pt-4">
          <span className="font-pretendard font-light text-[12px] md:text-[13px] text-text-meta">
            {region}
          </span>
          <h3 className="mt-1 font-pretendard font-bold
                         text-[17px] md:text-[18px] lg:text-[19px]
                         text-text-strong tracking-[-0.02em] line-clamp-2">
            {name}
          </h3>
          {short_description && (
            <p className="mt-2 font-pretendard font-normal text-[13px] md:text-[14px] text-text-sec line-clamp-2 leading-relaxed">
              {short_description}
            </p>
          )}
          {price_label && price_label !== '확인 안 됨' && (
            <p className="mt-2 font-pretendard font-medium text-[14px] text-text-meta">
              {price_label}
            </p>
          )}
        </div>
      </article>
    </Link>
  )
}
