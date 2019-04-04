import React from 'react';

import AuthUserContext from './context';
import {withFirebase} from "../Firebase";

const withAuthentication = Component => {
    class WithAuthentication extends React.Component {
        constructor(props) {
            super(props);

            this.state = {
                authUser: null,
            };
        }

        //Leser inn om bruker er logget inn eller ikke
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

        //Fjerner listener
        componentWillUnmount() {
            this.listener();
        }

        //Returnerer komponenten, men med Provider rundt. Dette gjør det mulig å hente ut authUser fra props
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