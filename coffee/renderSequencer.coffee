export default do ->
  NOTES = "C- C# D- D# E- F- F# G- G# A- A# B-".split ' '
  note = (o) ->
    v = o.note

    if v?
      return NOTES[v % 12]

    return '--'


  octave = (o) ->
    v = o.note

    if v?
      return ''+Math.floor(v/12)

    return '-'


  volumeHigh = (o) ->
    v = o.volume

    if v?
      return Math.floor(v / 16)
        .toString(16)
        .toUpperCase()

    return '-'

  
  volumeLow = (o) ->
    v = o.volume

    if v?
      return (v % 16)
        .toString(16)
        .toUpperCase()

    return '-'

  instrumentHigh = (o) ->
    v = o.instrument

    if v?
      return Math.floor(v / 16)
        .toString(16)
        .toUpperCase()

    return '-'

  instrumentLow = (o) ->
    v = o.instrument

    if v?
      return (v % 16)
        .toString(16)
        .toUpperCase()

    return '-'


  effect = (o) ->
    v = o.effect

    if v?
      return v.slice[0].toUpperCase()

    return '-'

  effectParam1 = (o) ->
    v = o.effectParam1

    if v?
      return v

    return '-'

  effectParam2 = (o) ->
    v = o.effectParam2

    if v?
      return v

    return '-'



  return (parent, model) ->
    { rowSelected, columnSelected, rows } = model

    str = ''

    for r, i in rows
      str += '<div class="row">'

      cells = []

      cells.push '<div class="note">' +
        note(r) +
        '</div>'

      cells.push '<div class="octave">' +
        octave(r) +
        '</div>'

      cells.push '<div class="volume-high">' +
        volumeHigh(r) +
        '</div>'

      cells.push '<div class="volume-low">' +
        volumeLow(r) +
        '</div>'

      cells.push '<div class="instrument-high">' +
        instrumentHigh(r) +
        '</div>'

      cells.push '<div class="instrument-low">' +
        instrumentLow(r) +
        '</div>'

      cells.push '<div class="effect">' +
        effect(r) +
        '</div>'

      cells.push '<div class="effect-param1">' +
        effectParam1(r) +
        '</div>'

      cells.push '<div class="effect-param2">' +
        effectParam2(r) +
        '</div>'
      
      if rowSelected == i
        cells[columnSelected] =
          '<div class="selected">' +
          cells[columnSelected] +
          '</div>'

      str += cells.join ''

      str += '</div>'


    parent.innerHTML = str
