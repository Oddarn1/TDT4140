import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import AuthUserContext from './context';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

const withAuthorization = condition => Component => {
    class WithAuthorization extends React.Component {
        //Sjekker om condition i komponent er oppfylt av innlogget bruker. Hvis ikke blir de redirigert til landing
        componentDidMount() {
            this.listener = this.props.firebase.onAuthUserListener(
                authUser => {
                    if (!condition(authUser)) {
                        this.props.history.push('/redirect');
                    }
                },
                () => this.props.history.push(ROUTES.LANDING),
            );
        }

        //Fjerner listener
        componentWillUnmount() {
            this.listener();
        }

        //Returnerer komponent med Consumer fra withAuthenthication, sender props videre til komponent
        render() {
            return (
                <AuthUserContext.Consumer>
                    {authUser =>
                        condition(authUser) ? <Component authUser={authUser} {...this.props} /> : null
                    }
                </AuthUserContext.Consumer>
            );
        }
    }

    return compose(
        withRouter,
        withFirebase,
    )(WithAuthorization);
};

export default withAuthorization;