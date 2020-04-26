import EventEmitter from './EventEmitter.coffee'

export default do ->


  class SequencerController extends EventEmitter
    constructor: (kb, model) ->
      @kb = kb
      @model = model


      @kb.on 'keyboard'


