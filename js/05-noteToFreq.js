(function() {
  var noteToFreq;

  noteToFreq = function(note) {
    return 440 * Math.pow(2, (note - 57) / 12);
  };

}).call(this);
