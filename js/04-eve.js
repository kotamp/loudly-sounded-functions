(function() {
  var eve;

  eve = (function() {
    var _eve, _f, _on, events, internal;
    internal = "__internal__";
    events = {};
    events[internal] = [];
    _eve = function(name, scope, ...args) {
      var entry, i, j, len, len1, listeners, nameClass, nqueue, queue, token, tokens;
      nameClass = classof(name);
      if (nameClass === 'Array') {
        tokens = name;
      } else if (nameClass === 'String') {
        tokens = name.split('.');
      } else {
        return false;
      }
      queue = [events];
      nqueue = [];
      for (i = 0, len = tokens.length; i < len; i++) {
        token = tokens[i];
        for (j = 0, len1 = queue.length; j < len1; j++) {
          entry = queue[j];
          if (entry[token] != null) {
            nqueue.push(entry[token]);
          }
          if (entry['*'] != null) {
            nqueue.push(entry['*']);
          }
        }
        queue = nqueue;
      }
      listeners = [];
      queue.forEach(function(entry) {
        var ref;
        return (ref = entry[internal]) != null ? ref.forEach(function(func) {
          if (listeners.indexOf(func) === -1) {
            func.apply(scope, args);
            return listeners.push(func);
          }
        }) : void 0;
      });
      return true;
    };
    _on = function(name, func) {
      var i, len, nameClass, ptr, token, tokens;
      nameClass = classof(name);
      if (nameClass === 'Array') {
        tokens = name;
      } else if (nameClass === 'String') {
        tokens = name.split('.');
      } else {
        return false;
      }
      ptr = events;
      for (i = 0, len = tokens.length; i < len; i++) {
        token = tokens[i];
        if (ptr[token] == null) {
          ptr[token] = {};
        }
        ptr = ptr[token];
      }
      if (ptr[internal] == null) {
        ptr[internal] = [];
      }
      ptr[internal].push(func);
      return true;
    };
    _f = function(name, ...args) {
      return function(...fargs) {
        return _eve.apply(null, [this].concat(args).concat(fargs));
      };
    };
    _eve['on'] = _on;
    _eve['f'] = _f;
    return _eve;
  })();

}).call(this);
