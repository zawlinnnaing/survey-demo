const jwt = require("jsonwebtoken");
const models = require("../../models");

module.exports = async (req, res, next) => {
  try {
    if (!req.header("Authorization")) throw new Error("No auth header");
    let token = req.header("Authorization").replace("Bearer ", "");
    const data = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await models.Admin.findOne({
      where: {
        id: data.id,
        accessToken: token
      }
    });
    if (!admin) {
      throw new Error("Invalid Entity");
    }
    req.admin = admin;
    req.token = token;
    next();
  } catch (error) {
    console.error(error);
    if (error.name == "TokenExpiredError") {
      return res.status(401).json({
        message: "Token expired"
      });
    } else {
      return res.status(401).json(error);
    }
  }
};
