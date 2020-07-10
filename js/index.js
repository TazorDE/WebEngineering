let user = "";
let url;
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
    //test getting the JSON
    fetch(url)
        .then(res => res.json())
        .then((out) => {
            console.log(out);
        })
        .catch(err => { throw err });
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
    document.getElementById('timeWarning').style.display = 'none';
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
    document.getElementById('timeWarning').style.display = 'none';
    return true;
}

function setTime(e) {
    e.preventDefault();
    console.log("setTime " + document.getElementById('starttime').value);
    startDate = document.getElementById('startdate').value;
    startTime = document.getElementById('starttime').value;
    endDate = document.getElementById('enddate').value;
    endTime = document.getElementById('endtime').value;
    if (validateDate()) {

        document.getElementById('mainContent').style.display = 'grid';
        document.getElementById('setEventTime').style.display = 'none';
        document.getElementById('timeWarning').style.display = 'none';

        return true;
    } else {
        return false;
    }
}

function validateTime() {
    let startHr = parseInt(startTime.substr(0, 2)); //validated through html pattern
    let startMin = parseInt(startTime.substr(3, 2));
    let endHr = parseInt(endTime.substr(0, 2));
    let endMin = parseInt(endTime.substr(3, 2));

    if (startTime == endTime) {
        console.log("start time is equal to end time");
        return true;
    } else if (startHr > endHr) {
        console.error("start hr is after end hr");
        return false;
    } else if (startHr < endHr) {
        console.log("start hr is before end hr");
        return true;
    } else if (startHr == endHr) {
        console.log("start hr is equal to end hr");
        if (startMin > endMin) {
            console.error("start min is after end min");
            return false;
        } else if (startMin < endMin) {
            console.log("start min is before end min");
            return true;
        } else {
            console.log("start min is equal to end min");
            return true;
        }
    }
}

function validateDate() {
    let startYear = parseInt(startDate.substr(0, 4), 10);
    let startMonth = parseInt(startDate.substr(5, 2), 10);
    let startDay = parseInt(startDate.substr(8, 2), 10);
    let endYear = parseInt(endDate.substr(0, 4), 10);
    let endMonth = parseInt(endDate.substr(5, 2), 10);
    let endDay = parseInt(endDate.substr(8, 2), 10);

    console.log(startDate);
    console.log(startYear + ',' + startMonth + ',' + startDay);
    console.log(endYear + ',' + endMonth + ',' + endDay);

    if (startYear == endYear) {
        if (startMonth == endMonth) {
            if (startDay == endDay) {
                if (validateTime()) {
                    return true;
                } else {
                    document.getElementById('timeWarning').style.display = 'grid';
                    return false;
                }
            } else if (startDay > endDay) {
                document.getElementById('timeWarning').style.display = 'grid';
                return false;
            } else {
                return true;
            }
        } else if (startMonth > endMonth) {
            document.getElementById('timeWarning').style.display = 'grid';
            return false;
        } else {
            return true;
        }
    } else if (startYear > endYear) {
        document.getElementById('timeWarning').style.display = 'grid';
        return false;
    } else {
        return true;
    }
}

function buildAndSubmitJSON(){
    let startT = startDate+'T'+startTime;
    let endT = endDate+'T'+endTime;
    let sending = {
        "title": eventName,
        "location": eventLocation,
        "organizer": orgMail,
        "start": startT,
        "end": endT,
        "status": "Busy",
        "allday": false,
        "webpage": " http://www.radicalsimplicity.com/",
        "imagedata": "data:ContentType;base64,ImageContent",
        "categories": [
            {
                "id": 3
            }
        ],
        "extra": null
    }
    
}