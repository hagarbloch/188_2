var signbutton = document.getElementById('signbutton');
var closeBtn = document.querySelector('.close-btn');

if (signbutton) {
  signbutton.addEventListener('click', function (event) {
    event.preventDefault();
    // Get the values from the form inputs
    var name = document.getElementById('name').value;
    var email = parseInt(document.getElementById('email').value);
    var password = document.getElementById('password').value;
    var password2 = document.getElementById('password2').value;

    if (password == password2) {
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
  }
  )
};


