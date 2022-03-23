const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const app = express();
const port = process.env.PORT || 8080;
const serviceAccount = require("./../config/serviceAccountKey.json");
const userFeed = require("./app/user-feed");
const authMiddleware = require("./app/auth-middleware");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// use cookies
app.use(cookieParser());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
// set the view engine to ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/static", express.static("static/"));

// use res.render to load up an ejs view file
// index page
app.get("/", function (req, res) {
  res.render("pages/index");
});

app.get("/sign-in", function (req, res) {
  res.render("pages/sign-in");
});

app.get("/sign-up", function (req, res) {
  res.render("pages/sign-up");
});

app.get("/dashboard", authMiddleware, async function (req, res) {
  const feed = await userFeed.get();
  res.render("pages/dashboard", { user: req.user, feed });
});

app.post("/sessionLogin", async (req, res) => {
  const idToken = req.body.idToken
  const expiresIn = 60 * 60 * 24 * 5 * 1000
  
  admin.auth().createSessionCookie(idToken, { expiresIn })
    .then(
      sessionCookie => {
        const options = { maxAge: expiresIn, httpOnly: true };
        res.cookie("session", sessionCookie, options);
        res.status(200).send(JSON.stringify({ status: "success" }));
      },
      error => {
        res.status(401).send("UNAUTHORIZED REQUEST!");
      }
    );
});

app.get("/sessionLogout", (req, res) => {
  res.clearCookie("session");
  res.redirect("/sign-in");
});

app.post("/dog-messages", authMiddleware, async (req, res) => {
  const user_email = req.user.email;
  const user_name = user_email.split('@')[0];
  const user = {
    name: user_name,
    email: user_email,
  }
  const msg = req.body.message;

  userFeed.add(user, msg)
    .then(
      () => {
        res.redirect('/dashboard')
      }
    )
});

app.listen(port);
console.log("Server started at http://localhost:" + port);
