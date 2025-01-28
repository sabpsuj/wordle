import words from "../data/dictionary.json"

export const getRandomWord = () => {
  return new Promise<string> (resolve => {
    const randomIndex = Math.floor(Math.random() * words.length)
    resolve(words[randomIndex])
  })
}

export const checkIfWordExist = (word: string) => {
  return new Promise<boolean> (resolve => {
    resolve(words.includes(word.toLowerCase()))
  })
}
