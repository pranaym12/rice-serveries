const baker = new Servery("Baker", {"Friday": false, "Saturday": false, "Sunday": false })
const sid = new Servery("SidRich", {"Friday": false, "Saturday": false, "Sunday": false })
const south = new Servery("South", {"Friday": true, "Saturday": false, "Sunday": true })
const west = new Servery("West", {"Friday": true, "Saturday": false, "Sunday": true })
const north = new Servery("North", {"Friday": true, "Saturday": true, "Sunday": true })
const seibel = new Servery("Seibel", {"Friday": true, "Saturday": true, "Sunday": true })

$(function(){
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
        result.servery ? serveryUpdate(result.servery) : serveryUpdate(seibel);
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
    chrome.storage.sync.set({'servery': servery}, function(){});

    var d = new Date();
    timeNow = d.getTime();
    
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
                            foodString += "<p>"+foodList[i] + "</p>";
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

/*
var foodOptionsDict = {
    Baker: ["Turkey Swedish Meatballs",
    "Basial and Parmesan Orzo",
    "Roasted Tempeh & Green Beans: Spicy Pepper Vinalgrette",
    "Spinach stuffed flounder with tomato and Kalamata",
    "Creamy herb tortellini",
    "Pepperoni and arugula fries with cheese",
    "Stir-fry vegetables and fried rice"],
    North:["Scalloped Potatoes",
    "Grilled Strip Steaks",
    "Blackened Catfish",
    "Local Tofu with Roasted Garlic & Beech Mushrooms",
    "Plant-Based Broccoli Rice Casserole",
    "Orzo Pasta with Roasted Fennel and Tomato",
    "Warm Dutch Apple Pie<"],
    Seibel:["Cilantro Brown Rice",
    "Pork Carnitas with Roasted Pineapple",
    "Onion Crusted Chicken with Jalapeῆo Cream Sauce (Halal)",
    "Cheese Enchiladas",
    "Black Bean and Potato Stew",
    "Brazilian Chicken and Rice Soup (Halal)",
    "Taco Salad with Chipotle Vinaigrette"],
    SidRich: ["Steamed Basmati Rice",
    "Teriyaki Tofu",
    "Garlic Soba Noodles: Bean Sprouts, Snow Peas & Carrots",
    "Mongolian Grilled Chicken Thighs",
    "Korean BBQ Glazed Pork Ribs",
    "Royal Milk Tea",
    "Baked Brie with Crackers and Fresh Fruit"],
    South: ["Macaroni & Cheese",
    "BBQ Chicken Drumsticks",
    "Smoked Beef Brisket",
    "Sweet Baked Beans",
    "Blackened Tofu Cutlets with Mustard Greens",
    "Southern Style Corn Bread",
    "Sweet Potato Pie"],
    West: ["Mashed potatoes",
    "Chicken fried chicken",
    "Pork loin roast",
    "Spinach onion tomato pinwheel",
    "Chickpea rice curry",
    "Smoked cheddar turkey burger",
    "Famous cauliflower hoisin"],
}*/
