var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
// API Versioning:-
// v1 - for books
// v2 - for books + comments added
// v3 - for book categories
// v4 - for book tags
var { routerV1, routerV2, routerV3, routerV4 } = require('./routes/books');
var usersRouter = require('./routes/users');
var commentsRouter = require('./routes/comments');
const { default: mongoose } = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const auth = require('./middlewares/auth');

var app = express();

mongoose
  .connect('mongodb://127.0.0.1:27017/api-bookstore-jwt')
  .then(() => console.log('Connected to DB!'))
  .catch((err) => console.log(err));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//session placed after cookieParser() and before accessing usersRouter below
//Session created below
// app.use(
//   session({
//     secret: process.env.SECRET,
//     resave: false,
//     saveUninitialized: false,
//     store: MongoStore.create({
//       mongoUrl: 'mongodb://127.0.0.1:27017/api-bookstore',
//     }),
//   })
// );

// Express API Server routes all incoming requests to /api/xyz routes.

// *** Note: that here I had created a seaparate route to handle comments (so despite being v2, it has a separate comments.js route). Whereas, categories is handled inside books.js route only as v3
app.use('/api', indexRouter);
app.use('/api/v1/books', auth.verifyToken, routerV1); // router for books.js file - handles version 1
app.use('/api/v2/books', auth.verifyToken, routerV2); // router for books.js file - handles version 2 (book changes handled)
app.use('/api/v2/books', auth.verifyToken, commentsRouter); // router for books.js file - handles version 2  (comment specific changed handled)
app.use('/api/v3/books/categories', auth.verifyToken, routerV3); // router for books.js file - handles version 3 (book categories handled)
app.use('/api/v4/books/tags', routerV4); // router for books.js file - handles version 4 (book TAGS handled)
app.use('/api/v5/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
