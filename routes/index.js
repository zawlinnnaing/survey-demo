let express = require("express");
let router = express.Router();
const models = require("../models");

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "Express", secondTitle: "Testing title" });
});

router.post("/login", async (req, res, next) => {
  let { data } = req.body;
  try {
    let admin = await models.Admin.findByCredentials(data.email, data.password);
    if (!admin) throw new Error("Entity not found.");
    await models.Admin.generateAccessToken(admin);
    admin = await admin.reload();
    console.log("reloaded token ", admin.accessToken.length);
    res.status(200).json(admin.publicInstance);
  } catch (e) {
    console.error(e);
    res.status(401).json(e);
  }
});

router.post("/register", async (req, res, next) => {
  const t = await models.sequelize.transaction();
  try {
    let data = req.body;
    console.log(req.body);
    let admin = await models.Admin.findOne({
      where: {
        email: data.email
      }
    });
    if (admin) {
      res.status(422).json({
        message: "An account is already registered with this email."
      });
    } else {
      admin = await models.Admin.create(
        {
          name: data.name,
          email: data.email,
          password: data.password
        },
        { transaction: t }
      );
      await models.Admin.generateAccessToken(admin, t);
      res.status(200).json(admin.publicInstance);
      await t.commit();
    }
  } catch (error) {
    await t.rollback();
    console.error(error);
    res.status(400).json(error);
  }
});
module.exports = router;
