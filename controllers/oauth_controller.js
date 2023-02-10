const axios = require("axios");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const {
  getRedirectUrl,
  getProvider,
} = require("../oauth_providers/oauth_utils");
const userController = require("./user_controller");
const SERVER_URL = process.env.SERVER_URL;
const TOKEN_KEY = process.env.TOKEN_KEY;

const oauth_authorize = asyncHandler((req, res) => {
  let provider = getProvider(req.query.provider);

  console.log(provider.getAuthUrl(req.query.source));

  res.redirect(provider.getAuthUrl(req.query.source));
});

const oauth_redirect = asyncHandler(async (req, res) => {
  const { code, source } = req.query;
  const redirectUrl = getRedirectUrl(source);
  let provider = getProvider(req.params.provider);
  try {
    //Fetch the details of the authenticated user
    const provider_user_data = await provider.getUserData(code, source);

    // console.log(provider_user_data);

    //Generate JWT token
    const token = jwt.sign(
      {
        iamId: provider_user_data.id,
        email: provider_user_data.email,
      },
      TOKEN_KEY,
      {
        expiresIn: "1h",
      }
    );

    // console.log("Token generated : ", token);

    //Check if user already has an account, and get their ID
    try {
      const res = await axios.get(
        `${SERVER_URL}/users?iamId=${provider_user_data.id}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("back to controller", res);

      const str = res["name"].split(" ");
      let firstName = "",
        middleName = "",
        lastName = "";

      firstName = str[0] ? str[0] : "";
      middleName = str[1] ? str[1] : "";
      lastName = str[2] ? str[2] : "";

      const obj = {
        orgId: null,
        firstName: firstName,
        middleName: middleName,
        lastName: lastName,
        email: res.email,
        iamId: res.id,
      };

      const req = { body: obj };

      console.log(req);

      const response = await userController.create(req);
      console.log(response);

      // res.redirect(
      //   `${redirectUrl}?access_token=${token}&email=${provider_user_data.email}&name=${provider_user_data.name}&id=${provider_user_data.id}&user_profile_exists=true`
      // );
    } catch ({ response }) {
      //If user does not exists
      // if (response.status === 404)
      //   res.redirect(
      //     `${redirectUrl}?access_token=${token}&email=${
      //       provider_user_data.email
      //     }&name=${provider_user_data.name ? provider_user_data.name : ""}&id=${
      //       provider_user_data.id
      //     }&user_profile_exists=false`
      //   );
    }
  } catch (error) {
    // res.redirect(`${redirectUrl}?error=OAUTH_AUTHENTICATION_FAILED`);
  }
});

module.exports = { oauth_redirect, oauth_authorize };
