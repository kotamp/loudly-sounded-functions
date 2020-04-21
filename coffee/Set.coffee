export default do ->
  class Set
    constructor: ->
      # temporary implementation. idk how to
      # search obj by reference < O(n) in js
      # because keys in js is string you can't
      # just @obj[{a1:23}] = ...

      @arr = []

    add: (objs...) ->
      for o in objs when o?
        @arr.push o

    remove: (objs...) ->
      narr = []
      for i in @arr
        if objs.indexOf(i) == -1
          narr.push i
      @arr = narr

    get: ->
      return @arr

