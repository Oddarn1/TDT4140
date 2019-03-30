import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { SignUpLink } from '../SignUp';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import {PasswordForgetLink} from "../PasswordForget";
import Typography from '@material-ui/core/Typography';
import './index.css';
import TextField from "@material-ui/core/TextField/TextField";
import Button from "@material-ui/core/Button/Button";

/*For SignIn, SignOut, SignUp, PasswordForget, Session, Firebase, Account har vi fulgt tutorial på:
* https://www.robinwieruch.de/complete-firebase-authentication-react-tutorial/ */

const SignInPage = () => (
    <div className="signinPage">
        <Typography component="h2" variant = "h4" gutterBottom style = {{padding: 24}}>
            Logg inn
        </Typography>
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
            <form className="signinform" onSubmit={this.onSubmit}>
                {propError && <p style={{color:"red"}}>{propError}</p>}
                <TextField
                    label={"Epost-adresse"}
                    style={{color:"#3F51B5",margin:10,width: "30%"}}
                    variant={"outlined"} className="userField"
                    name="email"
                    value={email}
                    onChange={this.onChange}
                    type="text"
                    placeholder="Epost-adresse"
                />
                <br/>
                <TextField
                    label={"Passord"}
                    style={{color:"#3F51B5",margin:10,width: "30%"}}
                    variant={"outlined"} className="passwordfield"
                    name="password"
                    value={password}
                    onChange={this.onChange}
                    type="password"
                    placeholder="Passord"
                />
                <br/>
                <Button  className="loggInn" variant="contained" style={{padding:15}}
                         onClick={this.showAll}
                         type="submit" disabled={isInvalid}>
                    Logg inn
                </Button>

                {error && <Typography variant="body1" gutterBottom style={{color:"red"}}>{error}</Typography>}
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
