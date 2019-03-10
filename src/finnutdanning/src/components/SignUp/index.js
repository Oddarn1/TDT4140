import React, {Component} from 'react';
import {Link,withRouter} from 'react-router-dom';
import {withFirebase} from '../Firebase';
import {compose} from 'recompose';

import * as ROLES from '../../constants/roles';
import * as ROUTES from '../../constants/routes';

const SignUpPage= () => (
    <div>
        <h1>Registrer deg</h1>
        <SignUpForm/>
        <p>Har du allerede bruker? <Link to={ROUTES.SIGNIN}> Logg inn</Link></p>
    </div>
);

const INITIAL_STATE = {
    fullName: '',
    email: '',
    passwordOne: '',
    passwordTwo: '',
    error: null,
};

class SignUpFormBase extends Component {
    constructor(props) {
        super(props);

        this.state={...INITIAL_STATE};
    }


    onSubmit = event =>{
        const { fullName, email, passwordOne } = this.state;
        const role=ROLES.USER;

        this.props.firebase
            .doCreateUserWithEmailAndPassword(email, passwordOne)
            .then(authUser => {
                return this.props.firebase
                    .user(authUser.user.uid)
                    .set({
                        fullName,
                        email,
                        role,
                    });
            })
            .then(() => {
                this.setState({ ...INITIAL_STATE });
                this.props.history.push(ROUTES.LANDING);
            })
            .catch(error => {
                this.setState({ error });
            });

        event.preventDefault();
    };

    onChange = event => {
        this.setState({[event.target.name]: event.target.value});
    };

    render() {
        const {
            fullName,
            email,
            passwordOne,
            passwordTwo,
            error,
        } = this.state;

        const isInvalid =
            passwordOne !== passwordTwo ||
            passwordOne === '' ||
            email === '' ||
            fullName === '';

        return (
            <form onSubmit={this.onSubmit}>
                <input
                    name="fullName"
                    value={fullName}
                    onChange={this.onChange}
                    type="text"
                    placeholder="Fullt navn"
                />
                <input
                    name="email"
                    value={email}
                    onChange={this.onChange}
                    type="text"
                    placeholder="Epost-adresse"
                />
                <input
                    name="passwordOne"
                    value={passwordOne}
                    onChange={this.onChange}
                    type="password"
                    placeholder="Passord"
                />
                <input
                    name="passwordTwo"
                    value={passwordTwo}
                    onChange={this.onChange}
                    type="password"
                    placeholder="Bekreft Passorc"
                />

                <button type="submit" disabled={isInvalid}>Registrer deg</button>

                {error && <p>{error.message}</p>}
            </form>
        );
    }
}

const SignUpLink = () => (
    <p>
        Har du ikke bruker? <Link to={ROUTES.SIGNUP}>Registrer deg</Link>
    </p>
);

const SignUpForm=compose(
    withRouter,
    withFirebase,
)(SignUpFormBase);

export default SignUpPage;

export {SignUpForm,SignUpLink};