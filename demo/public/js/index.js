const app = firebase.app();
const auth = app.auth();

const ui = new firebaseui.auth.AuthUI(firebase.auth());

ui.start('#firebaseui-auth-container', {
    signInOptions: [
        {
            provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
            requireDisplayName: true,
        }
    ],
    signInSuccessUrl: '/main.html',
});