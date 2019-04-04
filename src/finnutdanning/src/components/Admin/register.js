import React,{Component} from 'react';
import {withFirebase} from '../Firebase';
import * as ROLES from '../../constants/roles';
import firebase from 'firebase';

/*I denne komponenten er det lurt inn en del "hacky" løsninger på problemer, proceed with caution*/

/*Oppretter en secondary konfigurasjon av firebase-appen. Dette gjøres for at admin ikke skal bli logget ut ved registrering
* av ny bruker i verktøyet.*/
const config = {
    apiKey: "AIzaSyB75ISkhork5Z_-6Gp-oVq4iHA7zC2zuZ4",
    authDomain: "finnutdanning.firebaseapp.com",
    databaseURL: "https://finnutdanning.firebaseio.com",};

const secondaryApp = firebase.initializeApp(config, "Secondary");

const INITIAL_STATE = {
    email:"",
    fullName:"",
    error:null,
    role: ''

};

class Register extends Component {
    constructor(props){
        super(props);
        this.state={...INITIAL_STATE};
        this.onChange=this.onChange.bind(this);
        this.onSubmit=this.onSubmit.bind(this);
        this.submit=this.submit.bind(this);
        this.isRegistered=this.isRegistered.bind(this);
    }

    /*Oppdaterer state fra input-felter*/
    onChange(event){
        this.setState({[event.target.name]:event.target.value});
    }

    /*Kontrollmetode av e-post som registreres, er denne allerede i databasen?*/
    isRegistered(email){
        const users=this.props.registered;
        for(var i=0;i<users.length;i++) {
            console.log(users[i].email);
            if (!users[i].email.toLowerCase().localeCompare(email.toLowerCase())) {
                this.setState({error: "Eposten er allerede registrert."});
                return true;
            }
        }
        return false;
    }

    /*Genererer et midlertidig tilfeldig passord for bruker.*/
    generatePass(){
        let letters="1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!#%&/?()"
        let pass="";
        for (let i=0; i<32;i++){
            pass+=letters.charAt(Math.floor(Math.random()*letters.length));
        }
        return pass;
    }

    /*Skriver til firebase med oppgitt informasjon i tekstfelter.*/
    submit=event=> {
        const {email, fullName, role} = this.state;
        const pass=this.generatePass();
        //Oppretter bruker i firebase-auth med det genererte passordet
        secondaryApp.auth().createUserWithEmailAndPassword(email,pass)
            .then(authUser => {
                //Skriver bruker til firebase for å synkronisere dette mot autentiseringen
                    return secondaryApp.database().ref('users/'+authUser.user.uid)
                        .set({
                            fullName,
                            email,
                            role,
                        });
            })//Sender så ut reset passord-mail til bruker for å gi bruker mulighet til å velge eget passord
            .then(()=> {
                this.props.firebase.doPasswordReset(email);
                //Bruker logges så ut av secondaryapp for å gjøre det mulig å registrere ny bruker.
                secondaryApp.auth().signOut();
            })
            .catch(error =>
            {console.log(error);
                this.setState({error});}
            );

        event.preventDefault();
        this.setState({...INITIAL_STATE});
        };

    //Kontrollerer at eposten er godkjent og at registrering kan gjennomføres. Kaller submit som gjør registrering.
    onSubmit = (event) => {
        event.preventDefault();
        if(!this.isRegistered(this.state.email)) {
            this.submit(event);
            console.log("Registration complete");
            this.setState({error: null});
        }else{
            console.log("Registration failed");
        }
    };


    render(){
        const { email, fullName, role} = this.state;
        const isInvalid = email === '' || fullName === '' || role === '';
        return(
            <div>
            <form className="register"  onSubmit={this.onSubmit}>
                <h1>Registrer bruker</h1>
                <label>E-post </label>
                <input value={this.state.email}
                       placeholder="E-post"
                       onChange={this.onChange}
                       name="email"
                       />
                       <br/>

                <label>
                Fullt navn
                <input value={this.state.fullName}
                        placeholder="Fullt navn"
                        onChange={this.onChange}
                        name="fullName"
                        />
                        </label>
                        <br/>

                <label>Rolle: </label>

                <label>Bruker</label>
                <input type="radio"
                        name="role"
                        value={ROLES.USER}
                        checked={this.state.role === ROLES.USER}
                        onClick={this.onChange}
                        />

                <label> Veileder</label>
                <input type="radio"
                    name="role"
                    value={ROLES.COUNSELOR}
                    checked={this.state.role === ROLES.COUNSELOR}
                    onClick={this.onChange}
                        />

                <label> Ansatt</label>
                <input type="radio"
                    name="role"
                    value={ROLES.EMPLOYEE}
                    checked={this.state.role === ROLES.EMPLOYEE}
                    onClick={this.onChange}
                        />

                <label> Admin</label>
                <input type="radio"
                    name="role"
                    value={ROLES.ADMIN}
                    checked={this.state.role === ROLES.ADMIN}
                    onClick={this.onChange}
                        />
                        <br/>
                <button disabled={isInvalid} type="submit">Registrer
                </button>
                {this.state.error} <br/>
            </form>


        </div>
        )
    }

}

/*withFirebase er en Higher Order Component som "wrapper" klassen med funksonalitet for aksess til firebase på f.eks. formen
* this.props.firebase...*/
export default withFirebase(Register);
