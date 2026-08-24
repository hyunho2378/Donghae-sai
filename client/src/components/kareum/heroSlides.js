import { REGIONS } from '../RegionSection'

// CONTENT_GUIDE 히어로 형식. 활동 문장을 앞에 두고 장소를 뒤에 둔다
// 호스트 실명은 자료 대기라 장소만 표기한다
// 페이지마다 다른 사진을 쓴다. 세 배열이 사진을 공유하지 않는다

// 프로그램 페이지. 활동이 드러나는 places 사진
export const PROGRAM_HERO = [
  { image: '/images/places/dokkaebi-skyvalley.jpg', title: '도째비골 스카이밸리를 걷고 해랑전망대에서 밤바다 보기', subtitle: '묵호 권역에서' },
  { image: '/images/places/muleung-byeolyu.jpg', title: '무릉별유천지 호수를 지나 밤 10시까지 머물기', subtitle: '무릉 권역에서' },
  { image: '/images/places/nongol-damgil.jpg', title: '논골담길 골목을 밤에 걷고 등대에서 하루 마치기', subtitle: '묵호 권역에서' },
  { image: '/images/places/chuam-candle-rock.jpg', title: '촛대바위 일출을 보고 해파랑길로 걷기', subtitle: '추암 권역에서' },
  { image: '/images/places/mangsang-beach.jpg', title: '망상 백사장에서 캠핑하며 하룻밤 보내기', subtitle: '망상 권역에서' }
]

// 사이 찾기 페이지. 프로그램 히어로와 겹치지 않는 places 사진
export const STAYS_HERO = [
  { image: '/images/places/mukho-port.jpg', title: '묵호항에서 배를 보고 항구의 밤을 걷기', subtitle: '묵호 권역에서' },
  { image: '/images/places/muleung-forest.jpg', title: '무릉 숲길을 걷고 계곡에서 쉬어 가기', subtitle: '무릉 권역에서' },
  { image: '/images/places/bat-cave.jpg', title: '천곡황금박쥐동굴을 지나 도심에서 저녁 먹기', subtitle: '천곡 권역에서' },
  { image: '/images/places/hanseom-beach.jpg', title: '한섬해변을 따라 걷고 바다 앞에서 하루 마치기', subtitle: '망상 권역에서' },
  { image: '/images/places/samhwasa.jpg', title: '삼화사에 들렀다 무릉계곡으로 이어 걷기', subtitle: '천곡 권역에서' }
]

// 이야기 페이지. 권역 이야기라 권역 대표 사진을 그대로 쓴다
const STORY_TITLES = {
  추암: '촛대바위에서 일출을 보고 해파랑길로 걷기',
  무릉: '라벤더 정원과 호수를 밤 10시까지 걷기',
  천곡: '도심 속 동굴을 지나 시장에서 저녁 먹기',
  묵호: '논골담길을 밤에 걷고 등대에서 하루 마치기',
  망상: '넓은 백사장에서 캠핑하며 하룻밤 보내기'
}

export const STORY_HERO = REGIONS.map((r) => ({
  image: r.image,
  title: STORY_TITLES[r.name],
  subtitle: `${r.name} 권역에서`
}))
