

module.exports = {
	deferred: function deferred() {
		function isFunction(x) {
			return typeof x == 'function';
		}

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

					function resolve(x,then,k) {
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
								then.call(x, notedReject.bind(0, resolve), notedReject.bind(0, q));
              } else {
								r(x);
							}
						} catch (e) {
							notedReject(q, e);
						}
					}

					onF = isFunction(onF) ? resolve.bind(onF) : r;
					onR = isFunction(onR) ? resolve.bind(onR) : q;
					if (!mode) {
						a.push(onF);
						b.push(onR);
					} else {
						runLater(mode === a ? onF : onR);
					}
					return p;
				}
			},
			resolve: setModeAndValue.bind(0, a),
			reject: setModeAndValue.bind(0, b)
		};
	}
};

