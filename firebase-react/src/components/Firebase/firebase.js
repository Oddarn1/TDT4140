import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

export const config = {
    apiKey: "AIzaSyB75ISkhork5Z_-6Gp-oVq4iHA7zC2zuZ4",
    authDomain: "finnutdanning.firebaseapp.com",
    databaseURL: "https://finnutdanning.firebaseio.com",
    projectId: "finnutdanning",
    storageBucket: "finnutdanning.appspot.com",
    messagingSenderId: "903452096243"
};

/*The main API for use of firebase. Includes built-in functions for firebase authentication. */
class Firebase {
    constructor(){
        app.initializeApp(config);

        this.auth=app.auth();
        this.db=app.database();
    }

    // Auth API

    doCreateUserWithEmailAndPassword = (email, password) =>
        this.auth.createUserWithEmailAndPassword(email, password);

    doSignInWithEmailAndPassword = (email, password) =>
        this.auth.signInWithEmailAndPassword(email, password);

    doSignOut = () => this.auth.signOut();

    doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

    doPasswordUpdate = password =>
        this.auth.currentUser.updatePassword(password);

    //Merge Auth and DB User API

    onAuthUserListener = (next, fallback) =>
        this.auth.onAuthStateChanged(authUser => {
            if (authUser) {
                this.user(authUser.uid)
                    .once('value')
                    .then(snapshot => {
                        const dbUser = snapshot.val();

                        // default empty roles
                        if (!dbUser.roles) {
                            dbUser.roles = [];
                        }

                        // merge auth and db user
                        authUser = {
                            uid: authUser.uid,
                            email: authUser.email,
                            ...dbUser,
                        };

                        next(authUser);
                    });
            } else {
                fallback();
            }
        });

    // User API

    user=uid=>this.db.ref('users/' + uid);

    users = () => this.db.ref('users');
}

export default Firebase;