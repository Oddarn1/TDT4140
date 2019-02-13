import React from 'react';

import AuthUserContext from './context';
import {withFirebase} from "../Firebase";

/*Function to pass authentication on to components to keep user signed in. Used for control of available pages.
* Param: Component
* Return: Component with authentication-functions. */
const withAuthentication = Component => {
    class WithAuthentication extends React.Component {
        constructor(props) {
            super(props);

            this.state = {
                authUser: null,
            };
        }

        /*Listens for authenticated user.*/
        componentDidMount() {
            this.listener = this.props.firebase.onAuthUserListener(
                authUser => {
                    this.setState({ authUser });
                },
                () => {
                    this.setState({ authUser: null });
                },
            );
        }

        /*Removes listener for users. */
        componentWillUnmount() {
            this.listener();
        }

        render() {
            return (
                <AuthUserContext.Provider value={this.state.authUser}>
                    <Component {...this.props} />
                </AuthUserContext.Provider>
            );
        }
    }

    return withFirebase(WithAuthentication);
};


export default withAuthentication;