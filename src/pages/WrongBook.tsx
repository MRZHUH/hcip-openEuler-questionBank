import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import questionsDefault from '../data/questions.json'
import { getWrongIds, removeWrong } from '../utils/wrongBook'
import { Check, X, ChevronRight, ChevronLeft } from 'lucide-react'

type Q = any

const WrongBook = (props: { questions?: any[]; themeColor?: 'indigo' | 'green'; title?: string }) => {
  const { questions: propQuestions, themeColor = 'indigo', title } = props
  const source: 'openeuler' | 'opengauss' = themeColor === 'green' ? 'opengauss' : 'openeuler'
  const questionsData = (propQuestions || (questionsDefault as Q[])) as Q[]
  const [ids, setIds] = useState<number[]>(() => getWrongIds(source))
  const wrongQuestions = useMemo(() => {
    const map = new Map<number, Q>()
    for (const q of questionsData) map.set(q.id, q)
    return ids.map((id) => map.get(id)).filter(Boolean) as Q[]
  }, [ids, questionsData])
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<Record<string, string[]>>({})
  const [showResult, setShowResult] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const handler = (e: Event) => {
      const anyE = e as any
      if (anyE?.detail?.source === source) setIds(getWrongIds(source))
    }
    window.addEventListener('wrongbook:update', handler as EventListener)
    return () => window.removeEventListener('wrongbook:update', handler as EventListener)
  }, [source])

  const currentQ = wrongQuestions[current]
  const currentAnswers = selected[currentQ?.id] || []

  const handleAnswer = (option: string) => {
    const curr = selected[currentQ.id] || []
    if (currentQ.type === 'single' || currentQ.type === 'judge') {
      setSelected({ ...selected, [currentQ.id]: [option] })
    } else if (currentQ.type === 'multiple') {
      if (curr.includes(option)) {
        setSelected({ ...selected, [currentQ.id]: curr.filter((a) => a !== option) })
      } else {
        setSelected({ ...selected, [currentQ.id]: [...curr, option] })
      }
    }
  }

  const handleFillAnswer = (value: string) => {
    setSelected({ ...selected, [currentQ.id]: [value] })
  }

  const checkAnswer = () => {
    const user = selected[currentQ.id] || []
    const correct = currentQ.correctAnswer || []
    if (user.length === 0) return null
    if (currentQ.type === 'fill') {
      if (!user[0] || !correct[0]) return false
      return user[0].trim().toLowerCase() === correct[0].trim().toLowerCase()
    }
    if (user.length !== correct.length) return false
    return user.every((a) => correct.includes(a)) && correct.every((a: string) => user.includes(a))
  }

  const submit = () => {
    setShowResult(true)
    const ok = checkAnswer() === true
    if (ok) {
      removeWrong(source, currentQ.id)
      setIds((prev) => {
        const next = prev.filter((x) => x !== currentQ.id)
        setShowResult(false)
        setSelected((s) => ({ ...s, [currentQ.id]: [] }))
        setCurrent((c) => (next.length === 0 ? 0 : Math.min(c, next.length - 1)))
        return next
      })
    }
  }

  const next = () => {
    if (current < wrongQuestions.length - 1) {
      setCurrent(current + 1)
      setShowResult(false)
    }
  }

  const prev = () => {
    if (current > 0) {
      setCurrent(current - 1)
      setShowResult(false)
    }
  }

  const primaryBtn = themeColor === 'green' ? 'bg-green-600 hover:bg-green-700' : 'bg-indigo-600 hover:bg-indigo-700'
  const headerBg = themeColor === 'green' ? 'bg-green-600' : 'bg-indigo-600'
  const basePath = source === 'opengauss' ? '/opengauss' : '/openeuler'
  const close = () => navigate(-1)

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={close}></div>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] rounded-2xl shadow-soft border border-white/20 bg-white/80 overflow-hidden flex flex-col">
        <div className={`px-4 py-3 text-white ${headerBg}`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg sm:text-xl font-bold">{title || '错题本'}</h1>
              <div className="text-xs sm:text-sm opacity-90">当前错题：{wrongQuestions.length}</div>
            </div>
            <button onClick={close} className="px-3 py-1 rounded bg-white/20 hover:bg-white/30">关闭</button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 sm:p-6">
        {currentQ ? (
          <div className="backdrop-blur-xl bg-white/70 rounded-2xl shadow-soft border border-white/20 p-4 sm:p-6">
            <div className="mb-4">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                currentQ.type === 'judge' ? 'bg-blue-100 text-blue-800' : currentQ.type === 'single' ? 'bg-green-100 text-green-800' : currentQ.type === 'multiple' ? 'bg-purple-100 text-purple-800' : 'bg-orange-100 text-orange-800'
              }`}>{currentQ.type === 'judge' ? '判断题' : currentQ.type === 'single' ? '单选题' : currentQ.type === 'multiple' ? '多选题' : '填空题'}</span>
              <span className="ml-2 text-gray-500">错题第 {current + 1} / {wrongQuestions.length}</span>
            </div>

            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-5 leading-relaxed">{currentQ.question}</h2>

            {currentQ.type !== 'fill' && (
              <div className="space-y-2 sm:space-y-3">
                {currentQ.options.map((option: string, index: number) => {
                  const letter = option.match(/^[A-Z]\./) ? option.charAt(0) : option
                  const isSelected = currentAnswers.includes(letter)
                  const isCorrect = currentQ.correctAnswer && currentQ.correctAnswer.includes(letter)
                  let bgColor = 'bg-white/80 hover:bg-white'
                  let borderColor = 'border-gray-200'
                  let textColor = 'text-gray-900'
                  if (showResult) {
                    if (isCorrect) {
                      bgColor = 'bg-green-50'
                      borderColor = 'border-green-500'
                      textColor = 'text-green-900'
                    } else if (isSelected && !isCorrect) {
                      bgColor = 'bg-red-50'
                      borderColor = 'border-red-500'
                      textColor = 'text-red-900'
                    }
                  } else if (isSelected) {
                    bgColor = themeColor === 'green' ? 'bg-green-50' : 'bg-indigo-50'
                    borderColor = themeColor === 'green' ? 'border-green-500' : 'border-indigo-500'
                  }
                  return (
                    <button key={index} onClick={() => !showResult && handleAnswer(letter)} disabled={showResult} className={`group w-full p-3 sm:p-4 rounded-xl border-2 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${bgColor} ${borderColor} ${textColor} ${!showResult ? 'cursor-pointer' : 'cursor-default'}`}>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm sm:text-base">{option}</span>
                        {showResult && isCorrect && <Check className="text-green-600" size={20} />}
                        {showResult && isSelected && !isCorrect && <X className="text-red-600" size={20} />}
                      </div>
                    </button>
                  )
                })}
              </div>
            )}

            {currentQ.type === 'fill' && (
              <div className="space-y-4">
                <input type="text" value={currentAnswers[0] || ''} onChange={(e) => !showResult && handleFillAnswer(e.target.value)} disabled={showResult} placeholder="请输入答案..." className="w-full p-3 sm:p-4 border-2 border-gray-300 rounded-lg bg-white/90 focus:border-indigo-500 focus:outline-none text-base sm:text-lg shadow-sm" />
                {currentQ.answer && (
                  <p className="text-sm text-gray-600">参考答案: {currentQ.answer}{currentQ.points && ` (${currentQ.points}分)`}</p>
                )}
              </div>
            )}

            {showResult && (
              <div className={`mt-6 p-4 rounded-lg ${checkAnswer() ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <div className="flex items-center gap-2 mb-2">
                  {checkAnswer() ? (
                    <>
                      <Check className="text-green-600" size={24} />
                      <span className="font-semibold text-green-800">回答正确，已从错题本移除</span>
                    </>
                  ) : (
                    <>
                      <X className="text-red-600" size={24} />
                      <span className="font-semibold text-red-800">回答错误</span>
                    </>
                  )}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-6">
              <button onClick={prev} disabled={current === 0} className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"><ChevronLeft size={20} />上一题</button>
              <button onClick={showResult ? next : submit} disabled={(!showResult && (currentAnswers.length === 0)) || (showResult && current === wrongQuestions.length - 1)} className={`w-full sm:flex-1 px-4 py-2 ${primaryBtn} text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-sm`}>{showResult ? '下一题' : '提交答案'}</button>
              <button onClick={next} disabled={current === wrongQuestions.length - 1} className={`flex items-center gap-2 px-4 py-2 bg-white ${themeColor === 'green' ? 'text-green-700 border border-green-300 hover:bg-green-50' : 'text-indigo-700 border border-indigo-300 hover:bg-indigo-50'} rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-sm`}>直接下一题<ChevronRight size={20} /></button>
            </div>
          </div>
        ) : (
          <div className="backdrop-blur-xl bg-white/70 rounded-2xl shadow-soft border border-white/20 p-8 text-center">
            <h2 className="text-xl font-bold text-gray-800">暂无错题</h2>
            <p className="text-gray-600 mt-2 text-sm">提交错误的题目后，会在此处显示并可重新作答</p>
          </div>
        )}
        </div>
      </div>
    </div>
  )
}

export default WrongBook