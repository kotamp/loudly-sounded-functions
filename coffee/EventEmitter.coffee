export default do ->
  class EventEmitter
    constructor: ->
      @_events = {}
  
    on: (type, listener) ->
      @_events[type] ?= []
      @_events[type].push listener

    emit: (type, args...) ->
      if @_events[type]?
        for fn in @_events[type]
          fn(args...)
      
