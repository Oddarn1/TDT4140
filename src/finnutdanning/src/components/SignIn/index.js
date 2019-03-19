import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { SignUpLink } from '../SignUp';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import {PasswordForgetLink} from "../PasswordForget";

const SignInPage = () => (
    <div>
        <h1>Logg inn</h1>
        <SignInForm />
        <PasswordForgetLink/>
        <SignUpLink />
    </div>
);

const INITIAL_STATE = {
    email: '',
    password: '',
    error: null,
};

class SignInFormBase extends Component {
    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE };
    }

    onSubmit = event => {
        const { email, password } = this.state;

        this.props.firebase
            .doSignInWithEmailAndPassword(email, password)
            .then(() => {
                this.setState({ ...INITIAL_STATE });
                this.props.history.push(ROUTES.LANDING);
            })
            .catch(error => {
                this.setState({error: "Ugyldig epost eller passord."});
            });

        event.preventDefault();
    };

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    render() {
        const { email, password, error } = this.state;
        let propError;
        try {
            propError = this.props.location.error
        }catch(error){
            propError = null;
        }

        const isInvalid = password === '' || email === '';

        return (
            <form onSubmit={this.onSubmit}>
                {propError && <p style={{color:"red"}}>{propError}</p>}
                <input
                    name="email"
                    value={email}
                    onChange={this.onChange}
                    type="text"
                    placeholder="Epost-adresse"
                />
                <input
                    name="password"
                    value={password}
                    onChange={this.onChange}
                    type="password"
                    placeholder="Passord"
                />
                <button disabled={isInvalid} type="submit">
                    Logg inn
                </button>

                {error && <p>{error}</p>}
            </form>
        );
    }
}

const SignInForm = compose(
    withRouter,
    withFirebase,
)(SignInFormBase);

export default SignInPage;

export { SignInForm };