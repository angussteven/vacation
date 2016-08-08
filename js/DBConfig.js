 // Initialize Firebase
 var config = {
 	apiKey: "AIzaSyAeUUth3tU5auemQujKCmxRE3VS-y4QQxE",
 	authDomain: "vacationtracker-5d242.firebaseapp.com",
 	databaseURL: "https://vacationtracker-5d242.firebaseio.com",
 	storageBucket: "vacationtracker-5d242.appspot.com",
 };
 firebase.initializeApp(config);

var employeeCount = 0;
var teamCount = 0;
var allTeams = [];
var team;
var employee;
var teamsEmployees;
var keyToObject ;

var hiddenEmpField = $('#employeeCount');
console.log("Start");

// Implementation of getEmployeeCount
var getEmpCountTest = $.Deferred(getEmployeeCount);
getEmpCountTest.done(function(data){
  console.log("Employee Count: " + employeeCount);
});

// Implementation of getEmployeeCount
var getTeamCountTest = $.Deferred(getTeamCount);
getTeamCountTest.done(function(data){
  console.log("Team Count: " + teamCount);
});

// Implementation of getAllTeams
var getAllTeamsCallback = $.Deferred(getAllTeams);
getAllTeamsCallback.done(function(data){
	console.log("All da teams: ");
	console.log(allTeams);
});

// Implementation of getTeam
var getTeamCallback = $.Deferred(getTeam);
getTeamCallback.done(function(data){
	console.log("Team: " + team);
});

// Implementation of getEmployee
var getEmployeeCallback = $.Deferred(getEmployee("andrew.moawad@gm.com"));
getEmployeeCallback.done(function(data){
	if(employee == null){
		console.log("No employee found");
	}else{
		console.log("Name: " + employee.firstName + " " + employee.lastName);
		console.log("Email: " + employee.email);
		console.log("Total Vacation Days: " + employee.totalVacationDays);
		console.log("Remaining Vacation Days: " + employee.daysLeft);
	}
});

// Implementation of getEmployeesOnTeam
var getEmployeesOnTeamCallback = $.Deferred(getEmployeesOnTeam("quantum"));
getEmployeesOnTeamCallback.done(function(data){
	if(teamsEmployees == null){
		console.log("Team has no employees");
	}else{
		console.log(teamsEmployees);
	}
	//console.log(employee.firstName + " " + employee.lastName);               COMMENTED OUT BECAUSE OF JAVASCRIPT ERROR; cannot find property firstName of undefined
});

/**
*this function takes an email and returns the email with no special characters
*/
function fixEmail(tempEmail){
 	var result = tempEmail.replace(/[^a-zA-Z0-9]/g, '');
 	return result;
 }

 /*Get reference example=*/
 /*var value;
 var dbRef = firebase.database().ref().child('employee');
 dbRef.on('value', function(snapshot) {
 	console.log(snapshot.val());
 });*/

 //example of how to call the getEmployeeCount function
 // getEmployeeCount().then(function(count) {
 // 	console.log(count)
 // });
//deleteEvent(2);
 //saveEmployee("andrew","moawad",15,15,1,["michael.eilers@gm.com"],[1],true,"andrew.moawad@gm.com","1234");
 //saveManager("michael.eilers@gm.com",["zachary.dicino@gm.com"],"michael.eilers@gm.com");
 //saveTeam(1,["zachary.dicino@gm.com"],["michael.eilers@gm.com"],"Quantum");
 //saveEvent("zachary.dicino@gm.com",3,"08-29-2016","08-31-2016","business","vacation I need time","why");
 //saveHoliday(["01-01-2016","01-18-2016","03-25-2016","03-28-2016","05-30-2016","07-04-2016","09-05-2016","11-08-2016","11-11-2016","11-24-2016","11-25-2016","12-26-2016","12-27-2016","12-28-2016","12-29-2016","12-30-2016"]);

// Events //

// Adds a new event [TODO]
function addEvent(userID, startDate, endDate, title, description, alert, isBusiness, vacationUsed){
	// Create a new event

	// Remove appropriate vacation days from employee
}

// Deletes an event [UNKNOWN]
function deleteEvent(eventID){

	var ref = firebase.database().ref().child('event');
	ref.orderByChild("eventID").equalTo(eventID).on('value', function(snapshot) {
 	keyToObject = Object.keys(snapshot.val()).toString();
 	ref.child(keyToObject).remove();
 	//snapshot.ref().remove();
 });

	 //ref.remove();
	// Delete the event via the eventID
}

// Gets all the events for a given employee [TODO]
function getEmployeeEvents(userID){
	// Get all the vacation days for a given employee
	var ref = firebase.database().ref.child('event');
	ref.on('value', function(snapshot){
		console.log(snapshot.val());
	});
}

// Get all the events for the employees of a given team [TODO]
function getTeamEvents(teamID){
	// Get all the vacation days for all employees in a given team
}


/*
 	Save an event into the database
 	email: string (email)
 	eventID: int
 	startDate: string (ex. "08-29-2016")
 	endDate: string (ex. "08-31-2016")
 	vacationType: stirng (vaction or business)
 	eventTitle: string
 	title: string
 	description: string
 */
 // Add a new employee to the db [NEEDS TO BE TESTED]
 function saveEvent(email, eventID, startDate, endDate, vacationType,
 					  eventTitle, eventDescription) {
 	var tempEmail = fixEmail(email);
 	firebase.database().ref('event/' + tempEmail).set({
 		email: email,
 		eventID: eventID,
 		startDate: startDate,
 		endDate: endDate,
 		type: vacationType,
 		title: eventTitle,
 		description: eventDescription
 	});
 }

 // Updates a given event [TODO]
function updateEvent(){
	// Update the information for an event
}

// Employee //

// Get employee with given email address [DONE]
function getEmployee(emailAddress){
	var ref = firebase.database().ref().child('employee/' + fixEmail(emailAddress));
	ref.once('value', function(snapshot){
		if(snapshot.exists()){
			employee = snapshot.val();
		}
		else{
			employee = null;
		}
		getEmployeeCallback.resolve();
	})
}

// Get the employee with matching email
 	/*ref.orderByChild("email").equalTo(emailAddress).once('value', function(snapshot) { 

	// Get the employee with matching email
 	ref.orderByChild("email").equalTo(emailAddress).once('value', function(snapshot) {
 		if(snapshot.val() != null){
 			console.log(snapshot.val());
 			var id = Object.keys(snapshot.val()).toString();
 			console.log(id);
 			var empObject = snapshot.child(id).val();
 			employee = empObject;
 		}else{
 			console.log("No Employee Returned");
 		}
 		getEmployeeCallback.resolve();
 	})*/



// Try this from andrew: ref.orderByChild("eventID").equalTo(2).on('value', function(snapshot) {

// Gets the total number of employees in a database (included managers) [DONE]
 function getEmployeeCount() {
 	var count = 0;
 	var ref = firebase.database().ref().child('employee');
 	ref.on('value', function(snapshot) {
 		employeeCount = snapshot.numChildren();
 		getEmpCountTest.resolve();
 	});
 }

// Gets all the employees that are on a given team
function getEmployeesOnTeam(teamName){
	// Get all the employees that are on a team

	var ref = firebase.database().ref().child('employee');
	ref.orderByChild("team").equalTo(teamName.toLowerCase()).once('value', function(snapshot){
		if(snapshot.exists()){
			teamsEmployees = snapshot.val();
		} else{
			teamEmployees = null;
		}
		getEmployeesOnTeamCallback.resolve();
	})

}

/*
 	Save an employee into the database
 	totalVacation = int
 	daysLeft = int
 	teamID = int
 	managers = array of strings
 	events = array of ints (ids)
 	isManager = bool
 	employees = array of strings (emails) default null for now
 	everything else string
 */

 function saveEmployee(firstname, lastname, totalVacation, daysleft,
 						teamID, managers, events, isManager, email, password) {
 	var tempEmail = fixEmail(email);
 	firebase.database().ref('employee/' + tempEmail).set({
 		firstName: firstname,
 		lastName: lastname,
 		totalVacationDays: totalVacation,
 		daysLeft: daysleft,
 		team: teamID,
 		managers: managers,
 		events: events,
 		isManager: isManager,
 		email: email,
 		password: password,
 		employees: null
 	});

 	//if you are a manager, save the employee as a manager in the database
 	//setting the employee array to null for now
 	if (isManager) {
 		//still figuring this out
 	}

 	/**
 	 *	Now we must add this employee in their manager's employees list
 	 *	Do a get Manager call based on each manager in the managers array
 	 * 	insert this employee in the manager's employee list
 	 */
 }
//test for updateEmployee (successful): updateEmployee("andrewmoawadgmcom", "andrew", "moawad", "andrew.moawad@gm.com", 100, 50, "michael.eilers@gm.com", true, 1);
function updateEmployee(userID, firstName, lastName, emailAddress, totalVacation, usedVacation, manager, isManager, teamID){
	// Update the employee with the given userID
  //managers[managers.length()] = manager;
  var tempData = {
    firstName: firstName,
    lastName: lastName,
    email: emailAddress,
    totalVacationDays: totalVacation,
    daysLeft: totalVacation - usedVacation,
    //managers: managers,
    isManager: isManager,
    team: teamID
  };
  var updates = {};
  updates[userID] = tempData;
  return firebase.database().ref('employee').update(updates);
}

// Team //
function addTeam(teamName){

}

function addEmpToTeam(userID, teamID){
	// Add employee to team
}

function getAllTeams(){
	// Get all the teams
	var ref = firebase.database().ref().child('team');
 	ref.on('value', function(snapshot) {
 		snapshot.forEach(function(childSnapshot){
 			allTeams.push(childSnapshot.child("name").val());
		});
 		getAllTeamsCallback.resolve();
 	});
}

function getTeam(teamID){
	var ref = firebase.database().ref().child('team');
 	ref.on('value', function(snapshot) {

 		// TODO


 		getTeamCallback.resolve();
 	});
}

/*
  getTeamCount(), this method returns the
  total number of teams in the database
*/
 function getTeamCount() {
 	var count = 0;
 	var ref = firebase.database().ref().child('team');
 	ref.on('value', function(snapshot) {
 		count = snapshot.numChildren();
 		teamCount = count;
 		getTeamCountTest.resolve();
 	});
 }

function removeEmpFromTeam(userID, teamID){
	var refs = firebase.database().ref().child('team');
	var parent;
	var child;
	refs.orderByChild("teamID").equalTo(5).on('value', function(snapshot) {
 	//ref.remove();
 	parent = Object.keys(snapshot.val());
 	console.log(snapshot.val());
 	console.log("this is the parent of that table:" + parent)
 	snapshot.forEach(function(childSnapshot){
 				//console.log("Team ID: " + childSnapshot.child('employee').val());
 				console.log(childSnapshot.val());
 				 	childSnapshot.child('employee').forEach(function(grandchildSnapshot){
 				//console.log("Team ID: " + childSnapshot.child('employee').val());
 				console.log(grandchildSnapshot.val() + " in grand child \n");
 				if(grandchildSnapshot.val().toString() === userID)
 				{
 					child = Object.keys(grandchildSnapshot.val());
 					console.log(grandchildSnapshot);
 					//works but deleted the wrong child
 					//refs.child(parent.toString()).child("employee").child(child[0].toString()).remove();
 				}
 			});
 			});
 	// keyToObject = Object.keys(snapshot.val()).toString();
 	// ref.child(keyToObject).remove();
 	//snapshot.ref().remove();
 });

	 //ref.remove();
	// Delete the event via the eventID
}


/*
 	Save a team into the database
 	teamID = int
 	employees = array of strings (emails)
 	managers = array of strings (emails)
 */
 function saveTeam(teamID, employees, managers, teamName) {
 	firebase.database().ref('team/' + teamName).set({
 		teamID: teamID,
 		employee: employees,
 		manager: managers,
 		name: teamName
 	});
 }

function switchTeams(userID, fromTeamID, toTeamID){

}

// Manager //
function getEmpManager(userID){
	// Get the employee info for the user's manager
}

function getTeamManager(teamID){
	// Get the manager for the team
}

// User
/*
	 This method will add the user to the User table(firebase),
	 and also store the rest of the information in the database
 */
 function addUser(email, password,firstName,lastName,totalVacationDays
 					,dayslefts,isManager,managers,team,employees,pathToPicture,
 					title) {
 	firebase.auth().createUserWithEmailAndPassword(email, password)
 		.then(function(data) {
 			saveEmployee(firstName, lastName, totalVacationDays, dayslefts, team, managers, "EVENTSSS", isManager, email, "WHY DO WE SAVE PASSWORD??");
 		})
 		.catch(function(error) {
 			var errorCode = error.code;
 			var errorMessage = error.message;

 			if (errorCode == 'auth/weak-password') {
 				console.log(errorCode);
 			} else if (errorCode == 'auth/email-already-in-use') {
 				console.log(errorCode);
 			} else if (errorCode == 'auth/invalid-email') {
 				console.log(errorCode);
 			} else {
 				console.log(errorMessage);
 			}
 		});
 }

 function saveUsertoDatabase(mail, password,firstName,lastName,totalVacationDays
 					,dayslefts,isManager,managers,team,employees,pathToPicture,
 					title){

 	console.log(email,password);
 }

 // Misc
function calculateVacationDays(startDate, endDate){

}
