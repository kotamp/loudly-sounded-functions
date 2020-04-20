(function() {
  var NoteList;

  NoteList = class NoteList {
    constructor() {
      this.list = {};
      this.last = null;
    }

    getLast() {
      if (this.last != null) {
        return this.last.note;
      } else {
        return null;
      }
    }

    appendNote(note) {
      var o;
      if (this.list[note] == null) {
        o = this.list[note] = {
          prev: this.last,
          next: null,
          note: note
        };
        if (this.last != null) {
          this.last.next = o;
        }
        return this.last = o;
      }
    }

    removeNote(note) {
      var o;
      o = this.list[note];
      if (o != null) {
        if (o.prev != null) {
          o.prev.next = o.next;
        }
        if (o.next != null) {
          o.next.prev = o.prev;
        } else {
          this.last = o.prev;
        }
        return delete this.list[note];
      }
    }

    isLast(note) {
      return this.list[note] === this.last;
    }

    toArray() {
      var arr, it;
      it = this.last;
      arr = [];
      if (it == null) {
        return arr;
      }
      // actually do while
      arr.push(it.note);
      it = it.prev;
      while (it != null) {
        arr.push(it.note);
        it = it.prev;
      }
      arr.reverse();
      return arr;
    }

  };

}).call(this);
