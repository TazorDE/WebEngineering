let user = ""; 
let url, image;
let eventName, eventLocation, orgMail, startDate, startTime, endDate, endTime, allday, status, website, extra, categories;

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

function switchToMain() {
    document.getElementById('loginArea').style.display = 'none';
    document.getElementById('eventList').style.display = 'none';
    document.getElementById('categoryManagement').style.display = 'none';
    document.getElementById('mainContent').style.display = 'grid';
}

function showEvents() {
    document.getElementById('mainContent').style.display = 'none';
    document.getElementById('eventList').style.display = 'grid';
}

function backToEvents() {
    document.getElementById('eventList').style.display = 'grid';
    document.getElementById('categoryEvent').style.display = 'none';
    document.getElementById('event').style.display = 'none';
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
    allday = document.getElementById('allDay').checked;

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
    let category = $("#categorySelect").val();
    categories = [];
    //console.log('Cats: '+categories);
    status = document.getElementById('status').value;
    website = document.getElementById('webpage').value;
    extra = document.getElementById('extra').value;

    console.log("category " + category);
    if(category != null){
        category.forEach(e => {
            let data = {
                "id": e
            }
            categories.push(data);
        });
    }

    if (extra.length > 2000) {
        return false;
    }
    buildAndSubmitJSON();

    document.getElementById('additionalEventinfo').style.display = 'none';
    document.getElementById('mainContent').style.display = 'grid';
}

function encode() {
    console.log(document.getElementById('image').files);
    let file = document.getElementById('image').files;
    if (file.length > 0){
        let fileLoaded = file[0];
        const reader = new FileReader();
        reader.onloadend = function(e){
            image = e.target.result;
        }
        reader.readAsDataURL(fileLoaded);
        console.log(image);
    }
}

function addCategory(e, id) {
    e.preventDefault();
    let categoryName = document.getElementById(id).value;
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
        button.onclick = function () {
            fetch(`${url}/categories/${out.id}`, {
                method: 'DELETE',
            }).catch(err => {
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
        "allday": allday,
        "webpage": website,
        "imagedata": image,
        "categories": categories,
        "extra": extra
    }
    console.log(sending);
    fetch(`${url}/events`, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(sending)
    }).then((response) => {
        console.log(response);
        response.json();
    }).then((out) => {
        console.log(out);
    }).catch((err) => { console.log(err) });
}

function getData() {
    let select = document.getElementById('categorySelect');
    let table = document.getElementById('table');
    table.innerHTML = '<tr><th>Name</th><th>Delete</th></tr>';
    //get categories
    fetch(`${url}/categories`, { cache: 'no-cache' }).then((res) => res.json()).then((out) => {
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
            button.onclick = function () {
                fetch(`${url}/categories/${element.id}`, {
                    method: 'DELETE',
                }).catch(err => {
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

function getEvents(){
    let tableEventList = document.getElementById('tableEventList');
    tableEventList.innerHTML = '<tr><th>Name</th><th>more</th><th>Delete</th></tr>';
    //get events
    fetch(`${url}/events`, {
        cache: 'no-store'
    }).then(async (res) => {
        console.log(res);
        let data = await res.json();
        console.log(data);
        return data;
    }).then((result) => {
        result.forEach(element => {
            let tr = document.createElement('tr');
            tr.id = `EventList${element.id}`;
            let td1 = document.createElement('td');
            let td2 = document.createElement('td');
            let td3 = document.createElement('td');
            let name = document.createTextNode(element.title);
            let button = document.createElement('button');
            button.innerText = 'more';
            button.classList.add('btn');
            button.classList.add('btn-primary');
            button.classList.add('btn-sm');
            button.onclick = function () {
                document.getElementById('eventTable').innerHTML = '<tr><th scope="col">Description</th><th scope="col">Content</th></tr>';

                console.log(element.id);
                fetch(`${url}/events/${element.id}`).then(async (res) => { let data = await res.json(); return data }).then((out) => {
                    document.getElementById('eventList').style.display = 'none';
                    document.getElementById('event').style.display = 'grid';
                    let eventTable = document.getElementById('eventTable');
                    //event title
                    let row = document.createElement('tr');
                    row.id = out.title;
                    let cell1 = document.createElement('th');
                    cell1.setAttribute('scope', 'row');
                    let cell2 = document.createElement('td');
                    title = document.createTextNode('Event title');
                    content = document.createTextNode(out.title);
                    cell1.appendChild(title);
                    cell2.appendChild(content);
                    row.appendChild(cell1);
                    row.appendChild(cell2);
                    eventTable.appendChild(row);
                    //event location
                    row = document.createElement('tr');
                    row.id = out.location;
                    cell1 = document.createElement('th');
                    cell1.setAttribute('scope', 'row');
                    cell2 = document.createElement('td');
                    title = document.createTextNode('Event location');
                    content = document.createTextNode(out.location);
                    cell1.appendChild(title);
                    cell2.appendChild(content);
                    row.appendChild(cell1);
                    row.appendChild(cell2);
                    eventTable.appendChild(row);
                    //event organizer
                    row = document.createElement('tr');
                    row.id = out.organizer;
                    cell1 = document.createElement('th');
                    cell1.setAttribute('scope', 'row');
                    cell2 = document.createElement('td');
                    title = document.createTextNode('Event organizer');
                    content = document.createTextNode(out.organizer);
                    cell1.appendChild(title);
                    cell2.appendChild(content);
                    row.appendChild(cell1);
                    row.appendChild(cell2);
                    eventTable.appendChild(row);
                    //event start
                    row = document.createElement('tr');
                    row.id = out.start;
                    cell1 = document.createElement('th');
                    cell1.setAttribute('scope', 'row');
                    cell2 = document.createElement('td');
                    title = document.createTextNode('Event start');
                    let starttime = out.start.substr(0, 10) + ' ' + out.start.substr(11, 5);
                    content = document.createTextNode(starttime);
                    cell1.appendChild(title);
                    cell2.appendChild(content);
                    row.appendChild(cell1);
                    row.appendChild(cell2);
                    eventTable.appendChild(row);
                    //event end
                    row = document.createElement('tr');
                    row.id = out.end;
                    cell1 = document.createElement('th');
                    cell1.setAttribute('scope', 'row');
                    cell2 = document.createElement('td');
                    title = document.createTextNode('Event end');
                    let endtime = out.end.substr(0, 10) + ' ' + out.end.substr(11, 5);
                    content = document.createTextNode(endtime);
                    cell1.appendChild(title);
                    cell2.appendChild(content);
                    row.appendChild(cell1);
                    row.appendChild(cell2);
                    eventTable.appendChild(row);
                    //event status
                    row = document.createElement('tr');
                    row.id = out.status;
                    cell1 = document.createElement('th');
                    cell1.setAttribute('scope', 'row');
                    cell2 = document.createElement('td');
                    title = document.createTextNode('Availability');
                    content = document.createTextNode(out.status);
                    cell1.appendChild(title);
                    cell2.appendChild(content);
                    row.appendChild(cell1);
                    row.appendChild(cell2);
                    eventTable.appendChild(row);
                    //event website
                    if(out.webpage != null){
                        row = document.createElement('tr');
                        row.id = out.webpage;
                        cell1 = document.createElement('th');
                        cell1.setAttribute('scope', 'row');
                        cell2 = document.createElement('td');
                        anchor = document.createElement('a');
                        title = document.createTextNode('Webpage');
                        content = document.createTextNode(out.webpage);
                        anchor.appendChild(content);
                        if(out.webpage.substr(0,4) == 'http'){
                            anchor.href = out.webpage;
                        }else{
                            anchor.href = `https://${out.webpage}`;
                        }
                        anchor.target = '_blank';
                        cell1.appendChild(title);
                        cell2.appendChild(anchor);
                        row.appendChild(cell1);
                        row.appendChild(cell2);
                        eventTable.appendChild(row);
                    }
                    //event information
                    row = document.createElement('tr');
                    row.id = out.extra;
                    cell1 = document.createElement('th');
                    cell1.setAttribute('scope', 'row');
                    cell2 = document.createElement('td');
                    title = document.createTextNode('Information');
                    content = document.createTextNode(out.extra);
                    cell1.appendChild(title);
                    cell2.appendChild(content);
                    row.appendChild(cell1);
                    row.appendChild(cell2);
                    eventTable.appendChild(row);
                    //event categories
                    if(out.categories.length > 0){
                        row = document.createElement('tr');
                        cell1 = document.createElement('th');
                        cell1.setAttribute('scope', 'row');
                        cell2 = document.createElement('td');
                        title = document.createTextNode('Categories');
                        let names;
                        out.categories.forEach((res) => {
                            if (names != undefined) {
                                names += ` ${res.name}`
                            } else {
                                names = res.name;
                            }
                        });
                        let name = document.createTextNode(names);
                        cell1.appendChild(title);
                        cell2.appendChild(name);
                        row.appendChild(cell1);
                        row.appendChild(cell2);
                        eventTable.appendChild(row);
                    }else{
                        row = document.createElement('tr');
                        cell1 = document.createElement('th');
                        cell1.setAttribute('scope', 'row');
                        cell2 = document.createElement('td');
                        title = document.createTextNode('Categories');
                        let names = 'No Categories';
                        let name = document.createTextNode(names);
                        cell1.appendChild(title);
                        cell2.appendChild(name);
                        row.appendChild(cell1);
                        row.appendChild(cell2);
                        eventTable.appendChild(row);
                    }
                    //event image
                    if(out.imageurl != null){
                        row = document.createElement('tr');
                        row.id = out.imageurl;
                        cell1 = document.createElement('th');
                        cell1.setAttribute('scope', 'row');
                        cell2 = document.createElement('td');
                        title = document.createTextNode('Image');
                        img = document.createElement('img');
                        img.src = out.imageurl;
                        img.height = 100;
                        img.style.width = 'auto';
                        cell1.appendChild(title);
                        cell2.appendChild(img);
                        row.appendChild(cell1);
                        row.appendChild(cell2);
                        eventTable.appendChild(row);
                    }
                   document.getElementById('eventEdit').onclick = function(){
                        //go to event edit div
                        document.getElementById('manage').style.display = 'grid';
                        document.getElementById('event').style.display = 'none';
                   }
                }).catch(err => { console.error(err) });
            }
            let button2 = document.createElement('button');
            button2.innerText = 'delete';
            button2.classList.add('btn');
            button2.classList.add('btn-primary');
            button2.classList.add('btn-sm');
            button2.onclick = function () {
                fetch(`${url}/events/${element.id}`, {
                    method: 'DELETE',
                }).catch(err => {
                    console.log(err);
                });
                document.getElementById(`EventList${element.id}`).style.display = 'none';
            }

            td1.appendChild(name);
            td2.appendChild(button);
            td3.appendChild(button2);
            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            tableEventList.appendChild(tr);
        });
    });
}
