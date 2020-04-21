export default do ->
  prime = 1e9 + 7
  coef = 123122443
  i = 0
  return ->
    i = (i + coef) % prime
    return i
