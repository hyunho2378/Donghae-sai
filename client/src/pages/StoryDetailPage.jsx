import { useState } from 'react'
import { useParams, Navigate, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ArrowLeft, Link2, Check, Users, Pin, Lightbulb } from 'lucide-react'
import storiesData from '../data/stories.json'
import Carousel from '../components/kareum/Carousel'
import RevealOnScroll from '../components/kareum/RevealOnScroll'
import ScatterIllust from '../components/kareum/ScatterIllust'

// 첫 스팟 블롭 마스킹 포인트용 path 하나. viewBox 0 0 400 400 기준
const SPOT_BLOB = 'M 365.1 200.0 C 363.2 242.9, 330.6 295.1, 297.0 321.6 C 263.4 348.2, 206.5 366.7, 163.7 359.2 C 120.8 351.8, 59.1 315.7, 40.0 277.1 C 20.9 238.4, 28.5 166.6, 49.1 127.3 C 69.7 88.0, 120.5 51.7, 163.7 41.2 C 207.0 30.6, 274.8 37.6, 308.4 64.1 C 341.9 90.6, 367.0 157.1, 365.1 200.0 Z'

const CATEGORY_LABEL = {
  Culture: '문화',
  Spot: '명소',
  Stay: '스테이',
  Cafe: '카페',
  Dining: '식당',
  Cowork: '코워킹',
  Activity: '액티비티',
  Market: '마켓'
}

export default function StoryDetailPage() {
  const { slug } = useParams()
  const [copied, setCopied] = useState(false)

  const story = storiesData.find((s) => s.slug === slug)
  if (!story) return <Navigate to="/story" replace />

  const related = storiesData.filter((s) => story.related_stories?.includes(s.id))

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleTwitterShare = () => {
    const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(story.title)}`
    window.open(url, '_blank', 'noopener noreferrer')
  }

  return (
    <div className="page-enter">
      <Helmet>
        <title>{story.title} | 동해사이</title>
        <meta name="description" content={story.subtitle || story.summary_box} />
        <meta property="og:title" content={`${story.title} | 동해사이`} />
        <meta property="og:description" content={story.subtitle || story.summary_box} />
        <meta property="og:image" content={story.cover_image} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="theme-color" content="#4AB8CD" />
      </Helmet>

      {/* Hero 풀블리드. 커버 한 장. 슬라이더 아님. 하단에 카피와 이름 */}
      <div className="relative w-full aspect-[21/9] min-h-[240px] max-h-[560px] overflow-hidden bg-bg-card">
        <img src={story.cover_image} alt={story.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute bottom-0 left-0 right-0
                        px-5 md:px-8 lg:px-12 xl:px-16 3xl:px-24 pb-8 lg:pb-12">
          <div className="mx-auto max-w-[720px]">
            <p className="font-pretendard font-medium text-[12px] md:text-[13px] tracking-[0.08em] text-white/80">
              {story.category}
            </p>
            <h1 className="mt-2 font-pretendard font-bold
                           text-[26px] md:text-[36px] lg:text-[44px]
                           text-white tracking-[-0.02em] leading-tight">
              {story.title}
            </h1>
          </div>
        </div>
      </div>
      {story.cover_credit && (
        <div className="container-page">
          <p className="text-right font-pretendard font-light text-[12px] text-text-meta mt-2">
            {story.cover_credit}
          </p>
        </div>
      )}

      <div className="container-page pt-8 lg:pt-12">

        <Link to="/story"
          className="inline-flex items-center gap-1.5 font-pretendard font-medium text-[14px]
                         text-text-meta hover:text-text-pri transition-colors duration-100 mb-6">
          <ArrowLeft size={16} />
          스토리
        </Link>

        {/* 2. Subtitle. 수동 줄바꿈을 없애고 자동 줄바꿈에 맡긴다 */}
        <p className="mt-3 font-pretendard font-normal
                      text-[16px] md:text-[18px]
                      text-text-sec leading-relaxed">
          {story.subtitle?.replace(/\n/g, ' ')}
        </p>

        {/* 3. Date + Author */}
        <div className="mt-4 flex items-center gap-3 font-pretendard">
          <span className="font-light text-[13px] text-text-meta">{story.published_at}</span>
          <span className="w-px h-3 bg-border-def" />
          <span className="font-medium text-[13px] text-text-meta">{story.author}</span>
        </div>

        {/* 4. Target audience box */}
        <div className="mt-6 flex items-start gap-3 bg-bg-card rounded-xl p-4">
          <Users size={20} className="shrink-0 mt-0.5 text-text-meta" />
          <div>
            <p className="font-pretendard font-medium text-[13px] text-text-meta mb-1">추천 대상</p>
            <p className="font-pretendard font-normal text-[14px] md:text-[15px] text-text-sec leading-relaxed">
              {story.target_audience}
            </p>
          </div>
        </div>

        {/* 5. Highlights box */}
        <div className="mt-4 flex items-start gap-3 bg-bg-card rounded-xl p-4">
          <Pin size={20} className="shrink-0 mt-0.5 text-text-meta" />
          <div>
            <p className="font-pretendard font-medium text-[13px] text-text-meta mb-2">이 스토리의 특징</p>
            <ol className="space-y-1.5">
              {story.highlights?.map((h, i) => (
                <li key={i} className="font-pretendard font-normal text-[14px] md:text-[15px] text-text-sec leading-relaxed">
                  <span className="font-medium text-primary-hover mr-1.5">{i + 1}</span>
                  {typeof h === 'string' ? h : `${h.title}. ${h.description}`}
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* 6. Summary box */}
        <div className="mt-4 flex items-start gap-3 bg-bg-mute rounded-xl p-4">
          <Lightbulb size={20} className="shrink-0 mt-0.5 text-text-meta" />
          <p className="font-pretendard font-normal text-[14px] md:text-[15px] text-text-sec leading-relaxed">
            {typeof story.summary_box === 'string'
              ? story.summary_box
              : `${story.summary_box?.title}. ${story.summary_box?.items?.join(', ')}`}
          </p>
        </div>
      </div>

      {/* 8. Intro paragraphs */}
      <div className="container-page mt-10 lg:mt-12">
        <div className="space-y-5">
          {story.intro_paragraphs?.map((p, i) => (
            <p key={i} className="font-pretendard font-normal
                                   text-[15px] md:text-[16px] 4xl:text-[17px]
                                   text-text-sec leading-relaxed tracking-[-0.01em]">
              {p}
            </p>
          ))}
        </div>

        {/* 9. Spots */}
        <div className="mt-12 space-y-16">
          {story.spots?.map((spot, i) => (
            <RevealOnScroll key={i}>
              {/* Spot number + name + category */}
              <div className="flex items-baseline gap-3 mb-4">
                <span className="font-pretendard font-bold text-[32px] md:text-[40px]
                                 text-text-ter tracking-[-0.02em] leading-none">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h2 className="font-pretendard font-bold
                                 text-[20px] md:text-[22px] lg:text-[24px]
                                 text-text-pri tracking-[-0.02em] leading-tight">
                    {spot.name}
                  </h2>
                  <span className="mt-0.5 inline-block font-pretendard font-medium text-[12px]
                                   text-primary tracking-[0.04em]">
                    {CATEGORY_LABEL[spot.category] || spot.category}
                  </span>
                </div>
              </div>

              {/* 스팟 사진. 첫 스팟만 BlobCard 방식 블롭 마스킹 포인트. 나머지는 풀블리드 16:9 */}
              {i === 0 && spot.image ? (
                <div className="relative w-full max-w-[420px] mx-auto aspect-square mb-1">
                  <svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid meet"
                    className="absolute inset-0 w-full h-full">
                    <defs>
                      <clipPath id={`story-spot-blob-${i}`}>
                        <path d={SPOT_BLOB} />
                      </clipPath>
                    </defs>
                    <g clipPath={`url(#story-spot-blob-${i})`}>
                      <image href={spot.image} x="0" y="0" width="400" height="400"
                        preserveAspectRatio="xMidYMid slice" />
                    </g>
                  </svg>
                  <ScatterIllust items={[]} />
                </div>
              ) : (
                <div className="-mx-5 md:-mx-8 lg:-mx-12 xl:-mx-16 3xl:-mx-24
                                aspect-[16/9] overflow-hidden rounded-none md:rounded-xl
                                bg-bg-card mb-1">
                  {spot.image && (
                    <img
                      src={spot.image}
                      alt={spot.name}
                      className="w-full h-full object-cover" />
                  )}
                </div>
              )}
              <p className="font-pretendard font-light text-[12px] text-text-meta mb-5 text-right
                             px-0">
                {spot.credit}
              </p>

              {/* Spot description */}
              <div className="space-y-4">
                {spot.description_paragraphs?.map((p, j) => (
                  <p key={j} className="font-pretendard font-normal
                                        text-[15px] md:text-[16px]
                                        text-text-sec leading-relaxed tracking-[-0.01em]">
                    {p}
                  </p>
                ))}
              </div>

              {/* Linked stay CTA */}
              {spot.linked_stay_id && (
                <div className="mt-5">
                  <Link
                    to={`/stays/${spot.linked_stay_id}`}
                    className="inline-flex items-center h-10 px-5
                               bg-white text-primary border border-primary
                               font-pretendard font-medium text-[14px] rounded-lg
                               hover:bg-primary-soft transition-colors duration-150">
                    스테이 예약하기
                  </Link>
                </div>
              )}
            </RevealOnScroll>
          ))}
        </div>

        {/* 10. FAQ */}
        {story.faq?.length > 0 && (
          <div className="mt-16 pt-12 border-t border-border-sub">
            <h2 className="font-pretendard font-bold
                           text-[20px] md:text-[22px] lg:text-[24px]
                           text-text-pri tracking-[-0.02em] mb-8">
              자주 묻는 질문
            </h2>
            <div className="space-y-8">
              {story.faq.map((item, i) => (
                <div key={i}>
                  <p className="font-pretendard font-bold text-[16px] md:text-[17px]
                                 text-text-pri tracking-[-0.01em] mb-2">
                    Q. {item.question}
                  </p>
                  <p className="font-pretendard font-normal text-[15px] md:text-[16px]
                                 text-text-sec leading-relaxed tracking-[-0.01em]">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 11. Share buttons */}
        <div className="mt-12 pt-8 border-t border-border-sub">
          <p className="font-pretendard font-medium text-[14px] text-text-meta mb-4">
            이 스토리 공유하기
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-2 h-10 px-4
                         bg-white border border-border-def rounded-lg
                         font-pretendard font-medium text-[14px] text-text-sec
                         hover:border-primary hover:text-primary
                         transition-colors duration-150">
              {copied ? <Check size={15} /> : <Link2 size={15} />}
              {copied ? '복사됨' : '링크 복사'}
            </button>
            <button
              onClick={handleTwitterShare}
              className="inline-flex items-center gap-2 h-10 px-4
                         bg-white border border-border-def rounded-lg
                         font-pretendard font-medium text-[14px] text-text-sec
                         hover:border-primary hover:text-primary
                         transition-colors duration-150">
              X(트위터)
            </button>
            <button
              onClick={() => alert('카카오 공유 기능은 준비 중입니다.')}
              className="inline-flex items-center gap-2 h-10 px-4
                         bg-white border border-border-def rounded-lg
                         font-pretendard font-medium text-[14px] text-text-ter
                         cursor-not-allowed">
              카카오 (준비중)
            </button>
          </div>
        </div>
      </div>

      {/* 12. Related stories */}
      {related.length > 0 && (
        <div className="mt-16 bg-bg-mute py-12 lg:py-16">
          <div className="container-page">
            <h2 className="font-pretendard font-bold
                           text-[20px] md:text-[22px] lg:text-[24px]
                           text-text-pri tracking-[-0.02em] mb-6">
              비슷한 스토리
            </h2>
            <Carousel label="비슷한 스토리"
              className="-mx-5 px-5 md:-mx-8 md:px-8 lg:-mx-12 lg:px-12 pb-2"
              itemClassName="w-[72%] sm:w-[52%] md:w-[40%] lg:w-[31%]">
              {related.map((s) => (
                <Link key={s.id} to={`/story/${s.slug}`} className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl shadow-card bg-bg-card">
                    <img
                      src={s.cover_image}
                      alt={s.title}
                      className="w-full h-full object-cover
                                 transition-transform duration-[600ms] ease-out
                                 motion-reduce:transition-none group-hover:scale-[1.04]" />
                  </div>
                  <h3 className="mt-3 font-pretendard font-bold
                                 text-[16px] md:text-[17px]
                                 text-text-strong tracking-[-0.02em] leading-snug line-clamp-2">
                    {s.title}
                  </h3>
                  <p className="mt-1 font-pretendard font-medium text-[13px] text-text-meta">
                    {s.author}
                  </p>
                </Link>
              ))}
            </Carousel>
          </div>
        </div>
      )}
    </div>
  )
}