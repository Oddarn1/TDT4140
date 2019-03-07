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
        this.db=app.database();
    }

    // ** User API ***
    user = uid => this.db.ref('users/'+uid);

    users = () => this.db.ref('users');

    // ** Interest API ***
    interest = iname => this.db.ref('interests/'+iname);

    interests = () => this.db.ref('interests');

    hits = iname => this.db.ref('interests/'+iname+'/hits')
}

export default Firebase;
