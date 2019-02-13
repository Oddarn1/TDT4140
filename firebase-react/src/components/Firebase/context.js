import React from 'react';

const FirebaseContext=React.createContext(null);

/*Initializes firebase once for use in components, instead of encapsulating every component with <FirebaseContext.Consumer>
* param: Component with possible props
* return: Component encapsulated by the consumer with firebase passed as a prop.*/
export const withFirebase = Component => props => (
    <FirebaseContext.Consumer>
        {firebase => <Component {...props} firebase={firebase}/>}
    </FirebaseContext.Consumer>
);

export default FirebaseContext;