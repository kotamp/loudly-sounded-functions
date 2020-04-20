noteToFreq = (note) ->
  return 440 * Math.pow 2, (note - 57) / 12
