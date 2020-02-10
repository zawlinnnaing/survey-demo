const models = require("../../models");
module.exports = async (req, res, next) => {
  let formId = req.params.formId;
  try {
    let form = await models.Form.findByPk(formId, {
      include: [
        {
          model: models.FormAccessToken,
          as: "AccessTokens",
          attributes: ["id", "token", "answered"]
        }
      ],
      attributes: ["id", "title", "description"]
    });
    if (!form) throw `No form found.`;
    res.status(200).json(form);
  } catch (e) {
    console.error(e);
    res.status(400).json({
      message: e
    });
  }
};
