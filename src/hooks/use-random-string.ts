export const useRandomString = (length = 10) => {
  const chars = "abcdefghijklmnoprstuvwxyz1234567890";
  let randomId = ""

  for (let i = 0; i < length; i++ ) {
    randomId += chars[Math.floor(Math.random() * (chars.length - 1))]
  }

  return randomId
}