import { useParams, Navigate, Link } from 'react-router-dom'
import journalData from '../data/journal.json'
import { formatDateLong, JOURNAL_CATEGORY_LABEL } from '../lib/format'

export default function JournalDetailPage() {
  const { id } = useParams()
  const post = journalData.find((j) => j.id === id)

  if (!post) return <Navigate to="/journal" replace />

  const idx = journalData.findIndex((j) => j.id === post.id)
  const next = idx >= 0 ? journalData[(idx + 1) % journalData.length] : null

  return (
    <article className="page-enter">
      <div className="w-full aspect-[21/9] bg-bg-card overflow-hidden">
        <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover" />
      </div>
      <div className="mx-auto w-full max-w-[720px] px-5 md:px-0 py-10 lg:py-16">
        <span className="font-pretendard font-medium text-[11px] tracking-[0.06em] text-primary uppercase">
          {JOURNAL_CATEGORY_LABEL[post.category]}
        </span>
        <h1 className="mt-3 font-pretendard font-bold
                       text-[24px] md:text-[28px] lg:text-[32px] 4xl:text-[36px]
                       text-text-pri tracking-[-0.02em] leading-tight">
          {post.title}
        </h1>
        <p className="mt-2 font-pretendard font-normal text-[16px] md:text-[17px] text-text-sec">
          {post.subtitle}
        </p>
        <div className="mt-4 flex items-center gap-3 font-pretendard text-[13px]">
          <span className="font-medium text-text-meta">{post.author}</span>
          <span className="font-light text-text-meta">{formatDateLong(post.published_at)}</span>
        </div>

        <div className="mt-8 font-pretendard font-normal text-[16px] md:text-[17px] text-text-sec leading-relaxed tracking-[-0.01em]">
          {post.body}
        </div>

        {next && next.id !== post.id && (
          <div className="mt-16 border-t border-border-sub pt-8">
            <span className="font-pretendard font-light text-[12px] text-text-meta">다음 글</span>
            <Link to={`/journal/${next.id}`} className="block mt-2 font-pretendard font-bold text-[18px] text-text-pri hover:text-primary transition-colors duration-100">
              {next.title}
            </Link>
          </div>
        )}
      </div>
    </article>
  )
}
