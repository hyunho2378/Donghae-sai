import { useState } from 'react'
import GoodsCard from '../components/card/GoodsCard'
import Chip from '../components/Chip'
import goodsData from '../data/goods.json'
import { GOODS_CATEGORY_LABEL } from '../lib/format'

const CATEGORIES = [
  { key: 'all', label: '전체' },
  { key: 'nfc_album', label: GOODS_CATEGORY_LABEL.nfc_album },
  { key: 'curation_box', label: GOODS_CATEGORY_LABEL.curation_box },
  { key: 'produce', label: GOODS_CATEGORY_LABEL.produce },
  { key: 'processed', label: GOODS_CATEGORY_LABEL.processed }
]

export default function GoodsPage() {
  const [cat, setCat] = useState('all')
  const items = cat === 'all' ? goodsData : goodsData.filter((g) => g.category === cat)

  return (
    <div className="page-enter mx-auto w-full
                    px-5 md:px-8 lg:px-12 xl:px-16 3xl:px-24
                    max-w-[1400px] 2xl:max-w-[1600px]
                    py-8 lg:py-12">
      <h1 className="font-pretendard font-bold
                     text-[24px] md:text-[28px] lg:text-[32px] 4xl:text-[36px]
                     text-text-pri tracking-[-0.02em] leading-tight">
        로컬 굿즈
      </h1>
      <p className="mt-2 font-pretendard font-normal text-[15px] md:text-[16px] text-text-meta">
        마을의 손과 텃밭에서 온 상품
      </p>
      <p className="mt-1 font-pretendard font-light text-[12px] md:text-[13px] text-text-meta">
        총 {items.length}개 표시 중
      </p>

      <p className="mt-6 font-pretendard font-medium text-[13px] text-text-pri mb-2">카테고리</p>
      <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-5 px-5">
        {CATEGORIES.map((c) => (
          <Chip key={c.key} label={c.label} isSelected={cat === c.key} onClick={() => setCat(c.key)} />
        ))}
      </div>

      <div className="mt-8 lg:mt-10 grid gap-4 md:gap-6
                      grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
        {items.map((g) => <GoodsCard key={g.id} {...g} />)}
      </div>
    </div>
  )
}
