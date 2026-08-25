import { Link } from 'react-router-dom'

export default function Logo() {
  return (
    <Link to="/" aria-label="동해사이 홈"
      className="inline-flex min-h-11 lg:min-h-10 items-center leading-none">
      <img src="/images/logo/logo-wordmark.svg" alt="동해사이"
           className="h-5 lg:h-6 w-auto" />
    </Link>
  )
}
