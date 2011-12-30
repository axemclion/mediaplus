(function(){
    var id = "__MediaPlus__" + (Math.random() + "").substring(3)
    document.write("<span id = '" + id + "'></span>")
    
    var thisScriptName = "extensions/bookmarklets/install.js";
    
    
    var thisScript = document.getElementById(id);
    while (thisScript !== null && thisScript.nodeName !== "SCRIPT") {
        thisScript = thisScript.previousSibling;
    }
    
    var img = document.createElement('img');
    img.src = thisScript.src;
    var thisScriptSrc = img.src;
    img.src = null;
    
    var baseUrl = thisScriptSrc;
    baseUrl = baseUrl.substring(baseUrl.indexOf("://") + 1);
    baseUrl = baseUrl.substring(0, baseUrl.indexOf(thisScriptName));
    var params = thisScriptSrc.substring(thisScriptSrc.indexOf("?") + 1).split("&");
    var bookmarklet = "javascript:document.title='(Loading)'+document.title;document.getElementsByTagName('head')[0].appendChild(document.createElement('script')).setAttribute('src','__SRC__');";
    
    var options = {
        "type": "table"
    };
    for (var i = 0; i < params.length; i++) {
        var index = params[i].indexOf("=");
        options[params[i].substring(0, index)] = params[i].substring(index + 1);
    }
    
    var versions = {
        "mp-tip": {
            "src": baseUrl + "extensions/bookmarklets/MediaPlus.js?name=tip",
            "desc": "MediaPlus &#945;"
        },
        "mp-beta": {
            "src": baseUrl + "extensions/bookmarklets/MediaPlus.js?r=bookmarkletBeta",
            "desc": "MediaPlus  &#946;"
        },
        "mp-stable": {
            "src": baseUrl + "extensions/bookmarklets/MediaPlus.js?r=bookmarklet",
            "desc": "MediaPlus"
        }
    };
    
    var views = {
        "single": function(v){
            v = versions[v] || versions[options.version];
            if (!v) {
                v = versions["mp-stable"];
            }
            return "<a title = \"Drag and drop this in your bookmarklets/favourites toolbar.\" href = \"" + bookmarklet.replace(/__SRC__/g, v.src) + "\"> " + v.desc + "</a>"
        },
        "table": function(v){
            v = v || options.version;
            if (!v) {
                v = "all";
            }
            var result = ["<table cellspacing = 0 cellpadding= 0 style = 'text-align:center'>"];
            result.push("<tr><th colspan = '3'>MediaPlus</th></tr><tr>");
            result.push("<td>" + this.single("mp-stable") + " <br/><sub>(Stable)</sub></td>");
            result.push("<td>" + this.single("mp-beta") + "<br/><sub>(Beta)</sub></td>");
            result.push("<td>" + this.single("mp-tip") + "<br/><sub>(Alpha)</sub></td>");
            result.push("</tr>");
            
            result.push("</table>");
            return result.join("");
        }
    }
    
    // Writing the actual bookmarklet
    if (typeof views[options.type] === "function") {
        document.write(views[options.type]());
    }
})();
