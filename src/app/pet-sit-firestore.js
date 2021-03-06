const firebase = require("firebase");
require("firebase/firestore");

const petSitters = [];
const users = [];

const firebaseConfig = {
  apiKey: "AIzaSyAgz9vCHbxEAz8bfF9Ycyjw2LoS9B_jwXQ",
  authDomain: "cs5356-fffd1.firebaseapp.com",
  projectId: "cs5356-fffd1",
  storageBucket: "cs5356-fffd1.appspot.com",
  messagingSenderId: "354809257551",
  appId: "1:354809257551:web:b3606dfcbed9f98bda943a",
  measurementId: "G-YHZ8CE0LY2"
};

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// uncomment in testing
//   db.useEmulator("http://localhost:8082");


const get = async () => {
  if (petSitters.length === 0) {
    await db.collection("pet-sit").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        petSitters.push(doc.data());
        console.log(doc.data());
      });
    });
  } else {
    return petSitters;
  }
  
  return petSitters;
}

const getUserBookings = (email) => {
  let bookings = [];
  let emailPart = email.slice(0,-4);
  console.log(emailPart);
  petSitters.forEach((sitter) => {
    if (sitter.bookings[emailPart] != null) {
      bookings.push({
        sitter: sitter.email,
        address: sitter.address,
        name: sitter.name,
        dates: sitter.bookings[emailPart],
      });
    }
  });
  console.log("getting user bookings: " + bookings);
  return bookings;
}

const getUsers = async () => {
  if (users.length === 0) {
    await db.collection("user-info").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        users.push(doc.data());
        console.log(doc.data());
      });
    });
  } else {
    return users;
  }

  return users;
}

module.exports = {
  get,
  getUsers,
  getUserBookings,
};
