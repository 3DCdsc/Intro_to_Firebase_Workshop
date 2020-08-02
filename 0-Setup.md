# Lesson 1 - Firestore and Firebase Hosting

## Prerequisites

- Complete [Lesson 0](./0-Setup.md)
- Working development environment with NodeJS, a termnial and a code editor
- Working Internet connection

## Setting up

- Create an empty folder.
- Run `npm init`. Fill up the details as you want. Fields can be left blank. _(this is inconsequential for our scope)_
- Install firebase admin by running `npm install firebase-admin`.
- Create an empty `.js` file.

## Service Accounts

The Firestore database is inaccessible to the public by default (in `Production` mode). To read and make changes we need to prove that we have those privileges.
Some methods to do so are by using a proxy or using an IP whitelist. However we will be using service accounts.

Generally using of service accounts is best practice as:

1. Permissions handling is easier and more fine grained
2. Easier identification on logs/dashboards

### Getting your service account

1. Go to your Firebase project.
2. Click on ![Image](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAABNElEQVRIieXUq04DQRgF4A8koU24SDxJUZjiuASBhTRcXGsx8BZ9BRxYeAouLwC4OhIICQbXVraIXRIynVkWKAZO8ov99/zn7OzMHP4LjjEM6qjM4GRJg+WSvW9hCQ9GV/CA2mfDE5HnK7ziHGs4jPDeMcQJrnGAeaxjkDJsRb70q9VKiU/jeQwGL6jGDNoFQ49ooJLXNjoF/HbMYAe9hPhshD+Tvwv5vVwrijr6wUAjRcZuwO3nGoXoBkOVAm414HZDQtmLlkLq+CYN6pHeZsH8VkQv+Yu2xTe5I9vQEHN4ivB7udbIClYwFRFaxL1sQ6t57eEOCxH+VK41gl+/aNAcg0Hzo2As7C5lYXeBVVnYpU7bQBZ2N9iXhd2GgrCLoeYHcV0WZxGD0zKDZS/abcneH8QbVjmoqgPsNrYAAAAASUVORK5CYII=) beside `Project Overview`.
3. Click on `Project settings`.
4. Click on `Service accounts`.
5. Click on `Firebase Admin SDK` and click on `Generate new private key`.
6. After a few seconds you will be prompted to download a JSON. Save it in your project directory and rename it to `firebase.json` for easier access.

## Connecting to the database

Right now your directory stucture should be something like this:

```
.
+-- node_modules
|   ...
+-- index.js
+-- firebase.json
+-- package.json
+-- package-lock.json
```

Open `index.js`. Firstly, we will need to authenticate ourselves with the database. For this we will need a few functions from `firebase-admin`.

---

```javascript
import { initializeApp, credential, firestore } from "firebase-admin";
```

We will use `initializeApp` and `credential` for authentication, whereas `firestore` is used to interface with the database once we are authenticated.

---

```javascript
import serviceAccount from "./firebase.json";

initializeApp({
  credential: credential.cert(serviceAccount),
});
```

We load the service account we downloaded earlier into memory and use it to initialise (or connect) our app with the Firebase servers.

---

```javascript
const db = firestore();
```

Finally to connect to the database we use this command.

## Adding in some data

Now that we are connected with our database, its looking a bit empty. Let's change that by adding in some basic data.

Something to keep in mind is that Firestore is a NoSQL database. This means that there is no fixed schema (or structure) to the database.

> You can learn [more about NoSQL databases](https://www.mongodb.com/nosql-explained) and [how they are different from traditional SQL databases](https://www.mongodb.com/nosql-explained/nosql-vs-sql)

Let's create some data to add in.

```javascript
data = {
  name: "Rick Astley",
  rickrolled: true,
};
```

<sup>[sauce](https://www.reddit.com/r/nextfuckinglevel/comments/hawahv/this_guy_just_rick_rolled_rick_astley_i_think_he/)</sup>

---

Now that we have our data, we need to push it to the database. We can create the following function for that.

```javascript
async function addObjects(db) {
  // for automatic ID
  const res = await db.collection("test").add(data);
  console.log(res.id);

  // for set id (id_here)
  const doc = await db.collection("test").doc("id_here").set(data);
  console.log(doc.id);
}
```

Let's break that down a bit.

1. `async function addObjects(db)`
   `async`: means that the function is [asynchronous](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Introducing). In short that means that we will need to "wait" for a request (or promise) to be completed before we can move on.

   `addObjects(db)`: we are creating a function named `addObjects` with one parameter `db`. Here `db` will be the database object we created above. We will need it to push data to the database.

2. For automatic IDing
