const functions = require("firebase-functions");

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const app = express();
const port = process.env.PORT || 8080;
const serviceAccount = require("./../config/serviceAccountKey.json");
const authMiddleware = require("./app/auth-middleware");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const userFeed = require("./app/pet-sit-firestore");

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
  const bookings = userFeed.getUserBookings(req.user.email);
  const users = await userFeed.getUsers();
  let curUser = {
    name: "John Smith",
    phone: "123-456-7890",
    addres: "123 Main St."
  };
  users.forEach((u) => {
    if (u.email === req.user.email) curUser = u;
  });
  console.log(users);
  res.render("pages/dashboard", { 
    user: req.user, 
    feed: feed, 
    bookings: bookings,
    curUser: curUser
  });
});

app.post("/sessionLogin", async (req, res) => {
  const idToken = req.body.idToken
  const expiresIn = 60 * 60 * 24 * 5 * 1000
  
  admin.auth().createSessionCookie(idToken, { expiresIn })
    .then(
      sessionCookie => {
        const options = { maxAge: expiresIn, httpOnly: true };
        res.setHeader('Cache-Control', 'private');
        res.cookie("__session", sessionCookie, options);
        res.status(200).send(JSON.stringify({ status: "success" }));
      },
      error => {
        console.log("error for token: " + idToken);
        console.log(error);
        res.status(401).send("UNAUTHORIZED REQUEST!");
      }
    );
});

app.get("/sessionLogout", (req, res) => {
  res.clearCookie("__session");
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

exports.helloWorld = functions.https.onRequest(app);

// app.listen(port);
console.log("Server started at http://localhost:" + port);
