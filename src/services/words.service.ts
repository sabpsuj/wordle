import wordsEN from "../data/dictionary.en.json";
import wordsPL from "../data/dictionary.pl.json";
import wordsHALLOWEEN from "../data/dictionary.halloween.json";

const dictionaries = {
  en: wordsEN,
  pl: wordsPL,
  halloween: wordsHALLOWEEN,
};

export const getRandomWord = (language: "pl" | "en" | "halloween") => {
  return new Promise<string>((resolve) => {
    const dictionary = dictionaries[language];
    const randomIndex = Math.floor(Math.random() * dictionary.length);
    resolve(dictionary[randomIndex]);
  });
};

export const checkIfWordExist = (
  word: string,
  language: "pl" | "en" | "halloween"
) => {
  const dictionary = dictionaries[language];
  return new Promise<boolean>((resolve) => {
    resolve(dictionary.includes(word.toLowerCase()));
  });
};
