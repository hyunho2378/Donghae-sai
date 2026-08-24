import KareumHeader from './KareumHeader'
import Carousel from './Carousel'
import BlobCard from './BlobCard'
import RevealOnScroll from './RevealOnScroll'
import { REGIONS } from '../RegionSection'

// 권역마다 다른 블롭 5종. viewBox 0 0 400 400 기준이라 폭이 바뀌어도 비율이 유지된다
const BLOBS = [
  'M 365.1 200.0 C 363.2 242.9, 330.6 295.1, 297.0 321.6 C 263.4 348.2, 206.5 366.7, 163.7 359.2 C 120.8 351.8, 59.1 315.7, 40.0 277.1 C 20.9 238.4, 28.5 166.6, 49.1 127.3 C 69.7 88.0, 120.5 51.7, 163.7 41.2 C 207.0 30.6, 274.8 37.6, 308.4 64.1 C 341.9 90.6, 367.0 157.1, 365.1 200.0 Z',
  'M 372.2 200.0 C 373.3 238.0, 346.2 292.3, 317.5 317.5 C 288.8 342.6, 237.0 353.2, 200.0 351.0 C 163.0 348.8, 122.4 329.4, 95.7 304.3 C 69.1 279.1, 43.2 238.1, 39.8 200.0 C 36.5 161.9, 48.8 103.8, 75.5 75.5 C 102.2 47.2, 160.8 28.0, 200.0 30.3 C 239.2 32.6, 281.9 61.1, 310.6 89.4 C 339.3 117.7, 371.1 162.0, 372.2 200.0 Z',
  'M 348.2 200.0 C 349.9 248.4, 326.4 332.1, 289.0 354.1 C 251.6 376.1, 167.9 357.6, 123.9 331.9 C 79.8 306.2, 24.6 244.1, 24.5 200.0 C 24.5 155.9, 81.0 90.0, 123.3 67.2 C 165.7 44.5, 241.3 41.4, 278.8 63.6 C 316.2 85.7, 346.5 151.6, 348.2 200.0 Z',
  'M 371.7 200.0 C 372.2 236.7, 356.6 284.6, 332.7 311.3 C 308.7 338.1, 264.6 354.4, 228.3 360.4 C 192.0 366.5, 145.7 364.7, 114.9 347.4 C 84.1 330.2, 54.6 290.6, 43.7 256.9 C 32.8 223.2, 35.8 176.2, 49.5 145.2 C 63.1 114.2, 95.7 88.4, 125.4 70.9 C 155.2 53.3, 194.1 36.7, 228.2 40.1 C 262.3 43.4, 306.1 64.3, 330.0 90.9 C 353.9 117.6, 371.3 163.3, 371.7 200.0 Z',
  'M 370.4 200.0 C 368.9 240.1, 326.3 286.9, 291.6 314.8 C 256.8 342.7, 203.0 374.1, 161.8 367.5 C 120.5 360.9, 62.2 314.9, 44.0 275.1 C 25.8 235.4, 32.5 167.3, 52.6 129.0 C 72.8 90.8, 123.5 54.6, 164.7 45.4 C 206.0 36.3, 266.0 48.5, 300.3 74.2 C 334.6 100.0, 371.8 159.9, 370.4 200.0 Z'
]

// CONTENT_GUIDE 권역 카피를 15자 안팎으로 줄였다. 활동을 먼저 말한다
const CAPTIONS = {
  추암: '촛대바위 일출로 하루를 연다',
  무릉: '라벤더 정원이 밤 10시까지',
  천곡: '도심 동굴을 걷고 시장에 들른다',
  묵호: '논골담길 걷고 항구의 밤을 본다',
  망상: '백사장에서 캠핑하며 하룻밤'
}

export default function RegionBlobSection() {
  return (
    <section className="mx-auto w-full
                        px-5 md:px-8 lg:px-12 xl:px-16 3xl:px-24
                        max-w-[1400px] 2xl:max-w-[1600px]
                        py-12 md:py-18 lg:py-24 4xl:py-32">
      <RevealOnScroll>
        <KareumHeader title="동해사이 5개 권역" count={REGIONS.length} countLabel="개 권역" />
        <p className="mt-3 font-pretendard font-normal
                      text-[15px] md:text-[16px] 4xl:text-[17px]
                      tracking-[-0.01em] text-text-sec">
          흩어진 장소를 이어 하루 더 머무는 여행을 만든다
        </p>
      </RevealOnScroll>

      <RevealOnScroll className="mt-8">
        <Carousel
          label="동해사이 권역"
          className="-mx-5 px-5 md:-mx-8 md:px-8 lg:-mx-12 lg:px-12
                     xl:-mx-16 xl:px-16 3xl:-mx-24 3xl:px-24 pb-2"
          itemClassName="w-[74%] sm:w-[52%] md:w-[42%] lg:w-[32%] xl:w-[27%]">
          {REGIONS.map((r, i) => (
            // 홀짝으로 세로 오프셋을 번갈아 줘 지그재그로 흐르게 한다
            <div key={r.name} className={i % 2 === 1 ? 'md:mt-14' : ''}>
              <BlobCard
                slug={`region-${i}`}
                name={r.name}
                image={r.image}
                text={r.text}
                caption={CAPTIONS[r.name]}
                path={BLOBS[i % BLOBS.length]} />
            </div>
          ))}
        </Carousel>
      </RevealOnScroll>
    </section>
  )
}
