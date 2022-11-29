(function(){
    self.on("loading", function(){
        $("#loading").show();
        $(".panel").hide();
    });
    
    self.on("message", function(data){
        //console.log("Inside Panel Content Script", JSON.stringify(data));
        $(".panel").hide();
        $("#loading").hide();
        $("#" + data.action).show();
    })
    
    $("button").live("click", function(){
        self.postMessage($(this).attr("id"));
    });
})();
