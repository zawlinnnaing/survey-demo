const express = require("express");
let router = express.Router();
const analyticsHandler = require("../handlers/analytics-handlers/formAnalytics");

router.get("/:formId", analyticsHandler);

module.exports = router;
