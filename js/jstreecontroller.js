/*
* Get team information from session
*/
var data = sessionStorage.getItem('user');
var userData = JSON.parse(data);
var team = sessionStorage.getItem('teamEmployees');
var teamData = JSON.parse(team);

/*
* Keeps track the events that are currently visible on the calendar.
*/
var activeEvents = [];

/*
* Generate the HTML elements needed to create the tree and populate them with the json data.
*/
$(document).ready(function() {
	/*
	* Call the function that creates the HTML objects and adds the json data to them.
	*/
	populateList();

	/*
	* Get the HTML object were we want to create the tree.
	*/
	$('#container').jstree();

	/*
	* This changed the background color of the items in the tree to make them appear selected
	*/
	$('ul').on('click', 'li', function(e){
		e.stopPropagation();
		var id = $(this).css("background-color");
		if (id == 'rgba(194, 218, 218, 0.458824)') {
			$(this).css('background-color', 'rgba(0, 0, 0, 0)');
			removeEmployeeEvents(teamData[this.id].email);
		}
		else {
			$(this).css('background-color', 'rgba(194, 218, 218, 0.46)');
			renderEmployeeEvents(teamData[this.id].email);

		}
	});
});

/*
* This function removed the events from a calendar belonging to the employee that was deselected.
* It takes that persons employeeID as an argument.
*/
function removeEmployeeEvents(employeeID) {
	// Local Variables
	var promise;
	var event;
	/*
	* The promise is used to make sure that we have data back from the database before we continue
	* with the function.
	*/
	promise = getEmployeeEvents(employeeID.toString());
	promise.done(function (data) {
		/*
		* We iterate over the events belonging to an employee.
		*/
		for (var currentEvent in data) {
			/*
			* These events are then checked against the local array and if its there it is removed.
			*/
			if ($.inArray(data[currentEvent].eventID.toString(), activeEvents) != -1) {
				activeEvents.splice(activeEvents.indexOf(data[currentEvent].eventID.toString()), 1);
				$('#calendar').fullCalendar('removeEvents', data[currentEvent].eventID.toString());
			}
		}
	});
}

/*
* This function displays all of the events belonging to a given employee. It takes the employeeID
* as an argument.
*/
function renderEmployeeEvents(employeeID) {
	// Local variables.
	var promise;
	var event;
	/*
	* The promise is used to make sure that we have data back from the database before we continue
	* with the function.
	*/
	promise = getEmployeeEvents(employeeID.toString());
	promise.done(function (data) {
		/*
		* Every event returned from the database is added into our local array.
		*/
		for (var currentEvent in data) {
			/*
			* If the event is already in the array we don't save it again.
			*/
			if ($.inArray(data[currentEvent].eventID.toString(), activeEvents) == -1) {
				/*
				* The event is saved as a key-pair value array.
				*/
				event = {
					id:  data[currentEvent].eventID,
					title: data[currentEvent].title,
					start: data[currentEvent].startDate,
					end: data[currentEvent].endDate,
					description: data[currentEvent].description
				};
				/*
				* We use the eventID to keep track of currently rendered events so that is 
				* saved into the array.
				*/
				activeEvents.push(data[currentEvent].eventID.toString());
				/*
				* The current event is then rendered using the information in the event 
				* variable.
				*/
				$('#calendar').fullCalendar('renderEvent', event, true);
			}
			
		}
	});
	promise.fail(function (data) {
		console.log("Error: " + data);
	});
};

/*
* This function takes json data as an argument and uses that data to populate the tree dynamically.
*/
function populateList() {
	/*
	* These vaiables hold the different HTML objects that we insert into the HTML file.
	*/
	var unorderedList = document.createElement('ul');
	var manager;
	var employee;
	var nestedList;

	/*
	* The first for loop gets the manager and addes it as a child of the container div. 
	*/
	manager = document.createElement('li');
	for (var key in teamData) {
		if(teamData[key].isManager) {
			console.log("Key: " + key);
			manager.appendChild(document.createTextNode(capitalize(teamData[key].firstName) + " " + capitalize(teamData[key].lastName)));
			manager.setAttribute('id', key.toString());
		}
	}

	nestedList = document.createElement('ul');
	manager.appendChild(nestedList);

	/*
	* This second for loop creates an HTML element for every team member which are then added
	* as a child of the manager.
	*/
	for (var key in teamData) {
		if (!teamData[key].isManager) {
			employee = document.createElement('li');
			employee.appendChild(document.createTextNode(capitalize(teamData[key].firstName) + " " + capitalize(teamData[key].lastName)));
			employee.setAttribute('id', key.toString());
			nestedList.appendChild(employee);
		}
	}
	/*
	* The current is then added as a child to thye root unorderded list.
	*/
	unorderedList.appendChild(manager);

	/* 
	* The unordered list is added as a child of the container div.
	*/
	document.getElementById("container").appendChild(unorderedList);
};

/*
* This function capilizes the first letter of the string passed in.
*/
function capitalize(string) {
    return string[0].toUpperCase() + string.slice(1);
}
