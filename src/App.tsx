import { useState } from 'react'
import { Check, X, ChevronRight, ChevronLeft, RotateCcw } from 'lucide-react'
import questions from './data/questions.json'

const ExamApp = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string[]>>({})
  const [showResult, setShowResult] = useState(false)
  const [filterType, setFilterType] = useState<'all' | 'judge' | 'single' | 'multiple' | 'fill'>('all')

  const filteredQuestions = (questions as any[]).filter((q) => {
    if (filterType === 'all') return true
    return q.type === filterType
  })

  const currentQ = filteredQuestions[currentQuestion]

  const totals = {
    all: (questions as any[]).length,
    judge: (questions as any[]).filter((q: any) => q.type === 'judge').length,
    single: (questions as any[]).filter((q: any) => q.type === 'single').length,
    multiple: (questions as any[]).filter((q: any) => q.type === 'multiple').length,
    fill: (questions as any[]).filter((q: any) => q.type === 'fill').length,
  }

  const handleAnswer = (option: string) => {
    const currentAnswers = selectedAnswers[currentQ.id] || []

    if (currentQ.type === 'single' || currentQ.type === 'judge') {
      setSelectedAnswers({
        ...selectedAnswers,
        [currentQ.id]: [option],
      })
    } else if (currentQ.type === 'multiple') {
      if (currentAnswers.includes(option)) {
        setSelectedAnswers({
          ...selectedAnswers,
          [currentQ.id]: currentAnswers.filter((a) => a !== option),
        })
      } else {
        setSelectedAnswers({
          ...selectedAnswers,
          [currentQ.id]: [...currentAnswers, option],
        })
      }
    }
  }

  const handleFillAnswer = (value: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQ.id]: [value],
    })
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
    return (
      userAnswer.every((a) => correctAnswer.includes(a)) &&
      correctAnswer.every((a: string) => userAnswer.includes(a))
    )
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
        userAnswer.every((a) => correctAnswer.includes(a)) &&
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
  }

  const calculateScore = () => {
    let correctCount = 0
    filteredQuestions.forEach((q: any) => {
      const userAnswer = selectedAnswers[q.id] || []
      const correctAnswer = q.correctAnswer || []

      if (q.type === 'fill') {
        if (
          userAnswer[0] &&
          correctAnswer[0] &&
          userAnswer[0].trim().toLowerCase() === correctAnswer[0].trim().toLowerCase()
        ) {
          correctCount++
        }
      } else {
        if (
          userAnswer.length === correctAnswer.length &&
          userAnswer.every((a: string) => correctAnswer.includes(a)) &&
          correctAnswer.every((a: string) => userAnswer.includes(a))
        ) {
          correctCount++
        }
      }
    })
    return correctCount
  }

  const isAnswerCorrect = checkAnswer()
  const currentAnswers = selectedAnswers[currentQ.id] || []
  const progress = ((currentQuestion + 1) / filteredQuestions.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="backdrop-blur-xl bg-white/70 rounded-2xl shadow-soft border border-white/20 p-8 mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 tracking-tight mb-2">HCIP-openEuler 刷题系统</h1>
          <p className="text-gray-600">H12-623-CHS (winback考试) V1.0</p>

          <div className="flex items-center gap-2 mt-6 flex-wrap">
            <button
              onClick={() => {
                setFilterType('all')
                setCurrentQuestion(0)
              }}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                filterType === 'all'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              全部题目 ({totals.all})
            </button>
            <button
              onClick={() => {
                setFilterType('judge')
                setCurrentQuestion(0)
              }}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                filterType === 'judge'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              判断题 ({totals.judge})
            </button>
            <button
              onClick={() => {
                setFilterType('single')
                setCurrentQuestion(0)
              }}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                filterType === 'single'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              单选题 ({totals.single})
            </button>
            <button
              onClick={() => {
                setFilterType('multiple')
                setCurrentQuestion(0)
              }}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                filterType === 'multiple'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              多选题 ({totals.multiple})
            </button>
            <button
              onClick={() => {
                setFilterType('fill')
                setCurrentQuestion(0)
              }}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                filterType === 'fill'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              填空题 ({totals.fill})
            </button>
          </div>

          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>
                进度: {currentQuestion + 1} / {filteredQuestions.length}
              </span>
              <span>{progress.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-200/70 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="backdrop-blur-xl bg-white/70 rounded-2xl shadow-soft border border-white/20 p-8 mb-8">
          <div className="mb-4">
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                currentQ.type === 'judge'
                  ? 'bg-blue-100 text-blue-800'
                  : currentQ.type === 'single'
                  ? 'bg-green-100 text-green-800'
                  : currentQ.type === 'multiple'
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-orange-100 text-orange-800'
              }`}
            >
              {currentQ.type === 'judge'
                ? '判断题'
                : currentQ.type === 'single'
                ? '单选题'
                : currentQ.type === 'multiple'
                ? '多选题'
                : '填空题'}
            </span>
            <span className="ml-2 text-gray-500">第 {currentQuestion + 1} 题</span>
            {currentQ.label && (
              <span className="ml-2 inline-block px-2 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                {currentQ.label}
              </span>
            )}
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 mb-6 leading-relaxed">
            {currentQ.question}
          </h2>

          {currentQ.type !== 'fill' && (
            <div className="space-y-3">
              {currentQ.options.map((option: string, index: number) => {
                const optionLetter = option.match(/^[A-Z]\./) ? option.charAt(0) : option
                const isSelected = currentAnswers.includes(optionLetter)
                const isCorrect =
                  currentQ.correctAnswer && currentQ.correctAnswer.includes(optionLetter)

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
                  <button
                    key={index}
                    onClick={() => !showResult && handleAnswer(optionLetter)}
                    disabled={showResult}
                    className={`group w-full p-4 rounded-xl border-2 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${bgColor} ${borderColor} ${textColor} ${
                      !showResult ? 'cursor-pointer' : 'cursor-default'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{option}</span>
                      {showResult && isCorrect && <Check className="text-green-600" size={20} />}
                      {showResult && isSelected && !isCorrect && (
                        <X className="text-red-600" size={20} />
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          )}

          {currentQ.type === 'fill' && (
            <div className="space-y-4">
              <input
                type="text"
                value={currentAnswers[0] || ''}
                onChange={(e) => !showResult && handleFillAnswer(e.target.value)}
                disabled={showResult}
                placeholder="请输入答案..."
                className="w-full p-4 border-2 border-gray-300 rounded-lg bg-white/90 focus:border-indigo-500 focus:outline-none text-lg shadow-sm"
              />
              {currentQ.answer && (
                <p className="text-sm text-gray-600">
                  参考答案: {currentQ.answer}
                  {currentQ.points && ` (${currentQ.points}分)`}
                </p>
              )}
            </div>
          )}

          {showResult && (
            <div
              className={`mt-6 p-4 rounded-lg ${
                isAnswerCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {isAnswerCorrect ? (
                  <>
                    <Check className="text-green-600" size={24} />
                    <span className="font-semibold text-green-800">回答正确！</span>
                  </>
                ) : (
                  <>
                    <X className="text-red-600" size={24} />
                    <span className="font-semibold text-red-800">回答错误</span>
                  </>
                )}
              </div>
              {currentQ.explanation && (
                <div className="mt-3 text-gray-700">
                  <p className="font-medium mb-1">解析：</p>
                  <p className="text-sm leading-relaxed">{currentQ.explanation}</p>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3 mt-6">
            <button
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            >
              <ChevronLeft size={20} />
              上一题
            </button>

            <button
              onClick={showResult ? nextQuestion : submitAnswer}
              disabled={(!showResult && currentAnswers.length === 0) || (showResult && currentQuestion === filteredQuestions.length - 1)}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            >
              {showResult ? '下一题' : '提交答案'}
            </button>

            <button
              onClick={nextQuestion}
              disabled={currentQuestion === filteredQuestions.length - 1}
              className="flex items-center gap-2 px-4 py-2 bg-white text-indigo-700 border border-indigo-300 rounded-lg hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            >
              直接下一题
              <ChevronRight size={20} />
            </button>

            <button
              onClick={resetQuiz}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            >
              <RotateCcw size={20} />
              重置
            </button>
          </div>
        </div>

        <div className="backdrop-blur-xl bg-white/70 rounded-2xl shadow-soft border border-white/20 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">答题统计</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{Object.keys(selectedAnswers).length}</div>
              <div className="text-sm text-gray-600">已答题数</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{calculateScore()}</div>
              <div className="text-sm text-gray-600">正确题数</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {filteredQuestions.length - Object.keys(selectedAnswers).length}
              </div>
              <div className="text-sm text-gray-600">未答题数</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Object.keys(selectedAnswers).length > 0
                  ? ((calculateScore() / Object.keys(selectedAnswers).length) * 100).toFixed(1)
                  : 0}%
              </div>
              <div className="text-sm text-gray-600">正确率</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExamApp
