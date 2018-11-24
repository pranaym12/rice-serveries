class Servery {
    constructor(name, dayDict) {
        this.name = name;
        this.dayDict = {
            "Friday": dayDict["Friday"],
            "Saturday": dayDict["Saturday"],
            "Sunday": dayDict["Sunday"]
        };
        // this.friBool= dayDict["Friday"];
        // this.satBool = dayDict["Saturday"];
        // this.sunBool = dayDict["Sunday"];
    }
    toString() {
        var fridayOpen = this.dayDict["Friday"] ? "open" : "closed";
        var saturdayOpen = this.dayDict["Saturday"] ? "open" : "closed";
        var sundayOpen = this.dayDict["Sunday"] ? "open" : "closed";
        return this.name + ": " + fridayOpen + " on  Friday, " + saturdayOpen + " on  Saturday, " + sundayOpen + " on  Sunday."
    }

    isOpen() {

    }
    whenWillOpen() {

    }
    whenWillClose() {

    }
    updateTime() {
        var d = new Date();
        console.log(d.getHours());
        console.log(d.getMinutes());
        console.log(d.getDay());
    };
}