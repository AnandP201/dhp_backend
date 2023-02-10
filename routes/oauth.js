const {
  oauth_authorize,
  oauth_redirect,
} = require("../controllers/oauth_controller");

const router = require("express").Router();

router.get("/authorize", oauth_authorize);

router.get("/redirect/:provider", oauth_redirect);

module.exports = router;
