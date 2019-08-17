import { verifyKey } from "../helpers/jwt";

// Middleware to check the request token, will add the
//users id and name to be used if a valid token and session
export const auth = async (req, res, next) => {
  // Confirms the 'auth' cookie is present and not null
  if (!req.cookies.auth) {
    res.status(401).end();
    return;
  }

  // Verifies the token and returns username and user's id
  const validSession = await verifyKey(req.cookies.auth);

  if (validSession) {
    // Adds username and userid to request
    req.username = validSession.username;
    req.userid = validSession.userid;
    // Calls next to continue cycle
    next();
  } else {
    // Returns a 401 if user token is invalid or the session
    // is not found
    res.status(401).end();
  }
};
