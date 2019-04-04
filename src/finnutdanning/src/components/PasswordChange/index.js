import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const INITIAL_STATE = {
    passwordOne: '',
    passwordTwo: '',
    error: null,
};

class PasswordChangeForm extends Component {
    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE };
    }

    onSubmit = event => {
        const { passwordOne } = this.state;

        this.props.firebase
            .doPasswordUpdate(passwordOne)
            .then(() => {
                this.setState({ ...INITIAL_STATE,
                error:  {message:"Passord er endret"}});
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
        const { passwordOne, passwordTwo, error } = this.state;

        const isInvalid =
            passwordOne !== passwordTwo || passwordOne === '';

        return (
            <form onSubmit={this.onSubmit}>
                <TextField
                    variant="outlined"
                    name="passwordOne"
                    value={passwordOne}
                    onChange={this.onChange}
                    type="password"
                    label="Nytt passord"
                /><br/>
                <TextField
                    variant="outlined"
                    name="passwordTwo"
                    value={passwordTwo}
                    style={{marginTop:10}}
                    onChange={this.onChange}
                    type="password"
                    label="Bekreft nytt passord"
                /> <br/>
                <Button variant="contained" style={{padding:15,marginTop:10}} disabled={isInvalid} type="submit">
                    Sett nytt passord
                </Button>

                {error && <p>{error.message}</p>}
            </form>
        );
    }
}

export default withFirebase(PasswordChangeForm);