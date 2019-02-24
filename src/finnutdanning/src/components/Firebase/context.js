import React from 'react';

const FirebaseContext=React.createContext(null);


/*withFirebase is a higher order component which wraps our component with a firebase-consumer which makes it
* easy for our component to make us of firebase.*/
export const withFirebase = Component => props => (
    <FirebaseContext.Consumer>
        {firebase => <Component {...props} firebase={firebase}/>}
    </FirebaseContext.Consumer>
);

export default FirebaseContext;