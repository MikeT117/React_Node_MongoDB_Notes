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
import path from "path";
const avatarUpload = multer({ dest: "./uploads/avatar/" });

const app = express();
app.use(helmet());
app.disable("x-powered-by");
app.use(cookieParser());
app.use(express.json());

app.post("/logout", auth, (req, res) => {
  Session.findOneAndDelete({ sessionId: req.cookies.auth }, (err, doc) => {
    if (err) return;
    if (doc) {
      res.clearCookie("auth", {
        domain: "localhost",
        httpOnly: true
      });
      res.statusMessage = "LOGOUT_SUCCESSFUL";
      res.sendStatus(204).end();
    }
  });
});

app.post("/register", async (req, res) => {
  try {
    const hashPw = await bcrypt.hash(req.body.password, 10);
    let user = new User({ ...req.body, password: hashPw });
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
    res.json(err);
  }
});

app.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username }).lean({
      virtuals: true
    });

    const hashCmp = await bcrypt.compare(
      req.body.password,
      await user.password
    );
    if (hashCmp) {
      const token = jwt.sign(
        { username: req.body.username, userid: user._id },
        signingKey,
        { expiresIn: 604800 }
      );
      let session = new Session({
        sessionId: token,
        sessionuser: req.body.username,
        sessionuserid: user._id
      });

      Session.create(session).then(() => {
        res.cookie("auth", token, {
          domain: "localhost",
          expires: req.body.remember ? new Date(Date.now() + 604800 * 1000) : 0,
          httpOnly: true
        });
        res.statusMessage = "LOGIN_SUCCESSFUL";
        res
          .status(200)
          .json({ username: user.username, avatar: user.avatarImg })
          .end();
      });
    } else {
      res.statusMessage = "USERNAME/PASSWORD_INCORRECT";
      res.sendStatus(401).end();
    }
  } catch (err) {
    res.json(err);
  }
});

app.get("/account", auth, (req, res) => {
  // Get user from session
  User.findOne({ _id: req.userid }, "-_id -password", (err, data) => {
    if (err) {
      res.statusMessage = "ERROR_RETRIEVING ACCOUNT";
      res.sendStatus(500).end();
    }
    res
      .status(200)
      .json(data)
      .end();
  }).lean({ virtuals: true });
});

app.get("/notes", auth, (req, res) => {
  Note.where({ user: req.userid })
    .find((err, notes) => {
      if (err) {
        res.statusMessage = "ERROR_RETRIEVING_NOTES";
        res.sendStatus(500).end();
      }
      if (notes) {
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
  let note = new Note({ ...req.body, user: req.userid });
  Note.create(note, (err, data) => {
    if (err) {
      res.statusMessage = "ERROR_SAVING_NOTE";
      res.sendStatus(500).end();
    }
    if (data) {
      res.statusMessage = "NOTE_SAVED";
      res
        .status(200)
        .json(data)
        .end();
    }
  });
});

app.put("/update_note", auth, (req, res) => {
  const { _id, ...data } = req.body;
  Note.updateOne({ _id: _id }, { $set: data }, (err, data) => {
    if (err) {
      res.statusMessage = "ERROR_UPDATING_NOTE";
      res.sendStatus(500).end();
    }
    if (data) {
      res.statusMessage = "NOTE_UPDATED";
      res.sendStatus(200).end();
    }
  });
});

app.delete("/delete_note", auth, (req, res) => {
  Note.findByIdAndDelete(req.body._id, (error, data) => {
    if (error) {
      res.statusMessage = "ERROR_DELETING_NOTE";
      res.sendStatus(500).end();
    }
    if (data) {
      res.statusMessage = "NOTE_DELETED";
      res.sendStatus(200).end();
    }
  });
});

app.post("/update_account", auth, (req, res) => {
  // Removes all values that are empty strings aswell as the _id,
  // This removes the need to manipulate the bvody when sending and
  // also removes empty strings
  const data = Object.assign(
    ...Object.keys(req.body)
      .filter(key => req.body[key] !== "" && key !== "_id")
      .map(key => ({ [key]: req.body[key] }))
  );
  User.updateOne({ _id: req.userid }, { $set: data }, (err, doc) => {
    if (err) {
      res.statusMessage = "FAILURE_DURING_ACCOUNT_UPDATE";
      res
        .status(500)
        .json(err)
        .end();
    }
    if (doc) {
      res.clearCookie("auth", {
        domain: "localhost",
        httpOnly: true
      });
      res.statusMessage = "ACCOUNT_UPDATE_SUCCESSFUL";
      res.sendStatus(200).end();
    }
  });
});

app.post("/update_password", auth, async (req, res) => {
  try {
    const user = await User.where({ _id: req.userid })
      .findOne()
      .lean();

    const hashCmp = await bcrypt.compare(
      req.body.currentpassword,
      await user.password
    );

    if (hashCmp) {
      const hashPw = await bcrypt.hash(req.body.password, 10);
      User.updateOne(
        { _id: req.userid },
        { $set: { password: hashPw } },
        (err, doc) => {
          if (doc) {
            res.statusMessage = "PASSWORD_UPDATE_SUCCESSFUL";
            res.sendStatus(200).end();
          }
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
    res.statusMessage = "PASSWORD_UPDATE_FAILURE";
    res.sendStatus(500).end();
  }
});

app.post("/update_avatar", auth, avatarUpload.single("avatar"), (req, res) => {
  if (req.file) {
    const file =
      "F:/Projects/Projects/mern/backend/uploads/avatar/" + req.file.filename;
    User.updateOne(
      { _id: req.userid },
      { $set: { avatar: req.file.filename } },
      (err, doc) => {
        if (err) {
          try {
            fs.unlink(file);
          } catch (err) {
            console.log("FILE_NOT_DELETED: ", file);
            res.statusMessage = "FAILURE";
            res.sendStatus(500).end();
          }
        }
        if (doc) {
          res.statusMessage = "AVATAR_UPDATED";
          res.status(200).json({avatar: "http://localhost://uploads/avatar/" + req.file.filename + ".jpg"}).end();
        }
      }
    );
  } else {
    res.statusMessage = "IMAGE_NOT_FOUND";
    res.sendStatus(400).end();
  }
});
app.listen(3001, () => console.log(`Listening on port 3001`));
