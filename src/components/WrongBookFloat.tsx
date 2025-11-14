import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { BookOpenCheck } from 'lucide-react'
import { getWrongCount } from '../utils/wrongBook'

const WrongBookFloat = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const isHome = location.pathname === '/'
  const source = useMemo<'openeuler' | 'opengauss'>(() => {
    return location.pathname.startsWith('/opengauss') ? 'opengauss' : 'openeuler'
  }, [location.pathname])
  const [count, setCount] = useState<number>(() => getWrongCount(source))

  useEffect(() => {
    setCount(getWrongCount(source))
  }, [source])

  useEffect(() => {
    const handler = (e: Event) => {
      const anyE = e as any
      if (anyE?.detail?.source === source) setCount(getWrongCount(source))
    }
    window.addEventListener('wrongbook:update', handler as EventListener)
    return () => window.removeEventListener('wrongbook:update', handler as EventListener)
  }, [source])

  if (isHome) return null

  const toPath = source === 'opengauss' ? '/opengauss/wrong' : '/openeuler/wrong'

  return (
    <button
      onClick={() => navigate(toPath)}
      className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-3 py-2 rounded-full shadow-soft border border-white/30 backdrop-blur bg-white/80 hover:bg-white text-gray-800"
    >
      <BookOpenCheck size={18} className={source === 'opengauss' ? 'text-green-600' : 'text-indigo-600'} />
      <span className="text-sm">错题本</span>
      <span className="ml-1 inline-flex items-center justify-center min-w-[1.5rem] px-1 rounded bg-gray-100 text-gray-700 text-xs">{count}</span>
    </button>
  )
}

export default WrongBookFloat