const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const sql = require('./DB');
const cookie = require('cookie-parser');
const csv = require('csvtojson');
const app = express();
app.use(cookie());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const createResultsTable = (req, res) => {
    const Q1 = "CREATE TABLE IF NOT EXISTS `nutrition` (bmr FLOAT(10,2), tdee FLOAT(10,2), fat FLOAT(10,2), fatCals FLOAT(10,2), protein FLOAT(10,2), proteinCals FLOAT(10,2), carbs FLOAT(10,2), carbsCals FLOAT(10,2))";
    sql.query(Q1, (err, mysqlres) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log("table created");
        return;
    })
    return;
}
//bmr, tdee, fat, fatCals, protein, proteinCals, carbs, carbsCals
const createTable = (req, res) => {
    const Q1 = "CREATE TABLE IF NOT EXISTS `users` (email VARCHAR(255) PRIMARY KEY NOT NULL, name VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL,  gender VARCHAR(255),age INT ,activityLevel VARCHAR(255) ,height INT ,weight INT ,goal VARCHAR(255))";
    sql.query(Q1, (err, mysqlres) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log("user table created");
        return;
    })
    const adminUser = {
        email: 'admin@admin.admin',
        name: 'admin',
        password: 'admin'
    };
    // run insert query
    const Q3 = "INSERT IGNORE INTO users SET ?";
    sql.query(Q3, adminUser, (err, mysqlres) => {
        if (err) {
            console.log(err);
            console.log("something went wrong");
            return;
        }
        console.log("details entered");
    });
    return;
};

const createGymTable = (req, res) => {
    const Q8 = "CREATE TABLE IF NOT EXISTS `gyms` ( gymName VARCHAR(255) NOT NULL, address VARCHAR(255) PRIMARY KEY NOT NULL, lat DECIMAL(9,6) NOT NULL, lon DECIMAL(9,6) NOT NULL,rating DECIMAL(2,1) NOT NULL CHECK (rating >= 1 AND rating <= 5), lat_rounded DECIMAL(9,2) NOT NULL , lon_rounded DECIMAL(9,2) NOT NULL, mapaddress VARCHAR(1000) NOT NULL)";
    sql.query(Q8, (err, mysqlres) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log("GYMStable created");
        return;
    })
};
const getGymsdistance = (lat, lon) => {
    return new Promise((resolve, reject) => {
        var lati = lat;
        var loni = lon;
        const Q9 =
            "SELECT gymName, address, mapaddress, rating, (6371 * acos(cos(radians(?)) * cos(radians(lat)) * cos(radians(lon) - radians(?)) + sin(radians(?)) * sin(radians(lat)))) AS distance FROM gyms ORDER BY distance LIMIT 3";
        sql.query(Q9, [lati, loni, lati], (err, results) => {
            if (err) {
                console.error('Error executing SQL query:', err);
                reject(err);
            } else {
                resolve(results);
                console.log(results);
            }
        });
    });
};
const getGymsrating = (lat, lon) => {
    return new Promise((resolve, reject) => {
        var lati = lat;
        var loni = lon;
        const Q10 = `SELECT gymName, address, mapaddress, rating, (6371 * acos(cos(radians(?)) * cos(radians(lat_rounded)) * cos(radians(lon_rounded) - radians(?)) + sin(radians(?)) * sin(radians(lat_rounded)))) AS distance FROM gyms ORDER BY distance, rating DESC LIMIT 3`;
        sql.query(Q10, [lati, loni, lati], (err, results) => {
            if (err) {
                console.error('Error executing SQL query:', err);
                reject(err);
            } else {
                resolve(results);
                console.log(results);
            }
        });
    });
};

const insertData = (req, res) => {
    const csvPath = path.join(__dirname, "gyms.csv");
    /// this is new
    csv().fromFile(csvPath).then((jsonObj) => {
        //console.log(jsonObj);
        for (let i = 0; i < jsonObj.length; i++) {
            const element = jsonObj[i];
            const lat = Number(element.lat);
            const lon = Number(element.lon);
            const latRounded = Number(lat.toFixed(2));
            const lonRounded = Number(lon.toFixed(2));
            const mapaddress = "https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d13642.30576274967!2d" + lon + "!3d" + lat + "!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1siw!2sil!4v1689628141257!5m2!1siw!2sil&amp;markers=" + lat + "," + lon;
            // console.log(element);
            const NewCsvData = {
                gymName: element.gymName,
                address: element.address,
                lat: lat,
                lon: lon,
                rating: element.rating,
                lat_rounded: latRounded,
                lon_rounded: lonRounded,
                mapaddress: mapaddress
            };
            const Q2 = "insert  IGNORE into gyms set ?";
            sql.query(Q2, NewCsvData, (err, mysqlres) => {
                if (err) {
                    throw err
                }
                //console.log('Data inserted into table');
            });
        }

    });
    console.log('Data inserted into table');
    return;
};


const createNewUser = (email, nameUser, password, res) => {
    const newUser = {
        email,
        name: nameUser,
        password
    };
    // run insert query
    const Q3 = "INSERT INTO users SET ?";
    sql.query(Q3, newUser, (err, mysqlres) => {
        if (err) {
            console.log(err);
            console.log("something went wrong");
            return;
        }
        console.log("details entered");
    });
};

const insertNewDetails = (email, gender, age, activityLevel, height, weight, goal, callback) => {
    const Q4 = "UPDATE users SET gender = ?, age = ?, activityLevel = ?, height = ?, weight = ?, goal = ? WHERE email = ?";
    sql.query(Q4, [gender, age, activityLevel, height, weight, goal, email], (err, results) => {
        if (err) {
            callback(err, null);
            return;
        }
        console.log("details entered");
    })
};

const checkUserExists = (email, callback) => {
    const Q6 = "SELECT EXISTS (SELECT 1 FROM users WHERE email = ?) AS userExists";
    sql.query(Q6, [email], (err, results) => {
        if (err) {
            callback(err, null);
            return;
        }
        const userExists = results[0].userExists === 1;
        callback(null, userExists);
    });
};
const validateUser = (email, password, callback) => {
    const Q5 = "SELECT EXISTS (SELECT 1 FROM users WHERE email = ? AND password = ?) AS userExists";
    sql.query(Q5, [email, password], (err, results) => {
        if (err) {
            callback(err, null);
            return;
        }
        const userExists = results[0].userExists === 1;
        callback(null, userExists);
    });
};

const validateAdmin = (email, password, callback) => {
    const Q5 = "SELECT EXISTS (SELECT 1 FROM users WHERE email = ? AND password = ?) AS isAdmin";
    sql.query(Q5, [email, password], (err, results) => {
        if (err) {
            callback(err, null);
            return;
        }
        const isAdmin = results[0].isAdmin === 1;
        callback(null, isAdmin);
    });
};

const culcResults = (email) => {
    return new Promise((resolve, reject) => {
        console.log('hi');
        const Q11 = "SELECT * FROM users WHERE email = ?";
        sql.query(Q11, [email], (err, results) => {
            if (err) {
                reject(err);
                return;
            }
            if (results.length > 0) {
                const user = results[0];
                const gender = user.gender;
                const age = user.age;
                const activityLevel = user.activityLevel;
                const height = user.height;
                const weight = user.weight;
                const goal = user.goal;
                console.log(gender, age, activityLevel, height, weight, goal);
                const dataAll = { gender, age, activityLevel, height, weight, goal }

                //calculations-time!!
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
                        resolve(err, "missing data");
                        return;
                    }
                } else if (gender === 'female') {
                    if (activityLevel === 'sedentary') {
                        tdee = bmrWomen * 1.4;
                    } else if (activityLevel === 'moderately active') {
                        tdee = bmrWomen * 1.6;
                    } else if (activityLevel === 'active') {
                        tdee = bmrWomen * 1.8;
                    } else {
                        resolve(err, "missing data");
                        return;
                    }
                } else {
                    resolve(err, "missing data");
                    return;
                }

                var goalTdee = 0;
                if (goal == 'toning') {
                    goalTdee = tdee - 500;
                } else if (goal == 'mass') {
                    goalTdee = tdee - 500;
                }
                else {
                    resolve(err, "missing data");
                    return;
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
                console.log(goalTdee, goalProtein, goalFat, goalCarbsCals, goalCarbs);
                resolve({
                    goalTdee: goalTdee,
                    goalProtein: goalProtein,
                    goalFat: goalFat,
                    goalCarbsCals: goalCarbsCals,
                    goalCarbs: goalCarbs
                });
            } else {
                resolve(err, "missing data");
            }
        })
    })
};


//lehosif check all querys for admin- עובר על הכל וברגע שיש שאילתה שלא עובדת שולח מה השאילתה ומפסיק לרוץ, צריך להתחל את כל המשתנים לפני
//lehashlimmmmmmmmmmmmmmmmmmmm et col ha tables
const dropAllTables = (req, res) => {
    const Q10 = 'DROP TABLE IF EXISTS users, gyms, nutrition ;';
    sql.query(Q10, (err, mysqlres) => {
        if (err) {
            console.log(err);
            res.status(400).send(err);
            return;
        }
        console.log("tables dropped");
        return;
    })
    return;
};
module.exports = { getGymsrating, getGymsdistance, culcResults, createGymTable, createResultsTable, validateAdmin, validateUser, checkUserExists, createTable, createNewUser, insertNewDetails, dropAllTables, insertData };