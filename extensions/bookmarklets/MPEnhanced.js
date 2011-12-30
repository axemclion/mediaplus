(function() {
	var scriptSource = "extensions/bookmarklets/MPEnhanced.js";
	var scripts = document.getElementsByTagName("script");
	var __BASE_REV__ = __BASE_URL__ = "";
	for ( var i = 0; i < scripts.length; i++) {
		var baseSrc = scripts[i].src;
		if (baseSrc && baseSrc.indexOf(scriptSource) !== -1) {
			__BASE_URL__ = baseSrc.substring(0, baseSrc.indexOf(scriptSource));
			(baseSrc.indexOf("?") !== -1) && (__BASE_REV__ = baseSrc.substring(baseSrc.indexOf("?")));
			break;
		}
	}

	var getBaseUrl = function(url, rev) {
		return __BASE_URL__ + url + __BASE_REV__;
	}

	/**
	 * Logic to load the dependencies, javascript and css files
	 * 
	 * @param {Object}
	 *            callback
	 */
	var loadDependencies = function(callback) {
		var files = {
			"js" : [ getBaseUrl("extensions/bookmarklets/MediaPlus.js"), getBaseUrl("core/extensions/pixastic.custom.js"),
					getBaseUrl("core/extensions/PixasticController.js"), getBaseUrl("core/extensions/Enhance.js") ],
			"css" : [ getBaseUrl("core/extensions/PixasticController.css") ]
		}

		// loading CSS files
		for (i = 0; i < files.css.length; i++) {
			var cssNode = document.createElement('link');
			cssNode.type = 'text/css';
			cssNode.rel = 'stylesheet';
			cssNode.href = files.css[i];
			cssNode.media = 'screen';
			document.getElementsByTagName("head")[0].appendChild(cssNode);
		}

		var count = 0;
		var head = document.getElementsByTagName("head")[0] || document.documentElement;
		// loading Javascript files
		var loadScript = function(loadedFileIndex) {
			if (loadedFileIndex < files.js.length) {
				var x = document.createElement("script");
				x.src = files.js[loadedFileIndex];
				x.onreadystatechange = function() {
					if (this.readyState === "loaded" || this.readyState === "complete") {
						loadScript(loadedFileIndex + 1);
					}
				}
				x.onload = function() {
					loadScript(loadedFileIndex + 1);
				};
				head.insertBefore(x, head.firstChild);
			} else {
				callback.apply(this);
			}
		}
		loadScript(0);
	};
	loadDependencies();
})();
