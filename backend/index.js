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
    const hashPw = bcrypt.hash(req.body.password, 10);
    let user = new User({ ...req.body, password: hashPw });
    User.create(user)
      .then(d => res.json(d))
      .catch(err => res.json(err));
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

      Session.create(session)
        .then(d => {
          res.cookie("auth", token, {
            domain: "localhost",
            expires: new Date(Date.now() + 900000),
            httpOnly: true
          });
          res.json(d);
        })
        .catch(err => res.json(err));
    }
  } catch (err) {
    res.json(err);
  }
});

app.get("/account", (req, res) => {
  // Get user from session
  User.where({ username: "Razor116" })
    .then(d => res.json(d))
    .catch(err => res.json(err));
});

app.get("/getnotes", (req, res) => {
  // Get user from session/Cookie
  const query = Note.where({ user: "Razor116" });
  query.find((err, notes) => {
    if (err) return handleError(err);
    if (notes) {
      res.send(notes);
    }
  });
});

app.post("/add_note", (req, res) => {
  let note = new Note(req.body);
  Note.create(note)
    .then(d => {
      res.status(200).send("Note Saved");
    })
    .catch(err => res.json(err));
});

app.post("/update_note", (req, res) => {
  const { _id, ...data } = req.body;
  Note.updateOne({ _id: req.body._id }, { $set: data })
    .then(d => {
      res.status(200).send("Note Updated!");
    })
    .catch(err => res.json(err));
});

app.post("/delete", (req, res) => {
  Note.deleteOne({ _id: req.body._id }).then(
    d => d.ok === 1 && res.status(200).send("Note Deleted!")
  );
});

app.post("/testingMiddleWare", auth, (req, res) => {
  console.log(
    `BEGIN MIDDLEWARE TEST, UserID: ${req.userid}, USERNAME: ${req.username}`
  );
  res.json({ Hallo: "Some Data" });
});

app.post("/update_account", (req, res) => {
  const { _id, ...data } = req.body;
  User.updateOne({ _id: req.body.id }, { $set: data })
    .then(d => res.json(d))
    .catch(err => res.json(err));
});

app.post("update_password", async (req, res) => {
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
