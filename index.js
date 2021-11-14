const express = require('express')
const app = express()
const bodyParser = require('body-parser');
//database
var mongoose = require('mongoose');
const db = require('./database')
mongoose.Promise = global.Promise
// Connecting to the database
mongoose.connect(db.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

//define port
const port=8080;

app.use(bodyParser.urlencoded({ extended: true }))

app.use(bodyParser.json())

app.set('view engine', 'ejs');

const user = require('./controllers/user.controller.js');
//define API

// route index page
app.get("/", (req, res) => {
  
    switch (res.statusCode) {
        case 200:
            res.render("index")
            break;
        case 404:
            res.render("404page")
            break;
        
    }
    
})

// route login page
app.post("/login", user.login)

//route register page
app.post("/register", user.register)

// route recup user
app.get("/user/:token", user.get)

//route modification user
app.put("/update/:token", user.update)

//route modification user password
app.put("/updata-pwd/:id", user.updatepwd)

//route recuperation utilisateurs
app.get("/users/:token",user.findAll)

//route recuperation utilisateurs
app.delete("/logout/:token",user.logout)


//run the application
app.listen(port, () => {
    console.log(`Lancé sur le port ${port}`);
  });
