export default (function() {
  var NOTES, effect, effectParam1, effectParam2, instrumentHigh, instrumentLow, note, octave, volumeHigh, volumeLow;
  NOTES = "C- C# D- D# E- F- F# G- G# A- A# B-".split(' ');
  note = function(o) {
    var v;
    v = o.note;
    if (v != null) {
      return NOTES[v % 12];
    }
    return '--';
  };
  octave = function(o) {
    var v;
    v = o.note;
    if (v != null) {
      return '' + Math.floor(v / 12);
    }
    return '-';
  };
  volumeHigh = function(o) {
    var v;
    v = o.volume;
    if (v != null) {
      return Math.floor(v / 16).toString(16).toUpperCase();
    }
    return '-';
  };
  volumeLow = function(o) {
    var v;
    v = o.volume;
    if (v != null) {
      return (v % 16).toString(16).toUpperCase();
    }
    return '-';
  };
  instrumentHigh = function(o) {
    var v;
    v = o.instrument;
    if (v != null) {
      return Math.floor(v / 16).toString(16).toUpperCase();
    }
    return '-';
  };
  instrumentLow = function(o) {
    var v;
    v = o.instrument;
    if (v != null) {
      return (v % 16).toString(16).toUpperCase();
    }
    return '-';
  };
  effect = function(o) {
    var v;
    v = o.effect;
    if (v != null) {
      return v.slice[0].toUpperCase();
    }
    return '-';
  };
  effectParam1 = function(o) {
    var v;
    v = o.effectParam1;
    if (v != null) {
      return v;
    }
    return '-';
  };
  effectParam2 = function(o) {
    var v;
    v = o.effectParam2;
    if (v != null) {
      return v;
    }
    return '-';
  };
  return function(parent, model) {
    var cells, columnSelected, i, j, len, r, rowSelected, rows, str;
    ({rowSelected, columnSelected, rows} = model);
    str = '';
    for (i = j = 0, len = rows.length; j < len; i = ++j) {
      r = rows[i];
      str += '<div class="row">';
      cells = [];
      cells.push('<div class="note">' + note(r) + '</div>');
      cells.push('<div class="octave">' + octave(r) + '</div>');
      cells.push('<div class="volume-high">' + volumeHigh(r) + '</div>');
      cells.push('<div class="volume-low">' + volumeLow(r) + '</div>');
      cells.push('<div class="instrument-high">' + instrumentHigh(r) + '</div>');
      cells.push('<div class="instrument-low">' + instrumentLow(r) + '</div>');
      cells.push('<div class="effect">' + effect(r) + '</div>');
      cells.push('<div class="effect-param1">' + effectParam1(r) + '</div>');
      cells.push('<div class="effect-param2">' + effectParam2(r) + '</div>');
      if (rowSelected === i) {
        cells[columnSelected] = '<div class="selected">' + cells[columnSelected] + '</div>';
      }
      str += cells.join('');
      str += '</div>';
    }
    return parent.innerHTML = str;
  };
})();
