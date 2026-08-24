// 전역 공용 페이지 컨테이너. DESIGN.md 규격 하나로 통일한다
// 규칙은 index.css 의 .container-page 에 있다. 여기는 그 래퍼일 뿐이다
export default function Container({ as: Tag = 'div', className = '', children, ...props }) {
  return (
    <Tag className={`container-page ${className}`} {...props}>
      {children}
    </Tag>
  )
}
