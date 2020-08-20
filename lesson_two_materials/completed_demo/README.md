# Todo App Demo

## Setting up Firebase CLI

- Make sure you have the Firebase CLI installed (`npm install -g firebase-tools`)
- Login on firebase CLI (`firebase login`)
- Setup a project on the firebase web console
  - Set up Firestore ([or we'll have problems later](https://github.com/firebase/firebase-tools/issues/1988))
  - Set up Storage as well ([for similar reasons](https://stackoverflow.com/questions/58579042/firebase-project-initialization-error-cloud-resource-location-is-not-set-for-th))
- Initialize the project (`firebase init`), select the following
  - Enable `Functions, Hosting and Emulators`
  - Select the defaults for the rest of the options
- Run `firebase deploy` to deploy

## Data model

### Todo item (Firestore)

```json
{
    "userID": "string",
	"description": "string",
    "done": "boolean",
    "createdAt": "string", // unix datetime e.g. "1597924800"
    "updatedAt": "string", // unix datetime
}
```

### Todo item (Local)

```json
{
    "userID": "string",
    "id": "string", // corresponds to the document ID in firestore
	"description": "string",
    "done": "boolean",
    "createdAt": "string", // unix datetime e.g. "1597924800"
    "updatedAt": "string", // unix datetime
}
```



## Resources

https://firebase.google.com/docs/emulator-suite/install_and_configure



