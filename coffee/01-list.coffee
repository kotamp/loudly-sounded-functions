class NoteList
  constructor: ->
    @list = {}
    @last = null

  getLast: ->
    if @last?
      return @last.key
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
    return this.list[note] == this.last
