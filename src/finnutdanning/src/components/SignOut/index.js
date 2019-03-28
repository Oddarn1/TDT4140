import React from 'react';
import { withFirebase } from '../Firebase';

/*For SignIn, SignOut, SignUp, PasswordForget, Session, Firebase, Account har vi fulgt tutorial på:
* https://www.robinwieruch.de/complete-firebase-authentication-react-tutorial/ */

//Enkel knapp som gjør nytte av funksjoner definert i firebase.js
const SignOut = ({ firebase }) => (
    <button type="button" onClick={firebase.doSignOut}>
        Logg ut
    </button>
);

export default withFirebase(SignOut);