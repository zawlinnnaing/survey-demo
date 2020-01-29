const express = require("express");
let router = express.Router();
const analyticsHandler = require("../handlers/analytics-handlers/formAnalytics");
const formDataHandler = require("../handlers/analytics-handlers/formData");

router.get("/:formId", analyticsHandler);

router.get("/data/:formId", formDataHandler);

module.exports = router;
