import { Link } from 'react-router-dom'

export default function Logo() {
  return (
    <Link to="/" aria-label="동해사이 홈" className="inline-flex items-center leading-none">
      <img src="/images/logo/logo-wordmark.svg" alt="동해사이"
           className="h-6 lg:h-8 w-auto" />
    </Link>
  )
}
