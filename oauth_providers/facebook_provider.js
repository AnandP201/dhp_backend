const facebookProvider = {};
const axios = require("axios");
const FACEBOOK_APP_ID_TEST = process.env.FACEBOOK_APP_ID_TEST;
const FACEBOOK_APP_SECRET_TEST = process.env.FACEBOOK_APP_SECRET_TEST;
const FACEBOOK_AUTH_URL = process.env.FACEBOOK_AUTH_URL;
const FACEBOOK_AUTH_TOKEN_URL = process.env.FACEBOOK_AUTH_TOKEN_URL;
const FACEBOOK_AUTH_USER_URL = process.env.FACEBOOK_AUTH_USER_URL;
const SERVER_URL = process.env.SERVER_URL;

facebookProvider.getAuthUrl = (source) => {
  return `${FACEBOOK_AUTH_URL}?client_id=${FACEBOOK_APP_ID_TEST}&redirect_uri=${SERVER_URL}/oauth/redirect/facebook?source=${source}&scope=email,public_profile&response_type=code`;
};

const getAccessToken = async (code, source) => {
  const { data } = await axios({
    method: "GET",
    url: `${FACEBOOK_AUTH_TOKEN_URL}?client_id=${FACEBOOK_APP_ID_TEST}&client_secret=${FACEBOOK_APP_SECRET_TEST}&code=${code}&redirect_uri=${SERVER_URL}/oauth/redirect/facebook?source=${source}`,
    headers: {
      Accept: "application/json",
    },
  });

  return data.access_token;
};

facebookProvider.getUserData = async (code, source) => {
  const access_token = await getAccessToken(code, source);

  let { data: user_data } = await axios({
    method: "GET",
    url: `${FACEBOOK_AUTH_USER_URL}?access_token=${access_token}&fields=id,name,email&format=json`,
    headers: {
      Accept: "application/json",
    },
  });

  return user_data;
};

module.exports = facebookProvider;
