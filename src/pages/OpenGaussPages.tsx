// Wrapper components for openGauss that reuse openEuler components with different data
import ExamApp from '../App'
import Practice from './Practice'
import RandomExam from './RandomExam'
import questionsOpenGauss from '../data/questions-openGauss.json'
import WrongBook from './WrongBook'


export const OpenGaussExam = () => {
  return (
    <ExamApp 
      questions={questionsOpenGauss}
      themeColor="green"
      title="HCIP-openGauss 刷题系统"
      subtitle="winback 人才加速计划复习资料"
    />
  )
}

export const OpenGaussPractice = () => {
  return (
    <Practice
      questions={questionsOpenGauss}
      themeColor="green"
      title="背题模式 - openGauss"
    />
  )
}

export const OpenGaussRandomExam = () => {
  return (
    <RandomExam
      questions={questionsOpenGauss}
      themeColor="green"
      title="随机出题模式 - openGauss"
    />
  )
}

export const OpenGaussWrongBook = () => {
  return (
    <WrongBook
      questions={questionsOpenGauss}
      themeColor="green"
      title="错题本 - openGauss"
    />
  )
}
