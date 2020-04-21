export default (function() {
  var coef, i, prime;
  prime = 1e9 + 7;
  coef = 123122443;
  i = 0;
  return function() {
    i = (i + coef) % prime;
    return i;
  };
})();
