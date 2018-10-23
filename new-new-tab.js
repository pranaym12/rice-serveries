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
    Sidrich: ["Steamed Basmati Rice",
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
    West: ["mashed potatoes",
    "chicken fried chicken",
    "pork loin roast",
    "spinach onion tomato pinwheel",
    "chickpea rice curry",
    "smoked cheddar turkey burger",
    "famous cauliflower hoisin"],
}
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
    updateTime();
};
function updateTime(){
    var d = new Date();
    console.log(d.getHours());
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
