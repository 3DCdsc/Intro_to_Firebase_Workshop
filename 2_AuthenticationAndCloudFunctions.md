# Lesson 2 - Authentication and Cloud Functions

1. [Recap on Firebase](#recap-on-firebase)
2. [Initialise Firebase App](#initialise-firebase-app)

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

First, let's specify where the sign-up / login inputs will be. For ease of implementation, let's display and hide content based on whether a user is logged in.

1. In the `div` block with class "Modal", enclose the content with an inner `div` block.

    ```html
    <!-- Original code: -->
    <body>
      <div class="Viewframe">
        <div id="demo" class="Modal">
          <img src='./assets/logo/logo_small.png'/>
          <!-- other content in Modal -->
        </div>
      </div>
    </body>

    <!-- Modified code: -->
    <body>
      <div class="Viewframe">
        <div id="demo" class="Modal">
          <img src='./assets/logo/logo_small.png'/>
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
          <img src='./assets/logo/logo_small.png'/>
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
          <img src='./assets/logo/logo_small.png'/>
          <div id="main">
            <!-- content in main -->
          </div>
          <div id="login">
            <h1>Login / Sign Up</h1>
            <p>Just enter an email and we will allow you to login / sign up accordingly!</p>
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
      let login_section = document.getElementById('login');
      let main_section = document.getElementById('main');
      login_section.style.display = 'none';
      main_section.style.display = 'none';

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
5. TODO

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

3. Now, let's display based the blocks based on if a user is signed in. Use the code below to trigger a change when the authentication state is changed.

    ```javascript
    firebase.auth().onAuthStateChanged(function(user) {
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
    function signOut () {firebase.auth().signOut().then(function() {
      // Sign-out successful.
      ui.start('#firebaseui-auth-container', uiConfig);
    }).catch(function(error) {
      // An error happened.
      console.log("error:", error);
    });}
    ```

3. You can now logout and in easily!

### Profile Information

To add profile information, we can use the `user` object that we get once the authentication state is changed.

1. CHALLENGE: In the "main" block, let's add a `div` block called "greeting".
    - There should be no content in the "greeting" block.

2. Find the part in your code where we display blocks based on whether a user is logged in. It should look something like this:

    ``` javascript
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
        login_section.style.display = 'none';
        main_section.style.display = 'block';
      } else {
        // No user is signed in.
        login_section.style.display = 'block';
        main_section.style.display = 'none';
      }
    });
    ```

2. 

## Cloud Functions

### Set-up

1. Navigate to `Functions` on the right panel of Firebase.
2. Click `Get started` and `continue` twice.
3. Install Firebase tools. Open your terminal and navigate to the project folder. Enter the following line into it.

    ``` bash
    npm install -g firebase-tools
    ```

4. Configure `firebase-tools` with `firebase login`. Enter the following command in your terminal and follow the prompts:

    ``` bash
    firebase login
    ```

    - Enter `y` and login to the Google Account with the project as prompted.

5. Initiate your project:

    ``` bash
    firebase init
    ```

6. Now, the commandline will prompt you to pick some options. Read the instructions carefully on how to pick them. Pick the following options when prompted:
    1. Functions: Configure and deploy Cloud Functions
    2. Use an existing project
    3. Select the project that you are using for this workshop
    4. Javascript
    5. y
    6. y

### Set

### Deploying Functions

1. Deploy your functions:

    ``` bash
    firebase deploy
    ```
