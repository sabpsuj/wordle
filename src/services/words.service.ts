import wordsEN from "../data/dictionary.en.json"
import wordsPL from "../data/dictionary.pl.json"

const dictionaries = {
  en: wordsEN,
  pl: wordsPL
}

export const getRandomWord = (language: "pl" | "en") => {
  return new Promise<string> (resolve => {
    const dictionary = dictionaries[language]
    const randomIndex = Math.floor(Math.random() * dictionary.length)
    resolve(dictionary[randomIndex])
  })
}

export const checkIfWordExist = (word: string, language: "pl" | "en") => {
  const dictionary = dictionaries[language]
  return new Promise<boolean> (resolve => {
    resolve(dictionary.includes(word.toLowerCase()))
  })
}
