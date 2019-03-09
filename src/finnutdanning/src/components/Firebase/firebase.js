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



class Firebase {
    constructor(){
        app.initializeApp(config);
        this.auth=app.auth();
        this.db=app.database();
    }

    //Auth API


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
                        if (!dbUser.role) {
                            dbUser.role = "";
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

    //DB API
    user=uid=>this.db.ref('users/'+uid);

    users = () => this.db.ref('users');

    message=msgid=>this.db.ref('messages/'+msgid);

    messages= () => this.db.ref('messages');

    conversation = convid => this.db.ref('conversations/' + convid);
    
    conversations = () => this.db.ref('conversations');

}

export default Firebase;