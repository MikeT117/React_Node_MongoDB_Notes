import express from "express";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";
import helmet from "helmet";
import User from "./models/User";
import Note from "./models/Note.js";
import Session from "./models/Session.js";
import auth from "./middleware/auth";
import jwt from "jsonwebtoken";
import signingKey from "./keys";
import fs from "fs";
import multer from "multer";
const avatarUpload = multer({ dest: "./uploads/avatar/" });

const app = express();
app.use(helmet());
app.disable("x-powered-by");
app.use(cookieParser());
app.use(express.json());

const domain = "localhost";

app.post("/logout", auth, (req, res) => {
  // Finds the users session using the auth cookie
  Session.findOneAndDelete({ sessionId: req.cookies.auth }, (err, doc) => {
    if (err) return;
    if (doc) {
      // Removes tge cookie from the client
      res.clearCookie("auth", {
        domain: domain,
        httpOnly: true
      });
      // Sends a success message for the client to use.
      res.statusMessage = "LOGOUT_SUCCESSFUL";
      res.sendStatus(204).end();
    }
  });
});

app.post("/register", async (req, res) => {
  console.log(req.body.password);
  try {
    // HAshed the users password before saving to DB
    const hashPw = await bcrypt.hash(req.body.password, 10);
    // Creates a new user object spreading the request body and
    // modifying the password with the hashed version
    let user = new User({ ...req.body, password: hashPw });
    // Created the user, Returns success/failure if doc was added successfully to DB.
    User.create(user, (err, newUser) => {
      if (err) {
        res.statusMessage = "ERROR_CREATING_USER";
        res.sendStatus(500).end();
      }
      if (newUser) {
        res.statusMessage = "REGISTRATION_SUCCESSFUL";
        res.sendStatus(200).end();
      }
    });
  } catch (err) {
    // Catches and returns the error to the client,
    // This probably wouldn't be set this way were this a production api.
    res
      .status(500)
      .json(err)
      .end();
  }
});

app.post("/login", async (req, res) => {
  try {
    // Finds the user based on the username provided.
    const user = await User.findOne({ username: req.body.username }).lean({
      virtuals: true
    });

    // Hashes the provided password, compares the hashed pw with the hashed pw in the DB
    const hashCmp = await bcrypt.compare(req.body.password, user.password);

    if (hashCmp) {
      // If the passwords match a token is then generated using the users id and username, setting the expiration to 7 days.
      const token = jwt.sign(
        { username: req.body.username, userid: user._id },
        signingKey,
        { expiresIn: 604800 }
      );

      // Creates a new session object, adding the generated token, username and userid
      let session = new Session({
        sessionId: token,
        sessionuser: req.body.username,
        sessionuserid: user._id
      });

      // Writes the session to the DB
      Session.create(session, (err, doc) => {
        // Returns a 500 status if an error was encountered while writing session to DB
        if (err) {
          res.statusMessage = "LOGIN_FAILURE";
          res.sendStatus(500).end();
        }
        if (doc) {
          console.log("COOKIES");
          // Generates a cookie, depending on the users option to be remembered the
          //cookie will either last 7 days or just he users session (until they close the browser)
          res.cookie("auth", token, {
            domain: "localhost",
            expires: req.body.remember
              ? new Date(Date.now() + 604800 * 1000)
              : 0,
            httpOnly: true
          });
          // Returns a successful message
          res.statusMessage = "LOGIN_SUCCESSFUL";
          // Returns username and avatar to the client
          res
            .status(200)
            .json({ username: user.username, avatar: user.avatarImg })
            .end();
        }
      });
    } else {
      // Retuns a 401 with an error message if the username or password is incorrect
      res.statusMessage = "USERNAME/PASSWORD_INCORRECT";
      res.sendStatus(401).end();
    }
    // Catches any other error and returns a 500 to the client along with the error
  } catch (err) {
    res
      .status(500)
      .json(err)
      .end();
  }
});

app.get("/account", auth, (req, res) => {
  // Get user details excluding the ID and password
  User.findOne({ _id: req.userid }, "-_id -password", (err, data) => {
    if (err) {
      // Returns a 500 along with a message
      res.statusMessage = "ERROR_RETRIEVING ACCOUNT";
      res.sendStatus(500).end();
    }
    res
      // Returns a 200 OK along with the request account data.
      .status(200)
      .json(data)
      .end();
  }).lean({ virtuals: true });
});

app.get("/notes", auth, (req, res) => {
  // Gets all notes for the logged in user
  Note.where({ user: req.userid })
    .find((err, notes) => {
      // If an error is encountered a 500 is sent along with a message
      if (err) {
        res.statusMessage = "ERROR_RETRIEVING_NOTES";
        res.sendStatus(500).end();
      }
      if (notes) {
        // If successful the a 200 OK is sent along with the requested data.
        res.statusMessage = "SUCCESS_RETRIEVING_NOTES";
        res
          .status(200)
          .json(notes)
          .end();
      }
    })
    .lean();
});

app.post("/add_note", auth, (req, res) => {
  // Creates a new note object using the request.body from the client, spreading that and addingt the users ID
  let note = new Note({ ...req.body, user: req.userid });

  // Adds the note object tot he db,
  // Should an error be encountered a 500 will be sent along with a message.
  Note.create(note, (err, data) => {
    if (err) {
      res.statusMessage = "ERROR_SAVING_NOTE";
      res.sendStatus(500).end();
    }
    if (data) {
      // If successful the new note will be returned to the client
      res.statusMessage = "NOTE_SAVED";
      res
        .status(200)
        .json(data)
        .end();
    }
  });
});

app.put("/update_note", auth, (req, res) => {
  // Removes the _id from the request body
  const { _id, ...data } = req.body;

  // Finds the note to be updated using the id from the request,
  // 'sets' all fields using the request body
  Note.updateOne({ _id: _id }, { $set: data }, (err, data) => {
    // Returns a 500 along with a message if an error was thrown when updating the document
    if (err) {
      res.statusMessage = "ERROR_UPDATING_NOTE";
      res.sendStatus(500).end();
    }
    // If successful a 200OK is sent along with a success message
    if (data) {
      res.statusMessage = "NOTE_UPDATED";
      res.sendStatus(200).end();
    }
  });
});

app.delete("/delete_note", auth, (req, res) => {
  // Finds the document to be deleted using the id from the request.
  Note.findByIdAndDelete(req.body._id, (error, data) => {
    if (error) {
      // If an error is encountered a 500 will be sent wlaong with a message.
      res.statusMessage = "ERROR_DELETING_NOTE";
      res.sendStatus(500).end();
    }
    if (data) {
      // Sends a 200 along with a success message if the document is modified successfully
      res.statusMessage = "NOTE_DELETED";
      res.sendStatus(200).end();
    }
  });
});

app.post("/update_account", auth, (req, res) => {
  // Removes all values that are empty strings i.e. the user properties
  // not to be updated aswell as the _id, This removes the need to
  // manipulate the bvody when sending and also removes empty strings
  const data = Object.assign(
    ...Object.keys(req.body)
      .filter(key => req.body[key] !== "" && key !== "_id")
      .map(key => ({ [key]: req.body[key] }))
  );

  // Updates the user document - finding it via the users id, and sets
  // all fields that are not null or empty strings from the request
  User.updateOne({ _id: req.userid }, { $set: data }, (err, doc) => {
    if (err) {
      // If an error is encountered a 500 will be sent along with a message and the error itself
      res.statusMessage = "FAILURE_DURING_ACCOUNT_UPDATE";
      res
        .status(500)
        .json(err)
        .end();
    }
    if (doc) {
      // Deletets the users session from the db, forcing them to be logged out
      Session.findOneAndDelete({ sessionId: req.cookies.auth }, (err, doc) => {
        if (err)
          console.log("ERROR_DELETING_SESSION_FROM_DB", req.cookies.auth);
        if (doc) {
          // Returns a 200 OK success message and a call to remove the created cookie from the client
          res.clearCookie("auth", {
            domain: "localhost",
            httpOnly: true
          });
          res.statusMessage = "ACCOUNT_UPDATE_SUCCESSFUL";
          res.sendStatus(200).end();
        }
      });
    }
  });
});

app.post("/update_password", auth, async (req, res) => {
  try {
    // Finds the user using the userid add by auth
    const user = await User.where({ _id: req.userid })
      .findOne()
      .lean();

    // Compares the provided 'currentpassword' to the currently stored(hashed) password for the user.
    const hashCmp = await bcrypt.compare(
      req.body.currentpassword,
      await user.password
    );
    if (hashCmp) {
      // If the comparision result is true the new password is hashed
      const hashPw = await bcrypt.hash(req.body.password, 10);

      // Updates the user, found via the users id and sets the password to the newly hashed password
      User.updateOne(
        { _id: req.userid },
        { $set: { password: hashPw } },
        (err, doc) => {
          // If the document is successfully update the user will receieve a success message along
          // with a clear cookie command, Their session will also be removed from the DB.
          if (doc) {
            Session.findOneAndDelete(
              { sessionId: req.cookies.auth },
              (err, doc) => {
                if (err)
                  console.log(
                    "ERROR_DELETING_SESSION_FROM_DB",
                    req.cookies.auth
                  );
                if (doc) {
                  res.clearCookie("auth", {
                    domain: "localhost",
                    httpOnly: true
                  });
                  res.statusMessage = "PASSWORD_UPDATE_SUCCESSFUL";
                  res.sendStatus(200).end();
                }
              }
            );
          }
          // If the document cannot be written a 500 will be sent along with a message and the erorr.
          if (err) {
            res.statusMessage = "PASSWORD_UPDATE_FAILURE";
            res
              .status(500)
              .json(err)
              .end();
          }
        }
      );
    }
  } catch (err) {
    // Catches and returns a 500 to the user
    res.statusMessage = "PASSWORD_UPDATE_FAILURE";
    res.sendStatus(500).end();
  }
});

app.post("/update_avatar", auth, avatarUpload.single("avatar"), (req, res) => {
  // Confirms the file exists in the request
  if (req.file) {
    const file =
      "F:/Projects/Projects/mern/backend/uploads/avatar/" + req.file.filename;
    // Updates the users document in the DB witht the new avatar img filename
    User.updateOne(
      { _id: req.userid },
      { $set: { avatar: req.file.filename } },
      (err, doc) => {
        // If an error is encountered the uploaded file will be deleted
        if (err) {
          try {
            fs.unlink(file);
          } catch (err) {
            // If an erorr is encountered during the file deletion a message will
            // be displakyed on the console of this failure along witht he filename./
            console.log("FILE_NOT_DELETED: ", file);
            res.statusMessage = "FAILURE";
            res.sendStatus(500).end();
          }
        }
        if (doc) {
          // If the document is successfuilly written the new file name witll be sent to the user with a 200 and a success message.
          res.statusMessage = "AVATAR_UPDATED";
          res
            .status(200)
            .json({
              avatar:
                "http://localhost://uploads/avatar/" +
                req.file.filename +
                ".jpg"
            })
            .end();
        }
      }
    );
  } else {
    // If req.file doesn't exist the user will recieve a 400 along with a message
    res.statusMessage = "IMAGE_NOT_FOUND";
    res.sendStatus(400).end();
  }
});

// Starts the server on port 3001 and displays a message on the console
app.listen(3001, () => console.log(`Listening on port 3001`));
