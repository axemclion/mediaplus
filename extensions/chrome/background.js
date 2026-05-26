chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    switch (request.action) {
        case "notify":
            chrome.notifications.create({
                type: "basic",
                iconUrl: chrome.runtime.getURL("core/images/128icon.png"),
                title: "MediaPlus",
                message: request.data.message
            }, function(notifId) {
                if (request.data.time !== true) {
                    setTimeout(function() {
                        chrome.notifications.clear(notifId);
                    }, request.data.time || 5000);
                }
            });
            sendResponse();
            break;
        case "load":
            var files = request.data;
            var tabId = sender.tab.id;
            var cssPromises = files.css.map(function(file) {
                return chrome.scripting.insertCSS({ target: { tabId: tabId }, files: [file] });
            });
            Promise.all(cssPromises).then(function() {
                return files.js.reduce(function(chain, file) {
                    return chain.then(function() {
                        return chrome.scripting.executeScript({ target: { tabId: tabId }, files: [file] });
                    });
                }, Promise.resolve());
            }).then(function() {
                sendResponse();
            });
            return true;
        case "newWindow":
            var config = request.data;
            chrome.windows.create({ url: config.url }, function(win) {
                if (config.content) {
                    chrome.scripting.executeScript({
                        target: { tabId: win.tabs[0].id },
                        func: function(html) { document.body.innerHTML = html; },
                        args: [config.content]
                    });
                }
                sendResponse();
            });
            return true;
    }
    return true;
});
