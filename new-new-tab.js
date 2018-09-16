$(function(){
    initialServeryUpdate();
    //$('#servery-name').text(localStorage['servery-key']);
    $('#baker').click(function(){
        //bakerUpdate();
        serveryUpdate("Baker");
    });
    $('#north').click(function(){
        //northUpdate();
        serveryUpdate("North");
    });
    $('#seibel').click(function(){
        //seibelUpdate();
        serveryUpdate("Seibel");
    });
    $('#sid').click(function(){
        //sidUpdate();
        serveryUpdate("Sid Rich");
    });
    $('#south').click(function(){
        //southUpdate();
        serveryUpdate("South");
    });
    $('#west').click(function(){
        //westUpdate();
        serveryUpdate("West");
    });
});
function initialServeryUpdate(){
    if (localStorage['servery-key']){
        serveryUpdate(localStorage['servery-key']);
    }
    else{
        serveryUpdate("Seibel");
    }
}
function serveryUpdate(servName){
    $('#servery-name').text(servName);
    localStorage['servery-key'] = servName;
};

/*function bakerUpdate(){
    $('#servery-name').text("Baker");
    localStorage['servery-key'] = "Baker";
};function northUpdate(){
    $('#servery-name').text("North");
};function seibelUpdate(){
    $('#servery-name').text("Seibel");
};function sidUpdate(){
    $('#servery-name').text("Sid Rich");
};function southUpdate(){
    $('#servery-name').text("South");
};function westUpdate(){
    $('#servery-name').text("West");
};*/
