if (process.env.NODE_ENV !== "production") {//Configure in Heroku for production mode, Section 59, Lecture 578
    require('dotenv').config();
}
const express = require('express');
const app = express();
const ExpressError = require('./utils/ExpressError');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const { isLoggedIn } = require('./utils/middleware');
const mongoSanitize = require('express-mongo-sanitize');

//#region DataBase
const uri = process.env.MongoDbURI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, })
    .then(() => {
        console.log("mongoose connected!")
    })
    .catch(err => {
        console.log("mongoose connection error:")
        console.log(err)
    });
//#endregion

//#region RenderingEngine
app.engine('ejs', ejsMate)
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
//#endregion

//#region Uses
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, '/public')));
app.use(mongoSanitize());

//Session
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));

//Flash
app.use(flash());

//Passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//App Locals
app.use((req, res, next) => {
    req.app.locals.currentUser = req.user;
    next();
})

//Response Locals
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

//Routes
const userRoutes = require('./routers/user/user');
const exp = require('constants');
app.use('/user', userRoutes);
//#endregion

app.get('/', (req, res) => {
    res.render('home');
})

app.all('*', (req, res, next) => {
    next(new ExpressError(404, 'Page not found'));
})

//Errors
app.use((err, req, res, next) => {
    const { status = 500 } = err;
    if (!err.message) { err.message = 'Something went wrong :(' };
    res.status(status).render('error', { err });
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`listening on port ${port}!`);
})