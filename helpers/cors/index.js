module.exports = (req, res, next) => {
  res.header("Access-Control-Allow-Origin", process.env.CORS_SOURCE); // restrict it to the required domain
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  // Set custom headers for CORS
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-type,Accept,X-Access-Token,X-Key,Authorization"
  );
  res.header("Access-Control-Allow-Credentials", true);
  if (req.method == "OPTIONS") {
    res.status(200).end();
  } else {
    next();
  }
};
