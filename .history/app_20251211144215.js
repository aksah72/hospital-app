require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Session
app.use(session({
    secret: "hospitalappsecret",
    resave: false,
    saveUninitialized: true
}));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.error("MongoDB connection error:", err));


// ------------------ ROUTES ------------------

// Home Page
app.get("/", (req, res) => {
    res.render("index");
});

// Login Page
app.get("/login", (req, res) => {
    res.render("login");
});
const User = require("./models/User");
const bcrypt = require("bcryptjs");

// LOGIN POST
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.render("login", { error: "User not found" });
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.render("login", { error: "Incorrect password" });
        }

        req.session.userId = user._id;
        res.redirect("/appointments");

    } catch (err) {
        console.log(err);
        res.render("login", { error: "Login failed" });
    }
});


// Register Page
app.get("/register", (req, res) => {
    res.render("register");
});

// Appointments Page
app.get("/appointments", (req, res) => {
    res.render("appointments");
});


// ------------------ START SERVER ------------------
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
