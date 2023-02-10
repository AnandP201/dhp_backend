const oktaProvider = {};
const axios = require("axios");
const OKTA_CLIENT_ID = process.env.OKTA_CLIENT_ID;
const OKTA_CLIENT_SECRET = process.env.OKTA_CLIENT_SECRET;
const OKTA_AUTH_URL = process.env.OKTA_AUTH_URL;
const OKTA_AUTH_TOKEN_URL = process.env.OKTA_AUTH_TOKEN_URL;
const OKTA_AUTH_USER_URL = process.env.OKTA_AUTH_USER_URL;
const SERVER_URL = process.env.SERVER_URL;

oktaProvider.getAuthUrl = (source) => {
  return `${OKTA_AUTH_URL}?client_id=${OKTA_CLIENT_ID}&state=xyzABC123&response_type=code&scope=openid email profile&redirect_uri=${SERVER_URL}/oauth/redirect/okta?source=${source}`;
};

const getAccessToken = async (code, source) => {
  const { data } = await axios({
    method: "POST",
    url: `${OKTA_AUTH_TOKEN_URL}?client_id=${OKTA_CLIENT_ID}&client_secret=${OKTA_CLIENT_SECRET}&code=${code}&grant_type=authorization_code&redirect_uri=${SERVER_URL}/oauth/redirect/okta?source=${source}`,
    headers: {
      Accept: "application/json",
    },
  });

  return data.access_token;
};

oktaProvider.getUserData = async (code, source) => {
  const access_token = await getAccessToken(code, source);

  const { data: user_data } = await axios({
    method: "GET",
    url: `${OKTA_AUTH_USER_URL}`,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${access_token}`,
    },
  });

  user_data.id = user_data.sub;

  return user_data;
};

module.exports = oktaProvider;
