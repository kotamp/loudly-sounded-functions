(function() {
  var classof;

  classof = function(o) {
    return Object.prototype.toString.call(o).slice(8, -1);
  };

}).call(this);
