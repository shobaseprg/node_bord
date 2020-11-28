
// ===================================
// モジュールロード
// ===================================
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session'); //☆

var app = express();

// ===================================
// モジュール組み込み
// ===================================
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// ===================================
// ルーティング
// ===================================
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var boardsRouter = require('./routes/boards');
var marksRouter = require('./routes/marks');
var hello = require('./routes/hello');


// ===================================
// セッション設定
// ===================================
var session_opt = {
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60 * 60 * 1000 }
};
app.use(session(session_opt));


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/hello', hello);
app.use('/boards', boardsRouter);
app.use('/md', marksRouter);
// ===================================
// ビューエンジン指定
// ===================================
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// ===================================
// エラー処理
// ===================================
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
