(function(){
    var background = null, channel = null;
    var base = "", rev = "";
    var top = window.location;
    opera.extension.onmessage = function(event){
        if (typeof event.data.action === "undefined" || event.data.action !== "popup") {
            return;
        }
        background = event.source;
        channel = new MessageChannel();
        if (typeof window.__FlashPlus__ === "undefined") {
            var result = {
                "action": "loadFlashPlus"
            };
        }
        else {
            window.__FlashPlus__.stopPlugin(false);
            var nextAction = window.__FlashPlus__.nextAction();
            if (nextAction) {
                result = {
                    "action": "showAction",
                    "data": nextAction.message
                };
            }
            else {
                result = {
                    "action": "showOptions"
                };
            }
        }
        event.ports[0].postMessage(result, [channel.port2]);
        channel.port1.onmessage = function(event){
            switch (event.data.action) {
                case "initFlashPlus":
                    loadDependencies({
                        "js": ["lib/jquery/jquery.min.js", "lib/jquery/jquery-ui.min.js", "core/js/FlashPlus.js"],
                        "css": ["core/css/FlashPlus.css", "lib/jquery/jquery-ui.css", "lib/jquery/ui.theme.css"]
                    }, function(){
                        notify("Loading MediaPlus");
                        window.__FlashPlus__.init({
                            "env": {
                                "image": getImage,
                                "dependencies": loadDependencies,
                                "newWindow": function(config){
                                    var n = window.open("about:blank", config.name, config.specs);
                                    if (!config.content) {
                                        return;
                                    }
                                    try {
                                        window.setTimeout(function(){
                                            n.window.addEventListener("DOMContentLoaded", function(){
                                                n.document.body.innerHTML = config.content;
                                            }, false);
                                        });
                                    } 
                                    catch (e) {
                                    }
                                },
                                "xhr": function(url, callback, options){
                                    var channel = new MessageChannel();
                                    channel.port1.onmessage = function(event){
                                        if (event.data.action !== "xhr") {
                                            return;
                                        }
										callback(event.data.data);
                                    }
                                    if (!(url.indexOf("http:") === 0 || url.indexOf("https:") === 0)) {
                                        url = "http://" + url.substring(2);
                                    }
                                    background.postMessage({
                                        "action": "xhr",
                                        "data": {
                                            "url": url
                                        }
                                    }, [channel.port2]);
                                }
                            },
                            "notify": notify,
                            "commands": {
                                "js": ["core/js/Tags.js"],
                                "css": []
                            }
                        });
                    });
                    break;
                case "doAction":
                    var nextAction = window.__FlashPlus__.nextAction();
                    nextAction.perform();
                    break;
                case "rescan":
                    window.__FlashPlus__.refreshTags();
                    break;
                case "stopFlashPlus":
                    window.__FlashPlus__.stopPlugin();
                    break;
            }
        };
    };
    
    window.__flashPlus__messageHideTimer = window.__flashPlus__messageHideTimer || null;
    function notify(content, time){
        window.clearTimeout(window.__flashPlus__messageHideTimer);
        var m = document.getElementById("___flashPlus-message");
        if (!m) {
            m = document.createElement("div");
            m.setAttribute("id", "___flashPlus-message");
            m.style["right"] = "0";
            m.style["top"] = 0;
            m.style["backgroundColor"] = "#FFFFE1";
            m.style["padding"] = "1em";
            m.style["borderRadius"] = "0 0 0px 10px";
            m.style["position"] = "fixed";
            m.style["boxShadow"] = "0 0 5px 5px GRAY";
            m.style["fontSize"] = "14px";
            m.style["zIndex"] = "2147483647"
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
            window.__flashPlus__messageHideTimer = window.setTimeout(function(){
                m.style.display = "none";
            }, time || 4000);
        }
        return m;
    }
    
    function getImage(url, img){
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event){
            if (event.data.action !== "image") {
                return;
            }
            img.setAttribute("src", event.data.datauri);
        }
        background.postMessage({
            "action": "image",
            "url": url
        }, [channel.port2]);
    }
    
    function loadDependencies(files, callback){
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event){
            if (event.data.action !== "dependencies") {
                return;
            }
            var head = document.getElementsByTagName("head")[0] || document.documentElement;
            var files = event.data.files;
            for (var i = 0; i < files.css.length; i++) {
                var x = document.createElement("style");
                x.textContent = files.css[i];
                head.insertBefore(x, head.firstChild);
            }
            for (i = 0; i < files.js.length; i++) {
                var y = document.createElement("script");
                y.textContent = files.js[i];
                head.insertBefore(y, head.firstChild);
            }
            (typeof callback === "function") && callback();
        };
        background.postMessage({
            "action": "dependencies",
            "files": files
        }, [channel.port2]);
    }
})();
