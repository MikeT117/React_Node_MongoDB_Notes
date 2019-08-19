import signingKey from "../keys";
import jwt from "jsonwebtoken";
import Sessions from "../models/Session";

// Middleware to check the request token, will add the
//users id and name to be used if a valid token and session
const auth = async (req, res, next) => {
  try {
    // Confirms the 'auth' cookie is present and not null
    if (!req.cookies.auth) {
      res.sendStatus(401).end();
      return;
    }

    const decodedKey = jwt.verify(req.cookies.auth, signingKey);

    // Verifies the token and returns username and user's id
    const session = await Sessions.where({
      sessionId: req.cookies.auth,
      sessionuser: decodedKey.username
    })
      .findOne((err, doc) => {
        if (!doc || err) {
          res.clearCookie("auth", {
            domain: "localhost",
            httpOnly: true
          });
          res.sendStatus(401).end();
        }
      })
      .lean();

    if (session) {
      // Adds username and userid to request
      req.username = decodedKey.username;
      req.userid = decodedKey.userid;
      // Calls next to continue cycle
      next();
    } else {
      // Returns a 401 if user token is invalid or the session
      // is not found
      res.sendStatus(401).end();
    }
  } catch (err) {
    Sessions.where({ sessionId: req.cookies.auth }).findOneAndDelete(() => {
      res.status(401).end();
    });
  }
};

export default auth;
