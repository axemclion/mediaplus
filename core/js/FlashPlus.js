/**
 * @param options
 * @returns
 */
jQuery.noConflict();
if (typeof __FlashPlus__ === "undefined") {
    __FlashPlus__ = (function($){
        var config = {}, nextAction = null, selectedElement = null, notify = function(){
        };
        var tags = tags || {};
        
        /**
         * Initialized the element selector engine. Adds the required selection
         * divs.
         */
        var selectorCommands = $("div#_flashPlus_Selector_commands_");
        if (selectorCommands.length === 0) {
            $("body").append($("<div id = '_flashPlus_Selector_commands_'></div>").addClass("flashPlus-commands"));
            $("body").append($("<div id = '_flashPlus_Selector_top' class = 'flashPlus-selector'></div>"));
            $("body").append($("<div id = '_flashPlus_Selector_bottom' class = 'flashPlus-selector'></div>"));
            $("body").append($("<div id = '_flashPlus_Selector_right' class = 'flashPlus-selector'></div>"));
            $("body").append($("<div id = '_flashPlus_Selector_left' class = 'flashPlus-selector'></div>"));
        }
        
        $(".flashPlus-elem").live("mouseenter", function(){
            if (config.suspended || nextAction) {
                return;
            }
            var elem = $(this);
            var offset = elem.offset();
            
            // Draw the selector lines
            $("#_flashPlus_Selector_top").css({
                "top": offset.top - 4,
                "left": offset.left - 4,
                "width": elem.outerWidth() + 4
            }).show();
            $("#_flashPlus_Selector_left").css({
                "top": offset.top - 4,
                "left": offset.left - 4,
                "height": elem.outerHeight() + 4
            }).show();
            $("#_flashPlus_Selector_right").css({
                "top": offset.top - 4,
                "left": elem.outerWidth() + offset.left + 2,
                "height": elem.outerHeight() + 4
            }).show();
            $("#_flashPlus_Selector_bottom").css({
                "top": elem.outerHeight() + offset.top + 2,
                "left": offset.left - 2,
                "width": elem.outerWidth() + 4
            }).show();
            
            // If element is already the selected element, then the
            // commands would have already een drawn
            if (!selectedElement || selectedElement.attr("id") != elem.attr("id")) {
                // console.log("Drawing commands container again", elem);
                // Draw the commands Comtainer
                var commandsContainer = $("<div></div>");
                var commandsList = tags[elem.data("flashPlusTag")] ? (tags[elem.data("flashPlusTag")].commands || {}) : {};
                for (var command in commandsList) {
                    var img = $("<img></img>", {
                        "title": commandsList[command].tooltip,
                        "name": command,
                        "alt": command
                    }).data("flashPlusTagCommand", command).appendTo(commandsContainer);
                    config.env.image(commandsList[command].icon, img[0]);
                }
                commandsContainer.append(elem.data("flashPlusTag"));
                $("div#_flashPlus_Selector_commands_").empty().append(commandsContainer);
            }
            
            $("div#_flashPlus_Selector_commands_").css({
                "left": offset.left + 3,
                "top": offset.top + elem.outerHeight() + 4
            }).show();
            selectedElement = elem;
        });
        
        $("div#_flashPlus_Selector_commands_ img").live("click", function(){
            $("div.flashPlus-selector").hide();
            $("div#_flashPlus_Selector_commands_").hide();
            var tag = tags[selectedElement.data("flashPlusTag")];
            var command = $(this).data("flashPlusTagCommand");
            // console.log("Running", command, "on", tag);
            (tag && typeof tag.beforeCommand === "function") && tag.beforeCommand(command, selectedElement, config.env);
            nextAction = tag.commands[command].action(selectedElement, config.env);
            if (nextAction && nextAction.onAction) {
                flashPlus.notify(nextAction.onAction, 2000);
            }
        });
        
        $(document).bind("scroll", unselectElem).bind("keyup", function(e){
            // console.log("Captured in extension", e.keyCode);
            if (e.keyCode === 27) {// escape
                doNextAction();
            }
        });
        
        function unselectElem(){
            selectedElement = null;
            $(".flashPlus-selector, #_flashPlus_Selector_commands_").hide();
        }
        
        function doNextAction(){
            unselectElem();
            if (nextAction && nextAction.action && typeof nextAction.action === "function") {
                flashPlus.notify(nextAction.message);
                nextAction = nextAction.action();
            }
            return nextAction;
        }
        
        var flashPlus = {
            "getTags": function(){
                return tags;
            },
            "registerTag": function(tag){
                // console.log("Registering Tag", tag.name);
                tag.init().addClass("flashPlus-elem").data("flashPlusTag", tag.name);
                tags[tag.name] = tag;
            },
            
            /**
             * Initialized Flash Plus
             *
             * @param {Object}
             *            options - [base, commands, message]
             */
            "init": function(options){
                $.extend(config, options);
                var head = document.getElementsByTagName("head")[0] || document.documentElement;
                config.env.dependencies(options.commands);
                config.suspended = false;
                flashPlus.notify = config.notify || console.log ||
                function(){
                };
                flashPlus.notify("Move your mouse over videos, images or flash to start the plugin", 10000);
            },
            
            /**
             * Returns the next action if any. If there is no next action,
             * returns null
             */
            "nextAction": function(action){
                if (typeof action !== "undefined") {
                    nextAction = action;
                }
                if (nextAction) {
                    return $.extend({}, nextAction, {
                        "perform": doNextAction
                    });
                }
                return null;
            },
            
            "refreshTags": function(){
                unselectElem();
                config.suspended = false;
                for (tag in tags) {
                    flashPlus.registerTag(tags[tag]);
                }
                flashPlus.notify("Rescanned the page for Media Content");
            },
            
            "stopPlugin": function(canStop){
                if (canStop === false) {
                    config.suspended = false;
                    flashPlus.notify("MediaPlus started again");
                }
                else {
                    config.suspended = true;
                    flashPlus.notify("MediaPlus stopped. Click on MediaPlus to activate it again");
                }
                unselectElem();
            },
            
            "setImage": function(url, img){
                return config.env.image(url, img);
            }
        };
        return flashPlus;
    })(jQuery);
}
