// This is an active module of the MediaPlus Add-on
exports.main = function(){
    var self = require("self");
    var tabs = require("tabs");
    var notifications = require("notifications");
    
    //console.log("======================================================", new Date());
    var currentTabWorker = null;
    var panel = require("panel").Panel({
        "contentURL": self.data.url("panel.html"),
        "contentScriptFile": [self.data.url("lib/jquery/jquery.min.js"), self.data.url("panel.js")],
        "onShow": function(){
            var activeTab = tabs.activeTab;
            currentTabWorker = activeTab.attach({
                "contentScriptFile": self.data.url("content_script.js"),
                "onMessage": function(data){
                    //console.log("From Content Script to page-mod", JSON.stringify(data));
                    panel.postMessage(data);
                }
            });
            currentTabWorker.port.emit("base", {
                "base": self.data.url().replace(/undefined/, ""),
                "rev": ""
            });
            currentTabWorker.port.on("notify", function(data){
                notifications.notify({
                    "title": "MediaPlus",
                    "text": data,
                    "iconURL": self.data.url("core/images/32icon.png")
                });
            });
            currentTabWorker.port.on("xhr", function(data){
                var xhr = require("request").Request;
                xhr({
                    "url": data.url,
                    "onComplete": function(response){
						currentTabWorker.port.emit("xhr", response.text);
                    }
                }).get();
            })
            
            currentTabWorker.port.on("newWindow", function(config){
                var windows = require("windows").browserWindows;
                windows.open({
                    url: config.url,
                    onOpen: function(window){
                        if (!config.content) {
                            return;
                        }
                        window.tabs.activeTab.on("ready", function(tab){
                            var code = [""];
                            code.push("document.body.innerHTML='", config.content.replace(/\n/g, " ").replace(/\'/g, "\\\'"), "';");
                            tab.attach({
                                contentScript: code.join("")
                            });
                        });
                    }
                });
            });
        },
        "onMessage": function(data){
            //console.log("Message recieved by panel", JSON.stringify(data));
            currentTabWorker.postMessage(data);
            panel.hide();
        },
    });
    
    var widget = require("widget").Widget({
        "id": "MediaPlus",
        "label": "MediaPlus",
        "tooltip": "MediaPlus",
        "contentURL": self.data.url("core/images/16icon.png"),
        "panel": panel
    });
};
