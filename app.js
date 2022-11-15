"use strict";
const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("./utils/pass");

const app = express();
const port = 3000;

const loggedIn = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect("/form");
  }
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const username = "foo";
const password = "bar";

app.use(cookieParser());
app.use(session({ secret: "cmnva.krugh", cookie: { maxAge: 60000 } }));

app.use(passport.initialize());
app.use(passport.session());

app.set("views", "./views");
app.set("view engine", "pug");

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/form", (req, res) => {
  res.render("form");
});

// app.get("/secret", (req, res) => {
//   if (req.session.logged) {
//     res.render("secret");
//   } else {
//     res.redirect("/form");
//   }
// });
app.get("/secret", loggedIn, (req, res) => {
  res.render("secret");
});

// app.post("/login", (req, res) => {
//   console.log(req.body);
//   if (req.body.password === password && req.body.username === username) {
//     req.session.logged = true;
//     res.redirect("/secret");
//   } else {
//     req.session.logged = false;
//     res.redirect("/form");
//   }
// });

app.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/form" }),
  (req, res) => {
    console.log("success");
    res.redirect("/secret");
  }
);

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

app.get("/setCookie/:clr", (req, res) => {
  res.cookie("color", req.params.clr).send("eväste asetettu");
});

app.get("/getCookie", (req, res) => {
  console.log(req.cookies);
  res.send("color evästeessä lukee " + req.cookies.color);
});

app.get("/deleteCookie", (req, res) => {
  res.clearCookie("color");
  res.send("eväste poistettu");
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
