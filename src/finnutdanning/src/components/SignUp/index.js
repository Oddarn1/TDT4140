import React, {Component} from 'react';
import {Link,withRouter} from 'react-router-dom';
import {withFirebase} from '../Firebase';
import {compose} from 'recompose';
import Typography from '@material-ui/core/Typography';

import * as ROLES from '../../constants/roles';
import * as ROUTES from '../../constants/routes';
import './index.css';
import TextField from "@material-ui/core/TextField/TextField";
import Button from "@material-ui/core/Button/Button";

/*For SignIn, SignOut, SignUp, PasswordForget, Session, Firebase, Account har vi fulgt tutorial på:
* https://www.robinwieruch.de/complete-firebase-authentication-react-tutorial/ */

//Lager en ny komponent med andre Komponenter for å holde registreringssiden slik vi ønsker
const SignUpPage= () => (
    <div className="registerPage">
        <Typography variant="h4" gutterBottom style={{padding:15}}>Registrer deg</Typography>
        <SignUpForm/>
        <Typography variant="body1" gutterBottom>Har du allerede bruker? <Link to={ROUTES.SIGNIN}> Logg inn</Link></Typography>
    </div>
);

const INITIAL_STATE = {
    fullName: '',
    email: '',
    passwordOne: '',
    passwordTwo: '',
    error: null,
};

//Lager en komponent som står for funksjonen med registrering
class SignUpFormBase extends Component {
    constructor(props) {
        super(props);

        this.state={...INITIAL_STATE};
    }


    //Skriver utfylt data fra inputfelter til firebase
    onSubmit = event =>{
        const { fullName, email, passwordOne } = this.state;
        const role=ROLES.USER;

        //Oppretter bruker i auth-grensesnittet
        this.props.firebase
            .doCreateUserWithEmailAndPassword(email, passwordOne)
            .then(authUser => {
                //Skriver så til firebase med informasjon om brukeren
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

    //Lagrer tekstinput-felter til state
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
                <TextField
                    label={"Fullt navn"}
                    style={{color:"#3F51B5",margin:10,width: "30%"}}
                    variant={"outlined"}
                    className="fullName"
                    name="fullName"
                    value={fullName}
                    onChange={this.onChange}
                    type="text"
                /><br/>
                <TextField
                    label={"Epost-adresse"}
                    style={{color:"#3F51B5",margin:10,width: "30%"}}
                    variant={"outlined"}
                    className="email"
                    name="email"
                    value={email}
                    onChange={this.onChange}
                    type="text"
                /><br/>
                <TextField
                    label={"Passord"}
                    style={{color:"#3F51B5",margin:10,width: "30%"}}
                    variant={"outlined"}
                    className="password"
                    name="passwordOne"
                    value={passwordOne}
                    onChange={this.onChange}
                    type="password"
                /><br/>
                <label>Passord må bestå av minimum 6 tegn.</label><br/><br/>
                <TextField
                    label={"Bekreft passord"}
                    style={{color:"#3F51B5",margin:10,width: "30%"}}
                    variant={"outlined"}
                    className="password"
                    name="passwordTwo"
                    value={passwordTwo}
                    onChange={this.onChange}
                    type="password"
                /><br/>

                <Button  className="loggInn" variant="contained" style={{padding:15,marginTop:25}}
                         onClick={this.showAll}
                         type="submit" disabled={isInvalid}>
                    Registrer deg
                </Button>

                {error && <p>{error.message}</p>}
            </form>
        );
    }
}

//Oppretter en link som brukes på logg inn-siden for å linke til registrering
const SignUpLink = () => (
    <Typography variant="body1" gutterBottom>
        Har du ikke bruker? <Link to={ROUTES.SIGNUP}>Registrer deg</Link>
    </Typography>
);

const SignUpForm=compose(
    withRouter,
    withFirebase,
)(SignUpFormBase);

export default SignUpPage;

export {SignUpForm,SignUpLink};