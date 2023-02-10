const githubProvider = {};
const axios = require("axios");
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const GITHUB_AUTH_URL = process.env.GITHUB_AUTH_URL;
const GITHUB_AUTH_TOKEN_URL = process.env.GITHUB_AUTH_TOKEN_URL;
const GITHUB_AUTH_USER_URL = process.env.GITHUB_AUTH_USER_URL;
const SERVER_URL = process.env.SERVER_URL;

githubProvider.getAuthUrl = (source) => {
  return `${GITHUB_AUTH_URL}?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${SERVER_URL}/oauth/redirect/github?source=${source}&scope=user`;
};

const getAccessToken = async (code) => {
  const { data } = await axios({
    method: "POST",
    url: `${GITHUB_AUTH_TOKEN_URL}?client_id=${GITHUB_CLIENT_ID}&client_secret=${GITHUB_CLIENT_SECRET}&code=${code}`,
    headers: {
      Accept: "application/json",
    },
  });

  return data.access_token;
};

githubProvider.getUserData = async (code) => {
  const access_token = await getAccessToken(code);

  const { data: user_data } = await axios({
    method: "GET",
    url: `${GITHUB_AUTH_USER_URL}`,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${access_token}`,
    },
  });

  //Check if user has public email, if not then fetch email from GitHub API
  if (!user_data.email) {
    const { data: user_emails } = await axios({
      method: "GET",
      url: `${GITHUB_AUTH_USER_URL}/emails`,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    });

    //Find the user's primary email
    if (user_emails.length !== 1) {
      user_data.email = user_emails.find((data) => data.primary === true).email;
    } else {
      user_data.email = data[0].email;
    }
  }

  return user_data;
};

module.exports = githubProvider;
