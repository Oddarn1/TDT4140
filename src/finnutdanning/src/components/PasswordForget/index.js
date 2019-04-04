import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import './index.css';

/*For SignIn, SignOut, SignUp, PasswordForget, Session, Firebase, Account har vi fulgt tutorial på:
* https://www.robinwieruch.de/complete-firebase-authentication-react-tutorial/ */

const PasswordForgetPage = () => (
    <div className="passwordForgetForm">
        <Typography variant="h4" gutterBottom style={{padding:15}}>Glemt passord</Typography>
        <PasswordForgetForm />
    </div>
);

const INITIAL_STATE = {
    email: '',
    error: null,
};

class PasswordForgetFormBase extends Component {
    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE };
    }

    onSubmit = event => {
        const { email } = this.state;

        this.props.firebase
            .doPasswordReset(email)
            .then(() => {
                this.setState({ ...INITIAL_STATE });
            })
            .catch(error => {
                this.setState({ error });
            });

        event.preventDefault();
    };

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    render() {
        const { email, error } = this.state;

        const isInvalid = email === '';

        return (
            <form onSubmit={this.onSubmit}>
                <TextField
                    label={"Epost-adresse"}
                    style={{color:"#3F51B5",margin:10,width: "30%"}}
                    variant={"outlined"} className="userField"
                    name="email"
                    value={this.state.email}
                    onChange={this.onChange}
                    type="text"
                />
                <br/>
                <Button  className="resetPass" variant="contained" style={{padding:15,marginTop:25}}
                         type="submit" disabled={isInvalid}>
                    Nullstill passordet mitt
                </Button>

                {error && <p>{error.message}</p>}
            </form>
        );
    }
}

const PasswordForgetLink = () => (
    <Typography variant="body1" style={{padding:15}} gutterBottom>
        <Link to={ROUTES.PASSWORDFORGET}>Glemt passord?</Link>
    </Typography>
);

export default PasswordForgetPage;

const PasswordForgetForm = withFirebase(PasswordForgetFormBase);

export { PasswordForgetForm, PasswordForgetLink };