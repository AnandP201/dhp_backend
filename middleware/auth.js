const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
  // console.log(req.headers);

  const tokenStr = req.headers["authorization"];
  // console.log(tokenStr);
  if (!tokenStr) {
    return res.status(403).send({ error: "ERR_MISSING_TOKEN" });
  }
  const strings = tokenStr.split(" ");
  if (strings.length < 2) {
    return res.status(404).send({ error: "ERR_INVALID_TOKEN" });
  }
  const token = strings[1];
  // console.log("Hash Token : ", token);
  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send({ error: "ERR_MALFORMED_TOKEN" });
  }
  return next();
};

module.exports = verifyToken;
