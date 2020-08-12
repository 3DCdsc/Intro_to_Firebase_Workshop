# Lesson 1.1 Firestore

## Prerequisites

- Complete [Lesson 0](./0-Setup.md)
- Working development environment with NodeJS, a termnial and a code editor
- Working Internet connection

## Setting up

- Create an empty folder.
- Run `npm init`. Fill up the details as you want. Fields can be left blank. _(this is inconsequential for our scope)_
- Install firebase admin by running `npm install firebase-admin`.
- Create an empty `index.js` file.

## Service Accounts

The Firestore database is inaccessible to the public by default (in `Production` mode). To read and make changes we need to prove that we have those privileges.
Some methods to do so are by using a proxy or using an IP whitelist. However we will be using service accounts.

Generally using of service accounts is best practice as:

1. Permissions handling is easier and more fine grained
2. Easier identification on logs/dashboards

### Getting your service account

1. Go to your Firebase project.
2. Click ont he settings icon beside `Project Overview`.
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

Open `index.js`. Firstly, we will need to authenticate ourselves with the database. For this we will need to import `firebase-admin`.

---

```javascript
const serviceAccount = require("./firebase.json");
```

---

```javascript
import serviceAccount from "./firebase.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
```

We load the service account we downloaded earlier into memory and use it to initialise (or connect) our app with the Firebase servers.

---

```javascript
const db = admin.firestore();
```

Finally to connect to the database we use this command.

## Creating some data

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
   For this we just specify the data and Firestore will generate an ID for us. The data we want to add is passed under `add()`

3. For manual IDing
   We pass use an additional function `doc()` to specify an ID.

You might want to choose between automatic or manual IDing depending on your application.

---

Now if you go to the Firestore dashboard you should see two entries (one with the manual ID you specified and one automatic).

![Image of Create Success](images/firestore/create_success.png?raw=true "Firestore Create Success")

## Retrieving Data

After adding in some data to your database, you would want to request the data to display it for the user or use for further processing on the client end.

We are going to cover two types of querying:

- Getting all documents from a collection
- Getting documents matching parameters from a collection

### Getting all documents from a collection

Create a function with the following code:

```javascript
async function getObjects(db) {
  const snapshot = await db.collection("test").get();

  snapshot.forEach((doc) => {
    console.log(doc.id, "=>", doc.data());
  });
}
```

The purpose for `async` and `db` remains the same.

`db.collection()` specifies the collection name to get data from. We simply add the `get()` to get all the documents within the specified collection.

The lines that follow are to display the retrieved data on the console.

### Getting documents matching parameters from a collection

Create a function with the following code:

```javascript
async function queryObjects(db) {
  const test_collection = db.collection("test");
  const snapshot = await test_collection
    .where("name", "==", "Rick Astley")
    .get();

  if (snapshot.empty) {
    console.log("No matching documents.");
    return;
  }

  snapshot.forEach((doc) => {
    console.log(doc.id, "=>", doc.data());
  });
}
```

We first create a logical parameter which the database will use to search through the specified collection. Documents that satisfy the logical condition are returned and stored in the `snapshot` variable.

The logical operators supported are:

- `<`
- `<=`
- `==`
- `>`
- `>=`
- `array-contains`
- `in`
- `or`
- `array-contains-any`

You can use multiple `where()` functions, however do keep in mind Firestore allows range filtering (ie the use of `<`, `<=`, `>`, `>=`) on only one of the `where()` functions.

You can also specify how the documents will be ordered and can limit the number of responses.

For limit -> add `limit(<int>)` before `get()` and pass in the number of documents you want the database to return.

For order -> add `orderBy(field, mode)` before `get()`. `field` is used to specify which field you want to order results by and mode is to specify between ascending (`asc`, this is also the default if you omit filter mode) and descending (`desc`).

For more stuff we are not covering (like pagination, subcollections) you can reference the docs [here](https://firebase.google.com/docs/firestore/query-data/query-cursors).

## Updating data

Create a function with the following code:

```javascript
async function deleteDocument(db) {
    data = {
        name: "GG",
        coolness_factor: 100,
    };
    const test_collection = db.collection("test");
    const snapshot = await test_collection.doc(<document_id>).update(data)
}
```

First we define a dictionary which will contain all the new fields we want to update the document with. After that we select the document and use the `update(<dict>)` function to update the document with the data specified in the parameters.

## Deleting data

We will be covering two types of deletion:

- Deleting an entire document
- Deleting a certain field in a document

### Deleting an entire document

Create a function with the following code:

```javascript
async function deleteDocument(db) {
	const test_collection = db.collection("test");
	const snapshot = await test_collection.doc(<document_id>).delete()

	console.log(snapshot.id, "=>", snapshot.data());
}
```

Specify the document you want to delete (identified by the specified ID) using `doc()`, and pass `delete()` to tell the database to delete that document.

### Deleting a certain field

Create a function with the following code:

```javascript
async function deleteDocument(db) {
    const FieldValue = admin.firestore.FieldValue;
    const test_collection = db.collection("test");
    const doc = await test_collection.doc(<document_id>)

    const res = await cityRef.update({
          name: FieldValue.delete()
    });
}
```

First we select the document that we want to delete the field from. Next, a `FieldValue` is declared which we later use to specify the key that we want to delete along with the `delete()` function.

# Lesson 1.2 - Firebase Hosting

Firebase Hosting a easy to use (and free) service to host your static sites on the cloud. This gives you a URL that you can share with your friends. Some other alternatives are [Netlify](https://www.netlify.com/) and [Heroku](https://heroku.com/).

## How to host your website

1. Get the files from the [previous workshop](https://github.com/3DCdsc/Intro_to_JS_Workshop).
2. Install the Firebase CLI using `npm i -g firebase-tools`.
3. Login to Firebase on the CLI with `firebase login`
4. Go to the project directory and setup a `public` folder with the completed `index.html` and all related assets inside.
5. Go to the folder containing the `public` folder and run `firebase init`. Choose hosting and the project that you created. Choose yes for single page site and make sure that the folder it is pointing to is also `public`.
6. Use `firebase serve` to get a preview of what the deployed site would look like. (you can also use this to debug any issues)
7. If there are no issues then you can use `firebase deploy` and after the processes are done it will give you a URL at which you can find your site.
