import { useState } from "react";
import './App.css'
import { WordInput } from './components/WordInput'
import { MAX_ATTEMPTS } from "./variables/variables";

function App() {
  const [inputs, setInputs] = useState<{
    isActive: boolean
    isSolved: boolean
  }[]>([{ isActive: true, isSolved: false }])

  const currentWord = "apple"

  const handleWordSubmit = (word: string) => {
    console.log(word)
    const currentInputIndex = inputs.length - 1
    const newInputs = [...inputs]

    if (currentWord.toUpperCase() === word) {
      newInputs[currentInputIndex] = { isActive: false, isSolved: true }
      setInputs(newInputs)
    } else {
      newInputs[currentInputIndex] = { isActive: false, isSolved: false }

      if (inputs.length < MAX_ATTEMPTS) {
        newInputs.push({ isActive: true, isSolved: false })
        setInputs(newInputs)
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
        />
      ))}
    </div>
  )
}

export default App
