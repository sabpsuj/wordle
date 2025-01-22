import { useState } from "react";
import './App.css'
import { WordInput } from './components/WordInput'
import { MAX_ATTEMPTS } from "./variables/variables";
import type { LetterState } from "./types/LetterState.type";

function App() {
  const [inputs, setInputs] = useState<{
    isActive: boolean
    isSolved: boolean
    lettersStates: [LetterState, LetterState, LetterState, LetterState, LetterState] | null
  }[]>([{ isActive: true, isSolved: false, lettersStates: null }])

  const currentWord = "apple"

  const handleWordSubmit = (word: string) => {
    const currentInputIndex = inputs.length - 1
    const newInputs = [...inputs]

    if (currentWord.toUpperCase() === word) {
      newInputs[currentInputIndex] = { isActive: false, isSolved: true, lettersStates: ["correct", "correct", "correct", "correct", "correct"] }
      setInputs(newInputs)
    } else {
      const lettersStates: [LetterState, LetterState, LetterState, LetterState, LetterState] = ["wrong", "wrong", "wrong", "wrong", "wrong"]
      
      word.toLowerCase().split("").forEach((letter, index) => {
        if (currentWord.charAt(index) === letter) {
          lettersStates[index] = "correct"
        } else if (currentWord.match(letter)) {
          lettersStates[index] = "misplaced"
        } else {
          lettersStates[index] = "wrong"
        }
      })

      console.log(lettersStates)

      newInputs[currentInputIndex] = { isActive: false, isSolved: false, lettersStates }

      setInputs(newInputs)

      if (inputs.length < MAX_ATTEMPTS) {
        const extendedInputs = [...newInputs, { isActive: true, isSolved: false, lettersStates: null }]
        setTimeout(() => {
          setInputs(extendedInputs)
        }, 1800)
      }
    }
  }

  return (
    <div className="app">
      <h1 className="app__title">Word Game</h1>
      {inputs.map((input, index) => (
        <WordInput
          key={index}
          isActive={input.isActive}
          isSolved={input.isSolved}
          onSubmit={handleWordSubmit}
          lettersStates={input.lettersStates}
        />
      ))}
    </div>
  )
}

export default App
