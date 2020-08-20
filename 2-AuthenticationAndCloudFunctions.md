# Lesson 2 - Authentication and Cloud Functions

## Overview

- [Overview](#overview)
- [Recap on Firebase](#recap-on-firebase)
- [Initialise Firebase App](#initialise-firebase-app)
- [Authentication](#authentication)
  - [Create Login Page](#create-login-page)
  - [Adding Authentication to your Firebase Project](#adding-authentication-to-your-firebase-project)
  - [FirebaseUI Auth](#firebaseui-auth)
  - [Set Up FirebaseUI](#set-up-firebaseui)
  - [Sign Out](#sign-out)
  - [Profile Information](#profile-information)
- [Cloud Functions](#cloud-functions)
  - [Set-up Billing Account](#set-up-billing-account)
  - [Set-up Project](#set-up-project)
  - [Writing Cloud Functions](#writing-cloud-functions)
  - [Deploying Functions](#deploying-functions)

## Recap on Firebase

- Firebase is a comprehensive app development platform, with multiple tools we can use to make app development easier.
- Last week we covered:
  - Setting up Firebase
  - Firestore
  - Firebase Hosting
- This week we will cover:
  - Authentication
  - Web Functions

## Initialise Firebase App

1. If you haven't done so, create a Firebase Project (instructions here).
2. If you haven't done so, add Firebase to your web app (instructions here).
3. Multiple ways of doing this, but we will be using the Content Delivery Network (CDN) to do so. Other methods can be found [here](https://firebase.google.com/docs/web/setup#add-sdks-initialize).
4. In the `<body>` of your `index.html`, below the line which imports the core Firebase SDK, import `firebase-auth`. To illustrate, your code should look something like this:

   ```html
   <body>
     <!-- Firebase App (the core Firebase SDK) is always required and must be listed first -->
     <script src="https://www.gstatic.com/firebasejs/7.17.1/firebase-app.js"></script>

     <!-- Import firebase-auth -->
     <script src="https://www.gstatic.com/firebasejs/7.17.1/firebase-auth.js"></script>
   </body>
   ```

5. In the side bar, click the cog on the right of `Project Overview`. There should be a dropdown menu. Select the `Project settings` option.
6. Scroll down to find the `Firebase SDK snippet`, and make sure that the `CDN` option is selected.
7. Copy your web app's Firebase configuration and initialise Firebase in your app. It should look something like the following:

   ```html
   <body>
     <!-- Previously loaded Firebase SDKs -->

     <script>
       // Replace the following with your app's Firebase project configuration
       var firebaseConfig = {
         apiKey: "<api-token>",
         authDomain: "<project-id>.firebaseapp.com",
         databaseURL: "https://<project-id>.firebaseio.com",
         projectId: "<project-id>",
         storageBucket: "<project-id>.appspot.com",
         messagingSenderId: "<message-sender-id>",
         appId: "<app-id>",
         measurementId: "G-<measurement-id>",
       };

       // Initialize Firebase
       firebase.initializeApp(firebaseConfig);
     </script>
   </body>
   ```

## Authentication

### Create Login Page

First, let's specify where the sign-up / login inputs will be. For ease of implementation, let's display and hide content based on whether a user is logged in.

1. In the `div` block with class "Modal", enclose the content with an inner `div` block.

   ```html
   <!-- Original code: -->
   <body>
     <div class="Viewframe">
       <div id="demo" class="Modal">
         <img src="./assets/logo/logo_small.png" />
         <!-- other content in Modal -->
       </div>
     </div>
   </body>

   <!-- Modified code: -->
   <body>
     <div class="Viewframe">
       <div id="demo" class="Modal">
         <img src="./assets/logo/logo_small.png" />
         <div id="main">
           <!-- other content in Modal -->
         </div>
       </div>
     </div>
   </body>
   ```

2. Add the div block containing the login / sign up block:

   ```html
   <!-- Original code: -->
   <body>
     <div class="Viewframe">
       <div id="demo" class="Modal">
         <img src="./assets/logo/logo_small.png" />
         <div id="main">
           <!-- content in main -->
         </div>
       </div>
     </div>
   </body>

   <!-- Modified code: -->
   <body>
     <div class="Viewframe">
       <div id="demo" class="Modal">
         <img src="./assets/logo/logo_small.png" />
         <div id="main">
           <!-- content in main -->
         </div>
         <div id="login">
           <h1>Login / Sign Up</h1>
           <p>
             Just enter an email and we will allow you to login / sign up
             accordingly!
           </p>
           <div id="firebaseui-auth-container"></div>
           <div id="loader">Loading...</div>
         </div>
       </div>
     </div>
   </body>
   ```

   - `<div id="firebaseui-auth-container"></div>` will be where the authentication container will be placed.
   - `<div id="loader">Loading...</div>` is a loading placeholder to be visible before the authentication container has loaded.
   - Now, there are 2 blocks, "main" and "login", and we want to load them according to if there is a user signed in.

3. To optimise user experience, we will first hide both blocks. To do so, we will first get the element by id as taught in the JS workshops, then setting their display to 'none', as shown below.

   ```html
   <script>
     let login_section = document.getElementById("login");
     let main_section = document.getElementById("main");
     login_section.style.display = "none";
     main_section.style.display = "none";

     // other content
   </script>
   ```

### Adding Authentication to your Firebase Project

1. On the side bar, click "Authentication". You will see the screen below.
   ![Image of Initial Authentication Page](images/auth_setup_signin.png?raw=true "Initial Authentication Page")
2. Click "Set up sign-in method" button. You will see the screen below.
   ![Image of Sign In Methods](images/auth_signin_method.png?raw=true "Set Up Sign In Methods")
3. There are multiple sign-in options available to choose from. We will be using the `Email/Password` Method as it is the easiest to set up. More information on how to set up other methods can be found [here](https://firebase.google.com/docs/auth/web/start#next_steps).
4. Click the option we are using and click the toggle to enable it.
   ![Image of Enabling Email/Password Sign In](images/auth_enable_email_pw.png?raw=true "Enable Email/Password Sign In")
5. That's it! You can now start using Firebase Auth on the front end!

### FirebaseUI Auth

1. There are multiple ways of setting this up as well, but we will be using [FirebaseUI Auth](https://github.com/firebase/firebaseui-web) as it is an easy drop-in solution. Other ways can be found [here](https://firebase.google.com/docs/auth/where-to-start).
2. To use FirebaseUI Auth, we will need to import FirebaseUI as well with the following:

   ```html
   <body>
     <!-- Previously loaded Firebase SDKs, Firebase Config and App Initialisation -->

     <!-- Import FirebaseUI and its CSS -->
     <script src="https://cdn.firebase.com/libs/firebaseui/3.5.2/firebaseui.js"></script>
     <link
       type="text/css"
       rel="stylesheet"
       href="https://cdn.firebase.com/libs/firebaseui/3.5.2/firebaseui.css"
     />
   </body>
   ```

3. Initialize the FirebaseUI Widget using Firebase.

   ```javascript
   let ui = new firebaseui.auth.AuthUI(firebase.auth());
   ```

### Set Up FirebaseUI

1. Configure FirebaseUI.

   ```javascript
   let uiConfig = {
     callbacks: {
       signInSuccessWithAuthResult: function (authResult, redirectUrl) {
         // User successfully signed in.
         // Return type determines whether we continue the redirect automatically
         // or whether we leave that to developer to handle.
         return false;
       },
       uiShown: function () {
         // The widget is rendered.
         // Hide the loader.
         document.getElementById("loader").style.display = "none";
       },
     },
     signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID],
   };
   ```

   Let's unpack this:

   - `callbacks`
     
     > A callback is a function that is passed into another function as an argument, which is then invoked in the outer function to complete kind of action or routine.
     - Put into context:
       - `signInSuccessWithAuthResult` specifies what to do in the case of a successful sign in.
       - `uiShown` specifies what to do once the ui has been shown.
         - `document.getElementById` basically gets the element in the `html` by the id we specified. This was previously covered in our Intro to JS Workshop [here](https://github.com/3DCdsc/Intro_to_JS_Workshop/blob/master/Lesson1/1-UnderstandingWebDev.md#dom-accessing-methods).
         - `.style.display = 'none'` sets the display of this selected element to none, meaning that it would not be shown. To show it, you could set this value to `'block'`(this is set by default).
     - Note: these callbacks are _optional_ and is not a required argument of uiConfig.
     - Documentation on available callbacks found [here](https://github.com/firebase/firebaseui-web#available-callbacks).
   - `signInOptions`

     - This array indicates the options which would be available to the user to sign in or login.
     - Other methods sign in options can be displayed with options such as the following:

       ```javascript
       signInOptions: [
         firebase.auth.EmailAuthProvider.PROVIDER_ID,
         firebase.auth.GoogleAuthProvider.PROVIDER_ID,
         firebase.auth.FacebookAuthProvider.PROVIDER_ID,
         firebase.auth.TwitterAuthProvider.PROVIDER_ID,
         firebase.auth.GithubAuthProvider.PROVIDER_ID,
         firebase.auth.PhoneAuthProvider.PROVIDER_ID,
       ],
       ```

2. Render FirebaseUI Auth Container.

   ```javascript
   // Set UI config

   ui.start("#firebaseui-auth-container", uiConfig);
   ```

3. Now, let's display based the blocks based on if a user is signed in. Use the code below to trigger a change when the authentication state is changed.

   ```javascript
   firebase.auth().onAuthStateChanged(function (user) {
     if (user) {
       // User is signed in.
     } else {
       // No user is signed in.
     }
   });
   ```

4. CHALLENGE: Display and hide blocks based on authentication state.

   - Hints:
     1. You can make a block visible by setting an element's `style.display` property to 'block'.
     2. Refer to step 3 of [Create Login Page](#create-login-page), the code there is similar and can be used here.

5. You should be able to sign-in now!

### Sign Out

After signing in, we have to sign out as well. Let's see how to do that here.

1. Let's add the sign out button at the top of the page. (CHALLENGE: if you have gone through the previous JS workshops, try to do this without looking at the hints first :))

   - Hint:

     1. Buttons are created using the `<button>` tag in html.
     2. To add text, type it between the `<button>` and `</button>` tag. It should look something like this:

        ```html
        <button>SIGN OUT</button>
        ```

     3. To trigger something on click, use `onclick=...`. So if your sign out function is called `signOut`, your code should look something like this.

        ```html
        <button onclick="signOut()">SIGN OUT</button>
        ```

     - Note: the function `signOut` has not been created yet.

2. Let's create the sign out function:

   ```javascript
   function signOut() {
     firebase
       .auth()
       .signOut()
       .then(function () {
         // Sign-out successful.
         ui.start("#firebaseui-auth-container", uiConfig);
       })
       .catch(function (error) {
         // An error happened.
         console.log("error:", error);
       });
   }
   ```

3. You can now logout and in easily!

### Profile Information

To add profile information, we can use the `user` object that we get once the authentication state is changed.

1. CHALLENGE: In the "main" block, let's add a `div` block called "greeting".

   - There should be no content in the "greeting" block.

2. Find the part in your code where we display blocks based on whether a user is logged in. It should look something like this:

   ```javascript
   firebase.auth().onAuthStateChanged(function (user) {
     if (user) {
       // User is signed in.
       login_section.style.display = "none";
       main_section.style.display = "block";
     } else {
       // No user is signed in.
       login_section.style.display = "block";
       main_section.style.display = "none";
     }
   });
   ```

3. To get the user's name, we can use `.displayName` property of the user object. Let's first save the user's name with a variable `name`.

   ```javascript
   firebase.auth().onAuthStateChanged(function(user) {
     if (user) {
       // User is signed in.
       login_section.style.display = 'none';
       main_section.style.display = 'block';

       let name = user.displayName;
   ```

   - Pro-tip: There are actually many other properties of the user object which we can use, such as the following:

     ```javascript
     email = user.email;
     photoUrl = user.photoURL;
     emailVerified = user.emailVerified;
     uid = user.uid;
     ```

     - More information on user profile's properties in the documentation [here](https://firebase.google.com/docs/auth/web/manage-users#get_a_users_profile).

4. Let's change the `profile` block we made earlier to display a "Welcome, [name]" message. Below the name variable, type the following:

   ```javascript
   let profileDiv = document.getElementById("profile");
   profileDiv.innerHTML = "<p>Welcome, " + name + "</p>";
   ```

## Cloud Functions

Do note that to use Cloud Functions, Google requires the project to add a billing account and use the Blaze Plan instead of the Spark Plan (free). There are still free limits each month, so for a small demo or project like the one we are doing, we will not need to pay anything.

- Free tier limits are specified [here](https://cloud.google.com/functions/pricing#free_tier).
- Difference between Firebase's Spark Plan and Blaze Plan is stated [here](https://firebase.google.com/pricing).

### Set-up Billing Account

1. On the side bar in Firebase, click the "Upgrade" button beside "Spark". You should see this: ![Image of Billing Prompt 1](images/firebase_billing_1.png?raw=true "Billing Prompt 1")
2. Click "Select plan" under Blaze.
3. Next, you should see this:
4.  ![Image of Billing Prompt 2](images/firebase_billing_2.png?raw=true "Billing Prompt 2")
5. Click "Continue" and follow through the procedure to add your billing information.
6. After adding your billing account, you can add Budget Alerts as well so that Google will warn you when you have spent 50%, 90% and 100% of your budget.
7. After this, we can use Cloud Functions :D

### Set-up Project

1. Navigate to `Functions` on the side bar in Firebase.
2. Click `Get started` and `continue` twice.
3. Install Firebase tools. Open your terminal and navigate to the project folder. Enter the following line into it.

   ```bash
   npm install -g firebase-tools
   ```

4. Configure `firebase-tools` with `firebase login`. Enter the following command in your terminal and follow the prompts:

   ```bash
   firebase login
   ```

   - Enter `y` and login to the Google Account with the project as prompted.

5. Initiate your project:

   ```bash
   firebase init
   ```

6. Now, the command line will prompt you to pick some options. Read the instructions carefully on how to pick them. Pick the following options when prompted:
   1. Functions: Configure and deploy Cloud Functions
   2. Use an existing project
   3. Select the project that you are using for this workshop
   4. Javascript
   5. y
   6. y

### Writing Cloud Functions

Cloud functions are written in (surprise surprise) Javascript, albeit in a [node.js environment instead of the browser environment](https://hackernoon.com/nodejs-vs-javascript-differences-and-similarities-6w1ws22pc). Syntax wise they are identical, but node.js gives us a few extra features, like [modules.](https://eloquentjavascript.net/10_modules.html)

Cloud functions can be invoked based on many different triggers, such as a HTTP request to the function endpoint, changes made on a firestore database, events on firebase authentication, and many more!

For a simple example, lets look at at the example cloud function generated by `firebase init` in `your/project/director/functions/index.js`

```javascript
const functions = require('firebase-functions');

exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});
```

Here we see some built-in functions and syntax we've never seen before. Firstly, `require`. When you call `require`, with the module name of a dependency, it makes sure the module is loaded and returns its interface. This is convenient, as it now means we can use functions and utilities from packages other people have made.

In this case, we will be using the `firebase-functions` package, and binding the interface object to the `functions` variable. 

Next, `exports`. What we are writing here, in `index.js`, is basically a node.js module. That means it will be called by the `require` function and loaded somewhere else. Now, by default, this module will not expose any of the methods and variables in the scope of `index.js` unless we explicitly add it to the `exports` object. Therefore, what we are doing here is exposing the method returned by `functions.https.onRequest()` by binding it on the `helloWorld` attribute on the `exports` object. 

Now, in contrast to the javascript functions we have written previously, calling `functions.https.onRequest` returns a function, instead of an object or a primitive type like a number or a string. This is because Javascript supports [first class functions](https://developer.mozilla.org/en-US/docs/Glossary/First-class_Function), which allow us to treat functions like variables. This also means we can return functions from functions, and pass functions as arguments to functions. We call functions that take functions as input arguments and give functions as return values [higher-order functions](https://eloquentjavascript.net/05_higher_order.html)

Specifically, `functions.https.onRequest` takes as an argument a function that has the arguments a Express `Request` and a `Response` object. The [Request](http://expressjs.com/en/4x/api.html#req) object gives you access to the properties of the HTTP request sent by the client, and the [Response](http://expressjs.com/en/4x/api.html#res) object gives you a way to send a response back to the client. 

[Getting started with Firebase Cloud Functions](https://firebase.google.com/docs/functions/get-started)

### Deploying Functions

1. Deploy your (only) your functions:

   ```bash
   firebase deploy --only functions
   ```
   
2. That's it!

