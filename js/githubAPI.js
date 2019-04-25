function githubSetup()
{
	listIssues();
	listFullstory();
}

function listIssues()
{
	var request = new XMLHttpRequest();

	request.open('GET', 'https://api.github.com/repos/ricky-wallace-atl/fullstoryWB/issues');

	request.onload = function()
	{
		var data = JSON.parse(this.response);

		var labels = [];
		var counts = [];;

		for (i in data)
		{
			for (j in data[i].labels)
			{
				var labelIndex = labels.findIndex(function(element) { return (element == data[i].labels[j].name); })
				if (labelIndex >= 0)
				{
					counts[labelIndex]++;
				}
				else
				{
					labels.push(data[i].labels[j].name);
					counts.push(1);
				}
			}
		}

		var chartJSON = {
		    type: 'bar',
		    data: {
		        labels: [],
		        datasets: [{
		            label: '# of Issues',
		            data: [],
		            backgroundColor: [
		                'rgba(255, 99, 132, 0.2)',
		                'rgba(54, 162, 235, 0.2)',
		                'rgba(255, 206, 86, 0.2)',
		                'rgba(75, 192, 192, 0.2)',
		                'rgba(153, 102, 255, 0.2)',
		                'rgba(255, 159, 64, 0.2)'
		            ],
		            borderColor: [
		                'rgba(255, 99, 132, 1)',
		                'rgba(54, 162, 235, 1)',
		                'rgba(255, 206, 86, 1)',
		                'rgba(75, 192, 192, 1)',
		                'rgba(153, 102, 255, 1)',
		                'rgba(255, 159, 64, 1)'
		            ],
		            borderWidth: 1
		        }]
		    },
		    options: {
		    	legend: { display: false },
		        scales: {
		            yAxes: [{
		                ticks: {
		                    beginAtZero: true,
		                    stepSize: 1
		                }
		            }]
		        }
		    }
		};
		chartJSON.data.labels = labels;
		chartJSON.data.datasets[0].data = counts;

		var ctx = document.getElementById('issuesChart').getContext('2d');
		var issuesChart = new Chart(ctx, chartJSON);

		// Fill the chart
		var content = '';
		for (i in data)
		{
			var labelText = '';
			for (j in data[i].labels)
			{
				labelText += data[i].labels[j].name + ', ';
			}
			labelText = labelText.substring(0, labelText.length - 2);
			content += '<tr>';
			content += '<td><a href=\'' + data[i].html_url + '\'>' + data[i].title + '</a></td>';
			content += '<td>' + data[i].created_at.toString().split('T')[0] + '</td>';
			content += '<td>' + labelText + '</td>';
			content += '</tr>';
		}
		$('#githubIssues').append(content);

	}

	request.send();

}

function listFullstory(data)
{

}

