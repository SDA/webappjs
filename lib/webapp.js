/*
 * Dependencies
 *   signals: http://millermedeiros.github.com/js-signals/
 *   hasher: http://millermedeiros.github.com/Hasher/
 *   crossroads: http://millermedeiros.github.com/crossroads.js/
 *
 */

/*
 * Universal module - compatible with node.js, require.js and plain browser script tags.
 */

(function (define) {
	define(['hasher', 'crossroads'], function (hasher, crossroads) {

		if (typeof window === 'undefined') window = {};

		// Makes dependencies work for require.js & plain browser scripts.
		var hasher = hasher || window.hasher;
		var crossroads = crossroads || window.crossroads;

		var WebApp = WebApp || function() {

			var run = function() {
				// Setup hasher.
				var onHashChanged = function(newHash, oldHash) { crossroads.parse('/' + newHash); }
				hasher.initialized.add(onHashChanged); //parse initial hash value
				hasher.changed.add(onHashChanged); //add hash change listener

				// Start listening for history changes.
				hasher.init();
			}

			var Location = Location || function() {
				return {
					set: function(name) {
						if (name && name[0] && (name[0] == '/')) name = name.substr(1);
						hasher.setHash(name);
					},

					get: function() {
					},

					on: function(scope, path, handlers, opt) {
						// Set defaults.
						opt = opt || { greedy: true, once: false };

						// 'scope' is optional
						if (handlers === undefined) { handlers = path; path = scope; scope = ''; }

						// 'handlers' can a callback function
						if (typeof handlers == 'function') handlers = { '': handlers };

						for (var nestedPath in handlers) {
							var handler = handlers[nestedPath];
							if (typeof handler == 'function') {
								var route = crossroads.addRoute(scope + path + nestedPath);
								if (opt.once) { var h = handler; handler = function() { h(); route.dispose(); } };
								route.matched.add(handler);
								route.greedy = opt.greedy;
							}
							else {
								// Go recursive for extra power!
								this.on(scope + path, nestedPath, handler);
							}
						}
					},

					once: function(scope, path, handler) {
						this.on(scope, path, handler, { once: true, greedy: true });
					}
				}
			}

			return {
				run: run,
				location: new Location()
			}
		};

		// Return the module definition.
		return WebApp;
	});
}(typeof define === 'function' && define.amd ? define : function(deps, factory) {
	// node.js
	if (typeof module !== 'undefined' && module.exports) {
		module.exports = factory(require);
	}

	// require.js
	else if (typeof require === 'function') {
		window['WebApp'] = factory(function(value) {
			return window[value];
		});
	}

	// web browsers
	else {
		window['WebApp'] = factory();
	}
}));
