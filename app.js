let createError = require("http-errors");
let express = require("express");
let path = require("path");
// let cookieParser = require("cookie-parser");
let session = require("express-session");
let mysqlSessionStore = require("express-mysql-session");
let logger = require("morgan");
// let cors = require("cors");

let indexRouter = require("./routes/index");
let usersRouter = require("./routes/users");
let formRouter = require("./routes/forms");
let deviceRouter = require("./routes/devices");
let questionRouter = require("./routes/questions");
let analyticsRouter = require("./routes/analytics");

let app = express();
let storeOptions = {
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || "3306",
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};
let sess = {
  store: new mysqlSessionStore(storeOptions),
  secret: "234jfs",
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 3.154e8
  }
};

// let corsOptions = {
//   origin: "http://localhost:8080",
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//   allowedHeaders: ["Content-Type", "Authorization"],
//   preflightContinue: true
// };

if (app.get("env") === "production") {
  app.set("trust proxy", 1);
  sess.cookie.secure = true;
}

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

//Setting up middlewares
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(session(sess));
app.use(express.static(path.join(__dirname, "public")));

// Routes handlers
app.use("/*", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:8080"); // restrict it to the required domain
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  // Set custom headers for CORS
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-type,Accept,X-Access-Token,X-Key"
  );
  res.header("Access-Control-Allow-Credentials", true);
  if (req.method == "OPTIONS") {
    res.status(200).end();
  } else {
    next();
  }
});
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/forms", formRouter);
app.use("/devices", deviceRouter);
app.use("/questions", questionRouter);
app.use("/analytics", analyticsRouter);

//Test routes
app.post("/test-json", (req, res, next) => {
  let json_body = req.body.test_json;
  res.status(200).json(json_body);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
