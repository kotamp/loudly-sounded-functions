classof = (o) ->
  Object.prototype.toString.call(o).slice 8, -1
