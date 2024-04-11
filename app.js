const express = require('express');
const mongoose = require('mongoose');
const app = express(); // Initialize Express app

const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('./model/user_auth');
app.use('/uploads', express.static('uploads'));

const bodyParser = require('body-parser');

const homeRouter = require('./routes/homeRoutes');




const port = process.env.PORT || 5000;




mongoose.connect("mongodb://0.0.0.0:27017/user1", { useNewUrlParser: true })
const db = mongoose.connection;
db.on("error", () => { console.log("err"); })
db.once("open", () => { console.log("Conected"); })


app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.urlencoded({ extended: true }));    // authentication

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

// authentication
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.static('public'))





app.use('/uploads', express.static('uploads'));

// routing home route
app.use('/', homeRouter)


app.listen(port, () => {
  console.log("Server is Runing");
});
