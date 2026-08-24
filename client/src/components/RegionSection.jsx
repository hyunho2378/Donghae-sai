import { Link } from 'react-router-dom'

// 카피는 CONTENT_GUIDE.md 초안이다. 팀 검수 전이며 천곡과 망상은 확인된 자원 자료가 적다
// 이미지는 client/public/images/regions에 넣는다. 파일이 없으면 회색 플레이스홀더로 떨어진다
export const REGIONS = [
  { name: '추암', image: '/images/regions/chuam.jpg', text: '촛대바위 일출로 하루를 시작하는 곳. 해파랑길 33코스가 여기서 출발한다' },
  { name: '무릉', image: '/images/regions/muleung.jpg', text: '폐채석장이 라벤더 정원과 에메랄드빛 호수로 다시 태어난 곳. 밤 10시까지 열린다' },
  { name: '천곡', image: '/images/regions/cheongok.jpg', text: '도심 속 동굴과 시장이 있는 동해의 한가운데' },
  { name: '묵호', image: '/images/regions/mukho.jpg', text: '논골담길과 등대, 항구의 밤이 있는 원도심' },
  { name: '망상', image: '/images/regions/mangsang.jpg', text: '넓은 백사장과 캠핑의 바다' }
]

export default function RegionSection() {
  return (
    <section className="container-page
                        py-12 md:py-18 lg:py-24 4xl:py-32">
      <h2 className="font-pretendard font-bold
                     text-[20px] md:text-[22px] lg:text-[24px] 4xl:text-[28px]
                     tracking-[-0.02em] text-text-pri">
        동해사이 5개 권역
      </h2>
      <p className="mt-2 font-pretendard font-normal
                    text-[15px] md:text-[16px] 4xl:text-[17px]
                    tracking-[-0.01em] text-text-sec">
        흩어진 장소를 이어 하루 더 머무는 여행을 만든다
      </p>

      <div className="mt-8 grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {REGIONS.map((r) => (
          <Link
            key={r.name}
            to={`/stays?region=${encodeURIComponent(r.name)}`}
            className="group block rounded-xl overflow-hidden shadow-card
                       hover:border-primary transition-colors duration-150">
            <div className="relative aspect-[4/3] bg-bg-mute overflow-hidden
                            flex items-center justify-center">
              {/* 사진이 없을 때만 드러나는 폴백. 사진이 덮으므로 보조기기에서는 감춘다 */}
              <span aria-hidden="true"
                    className="select-none font-pretendard font-light text-[13px] text-text-ter">
                이미지 자료 대기
              </span>
              <img
                src={r.image}
                alt={`${r.name} 권역`}
                loading="lazy"
                onError={(e) => { e.currentTarget.style.visibility = 'hidden' }}
                className="absolute inset-0 w-full h-full object-cover
                           transition-transform duration-[600ms] ease-out
                           group-hover:scale-[1.04]" />
            </div>
            <div className="p-4 lg:p-5">
              <p className="font-pretendard font-bold
                            text-[17px] md:text-[18px] lg:text-[19px] 4xl:text-[20px]
                            tracking-[-0.02em] text-text-strong">
                {r.name}
              </p>
              <p className="mt-2 font-pretendard font-normal
                            text-[15px] md:text-[16px] 4xl:text-[17px]
                            tracking-[-0.01em] leading-relaxed text-text-sec">
                {r.text}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
