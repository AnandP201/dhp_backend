const googleProvider = {};
const axios = require("axios");

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_AUTH_URL = process.env.GOOGLE_AUTH_URL;
const GOOGLE_AUTH_TOKEN_URL = process.env.GOOGLE_AUTH_TOKEN_URL;
const GOOGLE_AUTH_USER_URL = process.env.GOOGLE_AUTH_USER_URL;
const SERVER_URL = process.env.SERVER_URL;

googleProvider.getAuthUrl = (source) => {
  return `${GOOGLE_AUTH_URL}?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${SERVER_URL}/oauth/redirect/google?source=${source}&scope=https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email&response_type=code`;
};

const getAccessToken = async (code, source) => {
  const { data } = await axios({
    method: "POST",
    url: `${GOOGLE_AUTH_TOKEN_URL}?client_id=${GOOGLE_CLIENT_ID}&client_secret=${GOOGLE_CLIENT_SECRET}&code=${code}&grant_type=authorization_code&redirect_uri=${SERVER_URL}/oauth/redirect/google?source=${source}`,
    headers: {
      Accept: "application/json",
    },
  });

  return data.access_token;
};

googleProvider.getUserData = async (code, source) => {
  const access_token = await getAccessToken(code, source);

  const { data: user_data } = await axios({
    method: "GET",
    url: `${GOOGLE_AUTH_USER_URL}?access_token=${access_token}`,
    headers: {
      Accept: "application/json",
    },
  });

  return user_data;
};

module.exports = googleProvider;
