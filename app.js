const express = require('express');
const { engine } = require('express-handlebars');
const sqlite3 = require('sqlite3').verbose();
const bodyParser= require('body-parser')
const session = require('express-session');
const connect = require('connect-sqlite3'); 
const connectSqlite3 = require('connect-sqlite3');
const { LIMIT_EXPR_DEPTH } = require('sqlite3');
const bcrypt = require("bcrypt")
const saltRounds=10;
const app = express();
const port = 8080

//connected to the database located in the model folder.
const db = new sqlite3.Database('model/portfolio.db');

//----------------------------------------CREATE Table User and inserting values ----------------------------------------
db.run("CREATE TABLE IF NOT EXISTS user (userID INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL, password TEXT NOT NULL, role INTEGER, email TEXT, regDate DATE)", (error) => {
  if (error) {
    console.log("Error: ", error);
  } else {
    console.log("----> Table user created!");

    //Flag to prevent duplicate insertions
    let insertedUsers = false;

    // Check if user data has been inserted before
    db.get("SELECT 1 FROM user LIMIT 1", (selectError, row) => {
      if (!selectError && row) {
        insertedUsers = true;
      }

      // Insert user data if it hasn't been inserted before
      if (!insertedUsers) {
        const users = [
          { "username": "nazli01", "password": "$2b$10$tfdDufzBWk.QdWYPfaQfXusJC.0Q01QAvScAJidvis7v6oVs18V5q", "role": 1, "email": "zana22za@student.ju.se", "regDate": "2023-09-22" },
          { "username": "momo22", "password": "$2b$10$3/mG9v4tM/v9SuIMcL4YU.UCEGGLoROTZl3bRbDYL9smt/AvsSseC", "role": 0, "email": "momo@gmail.com", "regDate": "2023-09-23" },
          { "username": "kevin33", "password": "$2b$10$LaEsn9Z/LP1eroxO.zQvcuj8DHuPCE6eEVTc2x1JXpVWNeImS2522", "role": 0, "email": "kevin@gmail.com", "regDate": "2023-09-24" },
          { "username": "lilly2434", "password": "$2b$10$xGuqChdNm405Llf/IFDjT.JPW6ixpvuAg4w18C9qZCENVP04EG2jq", "role": 0, "email": "lillyke@gmail.com", "regDate": "2023-09-25" },
          { "username": "Taylor2378", "password": "$2b$10$UQIgf2LEpnJ3G1jpPgTmMeSk3R7Lj8Zl28x/3sYXhWgTgtkwEm8Wm", "role": 0, "email": "taylor@example.com", "regDate": "2023-09-29" }
        ];

        users.forEach((userData) => {
          db.run("INSERT OR IGNORE INTO user (username, password, role, email, regDate) VALUES (?, ?, ?, ?, ?)",
            [userData.username, userData.password, userData.role, userData.email, userData.regDate], (error) => {
              if (error) {
                console.log("Error: ", error);
              } else {
                console.log("Line added into user table!");
              }
            });
        });
      }
    });
  }
});


//----------------------------------------CREATE Table Education and inserting values ----------------------------------------
db.run("CREATE TABLE IF NOT EXISTS education (educationID INTEGER PRIMARY KEY AUTOINCREMENT, userID INTEGER REFERENCES user(userID) ON DELETE CASCADE ON UPDATE CASCADE, school TEXT NOT NULL, degree TEXT NOT NULL, degreeDescription TEXT, date DATE)", (error) => {
  if (error) {
    console.log("Error: ", error);
  } else {
    console.log("----> Table education created!");

    //Flag to prevent duplicate insertions
    let insertedEducation = false;

    // Check if education data has been inserted before
    db.get("SELECT 1 FROM education LIMIT 1", (selectError, row) => {
      if (!selectError && row) {
        insertedEducation = true;
      }

      // Insert education data if it hasn't been inserted before
      if (!insertedEducation) {
        const education = [
          { "userID": 1, "school": "Trollbodaskolan", "degree": "Middle school", "degreeDescription": "Middle school degree", "date": "2007-2017" },
          { "userID": 1, "school": "Internationella Engelska Gymnaiset Södermalm (IEGS)", "degree": "High school degree in natural science program with specialization in social science", "degreeDescription": "The program mainly focuses on research, analysis, and communication skills in the context of natural sciences and mathematics and interdisciplinary connections. It introduces core concepts, promotes scientific method awareness, improves language proficiency for scientific communication, fosters the integration of scientific elements, and encourages coherent knowledge integration in fields such as biology, chemistry, physics. Additionally, the program puts a significant emphasis on social science as well.", "date": "2017-2020" },
          { "userID": 1, "school": "EC Education Yrkeshögskola", "degree": "Programming 1 course.", "degreeDescription": "Programming 1 course in C.", "date": "2020" },
          { "userID": 1, "school": "EC Education Yrkeshögskola", "degree": "Vocational Higher Educational Degree", "degreeDescription": "Software development with a specialization in Industrial Internet Of Things (IoT).", "date": "2020-2022" },
          { "userID": 1, "school": "Jönköping University", "degree": "Degree of Bachelor of Science in Computer Engineering with specialization in Software Engineering and Mobile Platforms", "degreeDescription": "The education is based on projects and exercises that provide practical experience. The focus lies on understanding the fundamentals of computer science and mathematics. The program dives deeper into mobile development, web development, computer networks, and systems. The program includes learning in C++ and SQL database management systems, algorithms and data structures, object-oriented programming principles, computer networks, Windows operating systems, as well as web technologies.", "date": "2022-2025" }
        ];

        education.forEach((eduData) => {
          db.run("INSERT INTO education (userID, school, degree, degreeDescription, date) VALUES (?, ?, ?, ?, ?)",
            [eduData.userID, eduData.school, eduData.degree, eduData.degreeDescription, eduData.date], (error) => {
              if (error) {
                console.log("Error: ", error);
              } else {
                console.log("Line added into education table!");
              }
            });
        });
      }
    });
  }
});

//----------------------------------------CREATE Table Projects and inserting values ----------------------------------------
db.run("CREATE TABLE IF NOT EXISTS projects (projectID INTEGER PRIMARY KEY AUTOINCREMENT, userID INTEGER REFERENCES user(userID) ON DELETE CASCADE ON UPDATE CASCADE, projectTitle TEXT NOT NULL, projectDescription TEXT, projectYear TEXT)", (error) => {
  if (error) {
    console.log("Error: ", error);
  } else {
    console.log("----> Table projects created!");

    // Flag used to prevent duplicate insertions
    let insertedProjects = false;

    // Check if projects data has been inserted before
    db.get("SELECT 1 FROM projects LIMIT 1", (selectError, row) => {
      if (!selectError && row) {
        insertedProjects = true;
      }

      // Insert projects data if it hasn't been inserted before
      if (!insertedProjects) {
        const projects = [
          { "projectID": 1, "userID": 1, "projectTitle": "Online Web Shop SQL", "projectDescription": "Online Web Shop created with SQL queries and ER diagram with both conceptual and logical diagrams that have been normalized to 3NF.", "projectYear": "2023" },
          { "projectID": 2, "userID": 1, "projectTitle": "Bank system", "projectDescription": "Simple bank program that resembles the nature and primary functions of an ATM machine and fulfills the tasks one can expect to be done at a visit to the bank.", "projectYear": "2022" },
          { "projectID": 3, "userID": 1, "projectTitle": "BlackJack Game", "projectDescription": "Small application in the language C++ of the classical game 21 Blackjackis. Players are invited to test their card skills and strategic thinking in a simplified yet entertaining digital environment. With a user-friendly interface and easy-to-follow rules, this C++ game promises an enjoyable gaming experience for all ages. Get ready to hit, stand, and challenge your luck in the pursuit of the elusive 21!", "projectYear": "2023" },
          { "projectID": 4, "userID": 1, "projectTitle": "Correlation between substance abuse & neurological disease; Opioids and Alzheimer’s Disease", "projectDescription": "GYAR project that studies the opioid epidemic and its effects to the human brain. Investigating into the intricate neurological damage caused by opioid abuse, with a particular emphasis on the hippocampus and its role in memory function. Additionally exploring the potential connection and likleyhood of  opioid abuse and developing Alzheimer's disease later in life.", "projectYear": "2020" },
          { "projectID": 5, "userID": 1, "projectTitle": "Ceasar Cipher Encryption ", "projectDescription": "A program written in Java, performs Caesar Cipher encryption. It takes an input text and a numerical encryption key. By using these two components, it encrypts and decrypts messages. The encryption key can also be a negative integer, allowing for both encryption and decryption of messages. It's a simple yet effective tool for encoding and decoding secret messages.", "projectYear": "2023" },
        ];

        projects.forEach((projectData) => {
          db.run("INSERT INTO projects (projectID, userID, projectTitle, projectDescription, projectYear) VALUES (?, ?, ?, ?, ?)",
            [projectData.projectID, projectData.userID, projectData.projectTitle, projectData.projectDescription, projectData.projectYear], (error) => {
              if (error) {
                console.log("Error: ", error);
              } else {
                console.log("Line added into projects table!");
              }
            });
        });
      }
    });
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

////----------------------------------------Post forms ----------------------------------------
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

////----------------------------------------Routes ----------------------------------------
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

//----------------------------------------Log In ----------------------------------------
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

  // Retrieves the hashed password from the database based on the username.
  const sql = 'SELECT username, password, role FROM user WHERE username = ?';
 
  db.get(sql, [user], async (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }

    if (row) {
      const hashedPasswordFromDatabase = row.password;
      const [result,compareErr]= await comparePasswords(plainTextPassword,hashedPasswordFromDatabase)
      // Compares the hashed password with the provided plain text password. 
    
      if (compareErr) {
        console.error(compareErr);
        return res.status(500).send('Internal Server Error');
      }

      if (result) {
        console.log(`${user} successfully logged in!  with role `, row.role);
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

app.get('/logout', (req,res)=>{
  req.session.destroy((err)=>{
    console.log("Error")
  })
  console.log('Logged out..')
  res.redirect('/')
});

//----------------------------------------Session----------------------------------------
app.get('/', (req, res) => {
  console.log("Session: ", req.session)
  const model = {
    isLoggedIn: req.session.isLoggedIn,
    name: req.session.name,
    isAdmin: req.session.isAdmin
  };
  res.render('home.handlebars', model);
});

//----------------------------------------Test the database connection----------------------------------------
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


//----------------------------------------Education ----------------------------------------
app.get('/edu', (req, res) => {
  console.log(`edu`)
  db.all("SELECT * FROM Education", function (error, theEducation) {
    if (error) {
       console.log("Database querie error", error);
       res.status(500).send("Internal Server Error");
    } else {
        console.log(theEducation);
        const model = {
          Education: theEducation,
          isLoggedIn: req.session.isLoggedIn,
          name: req.session.name,
          isAdmin: req.session.isAdmin,
        }
        res.render("edu.handlebars", model); 
      } 
    });
});


//----------------------------------------Project ----------------------------------------
app.get('/projects', (req, res) => {
  console.log(`project`)
  db.all("SELECT projectTitle, projectYear, projectID FROM projects", function (error, theProjects) {
    if (error) {
      res.status(500).send("Internal Server Error");
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
//----------------------------------------UPDATE CRUD Project ----------------------------------------
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

//----------------------------------------DELETE CRUD Project----------------------------------------
//can only be preformed by an admin.
app.get('/projects/delete/:id', (req, res) => {
  const id= req.params.id
  if (req.session.isLoggedIn === true && req.session.isAdmin === true) {
    db.run("DELETE FROM projects WHERE projectID = ?", [id], function (error, theProjects) {
      if (error) {
        const model = {
          dbError: true, theError:error,
          idLoggedIN:req.session.isLoggedIn,
          name:req.session.name,
          isAdmin:req.session.isAdmin
        }
        res.render('home.handlebars', model)
      } else {
        const model = {
          dbError: false, theError:error,
          idLoggedIN:req.session.isLoggedIn,
          name:req.session.name,
          isAdmin:req.session.isAdmin
        }
      res.redirect('/');
      }
    }) 
  } else {
    res.redirect('/login');
  }
});


//---------------------------------------- Read more about a specfic project (READ)  Project----------------------------------------
app.get('/projects-more/:id', (req, res) => {
  const id= req.params.id
  db.get("SELECT * FROM projects WHERE projectID=?", [id], function (error, theProjects) {
    if (error) {
    } else {
      const model = {
        project: theProjects,
        isLoggedIn: req.session.isLoggedIn,
        name: req.session.name,
        isAdmin: req.session.isAdmin,
      }
      console.log(model)
      res.render("projects-more.handlebars", model); 
    }
  }) 
});

//---------------------------------------- ADD NEW (CREATE) Project----------------------------------------
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
  console.log("newproject")
  const newp=[
    req.body.projectID,req.body.projectTitle, req.body.projectDescription, req.body.projectYear,
    req.body.userID
  ]
  if(req.session.isLoggedIn==true && req.session.isAdmin==true){
    db.run("INSERT INTO projects (projectID,projectTitle, projectDescription, projectYear) VALUES (?,?,?,?)", newp, (error)=>{
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

//----------------------------------------Modify project----------------------------------------
app.get('/projects/modify/:id', (req,res)=>{
  console.log(req.params.id);
  if (req.session.isLoggedIn === true && req.session.isAdmin === true) {
    const model={
      isLoggedIn: req.session.isLoggedIn,
      name: req.session.name,
      isAdmin: req.session.isAdmin,
      projectID: req.params.id
    }
    res.render('modifyproject.handlebars', model)
  } else{
    res.redirect('/login')
  }
});
app.post('/projects/modify/:id', (req, res) => {
  console.log("modifyproject");
  const mop = [
    req.body.projectTitle, req.body.projectDescription, req.body.projectYear, req.body.modifyp
  ];
  console.log(req.body.projectTitle);
  console.log(req.body.projectDescription);
  console.log(req.body.projectYear);
  console.log(req.body.modifyp);

  if (req.session.isLoggedIn === true && req.session.isAdmin === true) {
    db.run("UPDATE projects SET projectTitle = ?, projectDescription = ?, projectYear = ? WHERE projectID = ?",[req.body.projectTitle, req.body.projectDescription, req.body.link, req.body.modifyp], (error) => {
      console.log("momo");
      if (error) {
        console.log("ERROR: ", error);
      } else {
        console.log("Project updated in the projects table!");
        res.redirect('/projects');
      }
    });
  } else {
    res.redirect('/login');
  }
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


// app.get('/education', (req, res) => {
//   db.get("SELECT * FROM education WHERE educationID=?", [id], function (error, TheEducation) {
//     console.log("edu")
//       if (error) {
//         console.log("SESSION: ", req.session)
//           const model = {
//               dbError: true,
//               theError: error,
//               Education: [],
//               isLoggedIn:req.session.isLoggedIn,
//               name:req.session.name,
//               isAdmin:req.session.isAdmin,
//           }
//           // renders the page with the model
//           res.render("education.handlebars", model)
//       }
//       else {
//           const model = {
//               dbError: false,
//               theError: "",
//               Education: TheEducation,
//               isLoggedIn: req.session.isLoggedIn,
//               name: req.session.name,
//               isAdmin: req.session.isAdmin,
//           }
//           // renders the page with the model
//           res.render("education.handlebars", model)
//       }
//     })
// });


// run the server and make it listen to the port
app.listen(port, () => {
    console.log(`Server running and listening on port ${port}...`)
});


