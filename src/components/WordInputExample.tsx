import "./WordInputExample.scss";

type WordInputExampleProps = {
  word: string;
  correctLetterIndex?: number;
  misplacedLetterIndex?: number;
}

export function WordInputExample ({word, correctLetterIndex, misplacedLetterIndex}: WordInputExampleProps) {
  const wordArray: string[] = word.split("")
  console.log(word)
  return (
    <div className="word-input-example">
    {wordArray.map((letter, index) => (
      <div
        key={index}
        className={`word-input-example__letter${index === correctLetterIndex ? " word-input-example__letter--correct" : ""}${index === misplacedLetterIndex ? " word-input-example__letter--misplaced" : ""}`}
      >
        <span className="word-input-example__letter-side--front">{letter}</span>
      </div>
    ))}
    </div>
  )
}