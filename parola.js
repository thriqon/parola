

exports.deferred = function deferred() {
  function isFunction(x,a) {
    return (typeof x == 'function'?x:a);
  }

  var fs = [], b;
  var mode;

  function handle(cbs) {
    if (mode) {
      setTimeout(cbs[mode], 0, b);
    } else {
      fs.push(cbs);
    }
  }

  function setModeAndValue(val) {
    if (!mode) {
      b = val;
      mode = this;
      fs.forEach(handle);
    }
  }
  var resolve1 = setModeAndValue.bind(1);
  var reject1 = setModeAndValue.bind(2);

  return {
    promise:  {
      then: function then(onF, onR) {
        var d = deferred();
        var r = d.resolve, q = d.reject, p = d.promise;

        function resolve(l, x,then,k) {
          function notedReject(ttt, e) {
            if (!k) {
              ttt(e);
              k = 1;
            }
          }
          try {
            x = l ? l(x) : x;
            if (p == x) {
              0();
            } else if (x && x === Object(x) && isFunction((then = x.then))) {
              then.call(x, notedReject.bind(0, resolve.bind(0, 0)), notedReject.bind(0, q));
            } else {
              r(x);
            }
          } catch (e) {
            notedReject(q, e);
          }
        }

        handle([0,
          resolve.bind(0, isFunction(onF, r)),
          resolve.bind(0, isFunction(onR, q))
        ]);
        return p;
      }
    },
    resolve: resolve1,
    reject: reject1,
  };
};

