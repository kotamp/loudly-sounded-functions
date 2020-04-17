class NoteList
  constructor: () ->
    @list = {}
    @last = null

  getLast: ->
    if @last?
      return @last.note
    else
      return null

  appendNote: (note) ->
    if not @list[note]?
      o = @list[note] =
        prev: @last
        next: null
        note: note

      if @last?
        @last.next = o
      @last = o

  removeNote: (note) ->
    o = @list[note]
    if o?
      if o.prev?
        o.prev.next = o.next

      if o.next?
        o.next.prev = o.prev
      else
        @last = o.prev

      delete @list[note]

  isLast: (note) ->
    return @list[note] == @last

  toArray: ->
    it = @last
    arr = []

    if not it?
      return arr

    # actually do while
    arr.push it.note
    it = it.prev

    while it?
      arr.push it.note
      it = it.prev

    arr.reverse()
    return arr


