import { useMemo, useState } from 'react'
import { Check, X, ChevronRight, ChevronLeft, RotateCcw } from 'lucide-react'
import allQuestions from '../data/questions.json'

type Q = any

const POINTS: Record<string, number> = { single: 16, multiple: 18, judge: 16, fill: 16 }
const TARGETS: Record<string, number> = { single: 20, multiple: 20, judge: 17, fill: 3 }

function sample<T>(arr: T[], n: number): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy.slice(0, Math.min(n, copy.length))
}

const RandomExam = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string[]>>({})
  const [showResult, setShowResult] = useState(false)
  const [paper, setPaper] = useState<Q[]>([])

  const generatedPaper = useMemo(() => {
    if (paper.length > 0) return paper
    const byType = {
      single: (allQuestions as Q[]).filter((q) => q.type === 'single'),
      multiple: (allQuestions as Q[]).filter((q) => q.type === 'multiple'),
      judge: (allQuestions as Q[]).filter((q) => q.type === 'judge'),
      fill: (allQuestions as Q[]).filter((q) => q.type === 'fill'),
    }
    const picked = [
      ...sample(byType.single, TARGETS.single),
      ...sample(byType.multiple, TARGETS.multiple),
      ...sample(byType.judge, TARGETS.judge),
      ...sample(byType.fill, TARGETS.fill),
    ]
    return picked
  }, [paper])

  const filteredQuestions = generatedPaper
  const currentQ = filteredQuestions[currentQuestion]

  const handleAnswer = (option: string) => {
    const currentAnswers = selectedAnswers[currentQ.id] || []
    if (currentQ.type === 'single' || currentQ.type === 'judge') {
      setSelectedAnswers({ ...selectedAnswers, [currentQ.id]: [option] })
    } else if (currentQ.type === 'multiple') {
      if (currentAnswers.includes(option)) {
        setSelectedAnswers({ ...selectedAnswers, [currentQ.id]: currentAnswers.filter((a) => a !== option) })
      } else {
        setSelectedAnswers({ ...selectedAnswers, [currentQ.id]: [...currentAnswers, option] })
      }
    }
  }

  const handleFillAnswer = (value: string) => {
    setSelectedAnswers({ ...selectedAnswers, [currentQ.id]: [value] })
  }

  const checkAnswer = () => {
    const userAnswer = selectedAnswers[currentQ.id] || []
    const correctAnswer = currentQ.correctAnswer || []
    if (userAnswer.length === 0) return null
    if (currentQ.type === 'fill') {
      if (!userAnswer[0] || !correctAnswer[0]) return false
      return userAnswer[0].trim().toLowerCase() === correctAnswer[0].trim().toLowerCase()
    }
    if (userAnswer.length !== correctAnswer.length) return false
    return userAnswer.every((a) => correctAnswer.includes(a)) && correctAnswer.every((a: string) => userAnswer.includes(a))
  }

  const nextQuestion = () => {
    if (currentQuestion < filteredQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setShowResult(false)
    }
  }
  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setShowResult(false)
    }
  }
  const submitAnswer = () => {
    setShowResult(true)
    const userAnswer = selectedAnswers[currentQ.id] || []
    const correctAnswer = currentQ.correctAnswer || []
    let isCorrect = false
    if (currentQ.type === 'fill') {
      isCorrect = !!(userAnswer[0] && correctAnswer[0] && userAnswer[0].trim().toLowerCase() === correctAnswer[0].trim().toLowerCase())
    } else {
      isCorrect =
        userAnswer.length === correctAnswer.length &&
        userAnswer.every((a: string) => correctAnswer.includes(a)) &&
        correctAnswer.every((a: string) => userAnswer.includes(a))
    }
    if (isCorrect && currentQuestion < filteredQuestions.length - 1) {
      setTimeout(() => {
        nextQuestion()
      }, 300)
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswers({})
    setShowResult(false)
    setPaper([])
  }

  const regeneratePaper = () => {
    setPaper([])
    setCurrentQuestion(0)
    setSelectedAnswers({})
    setShowResult(false)
    setPaper((prev) => prev) 
  }

  const calculateScore = () => {
    let total = 0
    filteredQuestions.forEach((q: any) => {
      const userAnswer = selectedAnswers[q.id] || []
      const correctAnswer = q.correctAnswer || []
      let correct = false
      if (q.type === 'fill') {
        correct = !!(userAnswer[0] && correctAnswer[0] && userAnswer[0].trim().toLowerCase() === correctAnswer[0].trim().toLowerCase())
      } else {
        correct = userAnswer.length === correctAnswer.length && userAnswer.every((a: string) => correctAnswer.includes(a)) && correctAnswer.every((a: string) => userAnswer.includes(a))
      }
      if (correct) total += POINTS[q.type]
    })
    return total
  }

  const totals = {
    target: TARGETS,
    actual: {
      single: filteredQuestions.filter((q: any) => q.type === 'single').length,
      multiple: filteredQuestions.filter((q: any) => q.type === 'multiple').length,
      judge: filteredQuestions.filter((q: any) => q.type === 'judge').length,
      fill: filteredQuestions.filter((q: any) => q.type === 'fill').length,
    },
  }

  const isAnswerCorrect = checkAnswer()
  const currentAnswers = selectedAnswers[currentQ?.id] || []
  const progress = ((currentQuestion + 1) / filteredQuestions.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-3 py-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="backdrop-blur-xl bg-white/70 rounded-2xl shadow-soft border border-white/20 p-4 sm:p-8 mb-8">
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-800 tracking-tight">随机出题模式</h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">单选{TARGETS.single}×{POINTS.single}分，多选{TARGETS.multiple}×{POINTS.multiple}分，判断{TARGETS.judge}×{POINTS.judge}分，填空{TARGETS.fill}×{POINTS.fill}分，总分1000</p>
          <div className="mt-2 sm:mt-3 text-sm text-gray-700">实际抽取：单选{totals.actual.single}，多选{totals.actual.multiple}，判断{totals.actual.judge}，填空{totals.actual.fill}</div>

          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>进度: {currentQuestion + 1} / {filteredQuestions.length}</span>
              <span>{progress.toFixed(0)}%</span>
            </div>
            <div className="text-xs text-gray-500 mb-1">提示：可拖动切换题目</div>
            <div className="relative w-full bg-gray-200/70 rounded-full h-2 sm:h-3 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-full rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
              <input
                type="range"
                min={1}
                max={filteredQuestions.length}
                step={1}
                value={currentQuestion + 1}
                onChange={(e) => {
                  const idx = Number(e.target.value) - 1
                  setCurrentQuestion(idx)
                  setShowResult(false)
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {currentQ && (
          <div className="backdrop-blur-xl bg-white/70 rounded-2xl shadow-soft border border-white/20 p-8 mb-8">
            <div className="mb-4">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                currentQ.type === 'judge' ? 'bg-blue-100 text-blue-800' : currentQ.type === 'single' ? 'bg-green-100 text-green-800' : currentQ.type === 'multiple' ? 'bg-purple-100 text-purple-800' : 'bg-orange-100 text-orange-800'
              }`}>{currentQ.type === 'judge' ? '判断题' : currentQ.type === 'single' ? '单选题' : currentQ.type === 'multiple' ? '多选题' : '填空题'}</span>
              <span className="ml-2 text-gray-500">第 {currentQuestion + 1} 题</span>
            </div>

            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-5 leading-relaxed">{currentQ.question}</h2>

            {currentQ.type !== 'fill' && (
              <div className="space-y-2 sm:space-y-3">
                {currentQ.options.map((option: string, index: number) => {
                  const optionLetter = option.match(/^[A-Z]\./) ? option.charAt(0) : option
                  const isSelected = currentAnswers.includes(optionLetter)
                  const isCorrect = currentQ.correctAnswer && currentQ.correctAnswer.includes(optionLetter)
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
                    bgColor = 'bg-indigo-50'
                    borderColor = 'border-indigo-500'
                  }
                  return (
                    <button key={index} onClick={() => !showResult && handleAnswer(optionLetter)} disabled={showResult} className={`group w-full p-3 sm:p-4 rounded-xl border-2 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${bgColor} ${borderColor} ${textColor} ${!showResult ? 'cursor-pointer' : 'cursor-default'}`}> 
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
              </div>
            )}

            {showResult && (
              <div className={`mt-6 p-4 rounded-lg ${isAnswerCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <div className="flex items-center gap-2 mb-2">
                  {isAnswerCorrect ? (<><Check className="text-green-600" size={24} /><span className="font-semibold text-green-800">回答正确！</span></>) : (<><X className="text-red-600" size={24} /><span className="font-semibold text-red-800">回答错误</span></>)}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-6">
              <button onClick={prevQuestion} disabled={currentQuestion === 0} className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"><ChevronLeft size={20} />上一题</button>
              <button onClick={showResult ? nextQuestion : submitAnswer} disabled={(!showResult && currentAnswers.length === 0) || (showResult && currentQuestion === filteredQuestions.length - 1)} className="w-full sm:flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-sm">{showResult ? '下一题' : '提交答案'}</button>
              <button onClick={nextQuestion} disabled={currentQuestion === filteredQuestions.length - 1} className="flex items-center gap-2 px-4 py-2 bg-white text-indigo-700 border border-indigo-300 rounded-lg hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-sm">直接下一题<ChevronRight size={20} /></button>
              <button onClick={resetQuiz} className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors shadow-sm"><RotateCcw size={20} />重置</button>
            </div>
          </div>
        )}

        <div className="backdrop-blur-xl bg-white/70 rounded-2xl shadow-soft border border-white/20 p-4 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">成绩统计</h3>
              <div className="text-sm text-gray-600">总分1000，当前得分：<span className="font-bold text-indigo-700">{calculateScore()}</span></div>
            </div>
            <button onClick={regeneratePaper} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium">重新抽题</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RandomExam

