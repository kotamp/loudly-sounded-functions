export default (function() {
  var draw, list;
  list = [];
  draw = function(time) {
    var f, i, len;
    for (i = 0, len = list.length; i < len; i++) {
      f = list[i];
      f(time);
    }
    return window.requestAnimationFrame(draw);
  };
  window.requestAnimationFrame(draw);
  return function(fn) {
    return list.push(fn);
  };
})();
