(function() {
    function notify(message, time) {
        if (!message) {
            return;
        }
        chrome.extension.sendMessage({
            "action": "notify",
            "data": {
                "message": message,
                "time": time
            }
        });
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
                    console.log(sender.tab ?
                        "from a content script:" + sender.tab.url :
                        "from the extension");
                    sendResponse({
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
                            "js": ["core/js/Tags.js", "core/extensions/pixastic.custom.js", "core/extensions/PixasticController.js", "core/extensions/Enhance.js"],
                            "css": ["core/extensions/PixasticController.css"]
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