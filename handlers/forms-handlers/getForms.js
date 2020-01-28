const models = require("../../models");

module.exports = async (req, res, next) => {
  try {
    let forms = await models.Form.findAll({
      attributes: ["id", "title", "description"]
    });
    res.status(200).json(forms);
  } catch (e) {
    console.error(e);
    next(e);
  }
};
