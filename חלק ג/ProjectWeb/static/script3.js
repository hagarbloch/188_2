const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
var loginbutton = document.getElementById('button');
console.log(popup2)
app.set('views', path.join(__dirname, "views"));
popup2.innerHTML = "test"


function checkCreds() {
  var closeBtn = document.getElementById("closeBtn")
  var popup2 = document.getElementById('popup');
  // checks the values from the form inputs
  var name = document.getElementById('email').value;
  var password = document.getElementById('password').value;
  fetch("/loginButton", {
    method: "POST",
    body: JSON.stringify({
      "email": name,
      "password": password,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  })
    .then((response) => response.json())
    .then((json) => {
      if (json["Exists"] == false) {
        console.log(popup2.innerHTML)
        console.log(json["Exists"])
        popup2.style.display = 'block';
        closeBtn.addEventListener('click', function () {
          popup2.style.display = 'none';
        })
      } else if (json["Exists"] == "Admin") {
        window.location.href = '/indexAdmin';
      } else if (json["Exists"] == true) {
        window.location.href = '/index';

      }
    }

    );


};