import { Link } from 'react-router-dom'
import CurvedCaption from './CurvedCaption'
import ScatterIllust from './ScatterIllust'

// KAREUM_MIRROR 2-6. 블롭 마스킹 사진과 곡선 카피와 문어 흩뿌림
// 그림자는 쓰지 않는다. clipPath 로 잘린 도형은 shadow-card 가 잘려 보이지 않는다
export default function BlobCard({ slug, name, image, text, caption, path, illust = [] }) {
  const clipId = `blob-clip-${slug}`
  return (
    <Link to={`/stays?region=${encodeURIComponent(name)}`} className="group block">
      <div className="relative w-full aspect-square">
        <svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid meet"
             className="absolute inset-0 w-full h-full">
          <defs>
            <clipPath id={clipId}>
              <path d={path} />
            </clipPath>
          </defs>
          <g clipPath={`url(#${clipId})`}>
            <image href={image} x="0" y="0" width="400" height="400"
                   preserveAspectRatio="xMidYMid slice"
                   style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                   className="transition-transform duration-[600ms] ease-out
                              motion-reduce:transition-none group-hover:scale-[1.04]" />
            {/* 곡선 카피 대비 확보. 히어로 위 텍스트와 같은 방식이다 */}
            <path d={path} fill="black" opacity="0.28" />
          </g>
        </svg>

        <CurvedCaption id={slug} text={caption} className="text-white" />
        <ScatterIllust items={illust} />
      </div>

      <div className="mt-4 px-2">
        <p className="font-pretendard font-bold text-[18px] tracking-[-0.02em] text-text-strong">
          {name}
        </p>
        <p className="mt-2 font-pretendard font-normal
                      text-[15px] md:text-[16px] 4xl:text-[17px]
                      tracking-[-0.01em] leading-relaxed text-text-sec line-clamp-2">
          {text}
        </p>
      </div>
    </Link>
  )
}
