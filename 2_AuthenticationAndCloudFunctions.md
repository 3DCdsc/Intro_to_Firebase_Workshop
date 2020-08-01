# Lesson 2 - Authentication and Cloud Functions

1. [Recap on Firebase](#recap-on-firebase)
2. [Initialise Firebase App](initialise-firebase-app)

## Recap on Firebase

- Firebase is a comprehensive app development platform, with multiple tools we can use to make app development easier.
- Last week we covered:
  - Setting up Firebase
  - Firestore
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
          measurementId: "G-<measurement-id>"
        };

        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
      </script>
    </body>
    ```

## Authentication

### Create Login Page

TODO

### Adding Authentication to your Firebase Project

1. On the side bar, click "Authentication". You will see the screen below.
  ![Image of Initial Authentication Page](images/auth_setup_signin.png?raw=true "Initial Authentication Page")
2. Click "Set up sign-in method" button. You will see the screen below.
  ![Image of Sign In Methods](images/auth_signin_method.png?raw=true "Set Up Sign In Methods")
3. There are multiple sign-in options available to choose from. We will be using the `Email/Password` Method as it is the easiest to set up. More information on how to set up other methods can be found [here](https://firebase.google.com/docs/auth/web/start#next_steps).
4. Click the option we are using and click the toggle to enable it.
  ![Image of Enabling Email/Password Sign In](images/auth_enable_email_pw.png?raw=true "Enable Email/Password Sign In")

### FirebaseUI Auth

1. There are multiple ways of setting this up as well, but we will be using [FirebaseUI Auth](https://github.com/firebase/firebaseui-web) as it is an easy drop-in solution. Other ways can be found [here](https://firebase.google.com/docs/auth/where-to-start).
2. To use FirebaseUI Auth, we will need to import FirebaseUI as well with the following:

    ```html
    <body>
      <!-- Previously loaded Firebase SDKs, Firebase Config and App Initialisation -->

      <!-- Import FirebaseUI and its CSS -->
      <script src="https://cdn.firebase.com/libs/firebaseui/3.5.2/firebaseui.js"></script>
      <link type="text/css" rel="stylesheet" href="https://cdn.firebase.com/libs/firebaseui/3.5.2/firebaseui.css" />
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
        signInSuccessWithAuthResult: function(authResult, redirectUrl) {
          // User successfully signed in.
          // Return type determines whether we continue the redirect automatically
          // or whether we leave that to developer to handle.
          return false;
        },
        uiShown: function() {
          // The widget is rendered.
          // Hide the loader.
          document.getElementById('loader').style.display = 'none';
        }
      },
      signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
      ],
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
      - Note: these callbacks are *optional* and is not a required argument of uiConfig.
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

    ui.start('#firebaseui-auth-container', uiConfig);
    ```

3. You should be able to sign-in now!

### Sign Out

TODO

### Profile Information

TODO

## Cloud Functions

TODO
