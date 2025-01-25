import { useState, useEffect } from "react";
import './App.scss'
import { WordInput } from './components/WordInput'
import { MAX_ATTEMPTS } from "./variables/variables";
import type { LetterState } from "./types/LetterState.type";
import { useRandomString } from './hooks/use-random-string'
import { getRandomWord } from "./services/words.service";

function App() {
  const [inputs, setInputs] = useState<{
    id: string
    isActive: boolean
    isSolved: boolean
    lettersStates: [LetterState, LetterState, LetterState, LetterState, LetterState] | null
  }[]>([{id: useRandomString(), isActive: true, isSolved: false, lettersStates: null }])

  const [result, setResult] = useState<"win" | "loose" | null>(null)

  const [currentWord, setCurrentWord] = useState<string | null>(null)

  useEffect(() => {
    if (!currentWord) {
      const word = getRandomWord()
      setCurrentWord(word)
    }
  }, [currentWord])

  const handleWordSubmit = (word: string) => {
    const currentInputIndex = inputs.length - 1
    const newInputs = [...inputs]

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
    const word = getRandomWord()
    setCurrentWord(word)
  }
  return (
    <div className="app">
      <h1 className="app__title">w<span className="app__title--special-letter">o</span>rd game</h1>
      <main className="app__game-board">
        <div className="app__game-inputs">
          {inputs.map(input => (
            <WordInput
              key={input.id}
              isActive={input.isActive}
              isSolved={input.isSolved}
              onSubmit={handleWordSubmit}
              lettersStates={input.lettersStates}
            />
          ))}
        </div>
        {result && result === "loose" && (
          <div className="app__result-tile app__result-tile--loose">Not this time... But you can try again.</div>
        )}
        {result && result === "win" && (
          <div className="app__result-tile app__result-tile--win">You did that! Great!</div>
        )}

        {result && (
          <button className="app__restart-button" onClick={handleGameRestart}>Play again</button>
        )}
      </main>
      <footer className="app__footer">Made with 🐸 by <a href="https://sabinapsuj.dev/" target="_blank">Sabina Psuj</a></footer>
    </div>
  )
}

export default App
