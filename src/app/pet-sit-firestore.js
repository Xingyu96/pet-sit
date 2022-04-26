const firebase = require("firebase");
require("firebase/firestore");

const petSitters = [];

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

module.exports = {
  get,
};
