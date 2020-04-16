class EventEmitter
  constructor: ->
    this._events = {}
  
  on: (type, listener) ->
    if not this._events[type]?
      this._events[type] = []
    this._events[type].push listener

  emit: (type, args...) ->
    if this._events[type]?
      for fn in this._events[type]
        fn(args...)
      
