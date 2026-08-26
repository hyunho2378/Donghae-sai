import { useParams, Navigate, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ArrowLeft, Users, Pin, Lightbulb, MapPin, Clock } from 'lucide-react'
import storiesData from '../data/stories.json'
import Carousel from '../components/kareum/Carousel'
import RevealOnScroll from '../components/kareum/RevealOnScroll'
import Eyebrow from '../components/Eyebrow'
import Description from '../components/Description'
import { cleanCopy, endSentence, STAY_TYPE_LABEL } from '../lib/format'
import { BRAND_HEX } from '../lib/designTokens'

// 스팟 갈래. 데이터는 type 한 필드만 쓴다
const SPOT_LABEL = STAY_TYPE_LABEL

// 자료 정리 과정에서 자동으로 붙은 제목이다. 화면에 낼 문구가 아니라 목차 메모다
const AUTO_SUMMARY_TITLE = /(에서 볼 곳|에서 먹을 것)$/

// hours 원문의 에서 표기를 물결로 바꾸고 미상 조각은 버린다
const readableHours = (h) => cleanCopy(h)
  .split(',')
  .map((p) => p.trim())
  .filter((p) => p && !/확인 안 됨|미기재|미상/.test(p))
  .join(', ')
  .replace(/에서/g, ' ~ ')

export default function StoryDetailPage() {
  const { slug } = useParams()

  const story = storiesData.find((s) => s.slug === slug)
  if (!story) return <Navigate to="/story" replace />

  const related = storiesData.filter((s) => story.related_stories?.includes(s.id))
  const summary = story.summary_box
  const summaryTitle = typeof summary === 'string' ? '' : summary?.title
  const summaryItems = typeof summary === 'string' ? [summary] : (summary?.items || [])
  const showSummary = summaryItems.length > 0 && !AUTO_SUMMARY_TITLE.test(summaryTitle || '')

  return (
    <div className="page-enter">
      <Helmet>
        <title>{story.title} | 동해사이</title>
        <meta name="description" content={story.subtitle} />
        <meta property="og:title" content={`${story.title} | 동해사이`} />
        <meta property="og:description" content={story.subtitle} />
        <meta property="og:image" content={story.cover_image} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="theme-color" content={BRAND_HEX.primary} />
      </Helmet>

      {/* Hero 풀블리드. 높이는 상세 페이지 공통 기준을 따른다 */}
      <div className="relative w-full h-[38vw] min-h-[220px] max-h-[400px] overflow-hidden bg-bg-card">
        <img src={story.cover_image} alt={story.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/45" />

        {/* 목록으로 돌아가는 길. 히어로 좌상단이 제자리다 */}
        <div className="absolute top-0 left-0 right-0 pt-4">
          <div className="container-page">
            <Link to="/story"
              className="inline-flex items-center gap-1.5 h-11 pl-3 pr-4 -ml-3 rounded-full
                             bg-black/35 hover:bg-black/55
                             font-pretendard font-semibold text-[14px] text-white
                             transition-[background-color,scale] duration-150 ease-out
                             motion-reduce:transition-none active:scale-[0.96]">
              <ArrowLeft size={16} />
              스토리
            </Link>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 pb-8 lg:pb-10">
          <div className="container-page">
            <Eyebrow tone="light">{story.category}</Eyebrow>
            <h1 className="mt-3 type-detail-title text-white">
              {story.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="container-page pt-6 lg:pt-8">
        {story.cover_credit && (
          <p className="text-right font-pretendard font-normal text-[12px] text-text-meta">
            {story.cover_credit}
          </p>
        )}

        <p className="font-pretendard font-normal
                      text-[16px] md:text-[18px]
                      text-text-sec leading-relaxed">
          {story.subtitle?.replace(/\n/g, ' ')}
        </p>

        <div className="mt-4 flex items-center gap-3 font-pretendard">
          <span className="font-medium text-[13px] text-text-meta tabular-nums">{story.published_at}</span>
          <span className="w-px h-3 bg-border-def" />
          <span className="font-medium text-[13px] text-text-meta">{story.author}</span>
        </div>

        {story.target_audience && (
          <div className="mt-6 flex items-start gap-3 bg-bg-mute rounded-2xl p-5">
            <Users size={20} className="shrink-0 mt-0.5 text-text-meta" />
            <div>
              <p className="font-pretendard font-semibold text-[13px] text-text-meta mb-1">추천 대상</p>
              <p className="font-pretendard font-normal text-pretty text-[14px] md:text-[15px] text-text-sec leading-relaxed">
                {story.target_audience}
              </p>
            </div>
          </div>
        )}

        {/* 이 스토리의 특징. 제목은 굵게 세우고 설명은 항목이나 문장으로 편다 */}
        {story.highlights?.length > 0 && (
          <div className="mt-4 flex items-start gap-3 bg-bg-mute rounded-2xl p-5">
            <Pin size={20} className="shrink-0 mt-0.5 text-text-meta" />
            <div className="min-w-0 flex-1">
              <p className="font-pretendard font-semibold text-[13px] text-text-meta mb-3">이 스토리의 특징</p>
              <ol className="space-y-4">
                {story.highlights.map((h, i) => {
                  const title = typeof h === 'string' ? h : h.title
                  const desc = typeof h === 'string' ? '' : h.description
                  return (
                    <li key={i}>
                      <p className="font-pretendard font-bold text-[15px] md:text-[16px] text-text-pri">
                        <span className="mr-2 text-primary tabular-nums">{i + 1}</span>
                        {title}
                      </p>
                      {desc && <Description text={desc} className="mt-2" />}
                    </li>
                  )
                })}
              </ol>
            </div>
          </div>
        )}

        {showSummary && (
          <div className="mt-4 flex items-start gap-3 bg-primary-soft rounded-2xl p-5">
            <Lightbulb size={20} className="shrink-0 mt-0.5 text-primary-hover" />
            <div className="min-w-0 flex-1">
              {summaryTitle && (
                <p className="font-pretendard font-semibold text-[13px] text-primary-hover mb-2">
                  {summaryTitle}
                </p>
              )}
              <ul className="space-y-1.5">
                {summaryItems.map((it) => (
                  <li key={it} className="font-pretendard font-medium text-[14px] md:text-[15px] text-text-pri leading-relaxed">
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      <div className="container-page mt-10 lg:mt-12">
        <div className="space-y-5">
          {story.intro_paragraphs?.map((p, i) => (
            <p key={i} className="font-pretendard font-normal
                                   text-[15px] md:text-[16px] 4xl:text-[17px]
                                   text-text-sec leading-relaxed">
              {endSentence(p)}
            </p>
          ))}
        </div>

        {/* 스팟. 사진은 섹션을 꽉 채우고 그 아래 소개 글이 따라온다 */}
        <div className="mt-12 space-y-14">
          {story.spots?.map((spot, i) => {
            const hours = readableHours(spot.hours)
            return (
              <RevealOnScroll key={i}>
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="font-pretendard font-bold text-[32px] md:text-[40px]
                                   text-text-ter leading-none tabular-nums">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h2 className="type-section-title text-text-pri">
                      {spot.name}
                    </h2>
                    <span className="mt-1 inline-block font-pretendard font-semibold text-[12px]
                                     text-primary tracking-[0.08em] uppercase">
                      {SPOT_LABEL[spot.type] || ''}
                    </span>
                  </div>
                </div>

                {spot.image && (
                  <div className="-mx-5 md:-mx-8 lg:-mx-12 xl:-mx-16 3xl:-mx-24
                                  aspect-[16/9] overflow-hidden rounded-none md:rounded-2xl
                                  bg-bg-mute mb-3">
                    <img src={spot.image} alt={spot.name} loading="lazy"
                      className="w-full h-full object-cover" />
                  </div>
                )}
                {spot.credit && (
                  <p className="font-pretendard font-normal text-[12px] text-text-meta mb-4 text-right">
                    {spot.credit}
                  </p>
                )}

                {/* 소개 글. 데이터에 있는 원문을 그대로 노출한다 */}
                <div className="space-y-4">
                  {spot.description_paragraphs?.length > 0
                    ? spot.description_paragraphs.map((p, j) => (
                      <p key={j} className="font-pretendard font-normal
                                              text-[15px] md:text-[16px]
                                              text-text-sec leading-relaxed">
                        {endSentence(p)}
                      </p>
                    ))
                    : <Description text={spot.description} size="lg" />}
                </div>

                {(spot.address || hours) && (
                  <dl className="mt-5 rounded-2xl bg-bg-mute overflow-hidden">
                    {spot.address && (
                      <div className="grid grid-cols-[76px_minmax(0,1fr)] gap-3 px-5 py-4 md:grid-cols-[96px_minmax(0,1fr)] md:gap-5">
                        <dt className="font-pretendard font-semibold text-[14px] text-text-sec">주소</dt>
                        <dd className="min-w-0 font-pretendard font-medium text-[14px] md:text-[15px] text-text-pri leading-relaxed">
                          <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(spot.address)}`}
                            target="_blank" rel="noopener noreferrer"
                            className="inline-flex min-h-11 items-center gap-1.5 hover:text-primary
                                        transition-[color] duration-150 motion-reduce:transition-none">
                            <MapPin size={16} className="shrink-0 mt-0.5 text-text-meta" />
                            {spot.address}
                          </a>
                        </dd>
                      </div>
                    )}
                    {hours && (
                      <div className={`grid grid-cols-[76px_minmax(0,1fr)] gap-3 px-5 py-4 md:grid-cols-[96px_minmax(0,1fr)] md:gap-5 ${spot.address ? 'border-t border-border-sub' : ''}`}>
                        <dt className="font-pretendard font-semibold text-[14px] text-text-sec">운영</dt>
                        <dd className="min-w-0 font-pretendard font-medium text-[14px] md:text-[15px] text-text-pri leading-relaxed">
                          <span className="inline-flex items-start gap-1.5">
                            <Clock size={16} className="shrink-0 mt-0.5 text-text-meta" />
                            {hours}
                          </span>
                        </dd>
                      </div>
                    )}
                  </dl>
                )}

                {spot.linked_stay_id && (
                  <div className="mt-5">
                    <Link
                      to={`/stays/${spot.linked_stay_id}`}
                      className="inline-flex items-center h-11 px-5
                                 bg-white text-primary border border-primary
                                 font-pretendard font-semibold text-[14px] rounded-lg
                                 hover:bg-primary-soft
                                 transition-[background-color,scale] duration-150 ease-out
                                 motion-reduce:transition-none active:scale-[0.96]">
                      숙소 예약하기
                    </Link>
                  </div>
                )}
              </RevealOnScroll>
            )
          })}
        </div>

        {story.faq?.length > 0 && (
          <div className="mt-14 pt-10 border-t border-border-sub">
            <h2 className="type-section-title text-text-pri mb-8">
              자주 묻는 질문
            </h2>
            <div className="space-y-8">
              {story.faq.map((item, i) => (
                <div key={i}>
                  <p className="font-pretendard font-bold text-[16px] md:text-[17px]
                                 text-text-pri mb-2">
                    Q. {item.question}
                  </p>
                  <p className="font-pretendard font-normal text-[15px] md:text-[16px]
                                 text-text-sec leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {related.length > 0 && (
        <div className="mt-14 bg-bg-mute py-12 lg:py-16">
          <div className="container-page">
            <h2 className="type-section-title text-text-pri mb-6">
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
                      loading="lazy"
                      className="w-full h-full object-cover
                                 transition-transform duration-[600ms] ease-out
                                 motion-reduce:transition-none motion-reduce:transform-none group-hover:scale-[1.04]" />
                  </div>
                  <h3 className="mt-3 type-card-title text-text-strong line-clamp-2">
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
