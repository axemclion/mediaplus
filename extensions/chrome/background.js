chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    switch (request.action) {
        case "notify":
            if (window.webkitNotifications.checkPermission() === 0) {
                var x = window.webkitNotifications.createNotification(chrome.extension.getURL("core/images/128icon.png"), "MediaPlus", request.data.message);
                x.show();
                if (request.data.time !== true) {
                    window.setTimeout(function() {
                        x.cancel()
                    }, request.data.time || 5000);
                }
            }
            sendResponse();
            break;
        case "load":
            var files = request.data;
            chrome.tabs.getSelected(null, function(tab) {
                for (var i = 0; i < files.css.length; i++) {
                    chrome.tabs.insertCSS(tab.id, {
                        "file": files.css[i]
                    }, function(e) {});
                }

                function loadScript(loadedFileIndex) {
                    if (loadedFileIndex < files.js.length) {
                        chrome.tabs.executeScript(tab.id, {
                            "file": files.js[loadedFileIndex]
                        }, function() {
                            loadScript(loadedFileIndex + 1);
                        });
                    } else {
                        sendResponse();
                    }
                }
                loadScript(0);
            });
            break;
        case "newWindow":
            var config = request.data;
            chrome.windows.create({
                "url": config.url
            }, function(window) {
                if (!config.content) {
                    return true;
                }
                var code = [""];
                code.push("document.body.innerHTML='", config.content.replace(/\n/g, " ").replace(/\'/g, "\\\'"), "';");
                chrome.tabs.executeScript(window.tabs[0].id, {
                    "code": code.join("")
                });
            });
            break;
    }
    return true;
});