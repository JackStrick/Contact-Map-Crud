//const pug = require('pug');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const port = process.env.PORT || 5000


const Database = require('./dbWrapper/CrudDB');
const db = new Database();
db.initialize();


const app = express();

app.use(express.urlencoded({extended: true}))

app.use((req, res, next) => {
    console.log("Adding DB to request");
    req.db = db;
    next();
})

//Middleware for sessions - every request will have an implied session object
app.use(session({
    secret: 'cmps369',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))

// Middleware to allow other files to access user info
app.use((req, res, next) => {
    if (req.session.user){
        res.locals.user = {
            id: req.session.user.id,
            user_name: req.session.user.user_name,
            first_name: req.session.user.first_name,
            last_name: req.session.user.last_name
        }
    }
    next()
})

app.set('view engine', 'pug');
app.use(bodyParser.json());
app.use(express.static('public'));


app.use('/', require('./routes/accounts'));
app.use('/', require('./routes/contacts'));

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})