import React, {Component} from 'react';
import {Link,withRouter} from 'react-router-dom';
import {withFirebase} from '../Firebase';
import {compose} from 'recompose';

import * as ROLES from '../../constants/roles';
import * as ROUTES from '../../constants/routes';

/*For SignIn, SignOut, SignUp, PasswordForget, Session, Firebase, Account har vi fulgt tutorial på:
* https://www.robinwieruch.de/complete-firebase-authentication-react-tutorial/ */

//Lager en ny komponent med andre Komponenter for å holde registreringssiden slik vi ønsker
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
                <label>Fullt navn</label><br/>
                <input
                    name="fullName"
                    value={fullName}
                    onChange={this.onChange}
                    type="text"
                    placeholder="Fullt navn"
                /><br/>
                <label>Epost</label><br/>
                <input
                    name="email"
                    value={email}
                    onChange={this.onChange}
                    type="text"
                    placeholder="Epost-adresse"
                /><br/>
                <label>Passord</label><br/>
                <input
                    name="passwordOne"
                    value={passwordOne}
                    onChange={this.onChange}
                    type="password"
                    placeholder="Passord"
                /><br/>
                <label>Passord må bestå av minimum 6 tegn.</label><br/><br/>
                <label>Gjenta passord</label><br/>
                <input
                    name="passwordTwo"
                    value={passwordTwo}
                    onChange={this.onChange}
                    type="password"
                    placeholder="Bekreft Passord"
                /><br/>

                <button type="submit" disabled={isInvalid}>Registrer deg</button><br/>

                {error && <p>{error.message}</p>}
            </form>
        );
    }
}

//Oppretter en link som brukes på logg inn-siden for å linke til registrering
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