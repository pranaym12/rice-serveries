const baker = new Servery("Baker", {"Friday": false, "Saturday": false, "Sunday": false })
const sid = new Servery("SidRich", {"Friday": false, "Saturday": false, "Sunday": false })
const south = new Servery("South", {"Friday": true, "Saturday": false, "Sunday": true })
const west = new Servery("West", {"Friday": true, "Saturday": false, "Sunday": true })
const north = new Servery("North", {"Friday": true, "Saturday": true, "Sunday": true })
const seibel = new Servery("Seibel", {"Friday": true, "Saturday": true, "Sunday": true })
var reloadMin = 5 //number of minutes to wait between reloads
var allServeries = {Baker:baker, SidRich: sid, South: south, West: west, North: north, Seibel: seibel};
var noFoodMessage = "There is no menu available yet on dining.rice.edu."

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
    //Shortcuts to call each function: 1-6 or a-f keys
    Mousetrap.bind('1', function(){serveryUpdate(baker);});
    Mousetrap.bind('2', function(){serveryUpdate(north);});
    Mousetrap.bind('3', function(){serveryUpdate(seibel);});
    Mousetrap.bind('4', function(){serveryUpdate(sid);});
    Mousetrap.bind('5', function(){serveryUpdate(south);});
    Mousetrap.bind('6', function(){serveryUpdate(west);});

    Mousetrap.bind('a', function(){serveryUpdate(baker);});
    Mousetrap.bind('s', function(){serveryUpdate(north);});
    Mousetrap.bind('d', function(){serveryUpdate(seibel);});
    Mousetrap.bind('f', function(){serveryUpdate(sid);});
    Mousetrap.bind('g', function(){serveryUpdate(south);});
    Mousetrap.bind('h', function(){serveryUpdate(west);});

    Mousetrap.bind('q', function(){serveryUpdate(baker);});
    Mousetrap.bind('w', function(){serveryUpdate(north);});
    Mousetrap.bind('e', function(){serveryUpdate(seibel);});
    Mousetrap.bind('r', function(){serveryUpdate(sid);});
    Mousetrap.bind('t', function(){serveryUpdate(south);});
    Mousetrap.bind('y', function(){serveryUpdate(west);});
    
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
    //set current time, and good-morning/afternoon, and image
    setTimeDaytimeImage();
    //Set servery header and local storage equal to servName
    let servName = servery.getName();
    if(servName == "SidRich"){
        //Keep "SidRich" everywhere else, but I need to name the header "Sid Rich"
        $('#servery-name').text("SID RICH");
    }
    else{
        $('#servery-name').text(servName.toUpperCase());
    }
    chrome.storage.sync.set({'servery': servery.getName()}, function(){});

    //set prompt in HTML equal to promptMessage in chrome storage
    //(later, if program downloads, set HTML again to new promptMessage)
    var promptMessage = "";
    var whichMealMessage = "";
    chrome.storage.sync.get(['prompt', 'meal'], function(result){
        //console.log("chrome storage of meal: " + result.meal);
        promptMessage = result.prompt;
        $('#prompt').text(promptMessage);
        whichMealMessage = result.meal;
        $('#which-meal').text(whichMealMessage);

    })
    $('#servery-message').text(servery.serveryMessage());

    var d = new Date();
    timeNow = d.getTime();

    if(typeof localStorage["time"] == "undefined" || timeNow - localStorage["time"] > reloadMin*60000){
        console.log("updating from dining.rice.edu");
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
                var numServeriesWithFood = 0; //track # serv displaying food

                for (var i = 0; i < serveriesLength; i++) {
                    let thisServery = searchServeries(serveriesStr[i], data);
                    if(thisServery){
                        serveriesDict[ serveriesStr[i] ] = thisServery;
                        //if servery is open, add 1 to counter
                        numServeriesWithFood += 1;
                    }
                }
                //update with new promptMessage in hHML, and save in Chrome Storage
                promptMessage = generatePrompt(data, numServeriesWithFood);
                $('#prompt').text(promptMessage);
                var whichMeal = genWhichMeal(data, numServeriesWithFood);
                $('#which-meal').text(whichMeal);
                //save promptMessage and serveriesDict in chrome storage
                
                chrome.storage.sync.set({'servery_menus': serveriesDict, prompt: promptMessage,
                                        meal: whichMeal}, function() {
                    var foodString = ""; //foodList converted to string
                    if(serveriesDict[servName]){
                        var foodList = serveriesDict[servName]; //foods in array form
                        foodString = capFirstLetter(foodList, foodString);
                    }
                    if(foodString == ""){
                        foodString = noFoodMessage;
                    }
                    $('#list-of-foods').html(foodString);
                    //console.log(serveriesDict);
                });

            }
        };
        xhr.send()

        localStorage["time"] = timeNow;
    }
    else{ 
        let foodString = ""; //foodList converted to string
        chrome.storage.sync.get(['servery_menus'], function(result) {
            let serveriesDict = result.servery_menus;
            if(serveriesDict[servName]){
                var foodList = serveriesDict[servName]; //foods in array form
                foodString = capFirstLetter(foodList, foodString);
            }
            
            if(foodString == ""){
                foodString = noFoodMessage;
            }
            $('#list-of-foods').html(foodString);
        });
        
    }
};
function capFirstLetter(foodList, foodString){
    for(var i=0; i<foodList.length; i++){
        //Capitalize the first letter of the string
        var foodCap = foodList[i].charAt(0).toUpperCase() + foodList[i].slice(1)
        foodString += "<p>"+foodCap + "</p>";
        //foodString += "<p>"+foodList[i] + "</p>";
    }
    return foodString;
}

function genWhichMeal(data, numServeriesWithFood){
    //if dining.rice shows at least one servery open, ADD "Your Lunch/Dinner Today:"
    let foodTodayMessage = data.querySelector(".col_4");
    var whichMeal = "";
    if(numServeriesWithFood > 0){
        if(foodTodayMessage){
            foodTodayString = foodTodayMessage.innerHTML
            // let whichMeal = "";
            if(foodTodayString.includes("Your") && foodTodayString.includes("Today:")){
                //original message says "Your Lunch Today:" or "Your Dinner Today:"
                //set whichMeal equal to "Lunch" or "Dinner";
                whichMeal += ": ";
                var mealRegularCase = foodTodayString.slice(
                    foodTodayString.indexOf("Your")+5,
                    foodTodayString.indexOf("Today:")-2);
                whichMeal += mealRegularCase.toUpperCase();
                console.log(whichMeal);
                //('#which-meal').text(whichMeal);
                //promptMessage += "Your " + whichMeal + " Today:";
            }
        }
    }
    //return ": Dinner" or ": Lunch"
    return whichMeal;
    
}

function generatePrompt(data, numServeriesWithFood){

    let promptMessage = "";
    
    //if at least one servery is open based on timing, AND dining.rice shows >=1 servery's food
    // console.log(!baker.isOpen()[0] && !sid.isOpen()[0] && !south.isOpen()[0] && !west.isOpen()[0] 
    // && !north.isOpen()[0] && !seibel.isOpen()[0]);
    if(!allServeriesClosed() && numServeriesWithFood > 0 ){
        promptMessage = "What would you like to eat today? ";
    }

    //if serveries are closed from timing, OR no food on dining.rice
    if(allServeriesClosed() || numServeriesWithFood <= 0){
        promptMessage += "All serveries are currently closed. "
    }

    //console.log("Number serveries open: " + numServeriesWithFood);
    
    $('#prompt').text(promptMessage);
    return promptMessage;
}
function allServeriesClosed(){
    //based on TIME
    //return True if *all* serveries are closed
    //return False if at least 1 is closed
    return (!baker.isOpen()[0] && !sid.isOpen()[0] && !south.isOpen()[0] && !west.isOpen()[0] 
    && !north.isOpen()[0] && !seibel.isOpen()[0]);
}

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

function setTimeDaytimeImage(){
    /*
    Set the current time
    */
    var d = new Date();
    let hour24 = d.getHours();
    let hour12 = hour24;
    let minInt = d.getMinutes();
    let ampm = "";
    if(hour12 < 12){
        ampm = "AM";
        if(hour12 == 0){
            hour12 = 12;
        }
        ;
    }
    else{
        ampm = "PM";
        if(hour12 > 12) {
            hour12 -= 12;
        }
    }
    let minString = "";
    if(minInt < 10){
        minString = "0" + minInt.toString();
    }
    else{
        minString = minInt.toString();
    }
    // return hour.toString() + ":"+minString+" "+ampm;
    timeStr = hour12.toString() + ":"+minString+" "+ampm;
    $('#time').text(timeStr);

    //Set "good morning/afternoon/evening"
    var timeOfDay = "";
    if(hour24>=5 && hour24<12){
        timeOfDay = "Morning";
    }
    else if(hour24>=12 && hour24<17){
        timeOfDay = "Afternoon";
    }
    else{
        timeOfDay = "Evening";
    }
    $('#daytime').text("Good "+timeOfDay);

    //Set image
    
    if(hour24>=8 && hour24<14){
        //brochstein
        setBackgroundImage('Images/moody.jpg');
    }
    else if(hour24>=14 && hour24 < 18){
        //front-entrance
        setBackgroundImage('Images/skyspace.jpg');
    }
    else if(hour24>=18 && hour24<22){
        //mild-nighttime
        setBackgroundImage('Images/mild-nighttime.jpg');
    }
    else if ((hour24>=22 && hour24<24) || hour24<2){
        //dark-nighttime-lovett-hall
        setBackgroundImage('Images/dark-nighttime-lovett-hall.jpg');
    }
    else if(hour24>=2 && hour24 < 8){
        // misty-halloween
        setBackgroundImage('Images/misty-halloween.jpg');
    }
    else{
        //mild-nighttime
        setBackgroundImage('Images/mild-nighttime.jpg');
        console.log("Error. The proper background image is not loading. Please email pm28@rice.edu with a screenshot and the time.");
    }
}
function setBackgroundImage(imageUrl){
    $('#bg').css('background-image', 'url(' + imageUrl + ')');
}
