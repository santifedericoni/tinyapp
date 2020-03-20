const express = require("express");
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const app = express();
const PORT = 8080;
const {getUserByEmail, generateRandomString, urlsForUser} = require('./helpers.js');

let isLogin = false;

const urlDatabase = {
  "b2xVn2": {longURL:"http://www.lighthouselabs.ca", userID: "aJ48lW"},
  "9sm5xK": {longURL:"http://www.google.com", userID: "aR2faH"}
};

const users = {
  "aJ48lW": {
    id: "aJ48lW",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "aR2faH": {
    id: "aR2faH",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};
app.use(cookieSession({
  name: 'session',
  keys: ['Oe7xdNTr8ZxUY2Oiw3hTCxWebQc='],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/", (req, res) => {
  res.redirect("/urls");
});

app.get("/urls/new", (req, res) => {
  if (isLogin) {
    let templateVars = {
      user: users[req.session.userID],
    };
    res.render("urls_new", templateVars);
  } else {
    let templateVars = {
      user: users[req.session.userID],
    };
    res.render("login", templateVars);
  }
});

app.get("/urls", (req, res) => {
  let templateVars = {
    urls: urlsForUser(req.session.userID, urlDatabase),
    user: users[req.session.userID],
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  if (!isLogin) {
    res.status(403).send('Need to be logged');
  } else if (urlDatabase[req.params.shortURL].userID === users[req.session.userID].id) {
    let templateVars = {
      shortURL: req.params.shortURL,
      longURL: urlDatabase[req.params.shortURL].longURL,
      user: users[req.session.userID],
    };
    res.render("urls_show", templateVars);
  } else {
    let templateVars = {
      urls: urlsForUser((users[req.session.userID].id), urlDatabase),
      user: users[req.session.userID].id,
    };
    res.status(403).send('That is not your URL');
    res.render("urls_index",templateVars);
  }
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.get("/register", (req, res) => {
  let templateVars = {
    user: users[req.session.userID],
  };
  res.render("user_registration",templateVars);
});

app.get("/login", (req, res) => {
  let templateVars = {
    user: users[req.session.userID],
  };
  isLogin = true;
  res.render("login",templateVars);
});

app.post("/urls", (req, res) => {
  let shortUrl = generateRandomString();
  urlDatabase[shortUrl] = {
    longURL : req.body.longURL,
    userID : req.session.userID
  };
  res.redirect(`/urls`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  if (urlDatabase[req.params.shortURL].userID === users[req.session.userID].id) {
    const url = req.params.shortURL;
    delete urlDatabase[url];
    res.redirect("/urls");
  } else {
    res.redirect("/urls");
    res.status(403).send('This is not your URL');
  }
});

app.post("/urls/:shortURL/", (req, res) => {
  const url = req.params.shortURL;
  urlDatabase[url] = {
    longURL : req.body.longURL,
    userID : req.session.userID,
  };
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  req.session = null,
  res.redirect("/urls");
});

app.post("/register", (req, res) => {
  let userID = generateRandomString();
  if (req.body.password && !getUserByEmail(req.body.mail, users) && req.body.mail) {
    users[userID] = {
      id: userID,
      email: req.body.mail,
      password: bcrypt.hashSync(req.body.password, 10) };
    res.redirect("/urls");
  } else {
    res.status(400).send("User already exist");
    res.redirect('register');
  }
});

app.post("/login", (req, res) => {
  const user = getUserByEmail(req.body.mail, users);
  if (!user) {
    res.status(400).send("User don't exist");
    res.redirect('login');
  }
  if (req.body.password &&  bcrypt.compareSync(req.body.password, user.password)) {
    req.session.userID = user.id;
    res.redirect("/urls");
    return;
  } else {
    res.status(403).send('Wrong Password');
    res.redirect('login');
  }
});


