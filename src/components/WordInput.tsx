import { useState } from "react";
import "./WordInput.scss";

type WordInputProps = {
  onSubmit: (word: string) => void;
  isActive: boolean;
  isSolved: boolean;
}

export function WordInput({onSubmit, isActive, isSolved}: WordInputProps) {
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

  const hadleButtonClick = () => {
    if (isActive && word.length === 5) {
      onSubmit(word);
    }
  }

  return (
    <div className="word-input">
      <div className="word-input__letters">
        {wordLetters.map((letter, index) => (
          <div key={index} className="word-input__letter">{letter}</div>
        ))}
        <input
          className="word-input__input"
          type="text"
          onChange={handleInputChange}
          value={word}
        />
      </div>
      <button
        className={`word-input__submit${!isActive && !isSolved ? " word-input__submit--fail" : ""}${!isActive && isSolved ? " word-input__submit--success" : ""}`}
        disabled={!isActive || word.length !== 5}
        onClick={hadleButtonClick}
      >
        {!isActive && !isSolved ? "Fail" : !isActive && isSolved ? "Solved" : "Submit"}
      </button>
    </div>
  );
}