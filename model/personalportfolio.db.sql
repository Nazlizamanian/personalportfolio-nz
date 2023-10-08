BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "Contact" (
	"contactID"	INTEGER NOT NULL UNIQUE,
	"name"	TEXT NOT NULL,
	"email"	TEXT NOT NULL,
	"company"	TEXT,
	"subject"	TEXT NOT NULL,
	"message"	TEXT NOT NULL,
	PRIMARY KEY("contactID" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "Education" (
	"educationID"	INTEGER NOT NULL UNIQUE,
	"userID"	INTEGER,
	"school"	TEXT,
	"degree"	TEXT,
	"degreeDescription"	TEXT,
	"date"	TEXT,
	FOREIGN KEY("userID") REFERENCES "User"("userID"),
	PRIMARY KEY("educationID" AUTOINCREMENT),
	UNIQUE("educationID")
);
CREATE TABLE IF NOT EXISTS "Experience" (
	"experienceID"	INTEGER NOT NULL UNIQUE,
	"userID"	INTEGER,
	"jobTitle"	TEXT NOT NULL,
	"company"	TEXT,
	"jobDescription"	TEXT,
	"date"	TEXT,
	"location"	TEXT,
	FOREIGN KEY("userID") REFERENCES "User",
	PRIMARY KEY("experienceID" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "Skills" (
	"skillsID"	INTEGER NOT NULL UNIQUE,
	"userID"	INTEGER,
	"nameOfSkill"	TEXT,
	"type"	TEXT,
	"skillLevel"	NUMERIC,
	FOREIGN KEY("userID") REFERENCES "User"("userID"),
	PRIMARY KEY("skillsID" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "User" (
	"userID"	INTEGER NOT NULL UNIQUE,
	"username"	TEXT NOT NULL UNIQUE,
	"password"	TEXT NOT NULL,
	"role"	INTEGER NOT NULL,
	"email"	TEXT NOT NULL,
	"regDate"	TEXT,
	PRIMARY KEY("userID" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "Projects" (
	"projectID"	INTEGER NOT NULL UNIQUE,
	"userID"	INTEGER,
	"projectTitle"	TEXT,
	"projectDescription"	TEXT,
	"link"	TEXT,
	FOREIGN KEY("userID") REFERENCES "User"("userID"),
	PRIMARY KEY("projectID" AUTOINCREMENT)
);
INSERT INTO "Contact" VALUES (1,'John Smith','john.smith@example.com
','XYZ Innovations
','Job Opportunity Inquiry
','We are interested in your expertise in software development.
');
INSERT INTO "Contact" VALUES (2,'Sarah Johnson
','sarah.johnson@example.com
','Tech Solutions Inc.
','Hiring Collaboration Proposal
','We''d like to discuss potential collaboration in our IT department.
');
INSERT INTO "Contact" VALUES (3,'Michael Anderson','michael.anderson@example.com
','Acme Enterprises
','Employment Partnership
','Your company''s skills align with our staffing requirements.
');
INSERT INTO "Contact" VALUES (4,'Emily Davis
','emily.davis@example.com
','Quantum Systems
','Career Opportunities Discussion
','We are exploring employment possibilities in your organization.
');
INSERT INTO "Contact" VALUES (5,'David Taylor','david.taylor@example.com','Global Innovations','Staffing Needs Consultation','Let''s talk about how we can work together to meet our staffing needs.');
INSERT INTO "Education" VALUES (1,1,'Trollbodaskolan ','Middle school','','2007-2017');
INSERT INTO "Education" VALUES (2,1,'Internationella Engelska Gymnaiset Södermalm (IEGS)','High school degree in natural science programme with specialization in social science','The programme mainly focuses on research, analysis, and communication skills in the context of natural sciences and mathematics and interdisciplinary connections. It introduces core concepts, promotes scientific method awareness, improves language proficiency for scientific communication, fosters the integration of scientific elements, and encourages coherent knowledge integration in fields as biology, chemistry, physics. Additionally the programme puts a signficant emphasis on social science as well.','2017-2020');
INSERT INTO "Education" VALUES (3,1,'EC Utbildning Yrkeshögskola','Programming 1 course. ','Programming 1 course in C.','2020');
INSERT INTO "Education" VALUES (4,1,'EC Utbildning Yrkeshögskola','Vocational Higher Education Degree in Industrial IoT Software Development
','Software development with a specialization in Industrial Internet Of Things (IoT).','2020-2022');
INSERT INTO "Education" VALUES (5,1,'Jönköping University','Degree of Bachelor of Science in Computer Engineering with specialization in Software Engineering and Mobile Platforms','The education is largely based on projects and exercises that provide practical experience in the techniques being taught. The program focuses on understanding how computers work and the structure of computer networks. In the early stages of the program the focuses lies on understanding the basic fundamentals of computer science and mathematics. Following that, the program will dive deeper into mobile device development, web development, computer networks, and systems. The programe includs learning in C and its derivatives such as C++, SQL database management systems, algorithms and data structures, object-oriented programming principles, computer networking concepts, Windows operating systems, as well as web technologies like HTML, CSS, and JavaScript.','2022-2025 Current');
INSERT INTO "Experience" VALUES (1,1,'Assistant Floor Manager ','O''Learys Mall Of Scandinavia','Responsibilities consisted of arranging the resturants events, serving food and beverages, managing pentathlons and other games activities. Responsible for smaller sections of the departments including the bar and event organizer ( 3-& 5 battles, bachelor’s and children’s parties) Managed administrative functions for the day, served as the primary liaison between customers and employees, utilizing the best judgement in tandem with the restaurants standards to resolve conflict that might have arose. Maintained and executed routines site sanitation,supervising and furthermore.','April 2016– January 2020','Stockholm ');
INSERT INTO "Experience" VALUES (2,1,'Caretaker','Solom AB','Caretaker at a special needs group home residence, providing assistance and support to residents.',' January 2020 – August 2020','Stockholm, Sweden');
INSERT INTO "Experience" VALUES (3,1,'Salesman ','OKQ8','Salesman at a gas service station. Varying job tasks from cleaning, taking care of customers. Additionally, car rental services and taking care of the different vehicles and trailers.',' March 2021 – September 2022','Stockholm, Sweden');
INSERT INTO "Skills" VALUES (1,1,'C','Programming Language',75);
INSERT INTO "Skills" VALUES (2,1,'C++','Programming Language',70);
INSERT INTO "Skills" VALUES (3,1,'CSS','Stylesheet Language',60);
INSERT INTO "Skills" VALUES (4,1,'HTML','Markup Language',65);
INSERT INTO "Skills" VALUES (5,1,'SQL','Programming Language',70);
INSERT INTO "User" VALUES (1,'nazli01','$2b$10$tfdDufzBWk.QdWYPfaQfXusJC.0Q01QAvScAJidvis7v6oVs18V5q',1,'zana22za@student.ju.se','2023-09-22');
INSERT INTO "User" VALUES (2,'momo22','momo123',0,'momo@gmail.com','2023-09-23');
INSERT INTO "User" VALUES (3,'kevin33','kevin123',0,'kevin@gmail.com','2023-09-24');
INSERT INTO "User" VALUES (4,'lilly2434','lilly123',0,'lillyke@gmail.com','2023-09-25');
INSERT INTO "User" VALUES (5,'Taylor2378','taylor123',0,'taylor@example.com','2023-09-29');
INSERT INTO "Projects" VALUES (1,1,'Online Web Shop SQL','Online Web Shop created with SQL queries and ER diagram with both conceptual and logical diagram that has been normalized to 3NF.','https://github.com/Nazlizamanian/OnlineWebShopDatabaseSQL');
INSERT INTO "Projects" VALUES (2,1,'Bank system','Simple bank programme that resemblance the nature and primary functions of an atm machine and fullfils the tasks that one can expect to be done at a visit to the bank.','https://github.com/Nazlizamanian/LIA');
COMMIT;
