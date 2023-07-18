var popup = document.getElementById('popup');
var closeBtn = document.querySelector('.close-btn');

var goalTdee = localStorage.getItem('goalTdee');
var goalFat = localStorage.getItem('goalFat');
var goalProtein = localStorage.getItem('goalProtein');
var goalCarbsCals = localStorage.getItem('goalCarbsCals');
var goalCarbs = localStorage.getItem('goalCarbs');
console.log(goalTdee, goalFat, goalProtein, goalCarbsCals, goalCarbs);




if (!isNaN(goalTdee) && goalTdee > 0 && !isNaN(goalFat) && goalFat > 0 && !isNaN(goalProtein) && goalProtein > 0 && !isNaN(goalCarbsCals) && goalCarbsCals > 0 && !isNaN(goalCarbs) && goalCarbs > 0) {
    document.getElementById('caloriesData').textContent = Number(goalTdee).toFixed(0);
    document.getElementById('proteinData').textContent = Number(goalProtein).toFixed(0) + ' gr';
    document.getElementById('proteinFaq').textContent = '( ' + (Number(goalProtein) * 4).toFixed(0) + ' calories from your daily intake )';
    document.getElementById('fatData').textContent = Number(goalFat).toFixed(0) + ' gr';
    document.getElementById('fatFaq').textContent = '( ' + (Number(goalFat) * 9).toFixed(0) + ' calories from your daily intake )';
    document.getElementById('carbsData').textContent = Number(goalCarbs).toFixed(0) + ' gr';
    document.getElementById('carbsFaq').textContent = '( ' + Number(goalCarbsCals).toFixed(0) + ' calories from your daily intake )';
} else {
    popup.style.display = 'block';
    document.getElementById('proteinData').textContent = 'Missing Data';
    document.getElementById('proteinFaq').textContent = '';
    document.getElementById('fatData').textContent = 'Missing Data';
    document.getElementById('fatFaq').textContent = '';
    document.getElementById('carbsData').textContent = 'Missing Data';
    document.getElementById('carbsFaq').textContent = '';
}
function gymresults() {
    console.log("hi");
    // Send a GET request to the server to fetch gyms data
    fetch("/getgymsdistance", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(response => response.json()) // Parse the response as JSON
        .then(responseData => {
            console.log(responseData);
            document.getElementById('address1').textContent = JSON.stringify(responseData.address1);
            document.getElementById('distance1').textContent = (JSON.stringify(responseData.distance1) + " km");
            document.getElementById('rating1').textContent = JSON.stringify(responseData.rating1);
            document.getElementById('mapaddress1').src = responseData.mapaddress1;
            document.getElementById('address2').textContent = JSON.stringify(responseData.address2);
            document.getElementById('distance2').textContent = (JSON.stringify(responseData.distance2) + " km");
            document.getElementById('rating2').textContent = JSON.stringify(responseData.rating2);
            document.getElementById('mapaddress2').src = responseData.mapaddress2;
            document.getElementById('address3').textContent = JSON.stringify(responseData.address3);
            document.getElementById('distance3').textContent = (JSON.stringify(responseData.distance3) + " km");
            document.getElementById('rating3').textContent = JSON.stringify(responseData.rating3);
            document.getElementById('mapaddress3').src = responseData.mapaddress3;
        })
        .catch(error => {
            console.error("Error:");
        });
}

function gymresultsRating() {
    console.log("hi");
    // Send a GET request to the server to fetch gyms data
    fetch("/getgymsrating", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(response => response.json()) // Parse the response as JSON
        .then(responseData => {
            console.log(responseData);
            document.getElementById('address1').textContent = JSON.stringify(responseData.address1);
            document.getElementById('distance1').textContent = (JSON.stringify(responseData.distance1) + " km");
            document.getElementById('rating1').textContent = JSON.stringify(responseData.rating1);
            document.getElementById('address2').textContent = JSON.stringify(responseData.address2);
            document.getElementById('distance2').textContent = (JSON.stringify(responseData.distance2) + " km");
            document.getElementById('rating2').textContent = JSON.stringify(responseData.rating2);
            document.getElementById('address3').textContent = JSON.stringify(responseData.address3);
            document.getElementById('distance3').textContent = (JSON.stringify(responseData.distance3) + " km");
            document.getElementById('rating3').textContent = JSON.stringify(responseData.rating3);
        })
        .catch(error => {
            console.error("Error:");
        });
}

//closebutton for the validation error popup
closeBtn.addEventListener('click', function () {
    popup.style.display = 'none';
});

