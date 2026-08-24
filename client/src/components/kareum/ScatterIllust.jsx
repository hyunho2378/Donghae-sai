// KAREUM_MIRROR 2-5. 문어 흩뿌림. 애셋이 없으면 아무것도 렌더하지 않고 자리를 비운다
// 애셋 경로는 client/public/images/character 로 고정한다
export default function ScatterIllust({ items = [] }) {
  if (items.length === 0) return null
  return (
    <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
      {items.map((it, i) => (
        <img key={i} src={it.src} alt="" loading="lazy"
             className="absolute"
             style={{
               left: it.left,
               top: it.top,
               width: it.size,
               transform: `rotate(${it.rotate || 0}deg)`
             }} />
      ))}
    </div>
  )
}
