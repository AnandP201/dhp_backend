const express = require("express");
const router = express.Router();
const userController = require("../controllers/user_controller");
const auth = require("../middleware/auth");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");

/* GET users listing. */
router.get("/", auth, async (req, res, next) => {
  // console.log("Inside the users route");
  const myRes = req.query.iamId
    ? await userController.findByIamId(req.query.iamId)
    : await userController.findAll(req);
  if (myRes) {
    res.json(myRes);
  } else {
    return res.status(200).send("");
  }
});

//User local login route
router.post("/login", userController.localLogin);

const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// User registration route
router.post(
  "",
  [
    body("firstName", "ERR_FIRST_NAME_EMPTY").exists({
      checkNull: true,
      checkFalsy: true,
    }),
    body("email", "ERR_EMAIL_INVALID_OR_EMPTY").exists().isEmail(),
    body("middleName").optional(),
    body("lastName", "ERR_LAST_NAME_EMPTY").exists({
      checkNull: true,
      checkFalsy: true,
    }),
    body("iamId", "ERR_MISSING_IAM_ID").exists({
      checkNull: true,
      checkFalsy: true,
    }),
    body("password", "ERR_MISSING_PASSWORD").optional(),
    body("iamType", "ERR_MISSING_IAMTYPE").exists({
      checkNull: true,
      checkFalsy: true,
    }),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const myRes = await userController.create(req);
    if (myRes.success) {
      res.status(201).location(`/users/${myRes.user.id}`).end();
    } else {
      res.status(500).json({ errors: [myRes.error] });
    }
  }
);

module.exports = router;
