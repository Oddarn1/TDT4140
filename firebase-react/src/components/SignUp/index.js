import React, {Component} from 'react';
import {Link,withRouter} from 'react-router-dom';
import {withFirebase} from '../Firebase';
import {compose} from 'recompose';

import * as ROLES from '../../constants/roles';
import * as ROUTES from '../../constants/routes';

/*The main component for SignUp*/
const SignUpPage= () => (
    <div>
        <h1>SignUp</h1>
        <SignUpForm/>
    </div>
);

const INITIAL_STATE = {
    username: '',
    email: '',
    passwordOne: '',
    passwordTwo: '',
    error: null,
};

/*The base of the signup form.*/
class SignUpFormBase extends Component {
    constructor(props) {
        super(props);

        this.state={...INITIAL_STATE};
    }

    /*Uses built-in functions in firebase for signing up.*/
    onSubmit = event =>{
        const { username, email, passwordOne } = this.state;
        const roles =[];

        roles.push(ROLES.USER);
        this.props.firebase
            .doCreateUserWithEmailAndPassword(email, passwordOne)
            .then(authUser => {
                return this.props.firebase
                    .user(authUser.user.uid)
                    .set({
                        username,
                        email,
                        roles,
                    });
            })
            .then(() => {
                this.setState({ ...INITIAL_STATE });
                this.props.history.push(ROUTES.HOME);
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
            username,
            email,
            passwordOne,
            passwordTwo,
            error,
        } = this.state;

        const isInvalid =
            passwordOne !== passwordTwo ||
            passwordOne === '' ||
            email === '' ||
            username === '';

        return (
            <form onSubmit={this.onSubmit}>
                <input
                    name="username"
                    value={username}
                    onChange={this.onChange}
                    type="text"
                    placeholder="Full Name"
                />
                <input
                    name="email"
                    value={email}
                    onChange={this.onChange}
                    type="text"
                    placeholder="Email Address"
                />
                <input
                    name="passwordOne"
                    value={passwordOne}
                    onChange={this.onChange}
                    type="password"
                    placeholder="Password"
                />
                <input
                    name="passwordTwo"
                    value={passwordTwo}
                    onChange={this.onChange}
                    type="password"
                    placeholder="Confirm Password"
                />

                <button type="submit" disabled={isInvalid}>Sign Up</button>

                {error && <p>{error.message}</p>}
            </form>
        );
    }
}

const SignUpLink = () => (
    <p>
        Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
    </p>
);

const SignUpForm=compose(
    withRouter,
    withFirebase,
    )(SignUpFormBase);

export default SignUpPage;

export {SignUpForm,SignUpLink};