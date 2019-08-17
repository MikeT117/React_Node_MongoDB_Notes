import express from "express";
import cookieParser from "cookie-parser";
import User from "./models/User";
import Note from "./models/Note.js";
import Session from "./models/Session.js";
import { auth } from "./middleware";
import { generateKey } from "./helpers/jwt";
import bcrypt from "bcrypt";

express.static(`http://localhost:3001/public/images/profile_images`);
const app = express();
app.use(cookieParser());
app.use(express.json());

app.post("/register", async (req, res) => {
  try {
    const hashPw = await bcrypt.hash(req.body.password, 10);
    let user = new User({ ...req.body, password: hashPw });
    User.create(user)
      .then(d => res.json(d))
      .catch(err => res.json(err));
  } catch (err) {
    res.json(err);
  }
});

app.post("/login", async (req, res) => {
  console.log("LOGIN_BEGIN");
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

      Session.create(session)
        .then(d => {
          console.log("BEGIN_RESPONSE");
          res.cookie("auth", token, {
            domain: "localhost",
            expires: new Date(Date.now() + 900000),
            httpOnly: true
          });
          res.statusMessage = "LOGIN_SUCCESSFUL";
          res.json({ username: user.username, avatar: user.avatar });
          res.status(200).end();
        })
        .catch(err => res.json(err));
    }
  } catch (err) {
    res.json(err);
  }
});

app.get("/account", auth, (req, res) => {
  console.log("USERNAME: ", req.username);
  // Get user from session
  User.where({ username: req.username })
    .then(d => res.json(d))
    .catch(err => res.json(err));
});

app.get("/notes", auth, (req, res) => {
  const query = Note.where({ user: req.username });
  query.find((err, notes) => {
    if (err) return handleError(err);
    if (notes) {
      res.send(notes);
    }
  });
});

app.put("/add_note", auth, (req, res) => {
  console.log("REQ_BODY_ADD_NOTE: ", req.body);
  console.log("USERNAME_ADD_NOTE: ", req.username);
  let note = new Note({ ...req.body, user: req.username });
  Note.create(note)
    .then(d => {
      res.statusMessage = "NOTE_SAVED";
      res.status(200).end();
    })
    .catch(err => res.json(err));
});

app.put("/update_note", auth, (req, res) => {
  const { _id, ...data } = req.body;
  Note.updateOne({ _id: req.body._id }, { $set: data })
    .then(d => {
      res.statusMessage = "NOTE_UPDATED";
      res.status(200).end();
    })
    .catch(err => res.json(err));
});

app.delete("/delete_note", auth, (req, res) => {
  Note.findByIdAndDelete(req.body._id, (error, data) => {
    if (error) {
      res.statusMessage = "FAILURE";
      res.status(500).end();
    }
    res.statusMessage = "NOTE_DELETED";
    res.status(200).end();
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
