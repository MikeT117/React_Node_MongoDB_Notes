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

    // Decodes the key, returning the users id, username and session id
    const decodedKey = jwt.verify(req.cookies.auth, signingKey);

    // Uses the dcoded jey's values to locat the session in the DB
    const session = await Sessions.where({
      sessionId: req.cookies.auth,
      sessionuser: decodedKey.username,
      sessionuserid: decodedKey.sessionuserid
    })
      .findOne((err, doc) => {
        // If the doc is null or there is an error a response will be sent removing the cookie along with a 401
        if (!doc || err) {
          res.clearCookie("auth", {
            domain: "localhost",
            httpOnly: true
          });
          res.sendStatus(401).end();
        }
      })
      .lean();
    // If the session is found the username and userid from the decoded key are added to the request to be used by the next function
    if (session) {
      // Adds username and userid to request
      req.username = decodedKey.username;
      req.userid = decodedKey.userid;
      // Calls next to continue cycle
      next();
    } else {
      // Returns a 401 if user token is invalid or the session is not found
      res.sendStatus(401).end();
    }
  } catch (err) {
    // If an error is encounterd the session si removed if it exists, returning a 401 to the user
    Sessions.where({ sessionId: req.cookies.auth }).findOneAndDelete(() => {
      res.status(401).end();
    });
  }
};

export default auth;
