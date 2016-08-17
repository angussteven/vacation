$(document).foundation();

$(document).ready(function() {

var emailAddress;
var eventOwner;

firebase.auth().onAuthStateChanged(function (user) {
  if(user) {
    emailAddress = user.email;
    //emailAddress = fixEmail(emailAddress);
  }
});

function checkDate(date) {
  var today = new Date().toJSON().slice(0,10);
  if(date < today) {
    return false;
  }
  return true;
}

// date1 is start date, date2 is end date
function compareDates(date1, date2) {
  date1 = parseInt(date1.replace(/-/g,''));
  date2 = parseInt(date2.replace(/-/g,''));
  if (date1 > date2) {
    return false;
  }
  return true;
}

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + s4() + s4() +
    s4() + s4() + s4() + s4();
}

function getEmail() {
  return emailAddress;
}

function fixEmail(tempEmail){
  var result = tempEmail.replace(/[^a-zA-Z0-9]/g, '');
  return result;
}

function createICSFile(managerEmail, userName, userEmail, startDate, endDate, isVacation, alert) {
  startDate = startDate.split('-');
  startDate = startDate[0] + startDate[1] + startDate[2];
  endDate = endDate.split('-');
  endDate = endDate[0] + endDate[1] + endDate[2];
  switch (alert) {
    case "alertFour":
      alert = "-PT5760M";
      break;

    case "alertWeek":
      alert = "-PT10080M";
      break;

    default:
      alert = "-P1D";
      break;
  }
  switch (isVacation) {
    case "vacation":
      isVacation = "Vacation";
      break;
    case "travel":
      isVacation = "Business Travel";
      break;
  }
  var icsMSG = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Our Company//NONSGML v1.0//EN\nBEGIN:VEVENT\nDTSTAMP:20120315T170000Z\nATTENDEE;CN=" + userName + " ;RSVP=TRUE:MAILTO:" + userEmail + "\nATTENDEE;CN= ;RSVP=TRUE:MAILTO:" + managerEmail + "\nORGANIZER;CN=Me:MAILTO:" + userEmail + "\nDTSTART:" + startDate +"\nDTEND:" + endDate +"\nLOCATION:OOO\nSUMMARY:"+ isVacation + "\nX-MICROSOFT-CDO-BUSYSTATUS:OOF\nBEGIN:VALARM\nACTION:DISPLAY\nDESCRIPTION:Vacation\nTRIGGER:" + alert + "\nEND:VALARM\nEND:VEVENT\nEND:VCALENDAR";
  return icsMSG;
}

function updateTotals(){
    vacationDays = 0;

    $("#daysSelected").val(vacationDays);

}

function removeTime(date) {
  var dateArray = date.split('T');
  return dateArray[0];
}

  function Account(GMIN, First, Last, Email, Manager, TotalVacation, UsedVacation) {
    this.GMIN = GMIN;
    this.First = First;
    this.Last = Last;
    this.Email = Email;
    this.Manager = Manager;
    this.TotalVacation = TotalVacation;
    this.UsedVacation = UsedVacation;
  };

  function loadProfile(account) {
    $("#GMIN").val(account.GMIN);
    $("#firstName").val(account.First);
    $("#lastName").val(account.Last);
    $("#emailAddress").val(account.Email);
    $("#manager").val(account.Manager);
    $("#totalVacationDays").val(account.TotalVacation);
    $("#usedVacationDays").val(account.UsedVacation);
  };

    var popup2 = new Foundation.Reveal($('#viewProfileModal'));
    var popup3 = new Foundation.Reveal($('#addEventModal'));
    var popup4 = new Foundation.Reveal($("#viewEventModal"));
    var eventData;
    var title;
    var clickedID;
		$('#calendar').fullCalendar({
			header: {
				left: '',
				center: 'title',
				right: 'prev,next today'
			},
      height: "parent",
      theme: false,
      weekends: false,
			selectable: true,
			selectHelper: true,
      fixedWeekCount: false,

			select: function(start, end) {
        var check = start._d.toJSON().slice(0,10);
        var today = new Date().toJSON().slice(0,10);
        var start1 = start.toISOString();
        var end1 = subtractDay(end.toISOString());
        var data = sessionStorage.getItem('user');
        var dataResult = JSON.parse(data);
        var startDate = start1.slice(-5) + "-" + start1.slice(0,4);
        endDate = subtractDay(end1);
        var endDate = end1.slice(-5) + "-" + end1.slice(0,4);
        var vacation = calculateVacationDays(startDate,endDate);
        var vacationRemaining = dataResult.daysLeft-vacation;
        var newEnd = end._d.toJSON().slice(0,10);
        if(check < today) {
          $('#calendar').fullCalendar('unselect');
          alertify.alert("Please select a start date on or after today's date.");
        }
        else if(vacationRemaining < 0){
          alertify.alert("Not enough remaining vacation days.");
        }
        else if (isDateHasEvent(start,end)) {
            $('#calendar').fullCalendar('unselect');
            alertify.alert("You already have vacation on this day!");
        }
        else {
          title = $("#firstName").val() + ' ' + $("#lastName").val();
          if (title) {
            popup3.open();
            $("#startDate").val(start.toISOString());
            $("#endDate").val(subtractDay(end.toISOString()));
            $("#alertOne").prop("checked", true);
            $("#vacationRadio").prop("checked", true);
            $("#downloadICSCheckbox").prop("checked", false);
            $("#createEventDescription").val("");
            $("#createEventTitle").val(dataResult.firstName + " " + dataResult.lastName);
            $("#daysSelected").val(vacation);
            $("#daysLeft").val(vacationRemaining);
            //$("#createEventTitle").val("Variable for your name");//update to include name dynamically
          };
          $('#calendar').fullCalendar('unselect');
        }
			},
      eventClick: function(event, element) {
        clickedID = event.id;
        $("#eventTitle").val(event.title);
        $("#eventDescription").val(event.description);
        $("#viewStartDate").val(removeTime(event.start.toISOString()));
        var tempEnd = removeTime(event.end.toISOString());
        $("#viewEndDate").val(subtractDay(tempEnd));
        /*
        * If the user is not the owner of the event they will not be able to modify it.
        */
        eventOwner = event.owner;
        if (event.owner == emailAddress) {
          $("#eventTitle, #eventDescription, #viewStartDate, #viewEndDate, #downloadICSCheckbox_viewModal").prop("disabled", false);
          $("#changeEventBtn, #deleteBtn").prop("disabled", false);
          $('input[name=alert_viewModal]').attr('disabled', false);
          $('input[name=isVacation_viewModal]').attr('disabled', false);
          popup4.open();
        } else {
          $("#eventTitle, #eventDescription, #viewStartDate, #viewEndDate, #downloadICSCheckbox_viewModal").prop("disabled", true);
          $("#changeEventBtn, #deleteBtn").prop("disabled", true);
          $('input[name=alert_viewModal]').attr('disabled', true);
          $('input[name=isVacation_viewModal]').attr('disabled', true);
          popup4.open();
        }
        return false;
      },
			editable: false,
			eventLimit: true, // allow "more" link when too many events

      dayClick: function(date) {

        $("#daysSelected").val(1);//Should be added to vacation balance calculator
      },
//			events: [
//				{
//					title: 'All Day Event',
//					start: '2016-06-01'
//				},
//				{
//					title: 'Long Event',
//					start: '2016-06-07',
//					end: '2016-06-10'
//				},
//				{
//					id: 999,
//					title: 'Repeating Event',
//					start: '2016-06-09T16:00:00'
//				},
//				{
//					id: 999,
//					title: 'Repeating Event',
//					start: '2016-06-16T16:00:00'
//				},
//				{
//					title: 'Conference',
//					start: '2016-06-11',
//					end: '2016-06-13'
//				},
//				{
//					title: 'Meeting',
//					start: '2016-06-12T10:30:00',
//					end: '2016-06-12T12:30:00'
//				},
//				{
//					title: 'Lunch',
//					start: '2016-06-12T12:00:00'
//				},
//				{
//					title: 'Meeting',
//					start: '2016-06-12T14:30:00'
//				},
//				{
//					title: 'Happy Hour',
//					start: '2016-06-12T17:30:00'
//				},
//				{
//					title: 'Dinner',
//					start: '2016-06-12T20:00:00'
//				},
//				{
//					title: 'Birthday Party',
//					start: '2016-06-13T07:00:00'
//				},
//				{
//					title: 'Click for Google',
//					url: 'http://google.com/',
//					start: '2016-06-28'
//				}
//			]
        eventAfterAllRender: function (view) {
        //Use view.intervalStart and view.intervalEnd to find date range of holidays
        //Make ajax call to find holidays in range.
        var newYearsDay = moment("2016-01-01","YYYY-MM-DD");
        var mlkDay = moment("2016-01-18","YYYY-MM-DD");
        var goodFriday = moment("2016-03-25","YYYY-MM-DD");
        var dayAfterEaster = moment("2016-03-28","YYYY-MM-DD");
        var fourthOfJuly = moment('2016-07-04','YYYY-MM-DD');
        var laborDay = moment("2016-09-05","YYYY-MM-DD");
        var electionDay = moment("2016-11-08","YYYY-MM-DD");
        var veteransDay = moment("2016-11-11","YYYY-MM-DD");
        var thanksgiving1 = moment("2016-11-24","YYYY-MM-DD");
        var thanksgiving2 = moment("2016-11-25","YYYY-MM-DD");
        var christmas1 = moment("2016-12-26","YYYY-MM-DD");
        var christmas2 = moment("2016-12-27","YYYY-MM-DD");
        var christmas3 = moment("2016-12-28","YYYY-MM-DD");
        var christmas4 = moment("2016-12-29","YYYY-MM-DD");
        var christmas5 = moment("2016-12-30","YYYY-MM-DD");


        var holidays = [newYearsDay, mlkDay, goodFriday, dayAfterEaster, fourthOfJuly, laborDay, electionDay, veteransDay, thanksgiving1, thanksgiving2, christmas1, christmas2, christmas3, christmas4, christmas5];
        var holidayMoment;
        for(var i = 0; i < holidays.length; i++) {
          holidayMoment = holidays[i];
          if (view.name == 'month') {
            $("td[data-date=" + holidayMoment.format('YYYY-MM-DD') + "]").addClass('holiday');
          } else if (view.name =='agendaWeek') {
            var classNames = $("th:contains(' " + holidayMoment.format('M/D') + "')").attr("class");
            if (classNames != null) {
              var classNamesArray = classNames.split(" ");
              for(var i = 0; i < classNamesArray.length; i++) {
                if(classNamesArray[i].indexOf('fc-col') > -1) {
                  $("td." + classNamesArray[i]).addClass('holiday');
                  break;
                }
              }
            }
          } else if (view.name == 'agendaDay') {
            if(holidayMoment.format('YYYY-MM-DD') == $('#calendar').fullCalendar('getDate').format('YYYY-MM-DD')) {
              $("td.fc-col0").addClass('holiday');
            };
          }
        }
      }
		});

    $("#addCloseBtn").click(function () {
      popup3.close();
    });

    $("#notifyBtn").click(function() {
      var id = guid();
      // checks for start date following end date; if event ends before start, it will be set to a one-day event on the start date
      var startd = $("#startDate").val();
      var endd = addDay($("#endDate").val());
      var newStart = new Date(startd);
      var newEnd = new Date(endd);
      var newMomentStart = moment(newStart);
      var newMomentEnd = moment(newEnd);
      if (!checkDate(startd)) {
        alertify.alert("Please select a valid start date.");
      }
      else if (!checkDate(endd)) {
        alertify.alert("Please select a valid end date.");
      }
      else if (!compareDates(startd, endd)) {
        alertify.alert("The end date cannot be before the start date.");
      }else if (isDateHasEvent(newMomentStart,newMomentEnd)){
         alertify.alert("You already have vacation on this day!");
      }
      else if ($("#daysLeft").val() < 0){
      	alertify.alert("You do not have enough vacation days left for this request.")
      }
      else {
        if(Date.parse(startd) >= Date.parse(endd)) {
          endd = addDay(startd);
        }
        eventData = {
          owner: emailAddress,
          id: id,
          title: $("#createEventTitle").val(),
          start: startd,
          end: endd,
          description: $("#createEventDescription").val(),
        };
        $('#calendar').fullCalendar('renderEvent', eventData, true);

        activeEvents.push(eventData.id.toString());

        alert = $('input:radio[name=alert]:checked').val();
        isVacation = $('input:radio[name=isVacation]:checked').val();
        saveEvent(emailAddress, id, $("#startDate").val(), addDay($("#endDate").val()), isVacation, $("#createEventTitle").val(), $("#createEventDescription").val());
        popup3.close();
        if ($("#downloadICSCheckbox").is(':checked') === true) {
          var data = sessionStorage.getItem('user');
          var dataResult = JSON.parse(data);
          var fullName = dataResult.firstName + " " + dataResult.lastName;
          var icsFile = createICSFile(dataResult.managers, fullName, dataResult.email, $("#startDate").val(), addDay($("#endDate").val()), isVacation, alert);
          window.open( "data:text/calendar;charset=utf8," + escape(icsFile));
        }
      }
    });

    $("#deleteBtn").click(function() {
      alertify.confirm("Are you sure you want to remove this event?", function(){
        $("#calendar").fullCalendar('removeEvents',clickedID);
        activeEvents.splice(activeEvents.indexOf(clickedID), 1);
        updateDeleteEvent(clickedID);
        deleteEvent(clickedID);
        popup4.close();
      });
    });

    $("#viewEventCloseBtn").click(function () {
      console.log(eventOwner == emailAddress);
      if (eventOwner == emailAddress) {
        alertify.confirm("Are you sure you want to exit? All progress will be lost.", function(){
          popup4.close();
        });
      } else {
        popup4.close();
      }
      
    });

    $("#changeEventBtn").click(function () {
      // checks for start date following end date; if event ends before start, it will be set to a one-day event on the start date
      var news = $("#viewStartDate").val();
      var newe = addDay($("#viewEndDate").val());
      if (!checkDate(news)) {
        alertify.alert("Please select a valid start date.");
      }
      else if (!checkDate(newe)) {
        alertify.alert("Please select a valid end date.");
      }
      else if (!compareDates(news, newe)) {
        alertify.alert("The end date cannot be before the start date.");
      }
      else {
        $('#calendar').fullCalendar('removeEvents', clickedID);
        deleteEvent(clickedID);
        if(Date.parse(news) >= Date.parse(newe))
        {
          newe = addDay(news);
        }
        console.log(news + ", " + newe);
        changedEvent = {
          owner: emailAddress,
          id: guid(),
          title: $("#eventTitle").val(),
          start: news,
          end: newe,
          description: $("#eventDescription").val(),
        };
        alert = $('input:radio[name=alert_viewModal]:checked').val();
        isVacation = $('input:radio[name=isVacation_viewModal]:checked').val();
        $('#calendar').fullCalendar('renderEvent', changedEvent, true);
        saveEvent(emailAddress, guid(), news, newe, isVacation, $("#eventTitle").val(), $("#createEventDescription").val());
        popup4.close();
        if ($("#downloadICSCheckbox_viewModal").is(':checked') === true) {
          var data = sessionStorage.getItem('user');
          var dataResult = JSON.parse(data);
          var fullName = dataResult.firstName + " " + dataResult.lastName;
          var icsFile = createICSFile(dataResult.managers, fullName, dataResult.email, $("#viewStartDate").val(), addDay($("#viewEndDate").val()), isVacation, alert);
          window.open( "data:text/calendar;charset=utf8," + escape(icsFile));
        }
      }
    });

    document.getElementById('exampleFileUpload').addEventListener('change', function(){
      var file = this.files[0];
      if(file) {
        uploadImage(file);
        console.log(file);
        getImage(file.name);
        sessionStorage.setItem('image',file.name);
      }
    }, false)

	});
