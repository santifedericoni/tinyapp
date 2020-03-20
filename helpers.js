const urlsForUser = function(id, urlDatabase) {
  let urlsFromUser = {};

  for (let url in urlDatabase) {
    if (urlDatabase[url].userID === id) {
      urlsFromUser[url] = {longURL:urlDatabase[url].longURL, userID: id};
    }
  }
  return urlsFromUser;
};


const generateRandomString = function()  {
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
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