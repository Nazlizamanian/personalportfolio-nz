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


//conntect to the database located in the model folder.
const db = new sqlite3.Database('model/portfolio.db');


//Create Table experience and inserting values.
/*
db.run("CREATE TABLE experience (experienceID INTEGER PRIMARY KEY AUTOINCREMENT, userID INTEGER REFERENCES user(userID) ON DELETE CASCADE ON UPDATE CASCADE, jobTitle VARCHAR(100) NOT NULL, company VARCHAR(100), jobDescription TEXT, date DATE, location VARCHAR(100))", (error) => {
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
          db.run("INSERT INTO experience (userID, jobTitle, compoany, jobDescription, date, location) VALUES (?, ?, ?, ?)", [expData.userID, expData.jobTitle, expData.jobDescription, expData.date, expData.location], (error) => {
              if (error) {
                  console.log("Error: ", error);
              } else {
                  console.log("Line added into experience table!");
              }
          });
      });
  }
}); */

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

app.get('/projects', (req,res)=>{
  const model={
    isLoggedIn: req.session.isLoggedIn,
    name: req.session.name,
    isAdmin: req.session.isAdmin
  }
  res.render('projects.handlebars', model);
});

app.get('/projects', (req,res)=>{
  const model={
    isLoggedIn: req.session.isLoggedIn,
    name: req.session.name,
    isAdmin: req.session.isAdmin
  }
  res.redirect('onlinewebshop', model);
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
  const sql = 'SELECT username, password FROM user WHERE username = ?';
 

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
        req.session.isAdmin = true;
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
      // User not found in the database
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






















//Step4 create 
app.get('/projects', (req, res) => {
  db.all("SELECT * FROM projects", function (error, theProjects) {
    if (req.session.isLoggedIn === true && req.session.isAdmin === true) {
      const model = {
        dbError: true,
        theError: error,
        projects: [],  
        isLoggedIn: req.session.isLoggedIn,
        name: req.session.name,
        isAdmin: req.session.isAdmin,
      }
      res.render("projects.handlebars", model); 
    } else {
      const model = {
        dbError: false,
        theError: "",
        projects: theProjects,
        isLoggedIn: req.session.isLoggedIn,
        name: req.session.name,
        isAdmin: req.session.isAdmin,
      }
      res.render("projects.handlebars", model); 
    }
  });
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


