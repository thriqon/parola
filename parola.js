
function isFunction(x) {
  return typeof x == 'function';
}

function resolve(d, r, q, p, x,then,k) {
  function notedReject(ttt, e) {
    if (!k) {
      ttt(e);
      k = 1;
    }
  }
  try {
    x = isFunction(this) ? this(x) : x;
    if (p == x) {
      q(TypeError());
    } else if (x && x === Object(x) && isFunction((then = x.then))) {
      then.call(x, notedReject.bind(0, resolve.bind(0,d,r,q,p)), notedReject.bind(0, q));
    } else {
      r(x);
    }
  } catch (e) {
    notedReject(q, e);
  }
}

exports.deferred = function deferred() {
  var a = [], b = [];
  var mode;

  function runLater(f) {
    setTimeout(f, 0, b);
  }

  function setModeAndValue(nm, val) {
    if (!mode) {
      b = val;
      nm.forEach(runLater);
      mode = nm;
    }
  }
  return {
    promise:  {
      then: function then(onF, onR) {
        var d = deferred();
        var r = d.resolve, q = d.reject, p = d.promise;

        onF = isFunction(onF) ? resolve.bind(onF, d, r, q, p) : r;
        onR = isFunction(onR) ? resolve.bind(onR, d, r, q, p) : q;
        if (!mode) {
          a.push(onF);
          b.push(onR);
        } else {
          runLater(mode == a ? onF : onR);
        }
        return p;
      }
    },
    resolve: setModeAndValue.bind(0, a),
    reject: setModeAndValue.bind(0, b)
  };
};

