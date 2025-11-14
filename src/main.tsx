import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { Star } from 'lucide-react'
import './index.css'
import App from './App.tsx'
import RandomExam from './pages/RandomExam'
import Practice from './pages/Practice'
import Selection from './pages/Selection'
import { OpenGaussExam, OpenGaussPractice, OpenGaussRandomExam } from './pages/OpenGaussPages'
import WrongBookFloat from './components/WrongBookFloat'
import WrongBook from './pages/WrongBook'
import { OpenGaussWrongBook } from './pages/OpenGaussPages'

const Stars = () => {
  const [count, setCount] = useState<number | null>(null)
  useEffect(() => {
    fetch('https://api.github.com/repos/MRZHUH/hcip-openEuler-questionBank')
      .then((r) => r.json())
      .then((d) => setCount(typeof d.stargazers_count === 'number' ? d.stargazers_count : 0))
      .catch(() => {})
  }, [])
  return (
    <a
      href="https://github.com/MRZHUH/hcip-openEuler-questionBank"
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-1 px-2 py-1 rounded-md bg-white text-gray-800 border border-indigo-300 hover:bg-indigo-50 text-sm"
    >
      <Star size={16} className="text-yellow-500" />
      <span>Star</span>
      <span className="ml-1 inline-flex items-center justify-center min-w-[1.5rem] px-1 rounded bg-gray-100 text-gray-700">
        {count === null ? '—' : String(count)}
      </span>
    </a>
  )
}

const Navigation = () => {
  const location = useLocation()
  const showNav = !['/'].includes(location.pathname)
  
  if (!showNav) return null
  
  const isOpenGauss = location.pathname.startsWith('/opengauss')
  const baseColor = isOpenGauss ? 'green' : 'indigo'
  
  return (
    <div className="w-full bg-white/70 backdrop-blur border-b border-white/30">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-2 sm:py-3 flex items-center gap-2 sm:gap-3">
        <NavLink
          to={isOpenGauss ? '/opengauss' : '/openeuler'}
          className={({ isActive }) =>
            isActive
              ? `px-3 py-1 rounded-md bg-${baseColor}-600 text-white shadow-sm text-sm sm:text-base`
              : `px-3 py-1 rounded-md bg-white text-${baseColor}-700 border border-${baseColor}-300 hover:bg-${baseColor}-50 text-sm sm:text-base`
          }
        >
          主页
        </NavLink>
        {!isOpenGauss ? (
          <>
            <NavLink
              to="/openeuler/random"
              className={({ isActive }) =>
                isActive
                  ? 'px-3 py-1 rounded-md bg-indigo-600 text-white shadow-sm text-sm sm:text-base'
                  : 'px-3 py-1 rounded-md bg-white text-indigo-700 border border-indigo-300 hover:bg-indigo-50 text-sm sm:text-base'
              }
            >
              随机出题
            </NavLink>
            <NavLink
              to="/openeuler/practice"
              className={({ isActive }) =>
                isActive
                  ? 'px-3 py-1 rounded-md bg-indigo-600 text-white shadow-sm text-sm sm:text-base'
                  : 'px-3 py-1 rounded-md bg-white text-indigo-700 border border-indigo-300 hover:bg-indigo-50 text-sm sm:text-base'
              }
            >
              背题
            </NavLink>
          </>
        ) : (
          <>
            <NavLink
              to="/opengauss/random"
              className={({ isActive }) =>
                isActive
                  ? 'px-3 py-1 rounded-md bg-green-600 text-white shadow-sm text-sm sm:text-base'
                  : 'px-3 py-1 rounded-md bg-white text-green-700 border border-green-300 hover:bg-green-50 text-sm sm:text-base'
              }
            >
              随机出题
            </NavLink>
            <NavLink
              to="/opengauss/practice"
              className={({ isActive }) =>
                isActive
                  ? 'px-3 py-1 rounded-md bg-green-600 text-white shadow-sm text-sm sm:text-base'
                  : 'px-3 py-1 rounded-md bg-white text-green-700 border border-green-300 hover:bg-green-50 text-sm sm:text-base'
              }
            >
              背题
            </NavLink>
          </>
        )}
        <div className="ml-auto">
          <Stars />
        </div>
      </div>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <Navigation />
      <WrongBookFloat />
      <Routes>
        <Route path="/" element={<Selection />} />
        <Route path="/openeuler" element={<App />} />
        <Route path="/openeuler/random" element={<RandomExam />} />
        <Route path="/openeuler/practice" element={<Practice />} />
        <Route path="/openeuler/wrong" element={<WrongBook />} />
        <Route path="/opengauss" element={<OpenGaussExam />} />
        <Route path="/opengauss/random" element={<OpenGaussRandomExam />} />
        <Route path="/opengauss/practice" element={<OpenGaussPractice />} />
        <Route path="/opengauss/wrong" element={<OpenGaussWrongBook />} />
      </Routes>
    </HashRouter>
    <SpeedInsights />
  </StrictMode>,
)
