import { REGIONS } from '../RegionSection'

// CONTENT_GUIDE 히어로 형식. 활동 문장을 앞에 두고 장소를 뒤에 둔다
// 호스트 실명은 자료 대기라 장소만 표기한다
const TITLES = {
  추암: '촛대바위에서 일출을 보고 해파랑길로 걷기',
  무릉: '라벤더 정원과 호수를 밤 10시까지 걷기',
  천곡: '도심 속 동굴을 지나 시장에서 저녁 먹기',
  묵호: '논골담길을 밤에 걷고 등대에서 하루 마치기',
  망상: '넓은 백사장에서 캠핑하며 하룻밤 보내기'
}

export const HERO_SLIDES = REGIONS.map((r) => ({
  image: r.image,
  title: TITLES[r.name],
  subtitle: `${r.name} 권역에서`
}))
