(function(){
    var timerHandle = window.setInterval(function(){
        if (typeof __FlashPlus__ !== "undefined" && typeof __FlashPlus__.getTags()["Video"] !== "undefined") {
            window.clearInterval(timerHandle);
            (function($){
                var domain = function(url){
                    url = (typeof url === "string" ? url : "");
                    try {
                        var protocol = url.indexOf("://") + "://".length;
                        var result = url.substring(0, url.indexOf("/", protocol) === -1 ? url.length : url.indexOf("/", protocol));
                    } 
                    catch (e) {
                        result = NaN;
                    }
                    return result;
                }
                
                __FlashPlus__.registerTag({
                    "name": "Image",
                    "init": function(){
                        return $("img").filter(function(){
                            return ($(this).height() < 90 || $(this).width() < 90) ? false : true;
                        });
                    },
                    "commands": $.extend({}, __FlashPlus__.tags.commonCommands(), {
                        "zoom": {
                            "icon": "core/images/zoom.png",
                            "tooltip": "Zoom Image",
                            "action": function(elem, env){
                                var elemPos = elem.offset();
                                var zoomFactor = 1.5;
                                var lens = 150;
                                var zoomer = $("<div></div>").css({
                                    "top": elemPos.top,
                                    "left": elemPos.left,
                                    "width": lens,
                                    "height": lens,
                                    "position": "absolute",
                                    "border-radius": lens / 2,
                                    "border": "SOLID 2px BLACK",
                                    "z-index": 2147483647,
                                    "box-shadow": "0 0 5px 5px WHITE inset",
                                    "overflow": "hidden"
                                }).appendTo("body");
                                var zoomImage = $("<img>", {
                                    "src": elem.attr("src"),
                                    "class": "__flashPlus__action__zoom"
                                }).css({
                                    "width": elem.width() * zoomFactor,
                                    "height": elem.height() * zoomFactor,
                                    "position": "relative"
                                }).appendTo(zoomer);
                                
                                var bgPosition = function(){
                                    var zoomerPos = zoomer.offset();
                                    zoomImage.css({
                                        "top": -(zoomerPos.top - elemPos.top) * zoomFactor - lens / 4,
                                        "left": -(zoomerPos.left - elemPos.left) * zoomFactor - lens / 4
                                    });
                                }
                                __FlashPlus__.notify("Hit 'ESC' key or click the bookmarklet stop zoom");
                                zoomer.draggable({
                                    "drag": bgPosition,
                                    "stop": bgPosition,
                                    "containment": [elemPos.left - lens / 4, elemPos.top - lens / 4, elemPos.left + elem.width() - lens * 0.75, elemPos.top + elem.height() - lens * 0.75]
                                });
                                return {
                                    "message": "Stop Zoom",
                                    "action": function(){
                                        zoomer.remove();
                                    }
                                }
                            }
                        },
                        "enhance": {
                            "icon": "core/images/enhance.png",
                            "tooltip": "Add Effects like Blur, Brightness or Sepia",
                            "action": function(elem, env){
                                var enhancer = Enhancer(elem, {
                                    "width": elem.width(),
                                    "height": elem.height()
                                });
                                
                                var close = function(){
                                    if (elem.data("src")) {
                                        elem.attr("src", elem.data("src"));
                                    }
                                    enhancer.close();
                                }
                                
                                $("<button>x</button>").appendTo(enhancer.controller.header).click(close);
                                $("<button>Save</button>").prependTo(enhancer.controller.header).click(function(){
                                    var saveWindow = window.open(enhancer.canvas[0].toDataURL());
                                });
                                $("<span>Image  </span>").prependTo(enhancer.controller.header)
                                if (domain(elem[0].src) !== domain(document.location.href)) {
                                    enhancer.context.font = "10pt Arial";
                                    enhancer.context.strokeText("Converting Image to Data URI", 0, elem.height() / 2);
                                    enhancer.message("Please wait while this image is convereted to a data:uri");
                                    elem.data("src", elem.attr("src"));									
                                    var url = ["//featherservices.aviary.com/imgjsonpserver.aspx?_=1319942159081"];
									url.push("url=" + elem.attr("src"));
									env.xhr(url.join("&"), function(data, status){
										elem.attr("src", JSON.parse(data).data);
										enhancer.message("Image is ready for use");
										window.setTimeout(enhancer.paint, 1000);
									});
                                }
                                else {
                                    enhancer.paint();
                                }
                                return {
                                    "message": "Restored Image",
                                    "action": close
                                }
                            }
                        }
                    })
                });
                
                var videoTag = __FlashPlus__.getTags()["Video"];
                videoTag.commands["enhance"] = {
                    "icon": "core/images/enhance.png",
                    "tooltip": "Add Effects like Blur, Brightness or Sepia",
                    "action": function(elem){
                        var dim = {};
                        if (elem[0].videoWidth / elem[0].videoHeight < elem.width() / elem.height()) {
                            // height is set
                            dim.top = 0;
                            dim.height = elem.height();
                            dim.width = dim.height * elem[0].videoWidth / elem[0].videoHeight;
                            dim.left = (elem.width() - dim.width) / 2;
                        }
                        else {
                            // width is set
                            dim.left = 0;
                            dim.width = elem.width();
                            dim.height = dim.width * elem[0].videoHeight / elem[0].videoWidth;
                            dim.top = (elem.height() - dim.height) / 2;
                        }
                        var enhancer = Enhancer(elem, dim);
                        var video = elem[0];
                        function drawControls(pixasticController){
                            var header = pixasticController.header;
                            
                            $("<button>Pause</button>").prependTo(header).click(function(){
                                video.pause();
                            });
                            $("<button>Play</button>").prependTo(header).click(function(){
                                video.play();
                            });
                            $("<span>Video  </span>").prependTo(header);
                            
                            $("<button>x</button>").appendTo(header).click(close);
                            
                            var timeline = $("<div id = 'seeker'></div>").css({
                                "width": "85%",
                                "margin": "0.5em auto"
                            }).slider({
                                "change": function(){
                                    try {
                                        video.currentTime = $(this).slider("value");
                                    } 
                                    catch (e) {
                                        // Invalid state of video
                                    }
                                },
                                "min": 0,
                                "max": video.duration
                            }).appendTo(header);
                        }
                        
                        drawControls(enhancer.controller);
                        function paint(){
                            if (video.paused || video.ended) {
                                return;
                            }
                            enhancer.paint(function(){
                                window.setTimeout(paint, 0);
                            });
                        }
                        paint();
                        
                        function showSeeker(){
                            $("#seeker").slider("value", video.currentTime);
                            if (!video.paused || !video.ended) {
                                window.setTimeout(showSeeker, 1000);
                            }
                        }
                        showSeeker();
                        
                        video.addEventListener("play", function(){
                            paint();
                            showSeeker();
                        }, false);
                        
                        function close(){
                            enhancer.close();
                            paint = function(){
                            };
                        }
                        
                        return {
                            "message": "Restored video",
                            "action": close
                        }
                    }
                };
                __FlashPlus__.registerTag(videoTag);
                //__FlashPlus__.refreshTags();
            }(jQuery));
        }
    }, 1000);
    
    Enhancer = function(elem, dim){
        var $ = jQuery;
        dim.top = dim.top || 0;
        dim.left = dim.left || 0;
        __FlashPlus__.tags.holdPosition(elem);
        elem.css("z-index", __FlashPlus__.tags.bringUp());
        var elemOffset = elem.offset();
        var id = elem.attr("id");
        if (!id) {
            id = "flashPlus-canvas-" + new Date().getTime();
            elem.attr("id", id);
        }
        var canvas = $("<canvas>", {
            "id": "canvas-" + id
        }).attr({
            "width": elem.width(),
            "height": elem.height()
        }).css({
            "position": "absolute",
            "top": elemOffset.top + parseInt(0 + elem.css("padding-top"), 10) + parseInt(0 + elem.css("border-top-width"), 10),
            "left": elemOffset.left + parseInt(0 + elem.css("padding-left"), 10) + parseInt(0 + elem.css("border-left-width"), 10),
            "z-index": elem.css("z-index")
        }).insertBefore(elem);
        
        var context = canvas[0].getContext('2d');
        
        var resultCanvas = $("#flashPlus-video-resultCanvas" + id);
        if (resultCanvas.length === 0) {
            resultCanvas = $("<canvas>", {
                "id": "flashPlus-video-resultCanvas" + id
            }).appendTo("body").hide();
        }
        
        var paint = function(callback){
            (typeof callback !== "function") &&
            (callback = function(){
            });
            try {
                context.drawImage(elem[0], dim.left, dim.top, dim.width, dim.height);
                pixasticController.config.args["resultCanvas"] = resultCanvas[0];
                var x = Pixastic.process(canvas[0], pixasticController.config.action, pixasticController.config.args, callback);
                if (x === false) {
                    throw new Error(x);
                }
            } 
            catch (e) {
                pixasticController.message(["Could not manipulate image dues to", e.message, "(", e.name, ")"].join(" "));
                callback();
            }
        };
        
        var pixasticController = new PixasticController(paint);
        pixasticController.controls.css({
            "top": elemOffset.top + elem.height() + 40,
            "left": elemOffset.left
        });
        $("<button>Reset</button>").click(function(){
            pixasticController.config = {
                "action": "sharpen",
                "args": {
                    "amount": 0
                }
            }
            paint();
        }).appendTo(pixasticController.header);
        
        elem.hide();
        //elem.css("opacity", 0.2);
        return {
            "close": function(){
                elem.show();
                canvas.remove();
                resultCanvas.remove();
                pixasticController.controls.remove();
                __FlashPlus__.nextAction(null);
            },
            "paint": paint,
            "controller": pixasticController,
            "canvas": resultCanvas,
            "context": context,
            "message": pixasticController.message
        };
    };
})();
