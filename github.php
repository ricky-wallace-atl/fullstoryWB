<?php

$headers = array(
    'Content-Type:application/json',
    'Authorization: Basic S0tHQzY6UzB0SFF6WTZTazgwUW1sVGNXbzRia3hKZUhGbFVGRjBVa1pHTjNwYVluaGtiWEp2UzNKaFIwMWpXa0ZsUm1kdFJUMD0='
);
$ch = curl_init('https://www.fullstory.com/api/v1/sessions?uid=rwallace');
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_HEADER, 0);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
$return = curl_exec($ch);
curl_close($ch);

$return = str_replace("\n", '', $return); // remove new lines
$return = str_replace("\r", '', $return); // remove carriage returns
?>

<!DOCTYPE html>
<html>
<title>FullStory Fuel Calculator</title>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">

<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
<script src="js/githubAPI.js"></script>
<script src="js/fullstory.js"></script>
<script src="js/Chart.bundle.min.js"></script>
<script src="https://www.gstatic.com/firebasejs/5.9.4/firebase.js"></script>


<link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Raleway">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
<style>
html,body,h1,h2,h3,h4,h5 {font-family: "Raleway", sans-serif}
</style>


<body class="w3-light-grey" onload="githubSetup()">

<!-- Top container -->
<div class="w3-bar w3-top w3-black w3-large" style="z-index:4">
    <button class="w3-bar-item w3-button w3-hide-large w3-hover-none w3-hover-text-light-grey" onclick="w3_open();"><i class="fa fa-bars"></i>  Menu</button>
  <span class="w3-bar-item w3-right">Fuel Calculator</span>
</div>

<!-- Sidebar/menu -->
<nav class="w3-sidebar w3-collapse w3-white w3-animate-left" style="z-index:3;width:300px;" id="mySidebar"><br>
  <div class="w3-container w3-row">
  <div class="w3-container">
    <h5>Dashboard</h5>
  </div>
  <div class="w3-bar-block">
    <a href="#" class="w3-bar-item w3-button w3-padding-16 w3-hide-large w3-dark-grey w3-hover-black" onclick="w3_close()" title="close menu"><i class="fa fa-remove fa-fw"></i>  Close Menu</a>
    <a href="index.html" class="w3-bar-item w3-button w3-padding"><i class="fa fa-bullseye fa-fw"></i>  Fuel Calculation</a>
    <a href="aircraft.html" class="w3-bar-item w3-button"><i class="fa fa-users fa-fw"></i>  Aircraft</a>
    <a href="github.php" class="w3-bar-item w3-button w3-padding w3-padding w3-blue"><i class="fa fa-diamond fa-fw"></i>   GitHub &amp; Fullstory</a>
    <a href="about.html" class="w3-bar-item w3-button w3-padding"><i class="fa fa-eye fa-fw"></i>  About</a>
  </div>
</nav>


<!-- Overlay effect when opening sidebar on small screens -->
<div class="w3-overlay w3-hide-large w3-animate-opacity" onclick="w3_close()" style="cursor:pointer" title="close side menu" id="myOverlay"></div>

<!-- !PAGE CONTENT! -->
<div class="w3-main" style="margin-left:300px;margin-top:43px;">
  <div class="w3-panel w3-half">
  <h5>GitHub Issues by Label</h5>
    <canvas id="issuesChart"></canvas>
  </div>

  <div class="w3-panel w3-half">
  <h5>GitHub Issue List</h5>
      <table class="w3-table-all w3-hoverable w3-small" id="githubIssues">
        <tr>
         <th>Title</th>
         <th>Created</th>
         <th>Labels</th>
        </tr>
      </table>
  </div>

  <div class="w3-panel">
  <h5>FullStory Sessions over a Two-Week Period</h5>
    <canvas id="fullstoryChart"></canvas>
  </div>  

  <!-- End page content -->
</div>

<script>
// Get the Sidebar
var mySidebar = document.getElementById("mySidebar");

// Get the DIV with overlay effect
var overlayBg = document.getElementById("myOverlay");

// Toggle between showing and hiding the sidebar, and add overlay effect
function w3_open() {
  if (mySidebar.style.display === 'block') {
    mySidebar.style.display = 'none';
    overlayBg.style.display = "none";
  } else {
    mySidebar.style.display = 'block';
    overlayBg.style.display = "block";
  }
}

// Close the sidebar with the close button
function w3_close() {
  mySidebar.style.display = "none";
  overlayBg.style.display = "none";
}
</script>

<script>
var data = '<?php echo $return; ?>'
data = JSON.parse(data);

var timeLabels = [];
var timeCounts = [];

for (i = 13; i >= 0; i--)
{
  var d = new Date();
  d.setDate(d.getDate() - i);
  timeLabels[13-i] = d.toLocaleDateString();
  timeCounts[13-i] = 0;
}

for (i in data)
{
  var labelIndex = timeLabels.findIndex(function(element) { return (element == (new Date(data[i].CreatedTime * 1000)).toLocaleDateString()); });
  if (labelIndex >= 0)
  {
    timeCounts[labelIndex]++;
  }

}

    var timechartJSON = {
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
    timechartJSON.data.labels = timeLabels;
    timechartJSON.data.datasets[0].data = timeCounts;

    var fsctx = document.getElementById('fullstoryChart').getContext('2d');
    var fullstoryChart = new Chart(fsctx, timechartJSON);
</script>

</body>


</html>
