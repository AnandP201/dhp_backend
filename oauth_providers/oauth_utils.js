const googleProvider = require("./google_provider");
const facebookProvider = require("./facebook_provider");
const githubProvider = require("./github_provider");
const oktaProvider = require("./okta_provider");

const getRedirectUrl = (source) => {
  if (source === "nutriplan_app") return process.env.NUTRIPLAN_APP_DEEP_LINK;
  if (source === "pivot_app") return process.env.PIVOT_APP_DEEP_LINK;
  if (source === "pivot_portal") return process.env.PIVOT_PORTAL_URL;
};

const providers = {
  google: googleProvider,
  facebook: facebookProvider,
  github: githubProvider,
  okta: oktaProvider,
};

const getProvider = (name) => {
  return providers[name];
};

module.exports = { getRedirectUrl, getProvider };
