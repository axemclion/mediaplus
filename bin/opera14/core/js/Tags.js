__FlashPlus__.tags = (function($) {
    var zStack = 100000;

    function bringUp() {
        zStack++;
        if (zStack >= 2147483647) {
            zStack = 10000;
        }
        return zStack;
    }

    function samePosition(elem, excludePadding) {
        elem = $(elem);
        var offset = elem.offset();
        return {
            "top": offset.top,
            "left": offset.left,
            "height": excludePadding ? elem.height() : elem.outerHeight(),
            "width": excludePadding ? elem.width() : elem.outerWidth(),
            "position": "absolute"
        }
    }

    function getSubstitute(original) {
        var originalPosition = original.position();
        var img = ($("<img></img>", {
            "class": "flashPlus-original",
            "id": "flashPlus-original" + new Date().getTime()
        })).css({
            "top": originalPosition.top,
            "left": originalPosition.left,
            "height": original.outerHeight(),
            "width": original.outerWidth(),
            "float": original.css("float"),
            "display": original.css("display"),
            "margin-left": original.css("margin-left"),
            "margin-right": original.css("margin-right"),
            "margin-bottom": original.css("margin-bottom"),
            "margin-top": original.css("margin-top"),
            "position": original.css("position"),
            "vertical-align": original.css("vertical-align")
        }).insertBefore(original);
        __FlashPlus__.setImage("core/images/1x1.png", img[0]);
        return img;
    }

    function holdPosition(elem) {
        if (!elem.data("flashPlus-original")) {
            var newOffset = samePosition(elem, true);
            if (elem.data("flashPlusProxy")) {
                var target = $("#" + elem.data("flashPlusProxy"));
            }
            var substitute = getSubstitute(target || elem);
            elem.data("flashPlus-original", substitute.attr("id")).css({
                "margin": 0
            }).css(newOffset);
            if (elem.parent()[0].nodeName !== "BODY") {
                elem.detach().insertBefore("#_flashPlus_Selector_commands_");
            }
            if (target) {
                target.detach().insertBefore("#_flashPlus_Selector_commands_");
            }
        }
    }

    // Required to put the proxy behind when the mouse is over the element
    $(".flashPlus-proxy").live("mouseenter", function(e) {
        $(this).data("z-index", $(this).css("z-index")).css("z-index", -100);
    });
    // Brings back the proxy to front when mouse leaves element
    $(".flashPlus-hasProxy").live("mouseleave", function(e) {
        var proxy = $("#proxy-" + $(this).attr("id"));
        // console.log("axe", proxy.data("z-index"));
        proxy.css("z-index", proxy.data("z-index") || "auto");
    });

    return {
        "holdPosition": holdPosition,
        "samePosition": samePosition,
        "bringUp": bringUp,
        "createProxyElem": function(elem, type) {
            elem.each(function() {
                var id = $(this).attr("id");
                if (!id) {
                    id = "flashPlus-" + new Date().getTime();
                    $(this).attr("id", id);
                }
                var proxy = $("#proxy-" + id)
                if (proxy.length === 0) {
                    var position = samePosition(this);
                    // expanding the border for IE.
                    position.top -= 1;
                    position.left -= 1;
                    position.width += 2;
                    position.height += 2;
                    proxy = $("<div></div>", {
                        "id": "proxy-" + id,
                        "class": "flashPlus-proxy flashPlus-tag-" + type
                    }).data("flashPlusProxy", id).css(position).appendTo("body");
                }
                elem.addClass("flashPlus-hasProxy");
            });
            return $(".flashPlus-tag-" + type);
        },

        "commonCommands": function() {
            var commands = {
                "close": {
                    "icon": "core/images/close.png",
                    "tooltip": "Close this panel",
                    "action": function() {
                        //__FlashPlus__.toggle();
                    }
                },
                "moveResize": {
                    "icon": "core/images/resize.png",
                    "tooltip": "Resize or Move this element on the page",
                    "action": function(elem, env) {
                        holdPosition(elem);
                        if (elem.css("position") === "fixed") {
                            var pinnedCss = elem.position();
                            pinnedCss.position = "absolute";
                            if (elem.data("flashPlusProxy")) {
                                $("#" + elem.data("flashPlusProxy")).css(pinnedCss);
                            }
                            elem.css(pinnedCss);
                        }
                        var padding = 3;
                        var moveThumb = $("#flashPlus_moveThumb");
                        if (moveThumb.length === 0) {
                            var moveProxyPosition = samePosition(elem);
                            moveProxyPosition["top"] -= padding;
                            moveProxyPosition["left"] -= padding;
                            moveProxyPosition["border"] = padding + "px DASHED #d35400";

                            var moveProxy = $("<div id = 'flashPlus_moveProxy' ></div>").css(moveProxyPosition).appendTo("body");
                            moveThumb = $("<div id = 'flashPlus_moveThumb'></div>").css({
                                "top": moveProxyPosition["height"],
                                "left": 3
                            }).addClass("flashPlus-commands");
                            var moveResize_close = $("<img>", {
                                "class": "flashplus-moveResize-close"
                            }).click(function() {
                                stopMoveResize();
                            });
                            var moveResize_move = $("<img>", {
                                "class": "flashPlus-moveResize-move",
                                "title": "Click and Drag this"
                            });
                            var moveResize_pin = $("<img>", {
                                "class": "flashPlus-moveResize-move",
                                "title": "Pin this element here"
                            }).bind("click", function() {
                                stopMoveResize();
                                var pinnedCss = elem.position();
                                pinnedCss.top -= window.scrollY;
                                pinnedCss.left -= window.scrollX;
                                pinnedCss.position = "fixed";
                                if (elem.data("flashPlusProxy")) {
                                    $("#" + elem.data("flashPlusProxy")).css(pinnedCss);
                                }
                                elem.css(pinnedCss);
                                return false;
                            })

                            moveThumb.append(moveResize_close).append(moveResize_move).append(moveResize_pin).appendTo(moveProxy).show();
                            __FlashPlus__.setImage("core/images/pin.png", moveResize_pin[0]);
                            __FlashPlus__.setImage("core/images/resize.png", moveResize_move[0]);
                            __FlashPlus__.setImage("core/images/ok.png", moveResize_close[0]);
                        }

                        // Bring the element to Top. If there is a proxy, bring
                        // it above element
                        if (elem.data("flashPlusProxy")) {
                            $("#" + elem.data("flashPlusProxy")).css("z-index", bringUp());
                        }
                        elem.css("z-index", bringUp());

                        // Move the actual element after the proxy
                        var followProxy = function() {
                                var offset = moveProxy.offset();
                                elem.css({
                                    "top": offset.top + padding,
                                    "left": offset.left + padding,
                                    "height": moveProxy.outerHeight() - (elem.outerHeight() - elem.height()) - (padding) * 2,
                                    "width": moveProxy.outerWidth() - (elem.outerWidth() - elem.width()) - (padding) * 2,
                                    "box-sizing": "content-box"
                                });
                                if (elem.data("flashPlusProxy")) {
                                    var target = $("#" + elem.data("flashPlusProxy"));
                                    target.css({
                                        "top": offset.top + padding,
                                        "left": offset.left + padding,
                                        "margin": 0,
                                        "box-sizing": "border-box",
                                        "height": elem.outerHeight(),
                                        "width": elem.outerWidth(),
                                        "position": "absolute"
                                    });
                                }
                            }
                            // followProxy();

                        moveProxy.draggable({
                            "handle": moveThumb,
                            "stop": followProxy
                        }).resizable({
                            "resize": function(event, ui) {
                                moveThumb.css("top", $(this).outerHeight());
                            },
                            "stop": followProxy
                        }).addClass("flashPlus-moveResize");

                        var stopMoveResize = function() {
                            moveProxy.draggable("destroy").resizable("destroy").removeClass("flashPlus-moveResize");
                            followProxy();
                            moveProxy.remove();
                            __FlashPlus__.nextAction(null);
                        }
                        return {
                            "message": "Stop Drag/Resize",
                            "action": stopMoveResize
                        };
                    }
                },
                "darken": {
                    "icon": "core/images/shadow.png",
                    "tooltip": "Turn the lights off and Darken the areas around this",
                    "action": function(elem) {
                        var position = samePosition(elem);
                        var docWidth = $(document).width(),
                            winWidth = $(window).width();
                        var docHeight = $(document).height(),
                            winHeight = $(window).height();
                        if ($("#flashPlus_darkener_top").length === 0) {
                            $("<div id = 'flashPlus_darkener_top' class ='flashPlus_darkener'></div>").appendTo("body");
                            $("<div id = 'flashPlus_darkener_left' class ='flashPlus_darkener'></div>").appendTo("body");
                            $("<div id = 'flashPlus_darkener_right' class ='flashPlus_darkener'></div>").appendTo("body");
                            $("<div id = 'flashPlus_darkener_bottom' class ='flashPlus_darkener'></div>").appendTo("body");
                        }
                        $("#flashPlus_darkener_top").css({
                            "top": 0,
                            "left": 0,
                            "width": (docWidth > winWidth ? docWidth : winWidth),
                            "height": position.top
                        });
                        $("#flashPlus_darkener_left").css({
                            "top": position.top,
                            "left": 0,
                            "width": position.left,
                            "height": position.height
                        });
                        $("#flashPlus_darkener_right").css({
                            "top": position.top,
                            "left": position.width + position.left,
                            "width": (docWidth > winWidth ? docWidth : winWidth) - (position.left + position.width),
                            "height": position.height
                        });

                        $("#flashPlus_darkener_bottom").css({
                            "top": position.top + position.height,
                            "left": 0,
                            "width": (docWidth > winWidth ? docWidth : winWidth),
                            "height": (docHeight > winHeight ? docHeight : winHeight) - (position.top + position.height)
                        });
                        $(".flashPlus_darkener").show();
                        return {
                            "message": "Switched on the lights again",
                            "onAction": "Hit 'ESC' key or activate MediaPlus again to restore",
                            "action": function() {
                                $(".flashPlus_darkener").hide();
                            }
                        };
                    }
                },
                "maximize": {
                    "icon": "core/images/fullscreen.png",
                    "tooltip": "Maximize this to full screen",
                    "action": function(elem) {
                        var originalPosition = samePosition(elem, true);
                        holdPosition(elem);
                        if (elem.data("flashPlusProxy")) {
                            elem = $("#" + elem.data("flashPlusProxy"));
                        }
                        elem.css(originalPosition).css("margin", 0);
                        // TODO: Does not work if element.style has !important.
                        // Remove those
                        $("body").addClass('flashPlus-fullscreen-body');
                        elem.addClass("flashPlus-fullscreen");
                        window.scrollTo(0, 0);
                        return {
                            "onAction": "Hit 'ESC' key or activate MediaPlus again to restore",
                            "message": "Restored to original size",
                            "action": function() {
                                elem.removeClass("flashPlus-fullscreen");
                                $("body").removeClass('flashPlus-fullscreen-body');

                            }
                        }
                    }
                },
                "trash": {
                    "icon": "core/images/Trash.png",
                    "tooltip": "Remove this element from the page",
                    "action": function(elem) {
                        holdPosition(elem);
                        if (elem.data("flashPlusProxy")) {
                            $("#" + elem.data("flashPlusProxy")).remove()
                        }
                        elem.remove();
                    }
                }
            };

            return commands;
        }
    }
})(jQuery);

(function($) {
    __FlashPlus__.registerTag((function() {
        return {
            "name": "iFrame",
            "init": function() {
                return $("iframe");
                // __FlashPlus__.tags.createProxyElem($("iframe"), "iframe");
            },
            "commands": $.extend({}, __FlashPlus__.tags.commonCommands(), {
                "popout": {
                    "icon": "core/images/popout.png",
                    "tooltip": "Pop Out to a New Window",
                    "action": function(elem, env) {
                        env.newWindow({
                            "url": elem[0].src
                        });
                    }
                }
            })
        };
    })());

    __FlashPlus__.registerTag((function() {
        return {
            "name": "Flash",
            "init": function() {
                var tags = ["embed"];
                if ($.browser.opera || $.browser.safari || $.browser.webkit) {
                    tags.push("object[type!=application\\/x-silverlight-2]:not(:has(embed))");
                }
                if ($.browser.mozilla) {
                    tags.push("object[data], object[type='application/x-shockwave-flash']");
                }
                if ($.browser.msie) {
                    tags.push("object[type!=application\\/x-silverlight-2]:has(embed)");
                }
                return __FlashPlus__.tags.createProxyElem($(tags.join()), "flash");
            },
            "commands": $.extend({}, __FlashPlus__.tags.commonCommands(), {
                "popout": {
                    "icon": "core/images/popout.png",
                    "tooltip": "Pop Out to a New Window",
                    "action": function(elem, env) {
                        var embed = $("#" + $(elem).data("flashPlusProxy"));
                        var copy = embed.clone().wrap();
                        copy.css({
                            "top": "0",
                            "left": "0",
                            "width": "100%",
                            "height": "100%",
                            "position": "absolute",
                            "z-index": "1000000000",
                            "margin": "0",
                            "padding": "0",
                            "border": "none",
                            "background-color": "#000"
                        });
                        env.newWindow({
                            "url": document.location.href,
                            "content": copy.wrap("<div></div>").parent().html()
                        });
                    }
                },
                "download": {
                    "icon": "core/images/download.png",
                    "tooltip": "Download Flash Content on this page using external tools",
                    "action": function(elem, env) {
                        var embed = $("#" + $(elem).data("flashPlusProxy"));
                        var src = ["<h1>MediaPlus - Download Media Content</h1>"];
                        src.push("<h3>Link to swf file</h3>");
                        src.push("<ul>");
                        var swf = [embed.attr("src"), embed.attr("data"), embed.children("param[name=movie]").attr("value")];
                        $.each(swf, function(i) {
                            if (!swf[i] && typeof swf[i] !== "string")
                                return;
                            if (swf[i].indexOf("http:") === 0) {
                                src.push("<li><a target = '_blank' href = '", swf[i], "'>", swf[i], "</a></li>");
                            } else {
                                src.push("<li><a target = '_blank' href = '", document.location.href, "/../", swf[i], "'>", swf[i], "</a></li>");
                            }
                        });
                        src.push("</ul>");
                        src.push("<h3>Click on links below to download content</h3>");
                        src.push("<ul>");
                        src.push("<li><a target = '_blank' href = 'http://keepvid.com/?url=", document.location.href, "'>KeepVid</a></li>");
                        src.push("<li><a target = '_blank'  href = 'http://savevid.com/?url=", document.location.href, "'>SaveVid</a></li>");
                        src.push("<li><a target = '_blank'  href = 'http://www.videodownload.org/?url=", document.location.href, "'>VideoDownload</a></li>");
                        src.push("</ul>")
                        src.push("<br/><span>MediaPlus does not endorse any of the sites above. Exercise caution while downloading content from the sites</span>")
                        env.newWindow({
                            "url": document.location.href,
                            "content": src.join("")
                        });
                    }
                }
            })
        };
    })());

    __FlashPlus__.registerTag(function() {
        return {
            "name": "Silverlight",
            "init": function() {
                return __FlashPlus__.tags.createProxyElem($("object[type=application\\/x-silverlight-2]"), "silverlight");
            },
            "commands": __FlashPlus__.tags.commonCommands()
        };
    }());

    __FlashPlus__.registerTag(function() {
        return {
            "name": "Canvas",
            "init": function() {
                return __FlashPlus__.tags.createProxyElem($("canvas"), "canvas");
            },
            "commands": __FlashPlus__.tags.commonCommands()
        };
    }());

    __FlashPlus__.registerTag((function() {
        var tag = {
            "name": "Video",
            "init": function() {
                return $("video");
            },
            "commands": $.extend({}, __FlashPlus__.tags.commonCommands(), {
                "download": {
                    "icon": "core/images/download.png",
                    "tooltip": "Download this",
                    "action": function(elem, env) {
                        var src = ["<h1>MediaPlus - Download Media Content</h1>", "<h3>Click on links below to download content</h3>"];
                        src.push(elem[0].src, "<ul>");
                        elem.find("source").each(function() {
                            src.push("<li><a href = '", $(this)[0].src, "'>", $(this).attr("src"), "</a></li>");
                        });
                        src.push("</ul>")
                        env.newWindow({
                            "url": document.location.href,
                            "content": src.join("")
                        });
                    }
                }
            })
        };

        return tag;
    })());
}(jQuery));