import { useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { Eye, ThumbsUp, MessageCircle, ArrowLeft, Bookmark, Share2, Heart } from 'lucide-react'
import communityData from '../data/community.json'
import { useAuthStore } from '../store/useAuthStore'
import { formatDate } from '../lib/format'
import { useBookmark } from '../hooks/useBookmark'

const CATEGORY_STYLE = {
  '모임': 'bg-primary text-white',
  '후기': 'bg-primary-soft text-primary',
  '질문': 'bg-bg-card text-text-sec border border-border-def'
}

const STAGE_STYLE = {
  visit: 'bg-bg-card text-text-meta border border-border-def',
  connect: 'bg-primary-soft text-primary',
  relationship: 'bg-bg-mute text-text-sec border border-border-sub',
  settlement: 'bg-black text-white'
}

export default function CommunityPostPage() {
  const { id } = useParams()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const user = useAuthStore((s) => s.user)

  const { isBookmarked: bookmarked, toggle: toggleBookmark } = useBookmark('community', id)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(null)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [localComments, setLocalComments] = useState([])

  const post = communityData.find((p) => p.id === id)
  if (!post) return <Navigate to="/community" replace />

  const related = communityData.filter((p) => post.related_post_ids?.includes(p.id))
  const displayLikes = likeCount !== null ? likeCount : post.likes

  const handleLike = () => {
    setLiked((prev) => {
      setLikeCount(displayLikes + (prev ? -1 : 1))
      return !prev
    })
  }

  const handleSubmitComment = (e) => {
    e.preventDefault()
    if (!comment.trim()) return
    setSubmitting(true)
    setTimeout(() => {
      setLocalComments((prev) => [
        ...prev,
        {
          id: `c-local-${Date.now()}`,
          author: user?.name || user?.email?.split('@')[0] || '익명',
          content: comment.trim(),
          created_at: new Date().toISOString().slice(0, 10),
          like_count: 0
        }
      ])
      setComment('')
      setSubmitting(false)
    }, 400)
  }

  const allComments = [...(post.comments_data || []), ...localComments]

  return (
    <div className="page-enter">
      <div className="mx-auto w-full
                      px-5 md:px-8 lg:px-12 xl:px-16 3xl:px-24
                      max-w-[720px]
                      py-8 lg:py-12">

        {/* Back */}
        <Link to="/community"
              className="inline-flex items-center gap-1.5 font-pretendard font-medium text-[14px]
                         text-text-meta hover:text-text-pri transition-colors duration-100 mb-6">
          <ArrowLeft size={16} />
          커뮤니티
        </Link>

        {/* Badges */}
        <div className="flex items-center gap-2 mb-4">
          <span className={`inline-flex items-center h-[22px] px-2.5
                             font-pretendard font-medium text-[11px] tracking-[0.04em] rounded-md
                             ${CATEGORY_STYLE[post.category]}`}>
            {post.category}
          </span>
          <span className={`inline-flex items-center h-[22px] px-2.5
                             font-pretendard font-medium text-[11px] rounded-md
                             ${STAGE_STYLE[post.authorStage]}`}>
            {null}
          </span>
        </div>

        {/* Title */}
        <h1 className="font-pretendard font-bold
                       text-[22px] md:text-[26px] lg:text-[28px]
                       text-text-pri tracking-[-0.02em] leading-tight">
          {post.title}
        </h1>

        {/* Meta row */}
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1
                        font-pretendard text-[13px] text-text-meta
                        border-b border-border-sub pb-5">
          <span className="font-medium text-text-sec">{post.author}</span>
          <span className="font-light">{formatDate(post.date)}</span>
          <span className="ml-auto inline-flex items-center gap-1">
            <Eye size={13} />{post.views + (liked ? 1 : 0)}
          </span>
          <span className="inline-flex items-center gap-1">
            <ThumbsUp size={13} />{displayLikes}
          </span>
          <span className="inline-flex items-center gap-1">
            <MessageCircle size={13} />{allComments.length}
          </span>
        </div>

        {/* Body */}
        <div className="mt-8 space-y-5">
          {(post.body || [post.preview]).map((para, i) => (
            <p key={i}
               className="font-pretendard font-normal
                          text-[15px] md:text-[16px]
                          text-text-sec leading-relaxed tracking-[-0.01em]">
              {para}
            </p>
          ))}
        </div>

        {/* Images */}
        {post.images?.length > 0 && (
          <div className={`mt-8 grid gap-3 ${post.images.length === 1 ? '' : 'grid-cols-2'}`}>
            {post.images.map((src, i) => (
              <div key={i} className="aspect-[16/9] overflow-hidden rounded-xl bg-bg-card">
                <img src={src} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}

        {/* Action buttons */}
        <div className="mt-10 flex items-center gap-3 pt-6 border-t border-border-sub">
          <button
            onClick={handleLike}
            className={`inline-flex items-center gap-2 h-10 px-4
                        border rounded-lg font-pretendard font-medium text-[14px]
                        transition-colors duration-150
                        ${liked
                          ? 'bg-primary-soft border-primary text-primary'
                          : 'bg-white border-border-def text-text-sec hover:border-primary hover:text-primary'}`}>
            <Heart size={15} className={liked ? 'fill-primary' : ''} />
            좋아요 {displayLikes}
          </button>
          <button
            onClick={toggleBookmark}
            className={`inline-flex items-center gap-2 h-10 px-4
                        border rounded-lg font-pretendard font-medium text-[14px]
                        transition-colors duration-150
                        ${bookmarked
                          ? 'bg-primary-soft border-primary text-primary'
                          : 'bg-white border-border-def text-text-sec hover:border-primary hover:text-primary'}`}>
            <Bookmark size={15} className={bookmarked ? 'fill-primary' : ''} />
            {bookmarked ? '저장됨' : '저장'}
          </button>
          <button
            onClick={() => { navigator.clipboard.writeText(window.location.href) }}
            className="inline-flex items-center gap-2 h-10 px-4
                       bg-white border border-border-def rounded-lg
                       font-pretendard font-medium text-[14px] text-text-sec
                       hover:border-primary hover:text-primary
                       transition-colors duration-150">
            <Share2 size={15} />
            공유
          </button>
        </div>

        {/* Comments */}
        <div className="mt-12">
          <h2 className="font-pretendard font-bold
                         text-[18px] md:text-[20px]
                         text-text-pri tracking-[-0.02em] mb-6">
            댓글 {allComments.length}
          </h2>

          <div className="space-y-6">
            {allComments.map((c) => (
              <div key={c.id} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-bg-mute shrink-0
                                flex items-center justify-center
                                font-pretendard font-medium text-[13px] text-text-meta">
                  {c.author.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-pretendard font-medium text-[14px] text-text-pri">
                      {c.author}
                    </span>
                    <span className="font-pretendard font-light text-[12px] text-text-meta">
                      {formatDate(c.created_at)}
                    </span>
                  </div>
                  <p className="font-pretendard font-normal text-[14px] md:text-[15px]
                                 text-text-sec leading-relaxed">
                    {c.content}
                  </p>
                  {c.like_count > 0 && (
                    <p className="mt-1 font-pretendard font-light text-[12px] text-text-meta">
                      좋아요 {c.like_count}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Comment form */}
          <div className="mt-8 pt-6 border-t border-border-sub">
            {isAuthenticated ? (
              <form onSubmit={handleSubmitComment}>
                <label className="block">
                  <span className="block font-pretendard font-medium text-[14px]
                                   text-text-pri mb-2">
                    댓글 작성
                  </span>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                    placeholder="댓글을 입력하세요"
                    className="w-full px-4 py-3 resize-none
                               bg-white border border-border-def rounded-xl
                               font-pretendard font-normal text-[15px] text-text-pri
                               placeholder:text-text-ter
                               focus:outline-none focus:border-2 focus:border-primary
                               transition-colors duration-150" />
                </label>
                <div className="mt-3 flex justify-end">
                  <button
                    type="submit"
                    disabled={!comment.trim() || submitting}
                    className="h-10 px-5 bg-primary text-white
                               font-pretendard font-medium text-[14px] rounded-lg
                               hover:bg-primary-hover transition-colors duration-150
                               disabled:opacity-40 disabled:cursor-not-allowed">
                    {submitting ? '등록 중...' : '등록'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="py-6 text-center bg-bg-card rounded-xl">
                <p className="font-pretendard font-normal text-[14px] text-text-meta mb-3">
                  댓글을 작성하려면 로그인이 필요합니다
                </p>
                <Link to={`/auth?redirect=/community/${id}`}
                      className="inline-flex items-center h-10 px-5
                                 bg-primary text-white
                                 font-pretendard font-medium text-[14px] rounded-lg
                                 hover:bg-primary-hover transition-colors duration-150">
                  로그인하기
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Related posts */}
        {related.length > 0 && (
          <div className="mt-16 pt-8 border-t border-border-sub">
            <h2 className="font-pretendard font-bold text-[18px] md:text-[20px]
                           text-text-pri tracking-[-0.02em] mb-5">
              비슷한 게시글
            </h2>
            <div className="space-y-3">
              {related.map((p) => (
                <Link key={p.id} to={`/community/${p.id}`}
                      className="flex items-start gap-3 py-3 border-b border-border-sub
                                 group hover:border-primary transition-colors duration-150">
                  <span className={`shrink-0 inline-flex items-center h-[20px] px-2
                                    font-pretendard font-medium text-[11px] rounded-sm
                                    ${CATEGORY_STYLE[p.category]}`}>
                    {p.category}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-pretendard font-medium text-[14px] md:text-[15px]
                                  text-text-pri line-clamp-1 group-hover:text-primary
                                  transition-colors duration-100">
                      {p.title}
                    </p>
                    <p className="mt-0.5 font-pretendard font-light text-[12px] text-text-meta">
                      {p.author} {formatDate(p.date)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
