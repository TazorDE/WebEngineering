let user = "";
let eventName, eventLocation, orgMail, startDate, startTime, endDate, endTime;

function submitUserID(e) {
    e.preventDefault();
    //get form input
    user = document.getElementById('inputUserID').value;
    console.log(user);
    //change displayed cards
    document.getElementById('loginArea').style.display = 'none';
    document.getElementById('mainContent').style.display = 'grid';
    //build the URL to the Webservice
    buildURL();
}

function buildURL() {
    if (!(user.length === 0)) {
        //build URL
        url = `http://dhbw.radicalsimplicity.com/calendar/${user}`;
        console.log(url);
    }
}

function switchCreateEntry() {
    document.getElementById('mainContent').style.display = 'none';
    document.getElementById('createEvent').style.display = 'grid';
}

function newEvent(e) {
    e.preventDefault();
    console.log("create Element");
    eventName = document.getElementById('inputEventName').value;
    eventLocation = document.getElementById('inputEventLocation').value;
    orgMail = document.getElementById('inputEventEmail').value;

    console.log(eventName, eventLocation, orgMail,);
    document.getElementById('setEventTime').style.display = 'grid';
    document.getElementById('createEvent').style.display = 'none';
    return true;
}

function setTime(e) {
    e.preventDefault();
    console.log("setTime");
    startDate = document.getElementById('startdate').value;
    startTime = document.getElementById('starttime').value;
    endDate = document.getElementById('enddate').value;
    endTime = document.getElementById('endtime').value;
    validateTime();
    console.log(startDate, startTime, endDate, endTime);
    
    document.getElementById('mainContent').style.display = 'grid';
    document.getElementById('setEventTime').style.display = 'none';
}

function validateTime(){
    let startHr = parseInt(startTime.substr(0,2)); //validated through html pattern
    let startMin = parseInt(startTime.substr(3,2));
    let endHr = parseInt(endTime.substr(0,2));
    let endMin = parseInt(endTime.substr(3,2));

    if(startDate == endDate){
        if(startTime == endTime){
            console.log("start time == end time");
        }else if(startHr > endHr){
            console.error("start hr is after end hr");
        }else if(startHr < endHr){
            console.log("start hr is before end hr");
        }else if(startHr == endHr){
            console.log("start hr is equal to end hr");
            if(startMin > endMin){
                console.error("start min is after end min");
            }else if(startMin < endMin){
                console.log("start min is before end min");
            }else{
                console.log("start min is equal to end min");
            }
        }
    }
}