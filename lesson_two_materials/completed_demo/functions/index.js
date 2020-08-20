const functions = require('firebase-functions');
const firebase = require('firebase-admin');
firebase.initializeApp();

const db = firebase.firestore()

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.addDefaultTodos = functions.auth.user().onCreate(async (user) => {
    const currentTime = Math.round(new Date().getTime() / 1000);

    await db.collection('todo-items').add({
        userID: user.uid,
        description: 'This is a default todo item',
        done: false,
        createdAt: currentTime,
        updatedAt: currentTime,
    });
})
