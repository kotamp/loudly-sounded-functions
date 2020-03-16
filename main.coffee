$ = (id) ->
  document.getElementById id

$output = $('output')

text = (str) ->
  document.createTextNode str

elem = (tag, children) ->
  e = document.createElement tag
  e.appendChild(children) if children
  return e

slider = (str, min, max, step, onChange) ->

  container = elem 'div'
  label = text str
  input = elem 'input'

  input.setAttribute('type', 'range')
  input.setAttribute 'min', min
  input.setAttribute 'max', max
  input.setAttribute 'step', step

  input.addEventListener 'input', onChange

  container.appendChild label
  container.appendChild input
  $output.appendChild container

  return input


drawList = []

draw = (time) ->
  for entry in drawList
    entry()
  window.requestAnimationFrame draw

window.requestAnimationFrame draw

autoValue = (onUpdate) ->
  e = elem 'div'
  drawList.push onUpdate.bind(this, e)
  $output.appendChild e

canvas = (width, height, onDraw) ->
  console.log 'canvas was called'
  c = elem 'canvas'
  cc = c.getContext '2d'
  c.width = width
  c.height = height
  $output.appendChild c
  drawList.push onDraw.bind(this, cc)

$log = elem 'pre', text 'there will be some output'
$output.appendChild $log

linearFrequency = (analyser) -> (cc) ->
  freqBinCount = analyser.frequencyBinCount
  arr = new Uint8Array(freqBinCount)
  analyser.getByteFrequencyData(arr)

  nyquistFreq = ctx.sampleRate / 2 # the highest freq that can be sampled
  stepFreq = nyquistFreq / freqBinCount

  ccWidth = cc.canvas.width
  ccHeight = cc.canvas.height
  cc.clearRect 0, 0, ccWidth, ccHeight

  stepWidth = ccWidth / freqBinCount

  for i in [0...freqBinCount]
    db = arr[i]

    x = i * stepWidth
    width = stepWidth
    height = db * ccHeight / 255
    y = ccHeight - height


    cc.beginPath()
    cc.rect(x, y, width, height)
    cc.fillStyle = 'black'
    cc.fill()

linearToLog = (freq) ->
  Math.log(freq / 2 ) / Math.log(10)

logFrequency = (analyser) -> (cc) ->
  freqBinCount = analyser.frequencyBinCount
  arr = new Uint8Array(freqBinCount)
  analyser.getByteFrequencyData(arr)

  nyquistFreq = ctx.sampleRate / 2 # the highest freq that can be sampled
  # $log.innerText = nyquistFreq
  logNyquistFreq = linearToLog nyquistFreq
  $log.innerText = logNyquistFreq


  stepFreq = nyquistFreq / freqBinCount

  ccWidth = cc.canvas.width
  ccHeight = cc.canvas.height
  cc.clearRect 0, 0, ccWidth, ccHeight

  for i in [Math.ceil(2/stepFreq)...freqBinCount]
    db = arr[i] / 255

    x = linearToLog(i * stepFreq) / logNyquistFreq * ccWidth
    width = linearToLog((i+1) * stepFreq) / logNyquistFreq * ccWidth - x
    height = db * ccHeight
    y = ccHeight - height


    cc.beginPath()
    cc.rect(x, y, width, height)
    cc.fillStyle = 'black'
    cc.fill()

ctx = new AudioContext

osc = ctx.createOscillator()
osc.type = 'sine'
osc.frequency.value = 440;

gain = ctx.createGain()
gain.gain.value = 0.1

analyser = ctx.createAnalyser()

osc.connect gain
gain.connect analyser
analyser.connect ctx.destination


# UI
slider 'Oscillator frequency', 20, 20000, 1, (e) ->
  osc.frequency.value = e.target.value

autoValue (el) ->
  el.innerText = osc.frequency.value

slider 'Gain', 0, 1, 0.1, (e) ->
  gain.gain.value = e.target.value

autoValue (el) ->
  el.innerText = gain.gain.value

# analyser drawing
canvas 600, 150, linearFrequency(analyser)
canvas 600, 150, logFrequency(analyser)

osc.start()





