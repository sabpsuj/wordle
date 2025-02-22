import { useState, useEffect } from "react";
import './App.scss'
import { WordInput } from './components/WordInput'
import { MAX_ATTEMPTS } from "./variables/variables";
import type { LetterState } from "./types/LetterState.type";
import type { Languages } from "./types/Languages.type";
import { useRandomString } from './hooks/use-random-string'
import { getRandomWord, checkIfWordExist } from "./services/words.service";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "./components/LanguageSwitcher";
import { Modal } from "./components/Modal";
import { WordInputExample } from "./components/WordInputExample";

function App() {
  const { t, i18n } = useTranslation();
  const [inputs, setInputs] = useState<{
    id: string
    isActive: boolean
    isSolved: boolean
    lettersStates: [LetterState, LetterState, LetterState, LetterState, LetterState] | null
  }[]>([{id: useRandomString(), isActive: true, isSolved: false, lettersStates: null }])

  const [result, setResult] = useState<"win" | "loose" | null>(null)
  const [currentWord, setCurrentWord] = useState<string | null>(null)
  const [solutionCheckInProgress, setSolutionCheckInProgress] = useState(false)
  const [shakeErrorClass, setShakeErrorClass] = useState(false)
  const [howToModalIsOpen, setHowToModalIsOpen] = useState(false)
  const [warningModalIsOpen, setWarningModalIsOpen] = useState(false)

  useEffect(() => {
    handleGameRestart()
  }, [i18n.language])

  useEffect(() => {
    if (!currentWord) {
      getRandomWord(i18n.language as Languages)
      .then(word => {
        setCurrentWord(word)
      })
    }
  }, [currentWord])

  const shakeError = () => {
    setShakeErrorClass(true)

    setTimeout(() => {
      setShakeErrorClass(false)
    }, 500)
  }

  const handleWordSubmit = async (word: string) => { 
    if (solutionCheckInProgress) {
      return
    }
    setSolutionCheckInProgress(true)
    const currentInputIndex = inputs.length - 1
    const newInputs = [...inputs]

    const isWordCorrect = await checkIfWordExist(word, i18n.language as Languages)
    setSolutionCheckInProgress(false)
    if (!isWordCorrect) {
      shakeError()
      return
    }

    if (currentWord?.toUpperCase() === word) {
      newInputs[currentInputIndex] = {id: newInputs[currentInputIndex].id, isActive: false, isSolved: true, lettersStates: ["correct", "correct", "correct", "correct", "correct"] }
      setInputs(newInputs)
      setResult("win")
    } else {
      const lettersStates: [LetterState, LetterState, LetterState, LetterState, LetterState] = ["wrong", "wrong", "wrong", "wrong", "wrong"]
      
      word.toLowerCase().split("").forEach((letter, index) => {
        if (currentWord?.charAt(index) === letter) {
          lettersStates[index] = "correct"
        } else if (currentWord?.match(letter)) {
          lettersStates[index] = "misplaced"
        } else {
          lettersStates[index] = "wrong"
        }
      })

      newInputs[currentInputIndex] = {id: newInputs[currentInputIndex].id, isActive: false, isSolved: false, lettersStates }

      setInputs(newInputs)

      if (inputs.length < MAX_ATTEMPTS) {
        const extendedInputs = [...newInputs, {id: useRandomString(), isActive: true, isSolved: false, lettersStates: null }]
        setTimeout(() => {
          setInputs(extendedInputs)
        }, 1800)
      } else {
        setResult("loose")
      }
    }
  }

  const handleGameRestart = () => {
    setInputs([{id: useRandomString(), isActive: true, isSolved: false, lettersStates: null }])
    setResult(null)
    getRandomWord(i18n.language as Languages)
    .then(word => {
      setCurrentWord(word)
    })
  }

  return (
    <div className="app">
      <h1 className="app__title">w<span className="app__title--special-letter">o</span>rdle</h1>
      <div className="app__subheader">
        <LanguageSwitcher /> <p className="app__qa" onClick={() => setHowToModalIsOpen(true)}>{t("howToPlay")}</p>
      </div>
      <main className="app__game-board">
        <div className={`app__game-inputs${shakeErrorClass ? " app__game-inputs--shake" : ""}`}>
          {inputs.map(input => (
            <WordInput
              key={input.id}
              isActive={input.isActive}
              onSubmit={handleWordSubmit}
              lettersStates={input.lettersStates}
            />
          ))}
        </div>
        {result && result === "loose" && (
          <div className="app__result-tile app__result-tile--loose">{t("failMessage")}</div>
        )}
        {result && result === "win" && (
          <div className="app__result-tile app__result-tile--win">{t("winMessage")}</div>
        )}

        {result && (
          <button className="app__restart-button" onClick={handleGameRestart}>{t("playAgain")}</button>
        )}
      </main>
      <footer className="app__footer">Made with 🐸 by <a href="https://sabinapsuj.dev/" target="_blank">Sabina Psuj</a></footer>
      {howToModalIsOpen && <Modal closeModal={() => setHowToModalIsOpen(false)}>
        <h3>{t("howToPlay")}</h3>
        <p>{t("quessInSixTries")}</p>
        <ul>
          <li>{t("validFiveLetterWord")}</li>
          <li>{t("colorHints")}</li>
        </ul>
        <h4>{t("examples")}</h4>
        <p>{t("correctLetterExample")}</p>
        <WordInputExample word="apple" correctLetterIndex={3} />
        <p>{t("wrongPlacedExample")}</p>
        <WordInputExample word="bread" misplacedLetterIndex={1} />
      </Modal>}
      {warningModalIsOpen && <Modal closeModal={() => setWarningModalIsOpen(false)}>
        <p>uwaga ryje</p>
      </Modal>}
    </div>
  )
}

export default App
