class Servery {
    constructor(name, dayDict) {
        //Names are: Baker, SidRich, South, West, North, Seibel
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

        //this.times is an array with the times ordered [Sun,M,Tu,W,Th,F,Sa]
        //intiialize times for Sunday
        this.times = [];
        if(this.dayDict["Sunday"]){
            //this.times[0] = {"Lunch": [11.5, 14], "Dinner": [17, 19]};
            this.times.push([null, [11.5, 14], [17, 19]]);
        }
        else{
            this.times.push(null);
        }
        this.times.push([avgB.slice(), avgL.slice(), avgD.slice()]); //monday
        this.times.push([avgB.slice(), avgL.slice(), avgD.slice()]);//tues
        this.times.push([avgB.slice(), avgL.slice(), avgD.slice()]);//wed
        this.times.push([avgB.slice(), avgL.slice(), avgD.slice()]);//thurs
        //friday
        if(this.dayDict["Friday"]){
            this.times.push([avgB.slice(), avgL.slice(), [17.5, 19]]);
        }
        else{
            this.times.push([ avgB.slice(),avgL.slice(), null]);
        }
        //saturday
        if(this.dayDict["Saturday"]){
            this.times.push([ [9,11], [11.5, 14], [16.75, 18.25]]);
        }
        else{
            this.times.push(null);
        }
        this.times = this.exceptions(this.times, this.name);
    }

    exceptions (times, name) {
        //WHEN TO USE EXCEPTIONS
        //at all times, for each servery, there needs to be some time that the servery opens
        //so that whenWillOpen works

        //times is an array ordered [Sun,M,Tu,W,Th,F,Sat]
        //d.getDay() returns a number corresponding to what day of the week it is
        //with the same indices as in times. 
        //(that is, Sunday returns 0, which is the index of Sunday in times)
        var d = new Date();
        var year = d.getFullYear(); //year is 2019 or 2020 or whatever
        var month = d.getMonth(); //month is 0-11; January = 0; December = 11
        var date = d.getDate(); //date is 1-31
        var day = d.getDay(); //returns number 0-6 == idx of [Sun,M,Tu,W,Th,F,Sat]

        
        //EDIT BELOW BASED ON WHEN IT IS
        /* //The week before Spring semester 2019
        if(year == 2019 && month == 0 ){
            //january 2019
            if(date < 6 && day > 1){ //before Jan 6, but after Sunday
                // I set Sunday open for Seibel/North
                if(times[0]){
                    times[0][1] = null; //no lunch on Jan 6
                }
                //leave times[1] (Monday) untouched so that for "When will open"
                //it knows Monday is open for Baker/Sid,
                times[2] = null;
                times[3] = null;
                times[4] = null;
                times[5] = null;
                times[6] = null; 
            }
            else if(date == 6){
                if(times[0]){
                    times[0][1] = null; //no lunch on Jan 6
                }            
            }
        };*/
        return times
    }

    getName (){
        return this.name;
    }
    getNameAllCaps () {
        return this.name.toUpperCase();
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
            
            if(this.times[day][0]&& hourMin >= this.times[day][0][0] && hourMin <= this.times[day][0][1]){
                return [true, "Breakfast"];
            }
            
            else if(this.times[day][1] && hourMin >= this.times[day][1][0] && hourMin <= this.times[day][1][1]){
                return [true, "Lunch"];
            }
            else if(this.times[day][2] &&  this.times[day][2][0] && hourMin >= this.times[day][2][0] && hourMin <= this.times[day][2][1]){
                return [true, "Dinner"];
            }
            else{
                return [false, null];
            }
        }
        else{
            return [false, null];
        }
    }

    isOpenException (){
        return true;
    }

    whenWillOpen () {
        var d = new Date();
        var day = d.getDay();
        var hourMin = d.getHours() + d.getMinutes()/60;
        var dayCount = day; 
        var searching = true;
        var whichMeal = -1;
        
        while(searching){
            //make sure I can access this.times[dayCount].
            dayCount = dayCount % 7;
            //if the servery is open today
            if(this.times[dayCount]){
                //if there's breakfast
                if(this.times[dayCount][0]&&hourMin <= this.times[dayCount][0][0]){
                    searching = false;
                    whichMeal = 0;
                    return [dayCount % 7, whichMeal, this.times[dayCount][whichMeal][0]];
                }
                
                //if it's before lunch
                else if(this.times[dayCount][1]&&hourMin <= this.times[dayCount][1][0] ){
                    searching = false;
                    whichMeal = 1;
                    return [dayCount % 7, whichMeal, this.times[dayCount][whichMeal][0]];
                }
                //if it's before dinner
                else if(this.times[dayCount][2] && hourMin <= this.times[dayCount][2][0]){
                    searching = false;
                    whichMeal = 2;
                    return [dayCount % 7, whichMeal, this.times[dayCount][whichMeal][0]];              
                }
                //if time is after dinner
                else{
                    dayCount += 1;
                    hourMin = 0;
                } 
            }
            else{ 
                //if servery's closed today
                dayCount += 1; 
                hourMin = 0;
            }
        }
    }
    numberToDay (dayNum) {
        let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        return days[dayNum];
    }
    hourMinToTime (hourMin){
        let ampm = ""
        let min = hourMin - Math.floor(hourMin);
        let minInt = Math.round(60*min)
        let hour = Math.floor(hourMin);

        if(hour < 12){
            ampm = "AM";
            if(hour == 0){
                hour = 12;
            }
            let hourString = hour.toString();
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
    serveryMessage () {
        let d = new Date();
        let serveryMessage = "";
        if(this.name=="SidRich"){
            serveryMessage = "Sid Rich";
        }
        else{
            serveryMessage = this.name;
        }
        
        if(this.isOpen()[0]){ 
            serveryMessage += " is open until ";
            serveryMessage += this.hourMinToTime(this.whenWillClose());
        }
        else{
            serveryMessage += " is closed, ";
            let whenOpen = this.whenWillOpen();

            if(d.getDay() == whenOpen[0]){
                serveryMessage += "and opens at " + this.hourMinToTime(whenOpen[2]);
            }
            else{
                serveryMessage += "and opens on "+this.numberToDay(whenOpen[0]) 
                + " at " + this.hourMinToTime(whenOpen[2]);
            }
        }
        return serveryMessage;
    }
    //NEED TO FILL OUT
    updateFoods (){

    }
    timeLastUpdated () {
        
    }
}