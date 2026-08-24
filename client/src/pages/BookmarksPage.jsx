import { Bookmark } from 'lucide-react'
import staysData from '../data/stays.json'
import packagesData from '../data/packages.json'
import StayCard from '../components/card/StayCard'
import PackageCard from '../components/card/PackageCard'
import { getBookmarkIds } from '../hooks/useBookmark'

export default function BookmarksPage() {
  const stayIds = getBookmarkIds('stays')
  const pkgIds = getBookmarkIds('packages')

  const stays = staysData.filter((s) => stayIds.includes(s.id))
  const pkgs = packagesData.filter((p) => pkgIds.includes(p.id))
  const total = stays.length + pkgs.length

  return (
    <div className="page-enter mx-auto w-full
                    px-5 md:px-8 lg:px-12 xl:px-16 3xl:px-24
                    max-w-[1400px] 2xl:max-w-[1600px]
                    py-8 lg:py-12">

      <div className="mb-8 lg:mb-10">
        <h1 className="font-pretendard font-bold text-[24px] lg:text-[28px] text-text-pri tracking-[-0.02em]">
          내 북마크
        </h1>
        <p className="mt-1 font-pretendard font-light text-[14px] text-text-meta">
          저장한 공간 {total}곳
        </p>
      </div>

      {total === 0 ? (
        <div className="py-24 flex flex-col items-center gap-4 text-center">
          <Bookmark size={48} className="text-text-ter" />
          <p className="font-pretendard font-medium text-[16px] text-text-meta">
            저장한 공간이 없습니다
          </p>
          <p className="font-pretendard font-normal text-[14px] text-text-ter">
            마음에 드는 공간을 북마크해 보세요
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {stays.length > 0 && (
            <section>
              <h2 className="font-pretendard font-bold text-[18px] text-text-pri mb-5">
                스테이 ({stays.length})
              </h2>
              <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                {stays.map((s) => <StayCard key={s.id} {...s} />)}
              </div>
            </section>
          )}
          {pkgs.length > 0 && (
            <section>
              <h2 className="font-pretendard font-bold text-[18px] text-text-pri mb-5">
                프로그램 ({pkgs.length})
              </h2>
              <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {pkgs.map((p) => <PackageCard key={p.id} {...p} />)}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}
