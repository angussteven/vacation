$(document).ready(function () {
	//prevent form from posting
	$("#loginForm").submit(function (event) {
		event.preventDefault();
	});

	//attempt to load the cache else wait for DB to load(first sign on or profile create)
	var firebaseLocalStorageEmail;
	try {
		 firebaseLocalStorageEmail = JSON.parse(localStorage.getItem(localStorage.key(1))).email
	} catch (error) {
		console.log("No cache detected.");
	}
	//if the cache exists perform DOM edits right away then call initialize() database
	if (firebaseLocalStorageEmail) {
		var emailStorage = JSON.parse(localStorage.getItem(localStorage.key(1))).email;
		document.getElementById("profileName").innerHTML = capitalizeName(localStorage.getItem("firstName")) + " " + capitalizeName(localStorage.getItem("lastName"));
		document.getElementById("profileTeam").innerHTML = 'Team: ' + localStorage.getItem("team");
		var vdays = document.getElementById("vacationdays");
		var info = "Total Days: " + localStorage.getItem("vacationDays") + "<br>Remaining Days: " + localStorage.getItem("daysLeft");
		vdays.innerHTML = info;
		document.getElementById("profileManager").innerHTML = 'Manager: ' + capitalizeName(localStorage.getItem("managerFirstName")) + " " + capitalizeName(localStorage.getItem("managerLastName"));

		//Render the pages NOW if in cache
		RenderCalendar();
		//update the cache
		initialize(emailStorage);
	}
	else {
		//event that checks if user is logged in or just signed on
		firebase.auth().onAuthStateChanged(function (user) {
			if (user) {
				RenderCalendar();
				initialize(user.email);		
			} else {
				console.log("Not logged in");
			}
		});
	}
});

//remove session and localstorage cache when signout
function fireSignOut() {
	firebase.auth().signOut().then(function () {
		$("#loginWrap").show();
		$("#wrap").hide();
		$("#sidebar").hide();
		$("#signOutButton").show();
		$("#wrapper").removeClass("wrapper");

		//clear out the cache
		localStorage.clear();

	}, function (error) {
		alertify.alert("Fail");
	});
}

function logIn() {
	var email = document.getElementById('email').value;
	var password = document.getElementById('password').value;

	if (password == "") {
		alertify.alert("Enter a password");
		return;
	}

	firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
		if (errorCode == 'auth/invalid-email') {
			alertify.alert(errorMessage);
		}
		else if (errorCode == 'auth/user-not-found') {
			alertify.alert(errorMessage);
		}
		else if (errorCode == 'auth/wrong-password') {
			alertify.alert(errorMessage);
		}
		console.log(errorCode, errorMessage);
	});
}
function RenderCalendar() {
	$("#loginWrap").hide();
	$("#wrap").show();
	$("#signOutButton").show();
	$("#uploadBtn").removeClass("no-click");
	$("#sidebar").show();
	$("#wrapper").addClass("wrapper");
	$('#calendar').fullCalendar('render');
}
