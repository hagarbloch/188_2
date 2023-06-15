var loginbutton = document.getElementById('button');
var closeBtn = document.querySelector('.close-btn');

loginbutton.addEventListener('click', function (event) {
  event.preventDefault();
  // checks the values from the form inputs
  var name = document.getElementById('name').value;
  var password = document.getElementById('password').value;

  //now not neccery but next this will check if user is logged in
  if (password == password) {
    window.location.href = 'index.html';
    //+put data in database
  }
  else {
    //button for the validation error popup
    popup.style.display = 'block';
    closeBtn.addEventListener('click', function () {
      popup.style.display = 'none';
    });
  }
});