import React from "react";
import "./ResultCard.scss";
import { useTranslation } from "react-i18next";

interface ResultCardProps {
  time: string;
  result: "win" | "loose";
  word: string;
}

export const ResultCard = React.forwardRef<HTMLDivElement, ResultCardProps>(
  ({ time, result, word }, ref) => {
    const { t } = useTranslation();

    return (
      <div className="result-card" ref={ref}>
        <h2 className="result-card__title">Wordle Result</h2>
        <div className="result-card__content">
          <p className="result-card__stat">
            {t("time")}: {time}
          </p>
          <p className="result-card__stat">
            {t("result")}:{" "}
            {result === "win" ? t("winMessage") : t("failMessage")}
          </p>
          <p className="result-card__stat">
            {t("word")}: {word}
          </p>
        </div>
      </div>
    );
  }
);
