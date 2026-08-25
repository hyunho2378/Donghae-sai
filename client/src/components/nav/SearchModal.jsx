import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import staysData from '../../data/stays.json'
import packagesData from '../../data/packages.json'
import storiesData from '../../data/stories.json'

const QUICK = ['논골담길', '무릉별유천지', '촛대바위', '묵호 맛집']

function score(item, q) {
  const lower = q.toLowerCase()
  let s = 0
  const fields = [
    { value: item._name, weight: { exact: 100, partial: 50 } },
    { value: item._tagline, weight: { exact: 50, partial: 30 } },
    { value: item._desc, weight: { exact: 20, partial: 10 } }
  ]
  fields.forEach(({ value, weight }) => {
    if (!value) return
    const v = value.toLowerCase()
    if (v === lower) s += weight.exact
    else if (v.includes(lower)) s += weight.partial
  })
  ;(item._tags || []).forEach((t) => {
    if (t.toLowerCase().includes(lower)) s += 30
  })
  return s
}

function buildIndex() {
  const results = []
  staysData.forEach((s) => {
    results.push({
      _name: s.name,
      _tagline: s.tagline,
      _desc: s.short_description,
      _tags: s.tags || [],
      _image: s.main_image,
      _category: s.type,
      _label: s.region,
      _href: `/stays/${s.id}`
    })
  })
  packagesData.forEach((p) => {
    results.push({
      _name: p.name,
      _tagline: p.tagline,
      _desc: p.short_description,
      _tags: Array.isArray(p.target_persona) ? p.target_persona : [p.target_persona],
      _image: p.main_image,
      _category: 'program',
      _label: p.duration_label || '',
      _href: `/packages/${p.id}`
    })
  })
  storiesData.forEach((s) => {
    results.push({
      _name: s.title,
      _tagline: s.subtitle,
      _desc: s.summary_box,
      _tags: s.tags || [],
      _image: s.cover_image,
      _category: s.category,
      _label: s.author || '',
      _href: `/story/${s.slug}`
    })
  })
  return results
}

const INDEX = buildIndex()

const CATEGORY_LABEL = {
  cowork: '코워킹',
  lodging: '숙박',
  dining: '식당',
  activity: '액티비티',
  program: '프로그램',
  TRAVEL: '트래블',
  REGION: '권역',
  PICK: '픽'
}

export default function SearchModal({ onClose }) {
  const [q, setQ] = useState('')
  const [results, setResults] = useState([])
  const inputRef = useRef(null)
  const backdropRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    inputRef.current?.focus()
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  useEffect(() => {
    const term = q.trim()
    if (!term) { setResults([]); return }
    const scored = INDEX
      .map((item) => ({ ...item, _score: score(item, term) }))
      .filter((item) => item._score > 0)
      .sort((a, b) => b._score - a._score)
      .slice(0, 10)
    setResults(scored)
  }, [q])

  const go = (href) => {
    onClose()
    navigate(href)
  }

  return (
    <div
      ref={backdropRef}
      onClick={(e) => { if (e.target === backdropRef.current) onClose() }}
      className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center pt-[calc(60px+env(safe-area-inset-top))] pb-[env(safe-area-inset-bottom)] px-5 overflow-y-auto md:pt-[80px]">

      <div className="w-full max-w-[600px] bg-white rounded-2xl overflow-hidden">

        {/* Input row */}
        <div className="flex items-center gap-3 px-5 h-[60px] border-b border-border-sub">
          <Search size={20} className="text-text-meta shrink-0" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="어디로 떠날까요"
            className="flex-1 bg-transparent outline-none
                       font-pretendard font-normal text-[16px] text-text-pri
                       placeholder:text-text-ter" />
          <button
            aria-label="닫기"
            onClick={onClose}
            className="w-11 h-11 md:w-10 md:h-10 rounded-full inline-flex items-center justify-center
                       hover:bg-bg-card transition-colors duration-150">
            <X size={20} className="text-text-meta" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[480px] overflow-y-auto">
          {!q.trim() && (
            <div className="px-5 py-5">
              <p className="font-pretendard font-medium text-[12px] tracking-[0.06em]
                             text-text-meta mb-3">
                빠른 검색
              </p>
              <div className="flex flex-wrap gap-2">
                {QUICK.map((term) => (
                  <button
                    key={term}
                    onClick={() => setQ(term)}
                    className="min-h-11 md:min-h-10 px-4 rounded-full
                               bg-white border border-border-def
                               font-pretendard font-medium text-[14px] text-text-sec
                               hover:border-primary hover:text-primary
                               transition-colors duration-150">
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {q.trim() && results.length === 0 && (
            <div className="px-5 py-10 text-center">
              <p className="font-pretendard font-normal text-[14px] text-text-meta">
                검색 결과가 없습니다
              </p>
            </div>
          )}

          {results.length > 0 && (
            <ul className="py-2">
              {results.map((item, i) => (
                <li key={i}>
                  <button
                    onClick={() => go(item._href)}
                    className="w-full flex items-center gap-4 px-5 py-3
                               hover:bg-bg-card transition-colors duration-100 text-left">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-bg-mute shrink-0">
                      {item._image && (
                        <img src={item._image} alt="" className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-pretendard font-medium text-[12px] tracking-[0.04em]
                                          text-primary">
                          {CATEGORY_LABEL[item._category] || item._category}
                        </span>
                        {item._label && (
                          <span className="font-pretendard font-medium text-[12px] text-text-meta">
                            {item._label}
                          </span>
                        )}
                      </div>
                      <p className="font-pretendard font-medium text-[15px] text-text-pri
                                    truncate">
                        {item._name}
                      </p>
                      {item._tagline && (
                        <p className="font-pretendard font-normal text-[13px] text-text-meta
                                       truncate">
                          {item._tagline}
                        </p>
                      )}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
