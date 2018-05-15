(function() {
    var scriptSource = "extensions/bookmarklets/MediaPlus.js";
    var scripts = document.getElementsByTagName("script");
    var __BASE_REV__ = __BASE_URL__ = "";
    for (var i = 0; i < scripts.length; i++) {
        var baseSrc = scripts[i].src;
        if (scripts[i].src && scripts[i].src.indexOf(scriptSource) !== -1) {
            __BASE_URL__ = baseSrc.substring(0, baseSrc.indexOf(scriptSource));
            (baseSrc.indexOf("?") !== -1) && (__BASE_REV__ = baseSrc.substring(baseSrc.indexOf("?")));
            break;
        }
    }

    var getBaseUrl = function(url, rev) {
        return __BASE_URL__ + url + __BASE_REV__;
    }

    /**
     * Shows a message on the page
     */
    window.__flashPlus__messageHideTimer = window.__flashPlus__messageHideTimer || null;

    function message(content, time) {
        window.clearTimeout(window.__flashPlus__messageHideTimer);
        var m = document.getElementById("___flashPlus-message");
        if (!m) {
            m = document.createElement("div");
            m.setAttribute("id", "___flashPlus-message");
            m.style["left"] = "40%";
            m.style["top"] = 0;
            m.style["backgroundColor"] = "#FFFFE1";
            m.style["padding"] = "1em";
            m.style["borderRadius"] = "0 0 10px 10px";
            m.style["position"] = "fixed";
            m.style["boxShadow"] = "0 0 5px 5px GRAY";
            m.style["fontSize"] = "14px";
            m.style["zIndex"] = "21474836487";
            m.style["border"] = "SOLID 3px BLACK";
            m.style["text-align"] = "center";
            m.style["color"] = "black";
            document.body.appendChild(m);
        }
        if (!content) {
            m.style.display = "none";
            return;
        }
        m.innerHTML = content;
        m.style.display = "block";
        if (time !== true) {
            window.__flashPlus__messageHideTimer = window.setTimeout(function() {
                m.style.display = "none";
            }, time || 4000);
        }
        return m;
    }

    var helpMessage = "<center style = 'font-size:0.8em'><a href = 'http://nparashuram.com/projects/flashresizer.html'>MediaPlus Help</a> | <a href = 'http://nparashuram.com/contact.html'>Support/Bugs</a></center>";
    message("<h1>... Loading ...</h1>" + helpMessage);
    // If the title has a (Loading) inserted by the Bookmarklet, remove it
    document.title = document.title.replace(/^\(Loading\)/, "");

    /**
     * Logic to load the dependencies, javascript and css files
     *
     * @param {Object}
     *            callback
     */
    function loadDependencies(files, callback) {
        var head = document.getElementsByTagName("head")[0] || document.documentElement;
        // loading CSS files
        files.css = files.css || [];
        for (i = 0; i < files.css.length; i++) {
            var cssNode = document.createElement('link');
            cssNode.type = 'text/css';
            cssNode.rel = 'stylesheet';
            cssNode.href = files.css[i];
            cssNode.media = 'screen';
            head.insertBefore(cssNode, head.firstChild);
        }

        var count = 0;
        files.js = files.js || [];
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
                (typeof callback === "function") && callback.apply(this);
            }
        }
        loadScript(0);
    };

    function addEvent(el, eType, fn, uC) {
        if (el.addEventListener) {
            el.addEventListener(eType, fn, uC);
            return true;
        } else
        if (el.attachEvent) {
            return el.attachEvent('on' + eType, fn);
        } else {
            el['on' + eType] = fn;
        }
    }


    /**
     * Run the actual logic
     */
    message();
    if (typeof(__FlashPlus__) === "undefined") {
        loadDependencies({
            "js": ["//ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js", "//ajax.googleapis.com/ajax/libs/jqueryui/1.8.13/jquery-ui.min.js", getBaseUrl("core/js/FlashPlus.js")],
            "css": [getBaseUrl("core/css/FlashPlus.css"), "//ajax.googleapis.com/ajax/libs/jqueryui/1.8.13/themes/base/jquery-ui.css", "//static.jquery.com/ui/css/demo-docs-theme/ui.theme.css"]
        }, function() {
            __FlashPlus__.init({
                "commands": {
                    "js": [getBaseUrl("core/js/Tags.js")],
                    "css": []
                },
                "env": {
                    "dependencies": loadDependencies,
                    "image": function(url, img) {
                        img.setAttribute("src", getBaseUrl(url));
                    },
                    "xhr": function(url, callback, options) {
                        var callbackVar = "__FlashPlus__" + parseInt(Math.random() * 1000);
                        loadDependencies({
                            "js": [url + "&callback=(function(data){window." + callbackVar + "=data})"]
                        }, function() {
                            callback(JSON.stringify(window[callbackVar]));
                        });
                    },
                    "newWindow": function(config) {
                        var n = window.open(config.url || undefined, config.name, config.specs);
                        if (!config.content) {
                            return;
                        }
                        try {
                            window.setTimeout(function() {
                                n.window.addEventListener("DOMContentLoaded", function() {
                                    n.document.body.innerHTML = config.content;
                                }, false);
                            });
                        } catch (e) {}
                    }
                },
                "notify": message,
            });
        });
    } else {
        var nextAction = __FlashPlus__.nextAction();
        if (nextAction) {
            nextAction.perform();
        } else {
            __FlashPlus__.stopPlugin(false);
            var html = ["<hr/><button id = '__flashplus__panel__rescan' class = 'flashPlus-message-button'>Re-scan page for media</button>"];
            html.push("<button id = '__flashplus__panel__stop'  class = 'flashPlus-message-button'>Stop this plugin</button>");
            html.push("<button id = '__flashplus__panel__close'  class = 'flashPlus-message-button'>Close this panel</button>");
            var container = document.createElement("div");
            container.innerHTML = html.join("");
            message("MediaPlus Options", true).appendChild(container);

            addEvent(document.getElementById("__flashplus__panel__rescan"), "click", function(e) {
                __FlashPlus__.refreshTags();
            }, false);

            addEvent(document.getElementById("__flashplus__panel__stop"), "click", function(e) {
                __FlashPlus__.stopPlugin();
            }, false);

            addEvent(document.getElementById("__flashplus__panel__close"), "click", function(e) {
                message();
            }, false);
        }
    }
})();