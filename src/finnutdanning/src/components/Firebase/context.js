import React from 'react';

const FirebaseContext=React.createContext(null);


/*withFirebase er en Higher Order Component som "wrapper" klasser med funksonalitet for aksess til firebase på f.eks. formen
* this.props.firebase...*/
export const withFirebase = Component => props => (
    <FirebaseContext.Consumer>
        {firebase => <Component {...props} firebase={firebase}/>}
    </FirebaseContext.Consumer>
);

export default FirebaseContext;