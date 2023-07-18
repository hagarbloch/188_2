const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookie = require('cookie-parser');
const sql = require('./DB/DB');
const CRUD = require('./DB/CRUD');
const { accessSync } = require('fs');
const app = express();
const port = 3000;
app.use(express.static(path.join(__dirname, 'static')));
app.use(express.static(path.join(__dirname, 'Alfa_Slab_One')));
app.use(express.static(path.join(__dirname, 'static'), { type: 'application/javascript' }));
app.set('views', path.join(__dirname, "views"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookie());

app.get('/', (req, res) => {
  CRUD.createTable();
  CRUD.createGymTable();
  CRUD.insertData();
  res.redirect('/login');
});
app.get('/index', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});
app.get('/indexAdmin', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'indexAdmin.html'));
});
app.get('/index2', (req, res) => {
  CRUD.createResultsTable();
  res.sendFile(path.join(__dirname, 'views', 'index2.html'));
});

app.get('/results', (req, res) => {
  var email = req.cookies.signedEmail;
  CRUD.culcResults(email)
    .then(results => {
      const goalTdee = results.goalTdee;
      const goalFat = results.goalFat;
      const goalProtein = results.goalProtein;
      const goalCarbsCals = results.goalCarbsCals;
      const goalCarbs = results.goalCarbs;
      const responseData = {
        goalTdee,
        goalProtein,
        goalFat,
        goalCarbsCals,
        goalCarbs
      };
      res.json(responseData);
    })
    .catch(err => {
      console.error('Error while calculating', err);
      res.status(500).json({ error: 'Internal server error' });
    });
});


app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'indexlogin.html'));
});
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'indexsignup.html'));
});

app.get('/getgymsdistance', (req, res) => {
  var lat = req.cookies.lat;
  var lon = req.cookies.lon;
  CRUD.getGymsdistance(lat, lon)
    .then(results => {
      const address1 = results[0].address;
      const distance1 = parseFloat(results[0].distance).toFixed(2);
      const rating1 = results[0].rating;
      const mapaddress1 = results[0].mapaddress;
      const address2 = results[1].address;
      const distance2 = parseFloat(results[1].distance).toFixed(2);
      const rating2 = results[1].rating;
      const mapaddress2 = results[1].mapaddress;
      const address3 = results[2].address;
      const distance3 = parseFloat(results[2].distance).toFixed(2);
      const rating3 = results[2].rating;
      const mapaddress3 = results[2].mapaddress;
      const responseData = {
        address1,
        distance1,
        rating1,
        mapaddress1,
        address2,
        distance2,
        rating2,
        mapaddress2,
        address3,
        distance3,
        rating3,
        mapaddress3
      };
      console.log(responseData);
      res.json(responseData);
    })
    .catch(err => {
      console.error('Error getting gyms:', err);
      res.status(500).json({ error: 'Internal server error' });
    });
});

app.get('/getgymsrating', (req, res) => {
  var lat = req.cookies.lat;
  var lon = req.cookies.lon;
  CRUD.getGymsrating(lat, lon)
    .then(results => {
      const address1 = results[0].address;
      const distance1 = parseFloat(results[0].distance).toFixed(2);
      const rating1 = results[0].rating;
      const mapaddress1 = results[0].mapaddress1;
      const address2 = results[1].address;
      const distance2 = parseFloat(results[1].distance).toFixed(2);
      const rating2 = results[1].rating;
      const mapaddress2 = results[1].mapaddress2;
      const address3 = results[2].address;
      const distance3 = parseFloat(results[2].distance).toFixed(2);
      const rating3 = results[2].rating;
      const mapaddress3 = results[2].mapaddress3;

      const responseData = {
        address1,
        distance1,
        rating1,
        mapaddress1,
        address2,
        distance2,
        rating2,
        mapaddress2,
        address3,
        distance3,
        rating3,
        mapaddress3
      };
      res.json(responseData);
    })
    .catch(err => {
      console.error('Error getting gyms:', err);
      res.status(500).json({ error: 'Internal server error' });
    });
});

//admin-actions
app.post('/dropTables', (req, res) => {
  CRUD.dropAllTables();
  res.redirect('/indexAdmin');
});
app.post('/createTables', (req, res) => {
  CRUD.createTable();
  CRUD.createGymTable();
  res.redirect('/indexAdmin');
});
app.post('/insertGyms', (req, res) => {
  CRUD.insertData();
  res.redirect('/indexAdmin');
});

//signup_page
app.post('/signup', (req, res) => {
  const { nameUser, email, password, password2 } = req.body;
  if (password == password2) {
    console.log("in here");
    CRUD.checkUserExists(email, (err, userExists) => {
      if (err) {
        console.log(err);
        res.status(500).send('An error occurred');
        return;
      }
      if (userExists) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ Exists: true }))
        return;
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ Exists: false }))
        console.log("new user");
        CRUD.createNewUser(email, nameUser, password)
        return;
      }
    });
    return;
  }
  else {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ Exists: true }))
  }
});

//login_page
app.post('/loginButton', (req, res) => {
  const { email, password } = req.body;
  console.log(email, password)
  CRUD.validateUser(email, password, (err, userExists) => {
    console.log(userExists)
    if (err) {
      console.log(err);
      res.status(500).send(`An error occurred while validating user ${err}`);
      return;
    }
    if (userExists) {
      const adminEmail = 'admin@admin.admin';
      const adminPassword = 'admin';
      if (email === adminEmail && password === adminPassword) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ Exists: "Admin" }))
        return;
      } else {
        res.cookie('signedEmail', email);
        res.cookie('signedPassword', password);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ Exists: true }))
      }
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ Exists: false }))
    }
  })
});

app.post('/formDetails', (req, res) => {
  const { gender, age, activityLevel, height, weight, goal } = req.body;
  console.log(gender, age, activityLevel, height, weight, goal);
  var email = req.cookies.signedEmail;
  CRUD.insertNewDetails(email, gender, age, activityLevel, height, weight, goal);
  res.sendFile(path.join(__dirname, 'views', 'index2.html'));
});

sql.connect((err) => {
  if (err) {
    console.error('Failed to connect to the SQL database:', err);
  } else {
    console.log('Connected to the SQL database');
  }
});

app.listen(port, () => {
  console.log(`Server is running on :`, port);
});