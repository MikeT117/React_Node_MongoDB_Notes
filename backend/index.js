import express from "express";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";
import helmet from "helmet";
import User from "./models/User";
import Note from "./models/Note.js";
import Session from "./models/Session.js";
import { auth } from "./middleware";
import { generateKey } from "./helpers/jwt";

express.static(`http://localhost:3001/public/images/profile_images`);
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
      res.send(204).end();
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
        res.status(500).end();
      }
      if (newUser) {
        res.statusMessage = "REGISTRATION_SUCCESSFUL";
        res.status(200).end();
      }
    });
  } catch (err) {
    res.json(err);
  }
});

app.post("/login", async (req, res) => {
  try {
    const user = await User.where({ username: req.body.username })
      .findOne()
      .lean();

    const hashCmp = await bcrypt.compare(
      req.body.password,
      await user.password
    );

    if (hashCmp) {
      const token = generateKey({
        username: req.body.username,
        userid: user._id
      });
      let session = new Session({
        sessionId: token,
        sessionuser: req.body.username
      });

      Session.create(session).then(() => {
        res.cookie("auth", token, {
          domain: "localhost",
          expires: new Date(Date.now() + 900000),
          httpOnly: true
        });
        res.statusMessage = "LOGIN_SUCCESSFUL";
        res.json({ username: user.username, avatar: user.avatar });
        res.status(200).end();
      });
    } else {
      res.statusMessage = "USERNAME/PASSWORD_INCORRECT";
      res.status(401).end();
    }
  } catch (err) {
    res.json(err);
  }
});

app.get("/account", auth, (req, res) => {
  // Get user from session
  User.where({ username: req.username })
    .findOne((err, data) => {
      if (err) {
        res.statusMessage = "ERROR_RETRIEVING ACCOUNT";
        res.status(500).end();
      }
      if (data) res.json(data);
    })
    .lean();
});

app.get("/notes", auth, (req, res) => {
  Note.where({ user: req.username })
    .find((err, notes) => {
      if (err) {
        res.statusMessage = "ERROR_RETRIEVING_NOTES";
        res.status(500).end();
      }
      if (notes) {
        res.send(notes);
      }
    })
    .lean();
});

app.put("/add_note", auth, (req, res) => {
  let note = new Note({ ...req.body, user: req.username });
  Note.create(note).then((err, data) => {
    if (err) {
      res.statusMessage = "ERROR_SAVING_NOTE";
      res.status(500).end();
    }
    if (data) {
      res.statusMessage = "NOTE_SAVED";
      res.status(200).end();
    }
  });
});

app.put("/update_note", auth, (req, res) => {
  const { _id, ...data } = req.body;
  Note.updateOne({ _id: req.body._id }, { $set: data }).then((err, data) => {
    if (err) {
      res.statusMessage = "ERROR_UPDATING_NOTE";
      res.status(500).end();
    }
    if (data) {
      res.statusMessage = "NOTE_UPDATED";
      res.status(200).end();
    }
  });
});

app.delete("/delete_note", auth, (req, res) => {
  Note.findByIdAndDelete(req.body._id, (error, data) => {
    if (error) {
      res.statusMessage = "ERROR_DELETING_NOTE";
      res.status(500).end();
    }
    if (data) {
      res.statusMessage = "NOTE_DELETED";
      res.status(200).end();
    }
  });
});

app.post("/update_account", auth, (req, res) => {
  const { _id, ...data } = req.body;
  User.updateOne({ _id: req.body.id }, { $set: data })
    .then(d => res.json(d))
    .catch(err => res.json(err));
});

app.post("update_password", auth, async (req, res) => {
  const user = await User.where({ username: req.body.username }).findOne();
  const hashCmp = await bcrypt.compare(req.body.password, await user.password);
  if (hashCmp) {
    const { password, ...rest } = req.body;
    User.updateOne({ _id: req.body._id }, { $set: { password: password } })
      .then(d => res.status(200).send("Password updated!"))
      .catch(err => res.json(err));
  }
});

/* TO BE IMPLEMENTED
app.post("/update_avatar", (req, res) => {
})
*/
app.listen(3001, () => console.log(`Listening on port 3001`));
