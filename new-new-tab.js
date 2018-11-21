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
    Sid: ["Steamed Basmati Rice",
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
}
$(function(){
    initialServeryUpdate();
    //$('#servery-name').text(localStorage['servery-key']);
    $('#Baker').click(function(){
        //bakerUpdate();
        serveryUpdate("Baker");
    });
    $('#North').click(function(){
        //northUpdate();
        serveryUpdate("North");
    });
    $('#Seibel').click(function(){
        //seibelUpdate();
        serveryUpdate("Seibel");
    });
    $('#Sid').click(function(){
        //sidUpdate();
        serveryUpdate("Sid");
    });
    $('#South').click(function(){
        //southUpdate();
        serveryUpdate("South");
    });
    $('#West').click(function(){
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
    //Set servery header and local storage equal to servName
    if(servName == "Sid"){
        //Keep "Sid" everywhere else, but I need to name the header "Sid Rich"
        $('#servery-name').text("Sid Rich");
    }
    else{
        $('#servery-name').text(servName);
    }
    localStorage['servery-key'] = servName;

    var foodList = foodOptionsDict[servName]; //foods in array form
    var foodString = ""; //foodList converted to string
    for(var i=0; i<foodList.length; i++){
        /*if(i == foodList.length-1){
            foodString += foodList[i];
        }
        else{
            foodString += "<p>"+foodList[i] + "</p>"; 
        }*/
        foodString += "<p>"+foodList[i] + "</p>";
    }

    $('#list-of-foods').html(foodString);
    updateTime();
};
function updateTime(){
    var d = new Date();
    console.log(d.getHours());
    console.log(d.getMinutes());
    console.log(d.getDay());
};

var xhr = new XMLHttpRequest();
xhr.open("GET", "http://dining.rice.edu/", true);
xhr.onreadystatechange = function() {
    if(xhr.readyState === 4 && xhr.status === 200) {
        let data = xhr.responseXML;
        let food = data.querySelector("#Baker");
        let items = food.querySelectorAll("div.menu-item");
        for (let item of items) {
            console.log(item.textContent);
            console.log('hi');
        }
    }
};
xhr.send()

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
