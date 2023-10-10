const express = require('express');
const { engine } = require('express-handlebars');
const sqlite3 = require('sqlite3').verbose();
const bodyParser= require('body-parser')
const session = require('express-session');
const connect = require('connect-sqlite3'); 
//const cookieParser = require('cookie-parser')
const connectSqlite3 = require('connect-sqlite3');
const { LIMIT_EXPR_DEPTH } = require('sqlite3');
const bcrypt = require("bcrypt")
const saltRounds=10;
const app = express();
const port = 8080

//connected to the database located in the model folder.
const db = new sqlite3.Database('model/portfolio.db');
/*
//CREATE Table User and inserting values.
db.run("CREATE TABLE IF NOT EXISTS user (userID INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL, password TEXT NOT NULL, role INTEGER, email TEXT, regDate DATE)", (error) => {
  if (error) {
      console.log("Error: ", error);
  } else {
      console.log("----> Table user created!");
      const users = [
          { "id": 1, "username": "nazli01", "password": "$2b$10$tfdDufzBWk.QdWYPfaQfXusJC.0Q01QAvScAJidvis7v6oVs18V5q", "role": 1, "email": "zana22za@student.ju.se", "regDate": "2023-09-22" },
          { "id": 2, "username": "momo22", "password": "$2b$10$3/mG9v4tM/v9SuIMcL4YU.UCEGGLoROTZl3bRbDYL9smt/AvsSseC", "role": 0, "email": "momo@gmail.com", "regDate": "2023-09-23" },
          { "id": 3, "username": "kevin33", "password": "$2b$10$LaEsn9Z/LP1eroxO.zQvcuj8DHuPCE6eEVTc2x1JXpVWNeImS2522", "role": 0, "email": "kevin@gmail.com", "regDate": "2023-09-24" },
          { "id": 4, "username": "lilly2434", "password": "$2b$10$xGuqChdNm405Llf/IFDjT.JPW6ixpvuAg4w18C9qZCENVP04EG2jq", "role": 0, "email": "lillyke@gmail.com", "regDate": "2023-09-25" },
          { "id": 5, "username": "Taylor2378", "password": "$2b$10$UQIgf2LEpnJ3G1jpPgTmMeSk3R7Lj8Zl28x/3sYXhWgTgtkwEm8Wm", "role": 0, "email": "taylor@example.com", "regDate": "2023-09-29" }
      ];

      users.forEach((userData) => {
          db.run("INSERT OR IGNORE INTO user (username, password, role, email, regDate) VALUES (?, ?, ?, ?, ?)", [userData.username, userData.password, userData.role, userData.email, userData.regDate], (error) => {
              if (error) {
                  console.log("Error: ", error);
              } else {
                  console.log("Line added into user table!");
              }
          });
      });
  }
});

//CREATE Table Education and inserting values.
db.run("CREATE TABLE IF NOT EXISTS education (educationID INTEGER PRIMARY KEY AUTOINCREMENT, userID INTEGER REFERENCES user(userID) ON DELETE CASCADE ON UPDATE CASCADE, school TEXT NOT NULL, degree TEXT, degreeDescription TEXT, date DATE)", (error) => {
    if (error) {
        console.log("Error: ", error);
    } else {
        console.log("----> Table education created!");
        const education = [
            { "userID": 1, "school": "Trollbodaskolan", "degree": "Middle school", "degreeDescription": "-", "date": "2007-2017" },
            { "userID": 1, "school": "Internationella Engelska Gymnaiset Södermalm (IEGS)", "degree": "High school degree in natural science programme with specialization in social science", "degreeDescription": "The programme mainly focuses on research, analysis, and communication skills in the context of natural sciences and mathematics and interdisciplinary connections. It introduces core concepts, promotes scientific method awareness, improves language proficiency for scientific communication, fosters the integration of scientific elements, and encourages coherent knowledge integration in fields as biology, chemistry, physics. Additionally the programme puts a significant emphasis on social science as well.", "date": "2017-2020" },
            { "userID": 1, "school": "EC Education Yrkeshögskola", "degree": "Programming 1 course.", "degreeDescription": "Programming 1 course in C.", "date": "2020" },
            { "userID": 1, "school": "EC Education Yrkeshögskola", "degree": "Vocational Higher Educational Degree", "degreeDescription": "Software development with a specialization in Industrial Internet Of Things (IoT).", "date": "2020-2022" },
            { "userID": 1, "school": "Jönköping University", "degree": "Degree of Bachelor of Science in Computer Engineering with specialization in Software Engineering and Mobile Platforms", "degreeDescription": "The education is largely based on projects and exercises that provide practical experience in the techniques being taught. The program focuses on understanding how computers work and the structure of computer networks. In the early stages of the program, the focus lies on understanding the basic fundamentals of computer science and mathematics. Following that, the program will dive deeper into mobile device development, web development, computer networks, and systems. The program includes learning in C and its derivatives such as C++, SQL database management systems, algorithms and data structures, object-oriented programming principles, computer networking concepts, Windows operating systems, as well as web technologies like HTML, CSS, and JavaScript.", "date": "2023-09-28" },
        ];

        education.forEach((eduData) => {
            db.run("INSERT OR IGNORE INTO education (userID, school, degree, degreeDescription, date) VALUES (?, ?, ?, ?, ?)", [eduData.userID, eduData.school, eduData.degree, eduData.degreeDescription, eduData.date], (error) => {
                if (error) {
                    console.log("Error: ", error);
                } else {
                    console.log("Line added into education table!");
                }
            });
        });
    }
});


//CREATE Table Experience and inserting values.
db.run("CREATE TABLE IF NOT EXISTS experience (experienceID INTEGER PRIMARY KEY AUTOINCREMENT, userID INTEGER REFERENCES user(userID) ON DELETE CASCADE ON UPDATE CASCADE, jobTitle TEXT NOT NULL, company TEXT, jobDescription TEXT, date DATE, location TEXT)", (error) => {
  if (error) {
      console.log("Error: ", error);
  } else {
      console.log("----> Table experience created!");
      const experiences = [
          { "userID":1,"jobTitle": "Assistant Floor Manager","company": "O'Learys Mall Of Scandinavia", "jobDescription": "Responsibilities consisted of arranging the resturants events, serving food and beverages, managing pentathlons and other games activities. Responsible for smaller sections of the departments including the bar and event organizer ( 3-& 5 battles, bachelor’s and children’s parties) Managed administrative functions for the day, served as the primary liaison between customers and employees, utilizing the best judgement in tandem with the restaurants standards to resolve conflict that might have arose. Maintained and executed routines site sanitation,supervising and furthermore.", "date": "April 2016- January 2020", "location": "Stockholm, Sweden" },
          { "userID":2,"jobTitle": "Caretaker ","company":"Solom AB", "jobDescription": "Caretaker at a special needs group home residence, providing assistance and support to residents.", "date": "January 2020 – August 2020", "location": "Stockholm,Sweden" },
          { "userID":3,"jobTitle": "Salesman", "company":"OKQ8", "jobDescription": "Salesman at a gas service station. Varying job tasks from cleaning, taking care of customers. Additionally, car rental services and taking care of the different vehicles and trailers.", "date": "2023-09-30", "location": "Stockholm, Sweden" }

      ];

      experiences.forEach((expData) => {
          db.run("INSERT OR IGNORE INTO experience (userID, jobTitle, company, jobDescription, date, location) VALUES (?, ?, ?, ?, ?, ?)", [expData.userID, expData.jobTitle, expData.company, expData.jobDescription, expData.date, expData.location], (error) => {
              if (error) {
                  console.log("Error: ", error);
              } else {
                  console.log("Line added into experience table!");
              }
          });
      });
  }
}); 

//CREATE Table Projects and inserting values.
db.run("CREATE TABLE IF NOT EXISTS projects(projectID INTEGER PRIMARY KEY AUTOINCREMENT, userID INTEGER REFERENCES user(userID) ON DELETE CASCADE ON UPDATE CASCADE, projectTitle TEXT NOT NULL, projectDescription TEXT, link TEXT)", (error) => {
    if (error) {
        console.log("Error: ", error);
    } else {
        console.log("----> Table projects created!");
        const projects = [
            { "userID": 1, "projectTitle": "Online Web Shop SQL", "projectDescription": "Online Web Shop created with SQL queries and ER diagram with both conceptual and logical diagrams that have been normalized to 3NF.", "link": "https://github.com/Nazlizamanian/OnlineWebShopDatabaseSQL" },
            { "userID": 1, "projectTitle": "Bank system", "projectDescription": "Simple bank program that resembles the nature and primary functions of an ATM machine and fulfills the tasks one can expect to be done at a visit to the bank.", "link": "https://github.com/Nazlizamanian/LIA" },
        ];

        projects.forEach((projectData) => {
            db.run("INSERT OR IGNORE INTO projects (userID, projectTitle, projectDescription, link) VALUES (?, ?, ?, ?)", [projectData.userID, projectData.projectTitle, projectData.projectDescription, projectData.link], (error) => {
                if (error) {
                    console.log("Error: ", error);
                } else {
                    console.log("Line added into projects table!");
                }
            });
        });
    }
});
/*
//CREATE Table Skills and inserting values.
db.run("CREATE TABLE IF NOT EXISTS skills (skillsID INTEGER PRIMARY KEY AUTOINCREMENT, userID INTEGER REFERENCES user(userID) ON DELETE CASCADE ON UPDATE CASCADE, sname TEXT NOT NULL, type TEXT, skillLevel NUMERIC)", (error) => {
  if (error) {
      console.log("Error: ", error);
  } else {
      console.log("----> Table skills created!");
      const skillsData = [
          { "userID": 1, "name": "C", "type": "programming language", "skillLevel": 75 },
          { "userID": 1, "name": "C++", "type": "programming language", "skillLevel": 70 },
          { "userID": 1, "name": "CSS", "type": "stylesheet language", "skillLevel": 60 },
          { "userID": 1, "name": "HTML", "type": "markup language", "skillLevel": 65 },
          { "userID": 1, "name": "SQL", "type": "programming language", "skillLevel": 70 },
      ];

      skillsData.forEach((data) => {
          db.run("INSERT OR IGNORE INTO skills (userID, sname, type, skillLevel) VALUES (?, ?, ?, ?)", [data.userID, data.name, data.type, data.skillLevel], (error) => {
              if (error) {
                  console.log("Error: ", error);
              } else {
                  console.log("Line added into skills table!");
              }
          });
      });
  }
});
*/

//GET READ on table Education
app.get('/education',(req,res)=>{
  db.all("SELECT * FROM education", (err, rows)=>{
    if(err){
      res.status(500).send('International server error');
    }
    else {
      res.json(rows);
    }
  });
});

//UPDATE
app.put('/users/:userID', (req, res) => {
  if (req.user && req.user.role === 1) {
    const id = req.params.userID; 
    const username = req.body.username;
    const password = req.body.password;
    const role = req.body.role;
    const email = req.body.email;
    const regDate = req.body.regDate;

    db.run('UPDATE user SET username = ?, password = ?, role = ?, email = ?, regDate = ? WHERE id = ?', [username, password, role, email, regDate, id], (err) => {
      if (err) {
        res.status(500).json({ error: 'Server error' });
      } else {
        res.status(200).json({ message: 'User updated' });
      }
    });
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
}); 


//Use of a GET CRUD operation on one of your tables, 
//retrieve more information about an element by clicking on it
//Select all the users that are NOT admin. 
app.get('/user', (req, res) => {
  db.all("SELECT * FROM user WHERE role = 0", (err, users) => {
    if (err) {
      res.status(500).send('Internal server error');
    } else if (users.length === 0) {
      res.status(404).send('Error no users were found');
    } else {
      res.json(users);
    }
  });
});

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
// defines the views directory
app.set('views', './views');

app.set('view engine', 'handlebars');

// define static directory "public"
app.use(express.static('public'))

// defines a middleware to log all the incoming requests' URL
app.use((req, res, next) => {
    console.log("Req. URL: ", req.url)
    next()
})

//Post forms 
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//Store session in the database
const SQLiteStore= connectSqlite3(session)

app.use(session({
  store: new SQLiteStore({db: "session-db.db"}),
  saveUninitialized: false,
  resave: false,
  secret:"61Om318808"
}));

//Routes
app.get('/', (req, res) => {
  const model={
    isLoggedIn: req.session.isLoggedIn,
    name: req.session.name,
    isAdmin: req.session.isAdmin
  }
    res.render('home', model);
});

app.get('/about', (req, res) => {
  const model={
    isLoggedIn: req.session.isLoggedIn,
    name: req.session.name,
    isAdmin: req.session.isAdmin
  }
  res.render('about.handlebars', model);
});


app.get('/onlinewebshop', (req,res)=>{
  const model={
    isLoggedIn: req.session.isLoggedIn,
    name: req.session.name,
    isAdmin: req.session.isAdmin
  }
  res.render('onlinewebshop.handlebars', model);
});

app.get('/banksystem', (req,res)=>{
  const model={
    isLoggedIn: req.session.isLoggedIn,
    name: req.session.name,
    isAdmin: req.session.isAdmin
  }
  res.render('banksystem.handlebars', model);
});

app.get('/contact', (req, res) => {
  const model={
    isLoggedIn: req.session.isLoggedIn,
    name: req.session.name,
    isAdmin: req.session.isAdmin
  }
  res.render('contact.handlebars', model);
});


app.get('/login', (req, res) => {
  const model={
    isLoggedIn: req.session.isLoggedIn,
    name: req.session.name,
    isAdmin: req.session.isAdmin
  }
  res.render('login.handlebars', model);
});

//Log In 
async function comparePasswords(plainTextPassword, hashedPassword) {
  try {
      if (!plainTextPassword || !hashedPassword) {
          console.error('Both plainTextPassword and hashedPassword must be provided');
          return [false, true];
      }
      const match = await bcrypt.compare(plainTextPassword, hashedPassword);
      return [match, false];
  } catch (error) {
      return [false, true];
  }
}

app.post('/login', (req, res) => {
  const user = req.body.user;
  const plainTextPassword = req.body.pw;

  // Retrieve the hashed password from your database based on the username
  const sql = 'SELECT username, password, role FROM user WHERE username = ?';
 
  db.get(sql, [user], async (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }

    if (row) {
      const hashedPasswordFromDatabase = row.password;
      const [result,compareErr]= await comparePasswords(plainTextPassword,hashedPasswordFromDatabase)
      // Compare the hashed password with the provided plain text password
    
      if (compareErr) {
        console.error(compareErr);
        return res.status(500).send('Internal Server Error');
      }

      if (result) {
        console.log(`${user} successfully logged in!`);
        req.session.isAdmin = (row.role==1);
        req.session.isLoggedIn = true;
        req.session.name = user;
        res.redirect('/');
      } else {
        
        console.log('Login was unsuccessful, wrong user/password!');
        req.session.isAdmin = false;
        req.session.isLoggedIn = false;
        req.session.name = '';
        res.redirect('/login');
      }
  
    } else {
      console.log('User not found');
      req.session.isAdmin = false;
      req.session.isLoggedIn = false;
      req.session.name = '';
      res.redirect('/login');
    }
  });
});

app.get('/', (req, res) => {
  console.log("Session: ", req.session)
  const model = {
    isLoggedIn: req.session.isLoggedIn,
    name: req.session.name,
    isAdmin: req.session.isAdmin
  };
  res.render('home.handlebars', model);
});

app.get('/logout', (req,res)=>{
  req.session.destroy((err)=>{
    console.log("Error")
  })
  console.log('Logged out..')
  res.redirect('/')
});

db.serialize(function() {
  // Test the database connection
  db.all("SELECT 1", function(error, result) {
      if (error) {
          console.error("Error connecting to the database:", error);
      } else {
          console.log("Database connection successful");
      }
  });
});
process.on('exit', () => {
  db.close();
});



//Step4 create 
app.get('/projects', (req, res) => {
  console.log(`HÄR`)
  db.all("SELECT * FROM projects", function (error, theProjects) {
    if (error) {
       // fix err
    } else {
        console.log(theProjects);
        const model = {
          projects: theProjects,
          isLoggedIn: req.session.isLoggedIn,
          name: req.session.name,
          isAdmin: req.session.isAdmin,
        }
        res.render("projects.handlebars", model); 
      } 
    });
});

app.get('/projects/delete', (req,res)=>{
  if (req.session.isLoggedIn === true && req.session.isAdmin === true) {
    const model={
      isLoggedIn: req.session.isLoggedIn,
      name: req.session.name,
      isAdmin: req.session.isAdmin,
    }
    res.render('deleteproject.handlebars', model)
  } else{
    res.redirect('/login')
  }
});

//DELETE, can only be preformed by an admin.
app.delete('/projects/delete/:id', (req, res) => {
  const projectId = req.params.id; 

  if (req.session.isLoggedIn === true && req.session.isAdmin === true) {
    const sql = 'DELETE FROM project WHERE projectID = ?';

    db.run(sql, [projectId], function (error) { 
      if (error) {
        const model = {
          dbError: true,
          theError: error,
          isLoggedIn: req.session.isLoggedIn,
          name: req.session.name,
          isAdmin: req.session.isAdmin,
        };
        res.render("home.handlebars", model);
      } else {
        const model = {
          dbError: false,
          theError: "",
          isLoggedIn: req.session.isLoggedIn,
          name: req.session.name,
          isAdmin: req.session.isAdmin,
        };
        res.render("home.handlebars", model);
      }
    });
  } else {
    res.redirect('/login');
  }
});

app.get('/projects/new', (req,res)=>{
  if (req.session.isLoggedIn === true && req.session.isAdmin === true) {
    const model={
      isLoggedIn: req.session.isLoggedIn,
      name: req.session.name,
      isAdmin: req.session.isAdmin,
    }
    res.render('newproject.handlebars', model)
  } else{
    res.redirect('/login')
  }
});
app.post('/projects/new', (req,res )=>{
  const newp=[
    req.body.projectTitle, req.body.projectDescription, req.body.link,
  ]
  if(req.session.isLoggedIn==true && req.session.isAdmin==true){
    db.run("INSERT INTO projects (projectTitle, projectDescription, link) VALUES (?,?,?)", newp, (error)=>{
      if(error){
        console.log("ERROR: ", error)
      } else{
        console.log("line added into the projects table!")
      }
      res.redirect('/projects')
    })
  } else{
    res.redirect('/login')
  }
});

//Modify project
app.get('/projects/update', (req,res)=>{
  if (req.session.isLoggedIn === true && req.session.isAdmin === true) {
    const model={
      isLoggedIn: req.session.isLoggedIn,
      name: req.session.name,
      isAdmin: req.session.isAdmin,
    }
    res.render('modifyproject.handlebars', model)
  } else{
    res.redirect('/login')
  }
});
app.get('/projects/update/:projectID', (req, res) => {
  const id = req.params.id;
  db.get("SELECT * FROM projects WHERE projectID=?", [id], function (error, theProject) {
    if (error) {
      console.log("Error: ", error);
      const model = {
        dbError: true,
        theError: error,
        project: {},
        isLoggedIn: req.session.isLoggedIn,
        name: req.session.name,
        isAdmin: req.session.isAdmin,
      };
      res.render("modifyproject.handlebars", model);
    } else {
      const model = {
        dbError: false,
        theError: "",
        project: theProject,
        isLoggedIn: req.session.isLoggedIn,
        name: req.session.name,
        isAdmin: req.session.isAdmin,
        helpers: {
          theTypeR(value) { return value === "Education";},
          theTypeT(value) {return value === "Other";},
        },
      };
      res.render("modifyproject.handlebars", model);
    }
  });
});


app.get('/projects1111', (req, res) => {
  // Check if projectsData already exists in the database
  db.get("SELECT COUNT(*) AS count FROM projectsData", (error, row) => {
    if (error) {
      console.error("Error checking if data exists:", error);
      res.status(500).send("Internal Server Error");
      return;
    }

    if (row.count === 0) {
      // Projects data doesn't exist, insert it into the database
      const projectsData = [
        // ... your projects data here ...
      ];

      // Insert projects into the database
      const insertPromises = projectsData.map(project => {
        return new Promise((resolve, reject) => {
          db.run(`INSERT INTO projectsData (title, description) VALUES (?, ?)`,
            [project.title, project.description],
            (error) => {
              if (error) {
                console.error("Error inserting project:", error);
                reject(error);
              } else {
                console.log("---> Project inserted successfully!");
                resolve();
              }
            }
          );
        });
      });

      // Wait for all insert operations to complete
      Promise.all(insertPromises)
        .then(() => {
          // Redirect to the same route to fetch and render the data
          res.redirect('/projects');
        })
        .catch(error => {
          // Handle error if any of the insert operations fail
          console.error("Error inserting projects:", error);
          res.status(500).send("Internal Server Error");
        });
    } else {
      // Projects data already exists, retrieve and render it
      db.all("SELECT * FROM projectsData", (error, projectsData) => {
        if (error) {
          console.error("Error retrieving projects data:", error);
          res.status(500).send("Internal Server Error");
        } else {
          // Parse the JSON data from the database response
          projectsData = projectsData.map(project => {
            return {
              title: project.title,
              description: project.description
            };
          });

          const model = {
            projectsData: projectsData,
            isLoggedIn: req.session.isLoggedIn,
            name: req.session.name,
            isAdmin: req.session.isAdmin
          };
          res.render("projects.handlebars", model);
        }
      });
    }
  });
});









//All CRUD uperations one 1 table: User. 
//CREATE
app.post('/users', (req, res) => {
  const { username, password, role, email, regDate } = req.body;
  // Check if the username exists
  db.get('SELECT userID FROM user WHERE username = ?', [username], (error, existingUser) => {
      if (error) {
          console.log('Error: ', error);
          res.status(500).json({ error: 'Server error' });
      } else if (existingUser) {
          res.status(400).json({ error: 'Username already exists' });
      } else {
          // Insert the user if the username is unique
          db.run(
              'INSERT INTO user (username, password, role, email, regDate) VALUES (?, ?, ?, ?, ?)',
              [username, password, role, email, regDate],
              (insertError) => {
                  if (insertError) {
                      console.log('Error: ', insertError);
                      res.status(500).json({ error: 'Failed to create user' });
                  } else {
                      res.status(201).json({ message: 'User created successfully' });
                  }
              }
          );
      }
  });
});


// view all users who are not admin, role=0.
app.get('/user', (req, res) => {
  db.all("SELECT * FROM user WHERE role = 0", (err, users) => {
      const model = {
          dbError: false,
          theError: "",
          users: users
      };

      if (err) {
          model.dbError = true;
          model.theError = err;
      } else if (users.length === 0) {
          model.theError = "No users were found";
      }
      res.render("user.handlebars", model);
  });
});

// run the server and make it listen to the port
app.listen(port, () => {
    console.log(`Server running and listening on port ${port}...`)
});


