const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const bodyParser = require("body-parser");
require("dotenv").config();

const User = require("./models/User");
const Appointment = require("./models/appointment");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Middleware to protect pages
const auth = (req, res, next) => {
  if (!req.session.userId) return res.redirect("/login");
  next();
};

// ROUTES
app.get("/", auth, (req, res) => {
  res.render("index", { user: req.session.user });
});

// LOGIN
app.get("/login", (req, res) => res.render("login"));
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || user.password !== password)
    return res.send("Invalid credentials");

  req.session.userId = user._id;
  req.session.user = user;
  res.redirect("/");
});

// REGISTER
app.get("/register", (req, res) => res.render("register"));
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const newUser = new User({ name, email, password });
  await newUser.save();
  res.redirect("/login");
});

// APPOINTMENTS PAGE
app.get("/appointments", auth, async (req, res) => {
  const appointments = await Appointment.find();
  res.render("appointments", { appointments });
});

app.post("/appointments", auth, async (req, res) => {
  const { doctor, date } = req.body;
  await Appointment.create({
    doctor,
    date,
    patient: req.session.user.name,
  });
  res.redirect("/appointments");
});

// LOGOUT
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

// START SERVER
app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
