var signbutton = document.getElementById('signbutton');
const closeBtn = document.querySelector('.close-btn');
const popup2 = document.getElementById('popup');

function checkIsActive() {
  console.log("hi");
  // Get the values from the form inputs
  var nameUser = document.getElementById('nameUser').value;
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;
  var password2 = document.getElementById('password2').value;
  if (nameUser !== "" && email !== "" && password !== "" && password2 !== "") {
    fetch("/signup", {
      method: "POST",
      body: JSON.stringify({
        "email": email,
        "password": password,
        "password2": password2,
        "nameUser": nameUser
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
      .then((response) => response.json())
      .then((json) => {
        if (json["Exists"] == false) {
          window.location.href = '/index';
        } else if (json["Exists"] == true) {
          popup2.style.display = 'block';
          closeBtn.addEventListener('click', function () {
            popup2.style.display = 'none';
          });
        }
      });
  } else {
    popup2.style.display = 'block';
    closeBtn.addEventListener('click', function () {
      popup2.style.display = 'none';
    });
  }
};