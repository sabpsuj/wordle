import React from "react"
import { useTranslation } from "react-i18next";
import type { Languages } from "../types/Languages.type";

type LanguageSwitcherProps = {
  value: Languages
  onChange: (value: "pl" | "en") => void
}

export function LanguageSwitcher ({value, onChange}: LanguageSwitcherProps) {
  const { i18n } = useTranslation();
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLanguage = event?.target.value as Languages
    onChange(selectedLanguage)
    i18n.changeLanguage(selectedLanguage)
  }

  return (
    <select value={value} onChange={handleChange}>
      <option value="pl">PL</option>
      <option value="en">EN</option>
    </select>
  )
}