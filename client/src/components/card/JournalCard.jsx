import { Link } from 'react-router-dom'
import { formatDate, JOURNAL_CATEGORY_LABEL } from '../../lib/format'

export default function JournalCard({
  id, title, subtitle, category, cover_image, author, published_at
}) {
  return (
    <Link to={`/journal/${id}`} className="group block">
      <article>
        <div className="aspect-[4/3] overflow-hidden rounded-xl bg-bg-card">
          {cover_image && (
            <img src={cover_image} alt={title}
                 className="w-full h-full object-cover
                            transition-transform duration-[600ms] ease-out
                            group-hover:scale-[1.04]" />
          )}
        </div>
        <div className="pt-4">
          <span className="font-pretendard font-medium text-[11px] tracking-[0.06em] text-primary uppercase">
            {JOURNAL_CATEGORY_LABEL[category]}
          </span>
          <h3 className="mt-2 font-pretendard font-bold text-[18px] text-text-strong tracking-[-0.02em] line-clamp-2">
            {title}
          </h3>
          <p className="mt-1 font-pretendard font-normal text-[14px] text-text-sec line-clamp-2">
            {subtitle}
          </p>
          <div className="mt-3 flex items-center gap-2">
            <span className="font-pretendard font-medium text-[13px] text-text-meta">{author}</span>
            <span className="font-pretendard font-light text-[13px] text-text-meta">{formatDate(published_at)}</span>
          </div>
        </div>
      </article>
    </Link>
  )
}
