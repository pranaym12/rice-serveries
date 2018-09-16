
$(function(){
    $('#baker').click(function(){
        bakerUpdate();
    });
    $('#north').click(function(){
        northUpdate();
    });
    $('#seibel').click(function(){
        seibelUpdate();
    });
    $('#sid').click(function(){
        sidUpdate();
    });
    $('#south').click(function(){
        southUpdate();
    });
    $('#west').click(function(){
        westUpdate();
    });
});

function bakerUpdate(){
    $('#servery-name').text("Baker");
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
};