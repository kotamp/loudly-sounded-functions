export clamp = (min, max, val) ->
  if val < min then return min
  if val > max then return max
  return val
