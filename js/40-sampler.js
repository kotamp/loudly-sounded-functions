(function() {
  // events:
  //   sampler.loaded

  // options:
  //   ctx:       AudioContext
  //   sample:    "filepath"
  //   loop:      Boolean     or false 
  //   loopStart: 0..duration or 0
  //   loopEnd:   0..duration or 0
  var Sampler;

  Sampler = class Sampler extends EventEmitter {
    constructor(options) {
      super();
      if (options == null) {
        eve('debug', null, 'sampler: please supply ctx');
        return;
      }
      if (options.ctx == null) {
        eve('debug', null, 'sampler: ctx is null or undefined');
        return;
      }
      this.c = options.ctx;
      if ((options.sample == null) || 'String' !== classof(options.sample)) {
        eve('debug', null, 'sampler: sample path is not a string');
        return;
      }
      this.samplePath = options.sample;
      this.loop = options.loop || false;
      this.loopStart = options.loopStart || 0;
      this.loopEnd = options.loopEnd || 0;
      this.shiftTable = options.shiftTable || {};
      this.buffer = null;
      this.source = null;
      this.loadSample();
      return this;
    }

    loadSample() {
      return fetch(this.samplePath).then(function(r) {
        return r.arrayBuffer();
      }).then((d) => {
        return this.c.decodeAudioData(d);
      }).then((b) => {
        this.buffer = b;
        return eve('sampler.loaded', this);
      }).catch((e) => {
        return eve('sampler.error', this, e);
      });
    }

    play(note) {
      var offset;
      eve('debug', null, "sampler: playing ", note, "sampler: buffer duration", this.buffer.duration);
      if (note != null) {
        offset = this.shiftTable[note];
        if (this.source != null) {
          this.source.stop();
        }
        this.source = this.c.createBufferSource();
        this.source.buffer = this.buffer;
        this.source.loop = this.loop;
        this.source.loopStart = this.loopStart;
        this.source.loopEnd = this.loopEnd;
        this.source.connect(this.c.destination);
        if (offset != null) {
          return this.source.start(0, offset);
        } else {
          return this.source.start(0);
        }
      } else {
        if (this.source != null) {
          return this.source.stop();
        }
      }
    }

  };

}).call(this);
