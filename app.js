var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var passport = require('passport');

require('dotenv').config();

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const uploadRouter = require('./routes/uploadRouter');
const favoriteRouter=require("./routes/favoriteRouter");
const dishRouter = require("./routes/dishRouter");
const leaderRouter = require("./routes/leaderRouter");
const promoRouter = require("./routes/promoRouter");
const commentRouter=require('./routes/commentRouter');

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const url = process.env.mongoUrl;
console.log(url);
const start = async () => {
  try {
    const connect = await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("connected successfully");
  } catch (error) {
    console.log(error);
  }
};
start();

var app = express();

// Secure traffic only where all requests coming to the unsecure http server will be redirected to the secure https server.
app.all('*', (req, res, next) => {
  if (req.secure) {
    return next();
  }
  else {
    res.redirect(307, 'https://' + req.hostname + ':' + app.get('secPort') + req.url);
  }
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());



app.use(passport.initialize());



app.use("/", indexRouter);
app.use("/users", usersRouter);


app.use(express.static(path.join(__dirname, "public")));

app.use('/favorites',favoriteRouter);
app.use("/dishes", dishRouter);
app.use("/leaders", leaderRouter);
app.use("/promotions", promoRouter);
app.use('/imageUpload',uploadRouter);
app.use('/comments',commentRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
