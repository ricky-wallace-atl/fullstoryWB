
function addNewAircraftFromForm()
{
	var name = $('#newAircraftName').val();
	var tankSize = parseInt($('#newAircraftTankSize').val());
	var emptyWeight = parseInt($('#newAircraftEmptyWeight').val());
	var takeoffWeight = parseInt($('#newAircraftMaxTakeoffWeight').val());

	newAircraft(name, tankSize, emptyWeight, takeoffWeight);
	//fillAircraftList('aircraft');
}

function removeAircraft(id)
{
	database.ref('aircraft/' + id).remove();
}

// Create a new aircraft in the database
function newAircraft(name, tankSize, emptyWeight, takeoffWeight)
{
	var aircraft = {};
	aircraft['name'] = name;
	aircraft['tankSize'] = tankSize;
	aircraft['emptyWeight'] = emptyWeight;
	aircraft['takeoffWeight'] = takeoffWeight;
	dbRef.push(aircraft);
} // newAircraft

function fillAircraftList(pageName)
{
	dbRef.orderByChild('name').on('value',
	  	function(snapshot)
	  	{
	  		var content = (pageName == 'index' ? indexTableHTML : aircraftTableHTML);

	  		snapshot.forEach(
	  			function(data)
	  			{
	  				aircraft = data.val();
			  		
			  		if (pageName == 'index')
			  		{
				  		content += '<tr id=' + aircraft.name + ' onclick="changeAircraft(\'' + aircraft.name + '\')">';
				  	}
				  	else
				  	{
				  		content += '<tr id=' + aircraft.name + '>';
				  	}
				  	
			  		content += '<td>' + aircraft.name + "</td>";
			  		content += '<td>' + aircraft.tankSize + " gallons</td>";
			  		if (pageName == 'aircraft')
			  		{
			  		content += '<td>' + aircraft.emptyWeight + " lbs</td>";			  			
			  		}
			  		content += '<td>' + aircraft.takeoffWeight + " lbs</td>";
			  		if (pageName == 'aircraft')
			  		{
			  		content += '<td><button onclick="removeAircraft(\'' + data.key + '\')">Remove</button></td>'
			  		}

			  		content += '</tr>';
			  	}
			);
			content += '</table>'
			$('#aircraft').empty();
			$('#aircraft').append(content);
			

	  	}
	);

}