let user = "";

function submitUserID(e){
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

function buildURL(){
    if(!(user.length === 0)){
        //build URL
        url = `http://dhbw.radicalsimplicity.com/calendar/${user}`;
        console.log(url);
    }
}

function newEvent(e){
    e.preventDefault();
    console.log("create Element");
    let eventName = document.getElementById('inputEventName').value;
    let eventLocation = document.getElementById('inputEventLocation').value;
    let orgMail = document.getElementById('inputEventEmail').value;
    let startDate = document.getElementById('startdate').value;
    let endDate = document.getElementById('enddate').value;

    console.log(eventName, eventLocation, orgMail, startDate, endDate);
    document.getElementById('mainContent').style.display = 'grid';
    document.getElementById('createEvent').style.display = 'none';
    return true;
}

function switchCreateEntry(){
    document.getElementById('mainContent').style.display = 'none';
    document.getElementById('createEvent').style.display = 'grid';
}