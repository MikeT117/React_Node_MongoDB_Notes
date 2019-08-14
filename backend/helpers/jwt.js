import jwt from "jsonwebtoken";
import signingKey from "../keys";
import Sessions from "../models/Session";

// Generates a JWT and returns
export const generateKey = (data, exp = "1h") => {
  return jwt.sign(data, signingKey, { expiresIn: exp });
};

// Verifies the requetors key returns the decoded key along with the key itself.
export const verifyKey = async key => {
  // Returns false if the key is null
  if (!key) return false;

  // Decodes the key using the "secret", will return false if invalid
  const decodedKey = jwt.verify(key, signingKey);

  // Checks the return value of the above function
  if (!decodedKey) return false;

  // Gets the users session from the persitent storage(MongoDB),
  // using lean as no modifications will be made
  const session = await Sessions.where({
    sessionId: key,
    sessionuser: decodedKey.username
  })
    .findOne()
    .lean();
  // Checks the return value of the above thereby confirming if the user has an active session
  if (session) {
    // Returns the decoded key along with the key itself
    return { ...decodedKey, key: key };
  }
  // Returns false if session is not found.
  return false;
};
