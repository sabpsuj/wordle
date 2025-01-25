import words from "../data/dictionary.json"

export const getRandomWord = () => {
  const randomIndex = Math.floor(Math.random() * words.length)

  return words[randomIndex]
}
