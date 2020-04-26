export default do ->
  list = []

  draw = (time) ->
    for f in list
      f(time)
    window.requestAnimationFrame draw

  window.requestAnimationFrame draw

  return (fn) ->
    list.push fn

