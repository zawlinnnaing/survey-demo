const validateGenerateAnswerTokens = (req, res, next) => {
  console.log("from validator");
  try {
    let regex = new RegExp("/^(d+)$/");
    if (!req.body.count) {
      throw `Request should contain count.`;
    }
    if (!req.body.count instanceof Number && !regex.test(req.body.count)) {
      throw `${req.body.count} is not a number`;
    }
    if (req.body.count <= 0 || req.body.count > 10000) {
      throw `${req.body.count} exceeds specified limit. `;
    }
    next();
  } catch (e) {
    console.error(e);
    res.status(422).json({
      message: e
    });
  }
};

module.exports = { validateGenerateAnswerTokens };
