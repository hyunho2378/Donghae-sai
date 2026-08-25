import { useState } from 'react'
import GoodsCard from '../components/card/GoodsCard'
import Chip from '../components/Chip'
import goodsData from '../data/goods.json'

// goods.json 의 category 는 이미 한글 라벨이라 데이터에서 직접 목록을 뽑는다
const CATEGORIES = ['전체', ...Array.from(new Set(goodsData.map((g) => g.category)))]

export default function GoodsPage() {
  const [cat, setCat] = useState('전체')
  const items = cat === '전체' ? goodsData : goodsData.filter((g) => g.category === cat)

  return (
    <div className="page-enter container-page
                    py-8 lg:py-12">
      <h1 className="type-page-title text-text-pri">
        로컬 굿즈
      </h1>
      <p className="mt-2 font-pretendard font-normal text-[15px] md:text-[16px] text-text-sec">
        마을의 손과 텃밭에서 온 상품
      </p>
      <p className="mt-1 font-pretendard font-normal text-[12px] md:text-[13px] text-text-meta tabular-nums">
        총 {items.length}개 표시 중
      </p>

      <p className="mt-6 font-pretendard font-medium text-[13px] text-text-pri mb-2">카테고리</p>
      <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-5 px-5">
        {CATEGORIES.map((c) => (
          <Chip key={c} label={c} isSelected={cat === c} onClick={() => setCat(c)} />
        ))}
      </div>

      <div className="mt-8 lg:mt-10 grid gap-4 md:gap-6
                      grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
        {items.map((g) => <GoodsCard key={g.id} {...g} />)}
      </div>
    </div>
  )
}
