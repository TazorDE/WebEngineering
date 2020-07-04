let user = "";

function submitUserID(e){
    //prevent page reload on submit
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

function createEvent(e){
    //prevent page to reload on submit
    e.preventDefault();
    console.log("create Element");
}

function switchCreateEntry(){
    document.getElementById('mainContent').style.display = 'none';
    document.getElementById('createEvent').style.display = 'grid';
}