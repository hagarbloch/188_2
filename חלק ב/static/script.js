var popup = document.getElementById('popup');
var closeBtn = document.querySelector('.close-btn');
var address = document.getElementById('location');

// Function to get the current location
function getLocation() {
  navigator.geolocation.getCurrentPosition(showPosition);
}

// Function to display the current position
function showPosition(position) {
  var latitude = position.coords.latitude;
  var longitude = position.coords.longitude;
  localStorage.setItem('latitude', latitude);
  localStorage.setItem('longitude', longitude);
  console.log('latitude', latitude);
  console.log('longitude', longitude);
}

//  event listener to the button
var locationButton = document.getElementById('location');
if (locationButton) {
  locationButton.addEventListener('click', function () {
    getLocation();
  });
}

// Check if the submit button exists on the current page (becuse the script is for 2 paegs)
var submitBtn = document.getElementById('submitBtn');
if (submitBtn) {
  // Add event listener to the submit button on the first page
  submitBtn.addEventListener('click', function (event) {
    event.preventDefault(); // Prevent the form from submitting and refreshing the page

    // Get the values from the form inputs
    var gender = document.getElementById('Gender').value;
    var age = parseInt(document.getElementById('age').value);
    var activityLevel = document.getElementById('activityLevel').value;
    var height = parseInt(document.getElementById('height').value);
    var weight = parseInt(document.getElementById('weight').value);
    var goal = document.getElementById('goal').value;

    // Save the values in localStorage
    localStorage.setItem('gender', gender);
    localStorage.setItem('age', age);
    localStorage.setItem('activityLevel', activityLevel);
    localStorage.setItem('height', height);
    localStorage.setItem('weight', weight);
    localStorage.setItem('goal', goal);

    // Redirect to the second page
    if (isNaN(age) || isNaN(height) || isNaN(weight) || weight < 0 || height < 0 || age < 0) {
      popup.style.display = 'block';
      closeBtn.addEventListener('click', function () {
        popup.style.display = 'none';
      });
    } else {
      window.location.href = 'index2.html';
    }
  });
}

// Retrieve the values from localStorage on the second page
var gender = localStorage.getItem('gender');
var age = localStorage.getItem('age');
var activityLevel = localStorage.getItem('activityLevel');
var height = localStorage.getItem('height');
var weight = localStorage.getItem('weight');
var goal = localStorage.getItem('goal');

// Print the values to the console or display them in the HTML
console.log('Gender:', gender);
console.log('Age:', age);
console.log('Activity Level:', activityLevel);
console.log('Height:', height);
console.log('Weight:', weight);
console.log('Goal:', goal);

// calcs
var bmrMen = weight * 10 + height * 6.25 - age * 5 + 5;
var bmrWomen = weight * 10 + height * 6.25 - age * 5 - 161;

// calories calculations
var tdee = 0;
if (gender === 'male') {
  if (activityLevel === 'sedentary') {
    tdee = bmrMen * 1.4;
  } else if (activityLevel === 'moderately active') {
    tdee = bmrMen * 1.6;
  } else if (activityLevel === 'active') {
    tdee = bmrMen * 1.8;
  } else {
    document.getElementById('caloriesData').textContent = "Missing Data, Try Refilling The Form";
  }
} else if (gender === 'female') {
  if (activityLevel === 'sedentary') {
    tdee = bmrWomen * 1.4;
  } else if (activityLevel === 'moderately active') {
    tdee = bmrWomen * 1.6;
  } else if (activityLevel === 'active') {
    tdee = bmrWomen * 1.8;
  } else {
    document.getElementById('caloriesData').textContent = "Missing Data, Try Refilling The Form";
  }
} else {
  document.getElementById('caloriesData').textContent = "Missing Data, Try Refilling The Form";
}

var goalTdee = 0;
if (goal == 'toning') {
  goalTdee = tdee - 500;
} else if (goal == 'mass') {
  goalTdee = tdee - 500;
}

// Display the calculated calories if valid
if (!isNaN(goalTdee)) {
  document.getElementById('caloriesData').textContent = goalTdee.toFixed(0);
} else {
  document.getElementById('caloriesData').textContent = "Missing Data";
}

//protein calculations
var goalProtein = 0;
if (goal == 'toning') {
  goalProtein = weight * 2;
} else if (goal == 'mass') {
  goalProtein = weight * 1.6;
}
//fat calculations
var goalFat = (goalTdee * 0.35) / 9;

//carbs calculations
var goalCarbsCals = goalTdee - (goalTdee * 0.35) - (goalProtein * 4);
var goalCarbs = goalCarbsCals / 4;

// Display the calculated atributes if valid
if (!isNaN(goalTdee)) {
  document.getElementById('proteinData').textContent = goalProtein.toFixed(0) + " gr";
  document.getElementById('proteinFaq').textContent = "( " + (goalProtein * 4).toFixed(0) + " calories from your daily intake )";
  document.getElementById('fatData').textContent = goalFat.toFixed(0) + " gr";
  document.getElementById('fatFaq').textContent = "( " + (goalFat * 9).toFixed(0) + " calories from your daily intake )";
  document.getElementById('carbsData').textContent = goalCarbs.toFixed(0) + " gr";
  document.getElementById('carbsFaq').textContent = "( " + goalCarbsCals.toFixed(0) + " calories from your daily intake )";
} else {
  popup.style.display = 'block';
  document.getElementById('proteinData').textContent = "Missing Data";
  document.getElementById('proteinFaq').textContent = "";
  document.getElementById('fatData').textContent = "Missing Data";
  document.getElementById('fatFaq').textContent = "";
  document.getElementById('carbsData').textContent = "Missing Data";
  document.getElementById('carbsFaq').textContent = "";
}

//closebutton for the validation error popup
closeBtn.addEventListener('click', function () {
  popup.style.display = 'none';
});