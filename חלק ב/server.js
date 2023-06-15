const express = require('express');
//const db = require('./DB');
const path = require('path');

const app = express();
const port = 3000;
app.use(express.static(path.join(__dirname, 'static')));
app.use(express.static(path.join(__dirname, 'views')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.post('/submit', (req, res) => {
  const { sex, age, activityLevel, height, weight, goal } = req.body;

  db.insertUser(sex, age, activityLevel, height, weight, goal, (err, results) => {
    if (err) {
      res.status(500).send('An error occurred');
      return;
    }

    res.sendStatus(200);
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

 