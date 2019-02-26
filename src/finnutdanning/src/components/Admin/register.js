import React,{Component} from 'react';
import {withFirebase} from '../Firebase';
import * as ROLES from '../../constants/roles';

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
        //TODO: Access emails of all users.
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

    /*Firebase: write to database with user info. Creates new user and a unique user id*/
    submit=event=> {
        const {email, fullName, role} = this.state;
        event.preventDefault();
        this.props.firebase.users().push({
            email,
            fullName,
            role
        })
            .then(
                this.setState({...INITIAL_STATE})
            )
            .catch(error =>
                this.setState({error: error}))
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
                        onChange={this.onChange}
                        />

                <label> Veileder</label>
                <input type="radio"
                    name="role"
                    value={ROLES.COUNSELOR}
                    checked={this.state.role === ROLES.COUNSELOR}
                    onChange={this.onChange}
                        />

                <label> Ansatt</label>
                <input type="radio"
                    name="role"
                    value={ROLES.EMPLOYEE}
                    checked={this.state.role === ROLES.EMPLOYEE}
                    onChange={this.onChange}
                        />

                <label> Admin</label>
                <input type="radio"
                    name="role"
                    value={ROLES.ADMIN}
                    checked={this.state.role === ROLES.ADMIN}
                    onChange={this.onChange}
                        />
                        <br/>
                <button disabled={isInvalid} type="submit">Registrer
                </button>
                {this.state.error} <br/>
            </form>


        </div>
        )
    }

    /*TODO:
    * Create register-form, confirm registration details (matching passwords, email contains @ and so on.
    * Write to firebase with the call this.props.firebase.*Function goes here*. */
}

export default withFirebase(Register);
