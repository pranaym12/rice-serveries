const baker = new Servery("Baker", {"Friday": false, "Saturday": false, "Sunday": false })
const sid = new Servery("SidRich", {"Friday": false, "Saturday": false, "Sunday": false })
const south = new Servery("South", {"Friday": true, "Saturday": false, "Sunday": true })
const west = new Servery("West", {"Friday": true, "Saturday": false, "Sunday": true })
const north = new Servery("North", {"Friday": true, "Saturday": true, "Sunday": true })
const seibel = new Servery("Seibel", {"Friday": true, "Saturday": true, "Sunday": true })

var allServeries = {Baker:baker, SidRich: sid, South: south, West: west, North: north, Seibel: seibel};

$(function(){
    // serveryUpdate(baker);
    initialServeryUpdate();
    $('#Baker').click(function(){
        serveryUpdate(baker);
    });
    $('#North').click(function(){
        serveryUpdate(north);
    });
    $('#Seibel').click(function(){
        serveryUpdate(seibel);
    });
    $('#Sid').click(function(){
        serveryUpdate(sid);
    });
    $('#South').click(function(){
        serveryUpdate(south);
    });
    $('#West').click(function(){
        serveryUpdate(west);
    });
});
function initialServeryUpdate(){
    chrome.storage.sync.get(['servery'], function(result) {
        if(result.servery){
            serveryUpdate(allServeries[result.servery]);
        } 
        else{
            serveryUpdate(seibel);
        }
      });
}
function serveryUpdate(servery){
    //Set servery header and local storage equal to servName
    let servName = servery.name;
    if(servName == "SidRich"){
        //Keep "SidRich" everywhere else, but I need to name the header "Sid Rich"
        $('#servery-name').text("Sid Rich");
    }
    else{
        $('#servery-name').text(servName);
    }
    chrome.storage.sync.set({'servery': servery.getName()}, function(){});

    var d = new Date();
    timeNow = d.getTime();
    console.log(currentTime());
    
    if(typeof localStorage["time"] == "undefined" || timeNow - localStorage["time"] > 60000){
        console.log("downloading");
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "http://dining.rice.edu/", true);
        xhr.overrideMimeType("text/html");
        xhr.onreadystatechange = function() {
            if(xhr.readyState === 4 && xhr.status === 200) {
                //readyState = 4 says "request finished and response is ready"
                //status = 200 says "oK" 
                let parser = new DOMParser();
                let data = parser.parseFromString(xhr.responseText, "text/html");
                serveriesStr = ["Baker", "Seibel", "SidRich", "North", "South", "West"];
                serveriesLength = serveriesStr.length;
                let serveriesDict = {}
                for (var i = 0; i < serveriesLength; i++) {
                    let thisServery = searchServeries(serveriesStr[i], data);
                    if(thisServery){
                        serveriesDict[ serveriesStr[i] ] = thisServery;
                    }
                }
                chrome.storage.sync.set({'servery_menus': serveriesDict}, function() {
                    var foodString = ""; //foodList converted to string
                    if(serveriesDict[servName]){
                        var foodList = serveriesDict[servName]; //foods in array form
                        for(var i=0; i<foodList.length; i++){
                            //Capitalize the first letter of the string
                            var foodCap = foodList[i].charAt(0).toUpperCase() + foodList[i].slice(1)
                            foodString += "<p>"+foodCap + "</p>";
                            //foodString += "<p>"+foodList[i] + "</p>";
                        }
                    }
                    $('#list-of-foods').html(foodString);
                    //console.log(serveriesDict);
                });
            }
        };
        xhr.send()

        localStorage["time"] = timeNow;
        //console.log(localStorage["time"]);
    }
    else{ //console.log("not downloading");
        let foodString = ""; //foodList converted to string
        chrome.storage.sync.get(['servery_menus'], function(result) {
            //console.log(result.servery_menus);
            let serveriesDict = result.servery_menus;
            //console.log(serveriesDict);
            if(serveriesDict[servName]){
                var foodList = serveriesDict[servName]; //foods in array form
                for(var i=0; i<foodList.length; i++){
                    foodString += "<p>"+foodList[i] + "</p>";
                }
            }
            $('#list-of-foods').html(foodString);
        });
        
    }
    
    console.log("----------------------------------------");
    //console.log( Object.keys(servery) );
    console.log("isOpen function: "+ typeof servery.isOpen+", \ngetName function: "
    +typeof servery.getName+ ", \nservery.name: "+typeof servery.name);    
    
    $('#servery-message').text(servery.serveryMessage());
};

function searchServeries(serveryStr, data){
    let food = data.querySelector("#"+serveryStr).parentElement;
    let noFood = food.querySelector(".nothere");
    if (noFood == null) {
        let divItems = food.querySelectorAll("div.menu-item");
        foodArray = []
        for (let item of divItems) {
            foodArray.push(item.textContent);
        }
        return foodArray;
        
    } else {
        //console.log(serveryStr + " closed");
    }
}

function currentTime(){
    /*
    Outputs the current time as a string of the form 9:45AM
    */
    var d = new Date();
    let hour = d.getHours();
    let minInt = d.getMinutes();
    let ampm = "";
    if(hour < 12){
        ampm = "AM";
        if(hour == 0){
            hour = 12;
        }
        ;
    }
    else{
        ampm = "PM";
        if(hour > 12) {
            hour -= 12;
        }
    }
    let minString = "";
    if(minInt < 10){
        minString = "0" + minInt.toString();
    }
    else{
        minString = minInt.toString();
    }
    return hour.toString() + ":"+minString+" "+ampm;
}
