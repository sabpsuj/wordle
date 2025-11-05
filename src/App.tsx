import { useState, useEffect } from "react";
import "./App.scss";
import { WordInput } from "./components/WordInput";
import { MAX_ATTEMPTS } from "./variables/variables";
import type { LetterState } from "./types/LetterState.type";
import type { Languages } from "./types/Languages.type";
import { useRandomString } from "./hooks/use-random-string";
import { getRandomWord, checkIfWordExist } from "./services/words.service";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "./components/LanguageSwitcher";
import { Modal } from "./components/Modal";
import { WordInputExample } from "./components/WordInputExample";
import { PrivacyModal } from "./components/PrivacyModal";
import html2canvas from "html2canvas";
import { ResultCard } from "./components/ResultCard/ResultCard";

const privacyAccepted = localStorage.getItem("privacyAccepted");

function App() {
  const { t, i18n } = useTranslation();
  const [inputs, setInputs] = useState<
    {
      id: string;
      isActive: boolean;
      isSolved: boolean;
      lettersStates:
        | [LetterState, LetterState, LetterState, LetterState, LetterState]
        | null;
    }[]
  >([
    {
      id: useRandomString(),
      isActive: true,
      isSolved: false,
      lettersStates: null,
    },
  ]);

  const [result, setResult] = useState<"win" | "loose" | null>(null);
  const [currentWord, setCurrentWord] = useState<string | null>(null);
  const [solutionCheckInProgress, setSolutionCheckInProgress] = useState(false);
  const [shakeErrorClass, setShakeErrorClass] = useState(false);
  const [howToModalIsOpen, setHowToModalIsOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(
    !privacyAccepted
  );
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [timer, setTimer] = useState(0);
  const [timerInterval, setTimerInterval] = useState<number | null>(null);

  const handleClosePrivacyModal = () => {
    setIsPrivacyModalOpen(false);
    localStorage.setItem("privacyAccepted", "true");
  };

  const handleOpenPrivacyModal = () => {
    setIsPrivacyModalOpen(true);
  };

  useEffect(() => {
    handleGameRestart();
  }, [i18n.language]);

  useEffect(() => {
    if (!currentWord) {
      getRandomWord(i18n.language as Languages).then((word) => {
        setCurrentWord(word);
      });
    }
  }, [currentWord]);

  const shakeError = () => {
    setShakeErrorClass(true);

    setTimeout(() => {
      setShakeErrorClass(false);
    }, 500);
  };

  const handleWordSubmit = async (word: string) => {
    if (solutionCheckInProgress) {
      return;
    }
    setSolutionCheckInProgress(true);
    const currentInputIndex = inputs.length - 1;
    const newInputs = [...inputs];

    const isWordCorrect = await checkIfWordExist(
      word,
      i18n.language as Languages
    );
    setSolutionCheckInProgress(false);
    if (!isWordCorrect) {
      shakeError();
      return;
    }

    if (currentWord?.toUpperCase() === word) {
      newInputs[currentInputIndex] = {
        id: newInputs[currentInputIndex].id,
        isActive: false,
        isSolved: true,
        lettersStates: ["correct", "correct", "correct", "correct", "correct"],
      };
      setInputs(newInputs);
      setResult("win");
    } else {
      const lettersStates: [
        LetterState,
        LetterState,
        LetterState,
        LetterState,
        LetterState
      ] = ["wrong", "wrong", "wrong", "wrong", "wrong"];

      word
        .toLowerCase()
        .split("")
        .forEach((letter, index) => {
          if (currentWord?.charAt(index) === letter) {
            lettersStates[index] = "correct";
          } else if (currentWord?.match(letter)) {
            lettersStates[index] = "misplaced";
          } else {
            lettersStates[index] = "wrong";
          }
        });

      newInputs[currentInputIndex] = {
        id: newInputs[currentInputIndex].id,
        isActive: false,
        isSolved: false,
        lettersStates,
      };

      setInputs(newInputs);

      if (inputs.length < MAX_ATTEMPTS) {
        const extendedInputs = [
          ...newInputs,
          {
            id: useRandomString(),
            isActive: true,
            isSolved: false,
            lettersStates: null,
          },
        ];
        setTimeout(() => {
          setInputs(extendedInputs);
        }, 1800);
      } else {
        setResult("loose");
      }
    }
  };

  const handleGameRestart = () => {
    setInputs([
      {
        id: useRandomString(),
        isActive: true,
        isSolved: false,
        lettersStates: null,
      },
    ]);
    setResult(null);
    setIsGameStarted(false);
    setTimer(0);
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    getRandomWord(i18n.language as Languages).then((word) => {
      setCurrentWord(word);
    });
  };

  const startGame = () => {
    setIsGameStarted(true);
    setTimer(0);
    const interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer + 1);
    }, 1000);
    setTimerInterval(interval);
  };

  useEffect(() => {
    if (result && timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
  }, [result]);

  useEffect(() => {
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [timerInterval]);

  const HowToModalContent = () => {
    return (
      <>
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
      </>
    );
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleSaveResult = async () => {
    const resultCardRef = document.getElementById("result-card");
    if (resultCardRef) {
      try {
        const canvas = await html2canvas(resultCardRef);
        const image = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = image;
        link.download = "wordle-result.png";
        link.click();
      } catch (error) {
        console.error("Error generating image:", error);
      }
    }
  };

  return (
    <div className="app">
      <h1 className="app__title">
        w<span className="app__title--special-letter">o</span>rdle
      </h1>
      <div className="app__subheader">
        <LanguageSwitcher showWarningModal={inputs.length > 1} />
        <p className="app__qa" onClick={() => setHowToModalIsOpen(true)}>
          {t("howToPlay")}
        </p>
      </div>
      <main className="app__game-board">
        {!isGameStarted ? (
          <button className="app__start-button" onClick={startGame}>
            {t("startGame")}
          </button>
        ) : (
          <>
            <div className="app__timer">{formatTime(timer)}</div>
            <div
              className={`app__game-inputs${
                shakeErrorClass ? " app__game-inputs--shake" : ""
              }`}
            >
              {inputs.map((input) => (
                <WordInput
                  key={input.id}
                  isActive={input.isActive}
                  onSubmit={handleWordSubmit}
                  lettersStates={input.lettersStates}
                />
              ))}
            </div>
            {result && (
              <>
                <div
                  id="result-card"
                  style={{ position: "absolute", left: "-9999px" }}
                >
                  <ResultCard
                    time={formatTime(timer)}
                    result={result}
                    word={currentWord || ""}
                  />
                </div>
                <div className={`app__result-tile app__result-tile--${result}`}>
                  {result === "win" ? t("winMessage") : t("failMessage")}
                </div>
                <div className="app__buttons">
                  <button
                    className="app__restart-button"
                    onClick={handleGameRestart}
                  >
                    {t("playAgain")}
                  </button>
                  <button
                    className="app__save-button"
                    onClick={handleSaveResult}
                  >
                    {t("saveResult")}
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </main>
      <footer className="app__footer">
        <div>
          Made with 🐸 by{" "}
          <a href="https://sabinapsuj.dev/" target="_blank">
            Sabina Psuj
          </a>
        </div>
        <button onClick={handleOpenPrivacyModal}>Privacy Info</button>
      </footer>
      {howToModalIsOpen && (
        <Modal closeModal={() => setHowToModalIsOpen(false)}>
          <HowToModalContent />
        </Modal>
      )}
      <PrivacyModal
        isOpen={isPrivacyModalOpen}
        onClose={handleClosePrivacyModal}
      />
    </div>
  );
}

export default App;
