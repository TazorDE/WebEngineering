let user = "";
let url, image, updatedId;
let eventName, eventLocation, orgMail, startDate, startTime, endDate, endTime, allday, status, website, extra, categories;

function submitUserID(e) {
    e.preventDefault();
    //get form input
    user = document.getElementById('inputUserID').value;
    // console.log(user);
    //change displayed cards
    document.getElementById('loginArea').style.display = 'none';
    document.getElementById('mainContent').style.display = 'grid';
    //build the URL to the Webservice
    buildURL();
    getData();
    if(window.navigator.platform.includes('Win')){
        // console.log('Windows');
        document.getElementById('OSchange').innerText = 'CTRL+click to choose one or multiple categories';
    }else if(window.navigator.platform.includes('Mac')){
        // console.log('MacOs');
        document.getElementById('OSchange').innerText = '⌘+click to choose one or multiple categories';
    }else{
        // console.log('Other');
        document.getElementById('OSchange').innerText = 'CTRL/⌘+click to choose one or multiple categories';
    }
}

function buildURL() {
    if (!(user.length === 0)) {
        //build URL
        url = `http://dhbw.radicalsimplicity.com/calendar/${user}`;
        // console.log(url);
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
    document.getElementById('manage').style.display = 'none';
    document.getElementById('mainContent').style.display = 'grid';
}

function showEvents() {
    document.getElementById('mainContent').style.display = 'none';
    document.getElementById('eventList').style.display = 'grid';
}

function backToEvents() {
    document.getElementById('eventList').style.display = 'grid';
    document.getElementById('event').style.display = 'none';
}

function backToEvent() {
    document.getElementById('manage').style.display = 'none';
    document.getElementById('event').style.display = 'grid';
}

function newEvent(e) {
    e.preventDefault();
    // console.log("create Element");
    eventName = document.getElementById('inputEventName').value;
    eventLocation = document.getElementById('inputEventLocation').value;
    orgMail = document.getElementById('inputEventEmail').value;

    // console.log(eventName, eventLocation, orgMail,);
    document.getElementById('setEventTime').style.display = 'grid';
    document.getElementById('createEvent').style.display = 'none';
    document.getElementById('timeWarning').style.display = 'none';
    return true;
}

function setTime(e) {
    e.preventDefault();
    // console.log("setTime " + document.getElementById('starttime').value);
    startDate = document.getElementById('startdate').value;
    startTime = document.getElementById('starttime').value;
    endDate = document.getElementById('enddate').value;
    endTime = document.getElementById('endtime').value;
    allday = document.getElementById('allDay').checked;

    if (validateDate(startDate, endDate, startTime, endTime)) {

        document.getElementById('mainContent').style.display = 'none';
        document.getElementById('setEventTime').style.display = 'none';
        document.getElementById('timeWarning').style.display = 'none';
        document.getElementById('additionalEventinfo').style.display = 'grid';

        return true;
    } else {
        return false;
    }
}

function validateTime(sTime, eTime) {
    let startHr = parseInt(sTime.substr(0, 2)); //validated through html pattern
    let startMin = parseInt(sTime.substr(3, 2));
    let endHr = parseInt(eTime.substr(0, 2));
    let endMin = parseInt(eTime.substr(3, 2));

    if (sTime == eTime) {
        // console.log("start time is equal to end time");
        return true;
    } else if (startHr > endHr) {
        console.error("start hr is after end hr");
        return false;
    } else if (startHr < endHr) {
        // console.log("start hr is before end hr");
        return true;
    } else if (startHr == endHr) {
        // console.log("start hr is equal to end hr");
        if (startMin > endMin) {
            console.error("start min is after end min");
            return false;
        } else if (startMin < endMin) {
            // console.log("start min is before end min");
            return true;
        } else {
            // console.log("start min is equal to end min");
            return true;
        }
    }
}

function validateDate(sDate, eDate, sTime, eTime) {
    let startYear = parseInt(sDate.substr(0, 4), 10);
    let startMonth = parseInt(sDate.substr(5, 2), 10);
    let startDay = parseInt(sDate.substr(8, 2), 10);
    let endYear = parseInt(eDate.substr(0, 4), 10);
    let endMonth = parseInt(eDate.substr(5, 2), 10);
    let endDay = parseInt(eDate.substr(8, 2), 10);

    // console.log(sDate);
    // console.log(startYear + ',' + startMonth + ',' + startDay);
    // console.log(endYear + ',' + endMonth + ',' + endDay);

    if (startYear == endYear) {
        if (startMonth == endMonth) {
            if (startDay == endDay) {
                if (validateTime(sTime, eTime)) {
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

    // console.log("category " + category);
    if (category != null) {
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
    let file = document.getElementById('image').files;
    if (file.length > 0) {
        let fileLoaded = file[0];
        const reader = new FileReader();
        reader.onloadend = function (e) {
            // console.log("result: " + e.target.result);
            //calculate file size
            let size;
            if (e.target.result.slice(-2) == "==") {
                size = (e.target.result.length * (3 / 4)) - 2;
            } else {
                size = (e.target.result.length * (3 / 4)) - 1;
            }
            // console.log(size);
            //check if file size exceeds maximum
            if (size >= 500000) {
                console.error("chosen image is too large");
                //visual feedback
                $('#imgErrModal').modal('show');
                image = null;
            } else {
                image = e.target.result;
            }
        }
        reader.readAsDataURL(fileLoaded);
    }
}

function encodeUpdate() {
    let file = document.getElementById('updatedImage').files;
    if (file.length > 0) {
        let fileLoaded = file[0];
        const reader = new FileReader();
        reader.onloadend = function (e) {
            //calculate file size
            if (e.target.result.slice(-2) == "==") {
                size = (e.target.result.length * (3 / 4)) - 2;
            } else {
                size = (e.target.result.length * (3 / 4)) - 1;
            }
            //check if file size exceeds maximum
            if (size >= 500000) {
                console.error("chosen image is too large");
                //visual feedback
                $('#imgErrModal').modal('show');
                image = null;
            } else {
                image = e.target.result;
            }
        }
        reader.readAsDataURL(fileLoaded);
        // console.log(image);
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
    }).then((response) => {
        // console.log("Status:" + response.status);
        if (response.status != 200) {
            $('#errModal').modal('show');
        }
        return response.json();
    }).then((out) => {
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
            }).then((response) => {
                // console.log("Statuss:" + response.status);
                if (response.status != 204) {
                    $('#errModal').modal('show');
                }
            }).catch(err => {
                console.error(err);
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
    // console.log(sending);
    fetch(`${url}/events`, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(sending)
    }).then((response) => {
        // console.log(response);
        // console.log("Status:" + response.status);
        if (response.status != 200) {
            $('#errModal').modal('show');
        }
        return response.json();
    }).catch((err) => { console.error(err) });
    //reset all input fields
    document.getElementById('inputEventName').value = null;
    document.getElementById('inputEventLocation').value = null;
    document.getElementById('inputEventEmail').value = null;
    document.getElementById('startdate').value = null;
    document.getElementById('starttime').value = null;
    document.getElementById('enddate').value = null;
    document.getElementById('endtime').value = null;
    document.getElementById('allDay').checked = false;
    document.getElementById('status').value = 'Free';
    document.getElementById('webpage').value = null;
    document.getElementById('extra').value = null;
    image = null;
}

function getData() {
    let select = document.getElementById('categorySelect');
    let table = document.getElementById('table');
    table.innerHTML = '<tr><th>Name</th><th>Delete</th></tr>';
    //get categories
    fetch(`${url}/categories`, {
        cache: 'no-cache'
    }).then((res) => {
        // console.log("Status:" + res.status);
        if (res.status != 200) {
            $('#errModal').modal('show');
        }
        return res.json();
    }).then((out) => {
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
                }).then((response) => {
                    // console.log("Status:" + response.status);
                    if (response.status != 204) {
                        $('#errModal').modal('show');
                    }
                }).catch(err => {
                    console.error(err);
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
    }).catch(err => console.error(err));
}

function getEvents() {
    let tableEventList = document.getElementById('tableEventList');
    tableEventList.innerHTML = '<tr><th>Name</th><th>more</th><th>Delete</th></tr>';
    //get events
    fetch(`${url}/events`, {
        cache: 'no-store'
    }).then(async (res) => {
        // console.log(res);
        let data = await res.json();
        if (res.status != 200) {
            $('#errModal').modal('show');
        }
        // console.log(data);
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
                // console.log(element.id);
                updateId = element.id;
                // console.log(updateId);

                fetch(`${url}/events/${element.id}`).then(async (res) => {
                    let data = await res.json();
                    // console.log("Status:" + res.status);
                    if (res.status != 200) {
                        $('#errModal').modal('show');
                    }
                    return data;
                }).then((out) => {
                    document.getElementById('eventList').style.display = 'none';
                    document.getElementById('event').style.display = 'grid';
                    let eventTable = document.getElementById('eventTable');
                    // console.log('allday: ' + out.allday);
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
                    title = document.createTextNode('Organizer');
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
                    if (out.webpage != null) {
                        row = document.createElement('tr');
                        row.id = out.webpage;
                        cell1 = document.createElement('th');
                        cell1.setAttribute('scope', 'row');
                        cell2 = document.createElement('td');
                        anchor = document.createElement('a');
                        title = document.createTextNode('Webpage');
                        content = document.createTextNode(out.webpage);
                        anchor.appendChild(content);
                        if (out.webpage.substr(0, 4) == 'http') {
                            anchor.href = out.webpage;
                        } else {
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
                    if (out.categories.length > 0) {
                        row = document.createElement('tr');
                        cell1 = document.createElement('th');
                        cell1.setAttribute('scope', 'row');
                        cell2 = document.createElement('td');
                        title = document.createTextNode('Categories');
                        let names;
                        out.categories.forEach((res) => {
                            if (names != undefined) {
                                names += ` ${res.name},`
                            } else {
                                names = `${res.name},`;
                            }
                        });
                        let name = document.createTextNode(names);
                        cell1.appendChild(title);
                        cell2.appendChild(name);
                        row.appendChild(cell1);
                        row.appendChild(cell2);
                        eventTable.appendChild(row);
                    } else {
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
                    if (out.imageurl != null) {
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
                    //Edit the Event
                    document.getElementById('eventEdit').onclick = function () {
                        //go to event edit div
                        document.getElementById('manage').style.display = 'grid';
                        document.getElementById('event').style.display = 'none';
                        //fill editing table
                        let manageTable = document.getElementById('manageTable');
                        manageTable.innerHTML = '<tr><th scope="col">Description</th><th scope="col">Edit content</th><th scope="col"></th></tr>';
                        //Title
                        row = document.createElement('tr');
                        cell1 = document.createElement('th');
                        cell1.setAttribute('scope', 'row');
                        cell2 = document.createElement('td');
                        cell1.appendChild(document.createTextNode('Event title:'));
                        let updateInput = document.createElement('input');
                        updateInput.setAttribute('onkeyup', 'lengthChecker(this)');
                        updateInput.classList.add('form-control');
                        updateInput.setAttribute('required', 'true');
                        updateInput.setAttribute('id', 'updatedTitle');
                        updateInput.setAttribute('value', out.title);
                        cell2.appendChild(updateInput);
                        row.appendChild(cell1);
                        row.appendChild(cell2);
                        manageTable.appendChild(row);
                        //location
                        row = document.createElement('tr');
                        cell1 = document.createElement('th');
                        cell1.setAttribute('scope', 'row');
                        cell2 = document.createElement('td');
                        cell1.appendChild(document.createTextNode('Event location:'));
                        updateInput = document.createElement('input');
                        updateInput.classList.add('form-control');
                        updateInput.setAttribute('required', 'true');
                        updateInput.setAttribute('id', 'updatedLocation');
                        updateInput.setAttribute('value', out.location);
                        cell2.appendChild(updateInput);
                        row.appendChild(cell1);
                        row.appendChild(cell2);
                        manageTable.appendChild(row);
                        //organizer
                        row = document.createElement('tr');
                        cell1 = document.createElement('th');
                        cell1.setAttribute('scope', 'row');
                        cell2 = document.createElement('td');
                        cell1.appendChild(document.createTextNode('Event organizer:'));
                        updateInput = document.createElement('input');
                        updateInput.classList.add('form-control');
                        updateInput.setAttribute('required', 'true');
                        updateInput.setAttribute('id', 'updatedOrganizer');
                        updateInput.setAttribute('value', out.organizer);
                        cell2.appendChild(updateInput);
                        row.appendChild(cell1);
                        row.appendChild(cell2);
                        manageTable.appendChild(row);
                        //starttime
                        row = document.createElement('tr');
                        cell1 = document.createElement('th');
                        cell1.setAttribute('scope', 'row');
                        cell2 = document.createElement('td');
                        cell3 = document.createElement('td');
                        cell1.appendChild(document.createTextNode('Start time:'));
                        updateInput = document.createElement('input');
                        updateInput.classList.add('form-control');
                        updateInput.setAttribute('id', 'updatedStartdate');
                        updateInput.setAttribute('name', 'startdate');
                        updateInput.setAttribute('placeholder', 'DD/MM/YYYY');
                        updateInput.setAttribute('value', out.start.substr(0, 10));
                        updateInput.setAttribute('required', 'true');
                        updateTimeDiv = document.createElement('div');
                        updateTimeDiv.classList.add('input-group');
                        updateTimeDiv.classList.add('clockpicker');
                        updateTimeDiv.setAttribute('data-placement', 'top');
                        updateTimeDiv.setAttribute('data-align', 'top');
                        updateTimeDiv.setAttribute('data-autoclose', 'true');
                        updateTimeInput = document.createElement('input');
                        updateTimeInput.setAttribute('type', 'text');
                        updateTimeInput.setAttribute('id', 'updatedStarttime');
                        updateTimeInput.classList.add('form-control');
                        updateTimeInput.setAttribute('pattern', '[0-9]{2}:[0-9]{2}');
                        updateTimeInput.setAttribute('placeholder', 'hh:mm');
                        updateTimeInput.setAttribute('required', 'true');
                        updateTimeInput.setAttribute('value', out.start.substr(11, 5));
                        updateTimeDiv.appendChild(updateTimeInput);
                        cell2.appendChild(updateInput);
                        cell3.appendChild(updateTimeDiv);
                        row.appendChild(cell1);
                        row.appendChild(cell2);
                        row.appendChild(cell3);
                        manageTable.appendChild(row);
                        //enddime
                        row = document.createElement('tr');
                        cell1 = document.createElement('th');
                        cell1.setAttribute('scope', 'row');
                        cell2 = document.createElement('td');
                        cell3 = document.createElement('td');
                        cell1.appendChild(document.createTextNode('End time:'));
                        updateInput = document.createElement('input');
                        updateInput.classList.add('form-control');
                        updateInput.setAttribute('id', 'updatedEnddate');
                        updateInput.setAttribute('name', 'enddate');
                        updateInput.setAttribute('placeholder', 'DD/MM/YYYY');
                        updateInput.setAttribute('value', out.end.substr(0, 10));
                        updateInput.setAttribute('required', 'true');
                        updateTimeDiv = document.createElement('div');
                        updateTimeDiv.classList.add('input-group');
                        updateTimeDiv.classList.add('clockpicker');
                        updateTimeDiv.setAttribute('data-placement', 'top');
                        updateTimeDiv.setAttribute('data-align', 'top');
                        updateTimeDiv.setAttribute('data-autoclose', 'true');
                        updateTimeInput = document.createElement('input');
                        updateTimeInput.setAttribute('type', 'text');
                        updateTimeInput.setAttribute('id', 'updatedEndtime');
                        updateTimeInput.classList.add('form-control');
                        updateTimeInput.setAttribute('pattern', '[0-9]{2}:[0-9]{2}');
                        updateTimeInput.setAttribute('placeholder', 'hh:mm');
                        updateTimeInput.setAttribute('required', 'true');
                        updateTimeInput.setAttribute('value', out.end.substr(11, 5));
                        updateTimeDiv.appendChild(updateTimeInput);
                        cell2.appendChild(updateInput);
                        cell3.appendChild(updateTimeDiv);
                        row.appendChild(cell1);
                        row.appendChild(cell2);
                        row.appendChild(cell3);
                        manageTable.appendChild(row);
                        initDatepicker();
                        $('.clockpicker').clockpicker();
                        //allday
                        row = document.createElement('tr');
                        row.id = 'out.allday';
                        cell1 = document.createElement('th');
                        cell1.setAttribute('scope', 'row');
                        cell2 = document.createElement('td');
                        title = document.createTextNode('Event duration');
                        let contentDiv = document.createElement('div');
                        contentDiv.classList.add('custom-control');
                        contentDiv.classList.add('custom-switch');
                        content = document.createElement('input');
                        content.setAttribute('type', 'checkbox');
                        content.setAttribute('id', 'updatedAllday');
                        content.setAttribute('onclick', 'disableTime()');
                        if (out.allday == true) {
                            content.setAttribute('checked', 'true');
                            document.getElementById('updatedStarttime').disabled = true;
                            document.getElementById('updatedEndtime').disabled = true;
                        }
                        content.classList.add('custom-control-input');
                        label = document.createElement('label');
                        label.classList.add('custom-control-label');
                        label.setAttribute('for', 'updatedAllday');
                        label.innerText = 'Whole day?';
                        contentDiv.appendChild(content);
                        contentDiv.appendChild(label);
                        cell1.appendChild(title);
                        cell2.appendChild(contentDiv);
                        row.appendChild(cell1);
                        row.appendChild(cell2);
                        manageTable.appendChild(row);
                        //availability
                        row = document.createElement('tr');
                        cell1 = document.createElement('th');
                        cell1.setAttribute('scope', 'row');
                        cell2 = document.createElement('td');
                        cell1.appendChild(document.createTextNode('Event availability:'));
                        updateInput = document.createElement('select');
                        updateInput.classList.add('custom-select');
                        updateInput.setAttribute('required', 'true');
                        updateInput.setAttribute('id', 'updatedStatus');
                        if (out.status == 'Free') {
                            updateInput.innerHTML += '<option value="Free" selected>Free</option>';
                            updateInput.innerHTML += '<option value="Busy">Busy</option>';
                            updateInput.innerHTML += '<option value="Tentative">Tentative</option>';
                        } else if (out.status == 'Busy') {
                            updateInput.innerHTML += '<option value="Free">Free</option>';
                            updateInput.innerHTML += '<option value="Busy" selected>Busy</option>';
                            updateInput.innerHTML += '<option value="Tentative">Tentative</option>';
                        } else if (out.status == 'Tentative') {
                            updateInput.innerHTML += '<option value="Free">Free</option>';
                            updateInput.innerHTML += '<option value="Busy">Busy</option>';
                            updateInput.innerHTML += '<option value="Tentative"selected>Tentative</option>';
                        }
                        cell2.appendChild(updateInput);
                        row.appendChild(cell1);
                        row.appendChild(cell2);
                        manageTable.appendChild(row);
                        //webpage
                        if (out.webpage != null) {
                            row = document.createElement('tr');
                            cell1 = document.createElement('th');
                            cell1.setAttribute('scope', 'row');
                            cell2 = document.createElement('td');
                            cell1.appendChild(document.createTextNode('Event website:'));
                            updateInput = document.createElement('input');
                            updateInput.classList.add('form-control');
                            updateInput.setAttribute('id', 'updatedWebsite');
                            updateInput.setAttribute('value', out.webpage);
                            cell2.appendChild(updateInput);
                            row.appendChild(cell1);
                            row.appendChild(cell2);
                            manageTable.appendChild(row);
                        } else {
                            row = document.createElement('tr');
                            cell1 = document.createElement('th');
                            cell1.setAttribute('scope', 'row');
                            cell2 = document.createElement('td');
                            cell1.appendChild(document.createTextNode('Event website:'));
                            updateInput = document.createElement('input');
                            updateInput.classList.add('form-control');
                            updateInput.setAttribute('id', 'updatedWebsite');
                            cell2.appendChild(updateInput);
                            row.appendChild(cell1);
                            row.appendChild(cell2);
                            manageTable.appendChild(row);
                        }
                        //extra/information/comment
                        // console.log('extra: ' + out.extra);
                        if (out.extra != null) {
                            row = document.createElement('tr');
                            cell1 = document.createElement('th');
                            cell1.setAttribute('scope', 'row');
                            cell2 = document.createElement('td');
                            cell1.appendChild(document.createTextNode('Event Information:'));
                            updateInput = document.createElement('textarea');
                            updateInput.classList.add('form-control');
                            updateInput.setAttribute('id', 'updatedExtra');
                            updateInput.appendChild(document.createTextNode(out.extra));
                            updateInput.setAttribute('maxlength', '2000');
                            cell2.appendChild(updateInput);
                            row.appendChild(cell1);
                            row.appendChild(cell2);
                            manageTable.appendChild(row);
                        } else {
                            row = document.createElement('tr');
                            cell1 = document.createElement('th');
                            cell1.setAttribute('scope', 'row');
                            cell2 = document.createElement('td');
                            cell1.appendChild(document.createTextNode('Event website:'));
                            updateInput = document.createElement('textarea');
                            updateInput.classList.add('form-control');
                            updateInput.setAttribute('id', 'updatedExtra');
                            updateInput.setAttribute('maxlength', '2000');
                            cell2.appendChild(updateInput);
                            row.appendChild(cell1);
                            row.appendChild(cell2);
                            manageTable.appendChild(row);
                        }
                        //categories
                        if (out.categories.length > 0) {
                            row = document.createElement('tr');
                            cell1 = document.createElement('th');
                            cell1.setAttribute('scope', 'row');
                            cell2 = document.createElement('td');
                            // cell33 = document.createElement('td');
                            cell1.appendChild(document.createTextNode('Event categories:'));
                            updateInput = document.createElement('select');
                            updateInput.classList.add('form-control');
                            updateInput.setAttribute('id', 'updatedCategories');
                            updateInput.setAttribute('multiple', '');
                            fetch(`${url}/categories`, { cache: 'no-cache' }).then((res) => {
                                // console.log("Status:" + res.status);
                                if (res.status != 200) {
                                    $('#errModal').modal('show');
                                }
                                return res.json();
                            }).then((ret) => {
                                ret.forEach(element => {
                                    let added = false;
                                    out.categories.forEach((e) => {
                                        if (e.id == element.id) {
                                            // cell33.appendChild(document.createTextNode(`${e.name} `));
                                            document.getElementById('updatedCategories').innerHTML += `<option value="${element.id}" selected="selected">${element.name}</option>`;
                                            added = true;
                                        }
                                    });
                                    if (!added) {
                                        document.getElementById('updatedCategories').innerHTML += `<option value="${element.id}">${element.name}</option>`;
                                    }
                                }
                                )
                            });
                            cell2.appendChild(updateInput);
                            row.appendChild(cell1);
                            row.appendChild(cell2);
                            // row.appendChild(cell33);
                            manageTable.appendChild(row);
                        } else {
                            row = document.createElement('tr');
                            cell1 = document.createElement('th');
                            cell1.setAttribute('scope', 'row');
                            cell2 = document.createElement('td');
                            cell1.appendChild(document.createTextNode('Event categories:'));
                            updateInput = document.createElement('select');
                            updateInput.classList.add('form-control');
                            updateInput.setAttribute('id', 'updatedCategories');
                            updateInput.setAttribute('multiple', '');
                            fetch(`${url}/categories`, { cache: 'no-cache' }).then((res) => {
                                // console.log("Status:" + res.status);
                                if (res.status != 200) {
                                    $('#errModal').modal('show');
                                }
                                return res.json();
                            }).then((out) => {
                                out.forEach(element => {
                                    document.getElementById('updatedCategories').innerHTML += `<option value="${element.id}">${element.name}</option>`;
                                }
                                )
                            });
                            cell2.appendChild(updateInput);
                            row.appendChild(cell1);
                            row.appendChild(cell2);
                            manageTable.appendChild(row);
                        }
                        //image
                        if (out.imageurl != null) {
                            row = document.createElement('tr');
                            row.setAttribute('id', 'imagerow');
                            cell1 = document.createElement('th');
                            cell1.setAttribute('scope', 'row');
                            cell2 = document.createElement('td');
                            cell3 = document.createElement('td');
                            cell1.appendChild(document.createTextNode('Image:'));
                            let imageDiv = document.createElement('div');
                            imageDiv.classList.add('custom-file');
                            updateInput = document.createElement('input');
                            updateInput.classList.add('custom-file-input');
                            updateInput.classList.add('img');
                            updateInput.setAttribute('accept', 'image/png, image/jpeg');
                            updateInput.setAttribute('type', 'file');
                            updateInput.setAttribute('onchange', 'encodeUpdate()');
                            updateInput.setAttribute('id', 'updatedImage');
                            let updateImageLabel = document.createElement('label');
                            updateImageLabel.classList.add('custom-file-label');
                            updateImageLabel.setAttribute('for', 'updatedImage');
                            updateImageLabel.setAttribute('id', 'updateImageUpload');
                            updateImageLabel.innerText = 'Image';
                            imageDiv.appendChild(updateInput);
                            imageDiv.appendChild(updateImageLabel);
                            cell2.appendChild(imageDiv);
                            anchor = document.createElement('a');
                            anchor.setAttribute('id', 'showImage')
                            anchor.appendChild(document.createTextNode('Show current image'));
                            if (out.imageurl.substr(0, 4) == 'http') {
                                anchor.href = out.imageurl;
                            } else {
                                anchor.href = `https://${out.imageurl}`;
                            }
                            anchor.target = '_blank';
                            let linebreak = document.createElement('br');
                            let deleteImg = document.createElement('button');
                            deleteImg.classList.add('btn');
                            deleteImg.classList.add('btn-primary');
                            deleteImg.classList.add('btn-sm');
                            deleteImg.innerText = 'Delete image';
                            deleteImg.setAttribute('type', 'button');
                            deleteImg.setAttribute('id', 'deleteImgButton');
                            deleteImg.setAttribute('data-toggle', 'modal');
                            deleteImg.setAttribute('data-target', '#delImgModal');
                            cell3.appendChild(anchor);
                            cell3.appendChild(linebreak);
                            cell3.appendChild(deleteImg);
                            row.appendChild(cell1);
                            row.appendChild(cell2);
                            row.appendChild(cell3);
                            manageTable.appendChild(row);
                        } else {
                            row = document.createElement('tr');
                            cell1 = document.createElement('th');
                            cell1.setAttribute('scope', 'row');
                            cell2 = document.createElement('td');
                            cell1.appendChild(document.createTextNode('Image:'));
                            let imageDiv = document.createElement('div');
                            imageDiv.classList.add('custom-file');
                            updateInput = document.createElement('input');
                            updateInput.classList.add('custom-file-input');
                            updateInput.classList.add('img');
                            updateInput.setAttribute('accept', 'image/png, image/jpeg');
                            updateInput.setAttribute('type', 'file');
                            updateInput.setAttribute('onchange', 'encodeUpdate()');
                            updateInput.setAttribute('id', 'updatedImage');
                            let updateImageLabel = document.createElement('label');
                            updateImageLabel.classList.add('custom-file-label');
                            updateImageLabel.setAttribute('for', 'updatedImage');
                            updateImageLabel.setAttribute('id', 'updateImageUpload');
                            updateImageLabel.innerText = 'Image';
                            imageDiv.appendChild(updateInput);
                            imageDiv.appendChild(updateImageLabel);
                            cell2.appendChild(imageDiv);
                            row.appendChild(cell1);
                            row.appendChild(cell2);
                            manageTable.appendChild(row);
                        }
                    }
                }).catch(err => {
                    console.error(err);
                    if (res.status != 200) {
                        $('#errModal').modal('show');
                    }
                });
            }
            let button2 = document.createElement('button');
            button2.innerText = 'delete';
            button2.classList.add('btn');
            button2.classList.add('btn-primary');
            button2.classList.add('btn-sm');
            button2.onclick = function () {
                fetch(`${url}/events/${element.id}`, {
                    method: 'DELETE',
                }).then((res) => {
                    // console.log("Status:" + res.status);
                    if (res.status != 204) {
                        $('#errModal').modal('show');
                    }
                }).catch(err => {
                    console.error(err);
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

function deleteImage() {
    document.getElementById('showImage').style.display = 'none';
    document.getElementById('deleteImgButton').style.display = 'none';
    // event.preventDefault();
    fetch(`${url}/images/${updateId}`, {
        method: 'DELETE'
    }).then((result) => {
        // console.log(result);
        // console.log("Status:" + result.status);
        if (result.status != 204) {
            $('#errModal').modal('show');
        }
        result.json;
    }).catch((err) => {
        console.error(err);
    });
    $('#delImgModal').close()
}

function disableTime() {
    if (document.getElementById('updatedAllday').checked == true) {
        document.getElementById('updatedStarttime').disabled = true;
        document.getElementById('updatedStarttime').value = '00:00';
        document.getElementById('updatedEndtime').disabled = true;
        document.getElementById('updatedEndtime').value = '23:59';
        document.getElementById('updatedEnddate').value = document.getElementById('updatedStartdate').value;
    } else {
        document.getElementById('updatedStarttime').disabled = false;
        document.getElementById('updatedEndtime').disabled = false;
    }
}

function initDatepicker() {
    var startdate_input = $('input[name="startdate"]'); //our date input has the name "startdate"
    var enddate_input = $('input[name="enddate"]'); //our date input has the name "enddate"
    var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
    startdate_input.datepicker({
        format: 'yyyy-mm-dd',
        container: container,
        todayHighlight: true,
        autoclose: true,
    });
    enddate_input.datepicker({
        format: 'yyyy-mm-dd',
        container: container,
        todayHighlight: true,
        autoclose: true,
    });
}

function updateEntry() {
    let updatedStartdate = document.getElementById('updatedStartdate').value;
    let updatedEnddate = document.getElementById('updatedEnddate').value;
    let updatedStarttime = document.getElementById('updatedStarttime').value;
    let updatedEndtime = document.getElementById('updatedEndtime').value;
    let updatedCategoriesData = $("#updatedCategories").val();
    let updatedCategories = [];

    if (updatedCategoriesData != null) {
        updatedCategoriesData.forEach(e => {
            let data = { "id": e }
            updatedCategories.push(data);
        })
    }
    if (validateDate(updatedStartdate, updatedEnddate, updatedStarttime, updatedEndtime)) {
        let updatedSTime = updatedStartdate + 'T' + updatedStarttime;
        let updatedETime = updatedEnddate + 'T' + updatedEndtime;
        let updateJSON = {
            "title": document.getElementById('updatedTitle').value,
            "location": document.getElementById('updatedLocation').value,
            "organizer": document.getElementById('updatedOrganizer').value,
            "start": updatedSTime,
            "end": updatedETime,
            "status": document.getElementById('updatedStatus').value,
            "allday": document.getElementById('updatedAllday').checked,
            "webpage": document.getElementById('updatedWebsite').value,
            "imagedata": image,
            "categories": updatedCategories,
            "extra": document.getElementById('updatedExtra').value,
        }
        // console.log(updateJSON);
        document.getElementById('timeWarning').style.display = 'none';
        fetch(`${url}/events/${updateId}`, {
            method: "PUT",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateJSON)
        }).then((response) => {
            // console.log(response);
            // console.log("Status:" + response.status);
            if (response.status != 200) {
                $('#errModal').modal('show');
            }
            response.json;
        }).catch((err) => {
            console.error(err);
        });
    } else {
        document.getElementById('timeWarning').style.display = 'grid';
    }
    switchToMain();
    image = null;
}

let categorymaxchars = 30;
let titlemaxchars = 50;
let webmaxchars = 100;

function categoryNameChecker(element) {
    // console.log(element.value.length);
    if (element.value.length > categorymaxchars) {
        element.value = element.value.substr(0, categorymaxchars);
    }
}
function lengthChecker(element) {
    // console.log(element.value.length);
    if (element.value.length > titlemaxchars) {
        element.value = element.value.substr(0, titlemaxchars);
    }
}
function webChecker(element) {
    // console.log(element.value.length);
    if (element.value.length > webmaxchars) {
        element.value = element.value.substr(0, webmaxchars);
    }
}
