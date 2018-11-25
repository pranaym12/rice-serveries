class Servery {
    constructor(name, dayDict) {
        this.name = name;
        this.dayDict = {
            "Friday": dayDict["Friday"],
            "Saturday": dayDict["Saturday"],
            "Sunday": dayDict["Sunday"]
        };

        //normal breakfast, lunch, and dinner times
        let avgB = [7.5, 10.5];
        let avgL = [11.5, 13.5];
        let avgD = [17.5, 19.5];
        //intiialize times for Mond - Thurs
        this.times = [];
        if(this.dayDict["Sunday"]){
            //this.times[0] = {"Lunch": [11.5, 14], "Dinner": [17, 19]};
            this.times.push([null, [11.5, 14], [17, 19]]);
        }
        else{
            this.times.push(null);
        }
        // this.times = {
        //     1: {"Breakfast": avgB.slice(), "Lunch": avgL.slice(), "Dinner": avgD.slice()}, 
        //     2: {"Breakfast": avgB.slice(), "Lunch": avgL.slice(), "Dinner": avgD.slice()}, 
        //     3: {"Breakfast": avgB.slice(), "Lunch": avgL.slice(), "Dinner": avgD.slice()}, 
        //     4: {"Breakfast": avgB.slice(), "Lunch": avgL.slice(), "Dinner": avgD.slice()}
        // };
        this.times.push([avgB.slice(), avgL.slice(), avgD.slice()]);
        this.times.push([avgB.slice(), avgL.slice(), avgD.slice()]);
        this.times.push([ avgB.slice(), avgL.slice(), avgD.slice()]);
        this.times.push([avgB.slice(), avgL.slice(), avgD.slice()]);
        
        if(this.dayDict["Friday"]){
            this.times.push([avgB.slice(), avgL.slice(), [17, 19]]);
        }
        else{
            this.times.push([ avgB.slice(),avgL.slice(), null]);
        }
        if(this.dayDict["Saturday"]){
            this.times.push([ [9,11], [11.5, 14], [16.75, 18.25]]);
        }
        else{
            this.times.push(null);
        }
    }
    getName (){
        return this.name;
    }
    toString () {
        var fridayOpen = this.dayDict["Friday"] ? "open" : "closed";
        var saturdayOpen = this.dayDict["Saturday"] ? "open" : "closed";
        var sundayOpen = this.dayDict["Sunday"] ? "open" : "closed";
        return this.name + ": " + fridayOpen + " on  Friday, " + saturdayOpen + " on  Saturday, " + sundayOpen + " on  Sunday."
    }

    isOpen () {
        var d = new Date();
        var day = d.getDay();
        var hourMin = d.getHours() + d.getMinutes()/60;
        //first check if servery is open today
        if(this.times[day]){
            if(this.times[day][0]){
                if(hourMin >= this.times[day][0][0] && hourMin <= this.times[day][0][1]){
                    return [true, "Breakfast"];
                }
            }
            if(hourMin >= this.times[day][1][0] && hourMin <= this.times[day][1][1]){
                return [true, "Lunch"];
            }
            else if(hourMin >= this.times[day][2][0] && hourMin <= this.times[day][2][1]){
                return [true, "Dinner"];
            }
            else{
                return [false, null];
            }
        }
        else{
            return [false, null];
        }
        // console.log(day, hourMin);
    }

    isOpenException (){
        return true;
    }
    //WHILE LOOP INDEFINITELY RUNNIG, BUT IDK WHY
    whenWillOpen () {
        var d = new Date();
        var day = d.getDay();
        var hourMin = d.getHours() + d.getMinutes()/60;
        var dayCount = day; 
        var searching = true;
        var whichMeal = -1;
        console.log(hourMin);
        while(searching){
            //if the servery is open today
            if(this.times[dayCount]){
                //if there's breakfast
                
                if(this.times[dayCount][0]){
                    if(hourMin <= this.times[dayCount][0][0]){
                        searching = false;
                        whichMeal = 0;
                        return [dayCount % 7, whichMeal, this.times[dayCount][whichMeal][0]];
                    }
                }
                //if it's before lunch
                if(hourMin <= this.times[dayCount][1][0]){
                    searching = false;
                    whichMeal = 1;
                    return [dayCount % 7, whichMeal, this.times[dayCount][whichMeal][0]];
                }
                //if it's before dinner
                else if( hourMin <= this.times[dayCount][2][0]){
                    searching = false;
                    whichMeal = 2;
                    return [dayCount % 7, whichMeal, this.times[dayCount][whichMeal][0]];
                }
                else{ //if time is after dinner
                    dayCount += 1;
                }
            }
            else{ 
                //if servery's closed today
                dayCount += 1; 
            }
        }
    }
    whenWillClose () {
        let isOpen = this.isOpen();
        if(isOpen[0]){
            var d = new Date();
            var day = d.getDay();
            if(isOpen[1] === "Breakfast"){
                return this.times[day][0][1];
            }
            else if(isOpen[1] === "Lunch"){
                return this.times[day][1][1];
            }
            else if(isOpen[1] === "Dinner"){
                return this.times[day][2][1];
            }
        }
        else{
            return 10000;
        }
    }
    //NEED TO FILL OUT
    updateFoods (){

    }
}