import React from 'react';
import { withFirebase } from '../Firebase';

//Enkel knapp som gjør nytte av funksjoner definert i firebase.js
const SignOut = ({ firebase }) => (
    <button type="button" onClick={firebase.doSignOut}>
        Logg ut
    </button>
);

export default withFirebase(SignOut);