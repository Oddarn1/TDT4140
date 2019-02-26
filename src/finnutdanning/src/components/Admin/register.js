import React,{Component} from 'react';
import {withFirebase} from '../Firebase';

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
    }

    onChange(event){
        this.setState({[event.target.name]:event.target.value});
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

    onSubmit = () => {
        console.log("Registration complete");
    };


    render(){
        const { email, fullName, role} = this.state;
        const isInvalid = email === '' || fullName === '' || role === '';
        return(
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
                        value="user"
                        checked={this.state.role === "user"}
                        onChange={this.onChange}
                        />

                <label> Veileder</label>
                <input type="radio"
                    name="role"
                    value="counselor"
                    checked={this.state.role === "counselor"}
                    onChange={this.onChange}
                        />

                <label> Ansatt</label>
                <input type="radio"
                    name="role"
                    value="employee"
                    checked={this.state.role === "employee"}
                    onChange={this.onChange}
                        />

                <label> Admin</label>
                <input type="radio"
                    name="role"
                    value="admin"
                    checked={this.state.role === "admin"}
                    onChange={this.onChange}
                        />
                        <br/>

                <button disabled={isInvalid} onClick={this.submit} type="submit">Registrer
                </button>
            </form>

        )
    }

    /*TODO:
    * Create register-form, confirm registration details (matching passwords, email contains @ and so on.
    * Write to firebase with the call this.props.firebase.*Function goes here*. */
}

export default withFirebase(Register);
