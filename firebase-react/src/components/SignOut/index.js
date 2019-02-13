import React from 'react';

import { withFirebase } from '../Firebase';

/*Simple sign-out-button. Uses firebase-function.*/
const SignOutButton = ({ firebase }) => (
    <button type="button" onClick={firebase.doSignOut}>
        Sign Out
    </button>
);

export default withFirebase(SignOutButton);