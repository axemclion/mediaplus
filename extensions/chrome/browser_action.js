$("#loading").show();
var gotResponse = false;
window.setTimeout(function() {
    if (!gotResponse) {
        $("#loading").hide();
        $("#loadError").show();
        window.setTimeout(function() {
            !gotResponse && window.close();
        }, 10000);
    }
}, 5000);

chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    var tab = tabs[0];
    chrome.tabs.sendMessage(tab.id, {
        "action": "getNextAction"
    }, function(response) {
        gotResponse = true;
        $(".panel").hide();
        $("#loading").hide();
        switch (response.action) {
            case "loadFlashPlus":
                $("#loadFlashPlus").show();
                break;
            case "showAction":
                $("#showAction").show();
                break;
            case "showOptions":
                $("#showOptions").show();
                break;
            default:
                break;
        }
    });
});

$("button").on("click", function() {
    var self = $(this);
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            "action": self.attr("id")
        }, function(response) {
            window.close();
        });
    });
});
