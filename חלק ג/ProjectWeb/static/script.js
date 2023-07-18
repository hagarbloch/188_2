var popup = document.getElementById('popup');
var closeBtn = document.querySelector('.close-btn');
var address = document.getElementById('location');




function setCookie(name, value, days) {
  const expirationDate = new Date();
  expirationDate.setTime(expirationDate.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = "expires=" + expirationDate.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function calcresults() {
  if (navigator.geolocation) {
    console.log("in get location");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        setCookie("lat", lat, 7);
        setCookie("lon", lon, 7);
        console.log(lat, lon);
        return;
      }
    )
  }
  const gender = document.getElementById('gender').value;
  const age = parseInt(document.getElementById('age').value);
  const activityLevel = document.getElementById('activityLevel').value;
  const height = parseInt(document.getElementById('height').value);
  const weight = parseInt(document.getElementById('weight').value);
  const goal = document.getElementById('goal').value;
  const formData = {
    gender: gender,
    age: age,
    activityLevel: activityLevel,
    height: height,
    weight: weight,
    goal: goal
  };
  fetch("/formDetails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(formData)
  })
    .catch(error => {
      console.error("Error:");
    });

  fetch("/results", {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(response => response.json()) // Parse the response as JSON
    .then(responseData => {
      const goalTdee = responseData.goalTdee;
      const goalFat = responseData.goalFat;
      const goalProtein = responseData.goalProtein;
      const goalCarbsCals = responseData.goalCarbsCals;
      const goalCarbs = responseData.goalCarbs;
      localStorage.setItem('goalTdee', goalTdee);
      localStorage.setItem('goalFat', goalFat);
      localStorage.setItem('goalProtein', goalProtein);
      localStorage.setItem('goalCarbsCals', goalCarbsCals);
      localStorage.setItem('goalCarbs', goalCarbs);
      console.log(goalTdee, goalFat, goalProtein, goalCarbsCals, goalCarbs);
      window.location.href = "/index2";
    })
    .catch(error => {
      console.error("Error:");
    });
}
//closebutton for the validation error popup
closeBtn.addEventListener('click', function () {
  popup.style.display = 'none';
});