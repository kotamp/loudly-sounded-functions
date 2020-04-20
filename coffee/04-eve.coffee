eve = do ->
  internal = "__internal__"
  events = {}
  events[internal] = []

  _eve = (name, scope, args...) ->
    nameClass = classof name

    if nameClass == 'Array'
      tokens = name
    else if nameClass == 'String'
      tokens = name.split '.'
    else
      return false

    queue = [events]
    nqueue = []

    for token in tokens
      for entry in queue
        if entry[token]?
          nqueue.push entry[token]
        if entry['*']?
          nqueue.push entry['*']
      queue = nqueue


    listeners = []

    queue.forEach (entry) ->
      entry[internal]?.forEach (func) ->
        if listeners.indexOf(func) == -1
          func.apply scope, args
          listeners.push func


    return true

  _on = (name, func) ->
    nameClass = classof name

    if nameClass == 'Array'
      tokens = name
    else if nameClass == 'String'
      tokens = name.split '.'
    else
      return false

    ptr = events

    for token in tokens
      if not ptr[token]?
        ptr[token] = {}
      ptr = ptr[token]

    if not ptr[internal]?
      ptr[internal] = []

    ptr[internal].push func
    return true

  _f = (name, args...) ->
    return (fargs...) ->
      _eve.apply(
        null,
        [this].concat(args).concat(fargs))

  _eve['on'] = _on
  _eve['f'] = _f

  return _eve

