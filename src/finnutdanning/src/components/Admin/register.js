import React,{Component} from 'react';
import {withFirebase} from '../Firebase';
import * as ROLES from '../../constants/roles';
import firebase from 'firebase';

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

    onChange(event){
        this.setState({[event.target.name]:event.target.value});
    }

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

    generatePass(){
        let letters="1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!#%&/?()"
        let pass="";
        for (let i=0; i<32;i++){
            pass+=letters.charAt(Math.floor(Math.random()*letters.length));
        }
        return pass;
    }

    /*Firebase: write to database with user info. Creates new user and a unique user id*/
    submit=event=> {
        const {email, fullName, role} = this.state;
        const pass=this.generatePass();
        secondaryApp.auth().createUserWithEmailAndPassword(email,pass)
            .then(authUser => {
                    return secondaryApp.db
                        .user(authUser.user.uid)
                        .set({
                            fullName,
                            email,
                            role,
                        });
            })
            .then(()=> {
                this.props.firebase.doPasswordReset(email);
                secondaryApp.auth().signOut();
            })
            .catch(error =>
                this.setState({error: error}));

        event.preventDefault();
        this.setState({...INITIAL_STATE});
        };

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

export default withFirebase(Register);
