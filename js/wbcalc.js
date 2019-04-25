// Firebase db references
var database;
var dbRef;

// The selected aircraft
var aircraftName = "";

// p5 required function
function setup(pageName)
{
	// Firebase setup
	var config = {
	    apiKey: "AIzaSyBG7yfNk7i2bOokuylavw7bclQQN1zDRLA",
	    authDomain: "fullstorywb.firebaseapp.com",
	    databaseURL: "https://fullstorywb.firebaseio.com",
	    projectId: "fullstorywb",
	    storageBucket: "fullstorywb.appspot.com",
	    messagingSenderId: "690692956756"
	  };
	  firebase.initializeApp(config);

	  database = firebase.database();
	  dbRef = database.ref('aircraft/');

	  /*
	  Some sample aircraft; these can be added in the front-end
		  newAircraft("N203GT", 40, 1490.9, 2400);
		  newAircraft("N314GT", 40, 1490.9, 2400);
		  newAircraft("N161GT", 50, 1585, 2500);
		  newAircraft("N885GT", 55, 1701.5, 2550);
	  */

	  fillAircraftList(pageName);

}

function changeAircraft(name)
{
	aircraftName = name;
	$('#aircraftName').html('<img src="weight.png" style=\'height: 20px; width:20px;\' />&nbsp;Weight Distribution for ' + name);
	calculateFuel();
}


// How much fuel can I take?
function calculateFuel()
{
	var aircraft;

	var frontWeight = parseInt($('#pilotWeight').val()) + parseInt($('#frontPassengerWeight').val());
	var rearWeight = parseInt($('#rearPassenger1Weight').val()) + parseInt($('#rearPassenger2Weight').val());
	var baggageWeight = parseInt($('#baggageWeight').val());

	var query = dbRef
					.orderByChild('name')
					.equalTo(aircraftName)
					.limitToFirst(1);
	query.on('value', 
		function(snapshot)
		{
	  		snapshot.forEach(
	  			function(data)
	  			{
					aircraft = data.val();
					totalWeight = frontWeight + rearWeight + baggageWeight + aircraft.emptyWeight;
					//console.log(totalWeight);
					availableFuelWeight = Math.floor(aircraft.takeoffWeight - totalWeight);

					// We have the available fuel weight.  Now we want the minimum of adding either a full tank
					// or whatever gets us to the maximum tank amount.  Note: aviation 100LL gas is 6lbs/gallon
					availableFuel = Math.min(aircraft.tankSize, Math.floor(availableFuelWeight / 6));

					//console.log(availableFuelWeight);
					//console.log(availableFuel);

					if (availableFuel < 0)
					{
						availableFuel = 0;
						$('#availableFuel').css('color', 'red');
						$('#availableFuel').text('Overweight by ' + (availableFuelWeight * -1) + 'lbs');
					}
					else if (availableFuel < 15)
					{
						$('#availableFuel').css('color', 'orange');
						$('#availableFuel').text(availableFuel + ' gallons');
					}
					else
					{
						$('#availableFuel').css('color', 'green');
						$('#availableFuel').text(availableFuel + ' gallons');
					}
				}
			);

		}
	);
}

var aircraftTableHTML = '<table class="w3-table-all w3-hoverable"><tr><th>Aircraft Ident</th><th>Fuel Tank Size</th><th>Aircraft Empty Weight</th><th>Max Takeoff Weight</th><th>Remove</th></tr><tr><td><input id="newAircraftName" type="text" size=6></td><td><input id="newAircraftTankSize" type="text" size=2></td><td><input id="newAircraftEmptyWeight" type="text" size=4></td><td><input id="newAircraftMaxTakeoffWeight" type="text" size=4>&nbsp&nbsp<button id="addAircraft" onclick="addNewAircraftFromForm()">Add</button></td><td></td></tr>';
var indexTableHTML =    '<table class="w3-table-all w3-hoverable" id="aircraft"><tr><th>Aircraft Ident</th><th>Fuel Tank Size</th><th>Max Takeoff Weight</th></tr>';

