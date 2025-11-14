import { useMemo, useState } from 'react'
import { Check, ChevronRight, ChevronLeft } from 'lucide-react'
import questions from '../data/questions.json'

type Mode = 'sequential' | 'random'

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

const Practice = () => {
  const [mode, setMode] = useState<Mode>('sequential')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string[]>>({})
  const [showAnswer, setShowAnswer] = useState(false)

  const ordered = useMemo(() => {
    const base = questions as any[]
    return mode === 'random' ? shuffle(base) : base
  }, [mode])

  const currentQ = ordered[currentQuestion]
  const currentAnswers = selectedAnswers[currentQ?.id] || []
  const progress = ((currentQuestion + 1) / ordered.length) * 100

  const handleAnswer = (option: string) => {
    const current = selectedAnswers[currentQ.id] || []
    if (currentQ.type === 'single' || currentQ.type === 'judge') {
      setSelectedAnswers({ ...selectedAnswers, [currentQ.id]: [option] })
    } else if (currentQ.type === 'multiple') {
      if (current.includes(option)) {
        setSelectedAnswers({ ...selectedAnswers, [currentQ.id]: current.filter((a) => a !== option) })
      } else {
        setSelectedAnswers({ ...selectedAnswers, [currentQ.id]: [...current, option] })
      }
    }
  }

  const handleFillAnswer = (value: string) => {
    setSelectedAnswers({ ...selectedAnswers, [currentQ.id]: [value] })
  }

  const nextQuestion = () => {
    if (currentQuestion < ordered.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setShowAnswer(false)
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setShowAnswer(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-3 py-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="backdrop-blur-xl bg-white/70 rounded-2xl shadow-soft border border-white/20 p-4 sm:p-8 mb-8">
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-800 tracking-tight">刷题模式</h1>
          <div className="mt-4 flex items-center gap-2 sm:gap-3 flex-wrap">
            <button
              onClick={() => { setMode('sequential'); setCurrentQuestion(0); setShowAnswer(false) }}
              className={`px-3 py-1.5 rounded-full font-medium transition-all text-sm sm:text-base ${mode === 'sequential' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'}`}
            >
              顺序刷题
            </button>
            <button
              onClick={() => { setMode('random'); setCurrentQuestion(0); setShowAnswer(false) }}
              className={`px-3 py-1.5 rounded-full font-medium transition-all text-sm sm:text-base ${mode === 'random' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'}`}
            >
              随机刷题
            </button>
          </div>

          <div className="mt-4 sm:mt-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>进度: {currentQuestion + 1} / {ordered.length}</span>
              <span>{progress.toFixed(0)}%</span>
            </div>
            <div className="text-xs text-gray-500 mb-1">提示：可拖动切换题目</div>
            <div className="relative w-full bg-gray-200/70 rounded-full h-2 sm:h-3 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-full rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
              <input
                type="range"
                min={1}
                max={ordered.length}
                step={1}
                value={currentQuestion + 1}
                onChange={(e) => {
                  const idx = Number(e.target.value) - 1
                  setCurrentQuestion(idx)
                  setShowAnswer(false)
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {currentQ && (
          <div className="backdrop-blur-xl bg-white/70 rounded-2xl shadow-soft border border-white/20 p-4 sm:p-8 mb-8">
            <div className="mb-4">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                currentQ.type === 'judge' ? 'bg-blue-100 text-blue-800' : currentQ.type === 'single' ? 'bg-green-100 text-green-800' : currentQ.type === 'multiple' ? 'bg-purple-100 text-purple-800' : 'bg-orange-100 text-orange-800'
              }`}>{currentQ.type === 'judge' ? '判断题' : currentQ.type === 'single' ? '单选题' : currentQ.type === 'multiple' ? '多选题' : '填空题'}</span>
              <span className="ml-2 text-gray-500">第 {currentQuestion + 1} 题</span>
              {currentQ.label && (<span className="ml-2 inline-block px-2 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-800">{currentQ.label}</span>)}
            </div>

            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6 leading-relaxed">{currentQ.question}</h2>

            {currentQ.type !== 'fill' && (
              <div className="space-y-2 sm:space-y-3">
                {currentQ.options.map((option: string, index: number) => {
                  const optionLetter = option.match(/^[A-Z]\./) ? option.charAt(0) : option
                  const isSelected = currentAnswers.includes(optionLetter)
                  const isCorrect = currentQ.correctAnswer && currentQ.correctAnswer.includes(optionLetter)
                  let bgColor = 'bg-white/80 hover:bg-white'
                  let borderColor = 'border-gray-200'
                  let textColor = 'text-gray-900'
                  if (showAnswer) {
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
                    bgColor = 'bg-indigo-50'
                    borderColor = 'border-indigo-500'
                  }
                  return (
                    <button key={index} onClick={() => !showAnswer && handleAnswer(optionLetter)} disabled={showAnswer} className={`group w-full p-3 sm:p-4 rounded-xl border-2 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${bgColor} ${borderColor} ${textColor} ${!showAnswer ? 'cursor-pointer' : 'cursor-default'}`}>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm sm:text-base">{option}</span>
                        {showAnswer && isCorrect && <Check className="text-green-600" size={20} />}
                      </div>
                    </button>
                  )
                })}
              </div>
            )}

            {currentQ.type === 'fill' && (
              <div className="space-y-4">
                <input type="text" value={currentAnswers[0] || ''} onChange={(e) => !showAnswer && handleFillAnswer(e.target.value)} disabled={showAnswer} placeholder="请输入答案..." className="w-full p-3 sm:p-4 border-2 border-gray-300 rounded-lg bg-white/90 focus:border-indigo-500 focus:outline-none text-base sm:text-lg shadow-sm" />
              </div>
            )}

            {showAnswer && (
              <div className="mt-4 p-4 rounded-lg bg-indigo-50 border border-indigo-200">
                <div className="text-sm text-gray-700">
                  <span className="font-medium">参考答案：</span>
                  {currentQ.type === 'fill' ? (
                    <span>{currentQ.answer || (currentQ.correctAnswer && currentQ.correctAnswer[0])}</span>
                  ) : (
                    <span>{(currentQ.correctAnswer || []).join('、')}</span>
                  )}
                </div>
                {currentQ.explanation && (
                  <div className="mt-2 text-sm text-gray-700">
                    <span className="font-medium">解析：</span>
                    <span>{currentQ.explanation}</span>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-6">
              <button onClick={prevQuestion} disabled={currentQuestion === 0} className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"><ChevronLeft size={20} />上一题</button>
              <button onClick={() => setShowAnswer(true)} className="w-full sm:flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-sm">显示答案</button>
              <button onClick={nextQuestion} disabled={currentQuestion === ordered.length - 1} className="flex items-center gap-2 px-4 py-2 bg-white text-indigo-700 border border-indigo-300 rounded-lg hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-sm">直接下一题<ChevronRight size={20} /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Practice