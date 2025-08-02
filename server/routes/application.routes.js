// application.routes.js
const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/application.controller");
const auth = require("../middleware/auth.middleware");

router.post("/", auth, ctrl.applyToJob);
router.get("/mine", auth, ctrl.getMyApplications);

module.exports = router;
