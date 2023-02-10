const db = require("../models");
const User = db.User;
const Auth = db.Auth;
const Organization = db.Organization;
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const userController = {};

userController.create = async (req) => {
  const { firstName, middleName, lastName, email, iamId, orgId, iamType, password } = req.body;

  try {
    let organization = null;
    if (!orgId) {
      organization = await Organization.findOne({ where: { name: "Demo" } });
    } else {
      organization = await Organization.findOne({ where: { id: orgId } });
    }

    user = await User.create({
      orgId: organization.id,
      firstName: firstName,
      middleName: middleName,
      lastName: lastName,
      email: email,
      iamId: iamId,
      isActive: true,
    });
    return { success: true, user: user };
  } catch (err) {
    console.log(err);
    return { success: false, error: "ERR_INTERNAL_SERVER" };
  }
};

userController.findAll = async (req) => {
  return await User.findAll();
};

userController.findByIamId = async (iamId) => {
  return await User.findOne({ where: { iamId: iamId } });
};

userController.localLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new Error("Enter all the details");
  }

  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw new Error(`This email is not linked with an account`);
  }

  const hashedPassword = await Auth.findOne({
    where: { userId: user.dataValues.id },
  });

  if (!hashedPassword) {
    throw new Error("You have not created a password!!");
  } else if (
    !(await bcrypt.compare(password, hashedPassword.dataValues.password))
  ) {
    throw new Error(`Incorrect email or password`);
  }

  const payload = {
    id: user.dataValues.id,
    email: user.dataValues.email,
  };

  const token = await jwt.sign(payload, process.env.TOKEN_KEY, {
    expiresIn: 360000000,
  });

  res.status(200).json({
    ...user.dataValues,
    password: undefined,
    token: token,
  });
});
module.exports = userController;
