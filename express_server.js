const express = require("express");
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 8080; // default port 8080

// eslint-disable-next-line no-unused-vars
const generateRandomString = function()  {
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for (let i = 0; i < 6; i ++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
const urlsForUser = function(id) {
  let urlsFromUser = {};

  for (let url in urlDatabase) {
    console.log('id mandado por parametro' ,id);
    console.log('id de la base de datos', urlDatabase[url].userID);
    if (urlDatabase[url].userID === id) {
      urlsFromUser = {
        id : {longURL:urlDatabase[url].longURL, userID: id},
      };
    }
    console.log('funcion', urlsFromUser);
    
  }
  return urlsFromUser;
};

const userExist = function(userMail) {
  for (let user in users) {
    if (users[user].email === userMail) {
      return users[user];
    }
  }
  return false;
};
let isLogin = false;
const urlDatabase = {
  "b2xVn2": {longURL:"http://www.lighthouselabs.ca", userID: "aJ48lW"},
  "9sm5xK": {longURL:"http://www.google.com", userID: "aR2faH"}
};

const users = {
  "aJ48lW": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "aR2faH": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.set("view engine", "ejs");

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls/new", (req, res) => {
  if (isLogin) {
    let templateVars = {
      user: users[req.cookies['user_id']],
    };
    res.render("urls_new", templateVars);
  } else {
    let templateVars = {
      user: users[req.cookies['user_id']],
    };
    res.render("login", templateVars);
  }
});

app.get("/urls", (req, res) => {
  let templateVars = {
    urls: urlsForUser(req.cookies['user_id']),
    user: users[req.cookies['user_id']],
  };
  console.log('hola',templateVars.urls);
  res.render("urls_index", templateVars);
});


app.get("/urls/:shortURL", (req, res) => {
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
    user: users[req.cookies['user_id']],
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.get("/register", (req, res) => {
  let templateVars = {
    user: users[req.cookies['user_id']],
  };
  res.render("user_registration",templateVars);
});

app.get("/login", (req, res) => {
  let templateVars = {
    user: users[req.cookies['user_id']],
  };
  isLogin = true;
  res.render("login",templateVars);
});

app.post("/urls", (req, res) => {
  let shortUrl = generateRandomString();
  urlDatabase[shortUrl] = {
    longURL : req.body.longURL,
    userID : req.cookies['user_id']
  };
  res.redirect(`/urls/${shortUrl}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const url = req.params.shortURL;
  delete urlDatabase[url];
  res.redirect("/urls");
});

app.post("/urls/:shortURL/", (req, res) => {
  const url = req.params.shortURL;
  console.log(req.body);
  urlDatabase[url] = {
    longURL : req.body.longURL,
  };
  res.redirect("/urls");
});


app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.redirect("/urls");
});

app.post("/register", (req, res) => {
  let userID = generateRandomString();
  if (req.body.password && !userExist(req.body.mail) && req.body.mail) {
    users[userID] = {
      id: userID,
      email: req.body.mail,
      password: req.body.password };
    res.redirect("/urls");
  } else {
    res.redirect('register');
  }
});

app.post("/login", (req, res) => {
  const user = userExist(req.body.mail);
  if (!user) {
    //es.status(400).send("omg its broken!");
    res.redirect('login');
  }
  if (req.body.password && req.body.password === user.password) {
    res.cookie('user_id', user.id);
    res.redirect("/urls");
    return;
  } else {
    //res.status(400).send("omg its broken!");
    res.redirect('login');
  }
});


