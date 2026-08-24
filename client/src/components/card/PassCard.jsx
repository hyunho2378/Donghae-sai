import { forwardRef } from 'react'

const PassCard = forwardRef(function PassCard({ userName, planLabel, validLabel, collected, total, passCode }, ref) {
  return (
    <div
      ref={ref}
      className="relative aspect-[16/10] w-full max-w-[480px]
                 bg-black text-white rounded-[20px]
                 p-6 lg:p-8
                 overflow-hidden
                 flex flex-col justify-between">
      <div>
        <p className="font-pretendard font-medium text-[13px] text-white/70 tracking-[0.04em]">
          동해사이 패스
        </p>
        <p className="mt-1 font-pretendard font-bold text-[22px] tracking-[-0.02em]">{userName}</p>
        <div className="mt-2">
          <span className="h-7 px-3 rounded-full inline-flex items-center
                           bg-white/10 text-white
                           font-pretendard font-medium text-[13px]">
            {planLabel}
          </span>
        </div>
      </div>
      <div>
        <p className="font-pretendard font-medium text-[14px] text-white/80">
          스탬프 {collected} / {total}
        </p>
        <p className="mt-0.5 font-pretendard font-light text-[13px] text-white/60">
          {validLabel}
        </p>
      </div>
      <div className="absolute bottom-6 right-6 lg:bottom-8 lg:right-8 w-24 h-24 bg-white rounded-md flex items-center justify-center">
        <div className="font-pretendard font-light text-[10px] text-black text-center break-all px-1">
          {passCode}
        </div>
      </div>
    </div>
  )
})

export default PassCard
