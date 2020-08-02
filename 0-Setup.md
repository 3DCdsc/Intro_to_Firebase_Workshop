# Lesson 0 - Setting up Firebase

1. [Requirements](#requirements)
2. [What is Firebase](#what-is-firebase)
3. [Creating a project](#creating-a-project)

## Requirements

For this workshop series you will need

- Google account
- working installation of NodeJS (we will be using the current LTS version of v12.18)
- access to a termnial
- a code editor

## What is Firebase

TODO

## Creating a project

1. Go to [Firebase](https://firebase.google.com/).
2. `Go to console` on the top right.
3. Sign in with your Google account. Once you're signed in you should be able to see a page with your Firebase projects.
4. Click on `Add project`.
5. Enter a name for your project.
6. Enable Google Analytics.
7. Click on `Create project`.

In a few seconds you should have your own Firebase project up and running!
![Image of Success Page](images/firebase_complete.png?raw=true "Firebase Success Page")

## Enable Firestore, Hosting and Cloud Functions

_Firestore_

1. Click on `Database` on the side panel of the Firebase console under `Develop`.
2. Click on `Create database`.
3. Ensure `Start in production mode` is checked. Click on next.
4. Choose a location. Defaults will be fine as latency doesn't matter at this point.
5. Click on `Done`.

After a short while your Firestore database should be ready to use.

![Image of Firestore](images/firestore.png?raw=true "Firebase Firestore Page")

_Hosting_

1. Click on `Hosting` on the side panel of the Firebase console under `Develop`.
2. Click on `Get started`.
3. Click `Next` and `Finish` until you reach the dashboard.

![Image of Firebase Hosting](images/hosting.png?raw=true "Firebase Hosting Page")

_Cloud Functions_

1. Click on `Functions` on the side panel of the Firebase console under `Develop`.
2. Click on `Get started`.
3. Click `Next` and `Finish` until you reach the dashboard.

![Image of Firebase Functions](images/functions.png?raw=true "Firebase Functions Page")
