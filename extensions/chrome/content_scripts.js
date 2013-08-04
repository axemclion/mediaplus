(function() {
    function notify(message, time) {
        if (!message) {
            return;
        }
        if (typeof window.webkitNotifications !== 'undefined'){
            chrome.extension.sendMessage({
                "action": "notify",
                "data": {
                    "message": message,
                    "time": time
                }
            });
        } else { // In case this is used by Opera
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
            if (!message) {
                m.style.display = "none";
                return;
            }
            m.innerHTML = message;
            m.style.display = "block";
            if (time !== true) {
                window.__flashPlus__messageHideTimer = window.setTimeout(function(){
                    m.style.display = "none";
                }, time || 4000);
            }
            return m;
        }
    }

    function loadDependencies(files, callback) {
        chrome.extension.sendMessage({
            "action": "load",
            "data": files
        }, function(data) {
            (typeof callback === "function") && callback();
        });
    }

    var getBaseUrl = chrome.extension.getURL;
    chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
        switch (request.action) {
            case "getNextAction":
                if (typeof __FlashPlus__ === "undefined") {
                    /*console.log(sender.tab ?
                        "from a content script:" + sender.tab.url :
                        "from the extension");
                    */sendResponse({
                        "action": "loadFlashPlus"
                    });
                } else {
                    __FlashPlus__.stopPlugin(false);
                    var nextAction = __FlashPlus__.nextAction();
                    if (nextAction) {
                        sendResponse({
                            "action": "showAction",
                            "data": nextAction
                        });
                    } else {
                        sendResponse({
                            "action": "showOptions"
                        });
                    }
                }
                break;
            case "initFlashPlus":
                loadDependencies({
                    "js": ["lib/jquery/jquery.min.js", "lib/jquery/jquery-ui.min.js", "core/js/FlashPlus.js"],
                    "css": ["core/css/FlashPlus.css", "lib/jquery/jquery-ui.css", "lib/jquery/ui.theme.css"]
                }, function() {
                    __FlashPlus__.init({
                        "commands": {
                            "js": ["core/js/Tags.js"],
                            "css": []
                        },
                        "env": {
                            "dependencies": loadDependencies,
                            "image": function(url, img) {
                                img.setAttribute("src", getBaseUrl(url));
                            },
                            "xhr": function(url, callback, options) {
                                var xhr = new XMLHttpRequest();
                                xhr.onreadystatechange = function(resp) {
                                    if (xhr.readyState == 4) {
                                        callback(xhr.responseText);
                                    }
                                }
                                xhr.open("GET", url, true);
                                xhr.send();
                            },
                            "newWindow": function(config) {
                                chrome.extension.sendMessage({
                                    "action": "newWindow",
                                    "data": config
                                }, function(data) {

                                });
                            }
                        },
                        "notify": notify,
                    });
                });
                sendResponse();
                break;
            case "doAction":
                var nextAction = __FlashPlus__.nextAction();
                nextAction.perform();
                sendResponse();
                break;
            case "rescan":
                __FlashPlus__.refreshTags();
                sendResponse();
                break;
            case "stopFlashPlus":
                __FlashPlus__.stopPlugin();
                sendResponse();
                break;
            default:
                sendResponse();
        }
    });
})();