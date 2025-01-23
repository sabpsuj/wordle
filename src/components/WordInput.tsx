import { useState } from "react";
import "./WordInput.scss";
import type { LetterState } from "../types/LetterState.type";

type WordInputProps = {
  onSubmit: (word: string) => void;
  isActive: boolean;
  isSolved: boolean;
  lettersStates: [LetterState, LetterState, LetterState, LetterState, LetterState] | null;
}

export function WordInput({onSubmit, isActive, isSolved, lettersStates}: WordInputProps) {
  const [wordLetters, setWordLetters] = useState<[string, string, string, string, string]>(["", "", "", "", ""]); 
  const [word, setWord] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newWord = event.target.value.trim().toUpperCase().substring(0, 5);
    setWord(newWord);
    const newWordLetters = ["", "", "", "", ""];
    for (let i = 0; i < newWord.length; i++) {
      newWordLetters[i] = newWord[i];
    }
    setWordLetters(newWordLetters as [string, string, string, string, string]);
  }

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    console.log(event.key)
    if (event.key.toLowerCase() === "enter" && isActive && word.length === 5) {
      onSubmit(word);
    }
  }

  return (
    <div className="word-input">
      <div className="word-input__letters">
        {wordLetters.map((letter, index) => (
          <div
            key={index}
            className={`word-input__letter${lettersStates ? " word-input__letter--state word-input__letter--state_" + lettersStates[index] : ""}`}
            data-letter={letter}
          >
            <span className="word-input__letter-side--front">{letter}</span>
            <span className="word-input__letter-side--back">{letter}</span>
          </div>

        ))}
        <input
          className="word-input__input"
          type="text"
          onChange={handleInputChange}
          value={word}
          onKeyUp={handleKeyUp}
        />
      </div>
    </div>
  );
}