let user = "";
let url;
let eventName, eventLocation, orgMail, startDate, startTime, endDate, endTime, status, website, extra, image;

//Vorlesungsteststuff
// let pos, lat, long;
// function locate(){
//     pos = navigator.geolocation.getCurrentPosition(
//         (e) => {
//             success(e);
//         }
//     );
// }
// function success(position){
//     lat = position.coords.latitude;
//     long = position.coords.longitude;
//     document.getElementById('Unistuff').innerText = lat + ", " + long;
// }
//

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
    getData();
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

function switchCategories() {
    document.getElementById('mainContent').style.display = 'none';
    document.getElementById('categoryManagement').style.display = 'grid';
}

function switchToMain(){
    document.getElementById('loginArea').style.display = 'none';
    document.getElementById('categoryManagement').style.display = 'none';
    document.getElementById('mainContent').style.display = 'grid';
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

        document.getElementById('mainContent').style.display = 'none';
        document.getElementById('setEventTime').style.display = 'none';
        document.getElementById('timeWarning').style.display = 'none';
        document.getElementById('additionalEventinfo').style.display = 'grid';

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

function getExtras(e) {
    e.preventDefault();
    console.log('getExtras');
    status = document.getElementById('status').value;
    website = document.getElementById('webpage').value;
    extra = document.getElementById('extra').value;

    if (image != undefined) {
        console.log(image);
    } else {
        image = null;
    }
    console.log(image);

    if (extra.length > 2000) {
        return false;
    }
    buildAndSubmitJSON();

    document.getElementById('additionalEventinfo').style.display = 'none';
    document.getElementById('mainContent').style.display = 'grid';
}

function encode() {
    let filesSelected = document.getElementById('image').files;
    if (filesSelected.length > 0) {
        console.log(filesSelected[0]);

    }
}

function addCategory(e) {
    e.preventDefault();
    let categoryName = document.getElementById('newCategory').value;
    let select = document.getElementById('categorySelect');
    let table = document.getElementById('table');
    if (categoryName == undefined) {
        return false;
    }
    let data = {
        "name": categoryName
    }
    fetch(`${url}/categories`, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then((response) => response.json()).then((out) => {
        select.innerHTML += `<option id="Select${out.id}" value="${out.id}">${out.name}</option>`;
        let tr = document.createElement('tr');
        tr.id = `CategoryList${out.id}`;

        let td1 = document.createElement('td');
        let td2 = document.createElement('td');
        let name = document.createTextNode(out.name);

        let button = document.createElement('button');
        button.innerText = 'delete';
        button.classList.add('btn');
        button.classList.add('btn-primary');
        button.classList.add('btn-sm');
        button.onclick = function(){
            fetch(`${url}/categories/${out.id}`,{
                method:'DELETE',
            }).catch(err=>{
                console.log(err);
            });
            document.getElementById(`CategoryList${out.id}`).style.display = 'none';
            let del = document.getElementById(`Select${out.id}`);
            del.remove();
        }

        td1.appendChild(name);
        td2.appendChild(button);

        tr.appendChild(td1);
        tr.appendChild(td2);

        table.appendChild(tr);
    });
}

function buildAndSubmitJSON() {
    let startT = startDate + 'T' + startTime;
    let endT = endDate + 'T' + endTime;
    let sending = {
        "title": eventName,
        "location": eventLocation,
        "organizer": orgMail,
        "start": startT,
        "end": endT,
        "status": status,
        "allday": false,
        "webpage": website,
        "imagedata": image,
        "categories": [],
        "extra": extra
    }
    // fetch(`${url}/events`, {
    //     method: "post",
    //     headers: {
    //         'Accept': 'application/json',
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(sending)
    // }).then((response) => {
    //     console.log(response);
    // });
}

function getData() {
    let select = document.getElementById('categorySelect');
    let table = document.getElementById('table');
    table.innerHTML = '<tr><th>Name</th><th>Delete</th></tr>';
    //get categories
    fetch(`${url}/categories`,{cache: 'no-store'}).then((res) => res.json()).then((out) => {
        out.forEach(element => {
            select.innerHTML += `<option value="${element.id}">${element.name}</option>`;
            let tr = document.createElement('tr');
            tr.id = `CategoryList${element.id}`;

            let td1 = document.createElement('td');
            let td2 = document.createElement('td');
            let name = document.createTextNode(element.name);

            let button = document.createElement('button');
            button.innerText = 'delete';
            button.classList.add('btn');
            button.classList.add('btn-primary');
            button.classList.add('btn-sm');
            button.onclick = function(){
                fetch(`${url}/categories/${element.id}`,{
                    method:'DELETE',
                }).catch(err=>{
                    console.log(err);
                });
                document.getElementById(`CategoryList${element.id}`).style.display = 'none';
                let del = document.getElementById(`Select${out.id}`);
                del.remove();    
            }

            td1.appendChild(name);
            td2.appendChild(button);

            tr.appendChild(td1);
            tr.appendChild(td2);

            table.appendChild(tr);
        });
    }).catch(err => console.log(err));
}    
