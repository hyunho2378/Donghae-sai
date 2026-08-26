import { Link } from 'react-router-dom'
import Badge from '../Badge'
import { cleanLabel } from '../../lib/format'
export default function PackageCard({
  id, name, badges = [], images, main_image,
  duration_label, short_description
}) {
  const image = main_image || images?.[0]
  return (
    <Link to={`/packages/${id}`} className="group block">
      <article className="shadow-card rounded-2xl overflow-hidden bg-white">
        <div className="relative aspect-[16/9] bg-bg-card overflow-hidden">
          {image && (
            <img src={image} alt={name}
                 className="w-full h-full object-cover
                            transition-transform duration-[600ms] ease-out
                            motion-reduce:transition-none motion-reduce:transform-none
                            group-hover:scale-[1.04]" />
          )}
          <div className="absolute top-3 left-3">
            <Badge variant="soft">{badges.slice(0, 2).join(' ')}</Badge>
          </div>
        </div>
        <div className="p-5 lg:p-6">
          <h3 className="type-card-title text-text-strong line-clamp-2">
            {name}
          </h3>
          <p className="mt-1 font-pretendard font-semibold text-[14px] text-text-sec">
            {duration_label}
          </p>
          {short_description && (
            <p className="mt-3 font-pretendard font-normal text-[14px] text-text-sec leading-relaxed line-clamp-2">
              {cleanLabel(short_description)}
            </p>
          )}
          <span className="mt-4 inline-flex items-center justify-center
                           h-11 px-4
                           bg-white text-primary border border-primary
                           font-pretendard font-medium text-[14px] rounded-lg
                           hover:bg-primary-soft transition-colors duration-150">
            자세히 보기
          </span>
        </div>
      </article>
    </Link>
  )
}
