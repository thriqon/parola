

exports.deferred = function deferred() {
  function isFunction(x,a) {
    return (typeof x == typeof handle?x:a);
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

  return {
    promise:  {
      then: function then(onF, onR) {
        var d = deferred();
        var r = d.resolve, q = d.reject, p = d.promise;

        function resolve(l, x,k) {
          function notedReject(e) {
            k=k||this(e);
          }
          try {
            x = l ? l(x) : x;
            if (p == x) {
              0();
            } else if (x && x === Object(x) && isFunction((l = x.then))) {
              l.call(x, notedReject.bind(resolve.bind(0, 0)), notedReject.bind(q));
            } else {
              r(x);
            }
          } catch (e) {
            k || q(e);
          }
        }

        handle([0,
          resolve.bind(0, isFunction(onF, r)),
          resolve.bind(0, isFunction(onR, q))
        ]);
        return p;
      }
    },
    resolve: setModeAndValue.bind(1),
    reject: setModeAndValue.bind(2)
  };
};

