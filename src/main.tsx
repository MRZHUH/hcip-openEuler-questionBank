import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Routes, Route, NavLink } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import RandomExam from './pages/RandomExam'
import Practice from './pages/Practice'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <div className="w-full bg-white/70 backdrop-blur border-b border-white/30">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-2 sm:py-3 flex items-center gap-2 sm:gap-3">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? 'px-3 py-1 rounded-md bg-indigo-600 text-white shadow-sm text-sm sm:text-base'
                : 'px-3 py-1 rounded-md bg-white text-indigo-700 border border-indigo-300 hover:bg-indigo-50 text-sm sm:text-base'
            }
          >
            主页
          </NavLink>
          <NavLink
            to="/random"
            className={({ isActive }) =>
              isActive
                ? 'px-3 py-1 rounded-md bg-indigo-600 text-white shadow-sm text-sm sm:text-base'
                : 'px-3 py-1 rounded-md bg-white text-indigo-700 border border-indigo-300 hover:bg-indigo-50 text-sm sm:text-base'
            }
          >
            随机出题
          </NavLink>
          <NavLink
            to="/practice"
            className={({ isActive }) =>
              isActive
                ? 'px-3 py-1 rounded-md bg-indigo-600 text-white shadow-sm text-sm sm:text-base'
                : 'px-3 py-1 rounded-md bg-white text-indigo-700 border border-indigo-300 hover:bg-indigo-50 text-sm sm:text-base'
            }
          >
            背题
          </NavLink>
        </div>
      </div>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/random" element={<RandomExam />} />
        <Route path="/practice" element={<Practice />} />
      </Routes>
    </HashRouter>
  </StrictMode>,
)
