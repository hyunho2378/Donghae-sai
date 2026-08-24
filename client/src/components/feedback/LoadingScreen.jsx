export default function LoadingScreen({ message = '잠시만 기다려 주세요' }) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center">
        <div className="flex gap-2">
          <span className="w-2 h-2 rounded-full bg-primary animate-loading-dot-1" />
          <span className="w-2 h-2 rounded-full bg-primary animate-loading-dot-2" />
          <span className="w-2 h-2 rounded-full bg-primary animate-loading-dot-3" />
        </div>
        <p className="mt-6 font-pretendard font-medium text-[16px] text-text-sec">
          {message}
        </p>
      </div>
    </div>
  )
}
