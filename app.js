const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const route = require('./routes/main');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');

const app = express();
dotenv.config();

mongoose.connect(process.env.MONGODB, function (err) {
   if (!err) {
      console.log('Connection Database');
   } else {
      console.log(err);
   }
});

// Template Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors());
app.use(express.json());
app.use(cookieParser('secret'));
app.use(flash());
app.use(
   session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: true,
      cookie: { maxAge: 60000 },
   }),
);
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));

app.listen(() => {
   console.log(`Server is running on ${process.env.PORT}`);
});

// Routes
route(app);

module.exports = app;
