//i get an user and a data base and the return should be all the urls that user create
const urlsForUser = function(id, urlDatabase) {
  let urlsFromUser = {};
  for (let url in urlDatabase) {
    if (urlDatabase[url].userID === id) {
      urlsFromUser[url] = {longURL:urlDatabase[url].longURL, userID: id};
    }
  }
  return urlsFromUser;
};

// loop until the length of strings i want for the random usigin the characters like a dictionary
const generateRandomString = function()  {
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; //this is the "dictionary, if you want any string else, just add it"
  let charactersLength = characters.length;
  for (let i = 0; i < 6; i ++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const getUserByEmail = function(userMail, users) {
  for (let user in users) {
    if (users[user].email === userMail) {
      return users[user];
    }
  }
  return false;
};

module.exports = {getUserByEmail, generateRandomString, urlsForUser};