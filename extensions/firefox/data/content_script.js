(function(){
    var result = null, base = null, rev = null;
    
    function notify(message){
        self.port.emit("notify", message);
    }
    
    function getBaseUrl(url){
        return base + url + rev;
    }
    
    self.port.on("base", function(data){
        //console.log("Got Base", JSON.stringify(data));
        base = data.base;
        rev = data.rev;
    });
    
    var xhrCallBack = null;
    self.port.on("xhr", function(data){
        typeof(xhrCallBack === "function") && xhrCallBack(data);
        xhrCallBack = null;
    });
    
    self.on("message", function(data){
        //console.log("Recieved data in content Script", data);
        switch (data) {
            case "initFlashPlus":
                loadDependencies({
                    "js": ["lib/jquery/jquery.min.js", "core/js/FlashPlus.js"],
                    "css": ["core/css/FlashPlus.css"]
                }, function(){
                    unsafeWindow.__FlashPlus__.init({
                        "env": {
                            "image": function(url, img){
                                img.setAttribute("src", getBaseUrl(url));
                            },
                            "newWindow": function(config){
                                self.port.emit("newWindow", config);
                            },
                            "xhr": function(url, callback, options){
                                xhrCallBack = callback;
                                if (!(url.indexOf("http:") === 0 || url.indexOf("https:") === 0)) {
                                    url = "http://" + url;
                                }
                                self.port.emit("xhr", {
                                    "url": url
                                });
                            },
                            dependencies: loadDependencies
                        },
                        "notify": notify,
                        "commands": {
                            "js": ["lib/jquery/jquery-ui.min.js", "core/extensions/pixastic.custom.js", "core/extensions/PixasticController.js", "core/extensions/Enhance.js", "core/js/Tags.js"],
                            "css": ["core/extensions/PixasticController.css", "lib/jquery/jquery-ui.css", "lib/jquery/ui.theme.css"]
                        }
                    });
                });
                break;
            case "doAction":
                unsafeWindow.__FlashPlus__.nextAction().perform();
                break;
            case "rescan":
                unsafeWindow.__FlashPlus__.refreshTags();
                break;
            case "stopFlashPlus":
                unsafeWindow.__FlashPlus__.stopPlugin();
                break;
        }
    });
    
    if (typeof unsafeWindow.__FlashPlus__ === "undefined") {
        result = {
            "action": "loadFlashPlus"
        };
    }
    else {
        unsafeWindow.__FlashPlus__.stopPlugin(false);
        var nextAction = unsafeWindow.__FlashPlus__.nextAction();
        if (nextAction) {
            result = {
                "action": "showAction",
                "data": nextAction
            }
        }
        else {
            result = {
                "action": "showOptions"
            };
        }
    }
    self.postMessage(result);
    //console.log("Inside Content script ", JSON.stringify(result));
    
    function loadDependencies(files, callback){
        // loading CSS files
        //console.log(JSON.stringify(files));
        for (i = 0; i < files.css.length; i++) {
            var cssNode = document.createElement('link');
            cssNode.type = 'text/css';
            cssNode.rel = 'stylesheet';
            cssNode.href = getBaseUrl(files.css[i]);
            cssNode.media = 'screen';
            document.body.appendChild(cssNode);
        }
        
        var count = 0;
        var head = document.getElementsByTagName("head")[0] || document.documentElement;
        // loading Javascript files
        var loadScript = function(loadedFileIndex){
            if (loadedFileIndex < files.js.length) {
                var x = document.createElement("script");
                x.src = getBaseUrl(files.js[loadedFileIndex]);
                x.onload = function(){
                    loadScript(loadedFileIndex + 1);
                }
                head.insertBefore(x, head.firstChild);
            }
            else {
                (typeof callback === "function") && callback.apply(this);
            }
        }
        loadScript(0);
    }
})();
