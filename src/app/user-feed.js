const casual = require("casual");
const fetch = require("node-fetch");

const userFeed = [];
const sampleText = [
  "I'm a stay-at-home full-time parent who owns a micro-blogging business. I am also a huge animal lover and own 3 pets" +
  "myself. I pet sit on my spare time.",
  "Hi, hit me up for any casual pet-sitting. Pit bulls not accepted.",
  "I love cats and dogs, please contact me if you need your pet pampered and taken care of for a few days while your are gone!",
  "We are a family who love pets, and we own a penthouse, so you can rest assured that your pet will get plenty of legroom!",
  "Please contact 123-456-7890 for further pet-sitting inquiries. All dog breeds welcome!",
  "Pet hotel, but better.",
  "I have over 1000 5 star reviews, if you need a pet-sitter, look for me!"
]

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

const get = async () => {
  if (userFeed.length === 0) {
    const response = await fetch("https://dog.ceo/api/breeds/image/random/5");
    const body = await response.json();
    let index = 0;
    for (const dogUrl of body.message) {
      userFeed.push({
        name: casual.full_name,
        nameHandle: `${casual.address}`,
        message: `${sampleText[index]}`,
        imageSource: dogUrl,
      });
      index++;
      index %= sampleText.length;
    }
  } else {
    return userFeed;
  }

  return userFeed;
};

const add = async (user, message) => {
  const response = await fetch("https://dog.ceo/api/breeds/image/random/1");
  const body = await response.json();
  userFeed.unshift({
    name: user.name,
    nameHandle: user.email,
    message: message,
    imageSource: body.message,
  });
};

module.exports = {
  get,
  add,
};
