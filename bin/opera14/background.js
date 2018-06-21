window.addEventListener("DOMContentLoaded", function(){
    opera.extension.onconnect = function(event){
        if (event.origin.indexOf("popup.html") > -1 && event.origin.indexOf('widget://') > -1) {
            var tab = opera.extension.tabs.getFocused();
            if (tab) {
                tab.postMessage({
                    "action": "popup"
                }, [event.source]);
            }
        }
    };
    
    var imageCache = {};
    
    opera.extension.onmessage = function(event){
        if (typeof event.data.action === "undefined") {
            return;
        }
        switch (event.data.action) {
            case "dependencies":
                var result = {
                    "css": [],
                    "js": []
                }
                var cssCount = 0, jsCount = 0, files = event.data.files;
                function onComplete(){
                    if (jsCount >= files.js.length && cssCount >= files.css.length) {
                        event.ports[0].postMessage({
                            "action": "dependencies",
                            "files": result
                        });
                    }
                }
                // loading CSS files
                
                for (i = 0; i < files.css.length; i++) {
                    $.ajax({
                        "url": files.css[i],
                        "context": files.css[i],
                        "dataType": "text",
                        "success": function(data, textStatus, jqXHR){
                            result.css.push(data);
                        },
                        "complete": function(){
                            cssCount++;
                            onComplete();
                        }
                    });
                }
                for (i = 0; i < files.js.length; i++) {
                    $.ajax({
                        "url": files.js[i],
                        "context": files.js[i],
                        "dataType": "text",
                        "success": function(data, textStatus, jqXHR){
                            result.js.push(data);
                        },
                        "complete": function(){
                            jsCount++;
                            onComplete();
                        }
                    });
                }
                break;
            case "image":
                if (typeof imageCache[event.data.url] === "undefined") {
                    var canvas = document.createElement("canvas");
                    var img = document.createElement("img");
                    img.onload = function(){
                        canvas.height = img.height;
                        canvas.width = img.width;
                        var context = canvas.getContext("2d");
                        context.drawImage(img, 0, 0, img.width, img.height);
                        imageCache[event.data.url] = canvas.toDataURL();
                        event.ports[0].postMessage({
                            "action": "image",
                            "datauri": imageCache[event.data.url]
                        });
                    }
                    img.src = event.data.url;
                }
                else {
                    event.ports[0].postMessage({
                        "action": "image",
                        "datauri": imageCache[event.data.url]
                    });
                }
                break;
            case "xhr":
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function(resp){
                    if (xhr.readyState == 4) {
                        event.ports[0].postMessage({
                            "action": "xhr",
                            "data": xhr.responseText
                        });
                    }
                }
                xhr.open('GET', event.data.data.url, false);
                xhr.send();
                
        }
    };
}, false);
