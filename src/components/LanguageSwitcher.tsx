import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { Languages } from "../types/Languages.type";
import { Modal } from "./Modal";
import "./LanguageSwitcher.scss";

type LanguageSwitcherProps = {
  showWarningModal: boolean;
};

export function LanguageSwitcher({ showWarningModal }: LanguageSwitcherProps) {
  const { t, i18n } = useTranslation();
  const [warningModalIsOpen, setWarningModalIsOpen] = useState(false);
  const [languageToBeChosen, setLanguageToBeChosen] = useState<Languages>("en");

  const changeLanguage = (language: Languages) => {
    i18n.changeLanguage(language);
    if (warningModalIsOpen) {
      setWarningModalIsOpen(false);
    }
  };

  const WarningModalContent = () => {
    return (
      <>
        <h4>{t("changeLanguageWarningTitle")}</h4>
        <p>{t("changeLanguageWarning")}</p>
        <div className="language-switcher__modal-buttons">
          <button
            className="language-switcher__modal-button language-switcher__modal-button--accept"
            onClick={() => changeLanguage(languageToBeChosen)}
          >
            {t("yes")}
          </button>
          <button
            className="language-switcher__modal-button language-switcher__modal-button--decline"
            onClick={() => setWarningModalIsOpen(false)}
          >
            {t("no")}
          </button>
        </div>
      </>
    );
  };

  return (
    <div
      className="language-switcher"
      role="group"
      aria-label="Language Switcher"
    >
      <button
        className={`language-switcher__button${
          i18n.language === "pl" ? " language-switcher__button--active" : ""
        }`}
        onClick={() => {
          if (showWarningModal) {
            setWarningModalIsOpen(true);
            setLanguageToBeChosen("pl");
          } else {
            changeLanguage("pl");
          }
        }}
        aria-label="Switch to English"
        aria-pressed={i18n.language === "pl"}
      >
        <span>{t("language.polish")}</span>
      </button>
      <button
        className={`language-switcher__button${
          i18n.language === "en" ? " language-switcher__button--active" : ""
        }`}
        onClick={() => {
          if (showWarningModal) {
            setWarningModalIsOpen(true);
            setLanguageToBeChosen("en");
          } else {
            changeLanguage("en");
          }
        }}
        aria-label="Switch to Polish"
        aria-pressed={i18n.language === "en"}
      >
        <span>{t("language.english")}</span>
      </button>
      <button
        className={`language-switcher__button${
          i18n.language === "halloween"
            ? " language-switcher__button--active halloween-button"
            : ""
        }`}
        onClick={() => {
          if (showWarningModal) {
            setWarningModalIsOpen(true);
            setLanguageToBeChosen("halloween");
          } else {
            changeLanguage("halloween");
          }
        }}
        aria-label="Switch to Halloween"
        aria-pressed={i18n.language === "halloween"}
      >
        <span>🎃</span>
      </button>
      {warningModalIsOpen && (
        <Modal closeModal={() => setWarningModalIsOpen(false)}>
          <WarningModalContent />
        </Modal>
      )}
    </div>
  );
}
