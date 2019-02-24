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

    user=uid=>this.db.ref('/users'+uid);

    users = () => this.db.ref('/users');
}

export default Firebase;