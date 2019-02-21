import React,{Component} from 'react';
import {withFirebase} from '../Firebase';
import {compose} from 'recompose';

const INITIAL_STATE = {
    email:"",
    fullName:"",
    error:null,
    role: []
};

class Register extends Component {
    constructor(props){
        super(props);
        this.state={...INITIAL_STATE};
        this.onChange=this.onChange.bind(this);
    }

    onChange(event){
        this.setState({[event.target.name]:event.target.value});
    }


    /*Firebase: write to database with user info. Creates new user and a unique user id*/
    submit=event=> {
        const {email, fullName, role} = this.state;
        role.push("Admin");
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

    render(){
        return(
            <div className="register">
                <h1>Registrer bruker</h1>
                <label>E-post</label>
                <input value={this.state.email}
                       placeholder="E-post"
                       onChange={this.onChange}
                       name="email"
                       />

                <label>
                Fullt navn
                <input value={this.state.fullName}
                        placeholder="Fullt navn"
                        onChange={this.onChange}
                        name="fullName"
                        />
                        </label>

                <label>Rolle</label>
                <input type="checkbox"/>


                <button className="submitRegister" onClick={this.submit}>Registrér</button>


            </div>
        )
    }

    /*TODO:
    * Create register-form, confirm registration details (matching passwords, email contains @ and so on.
    * Write to firebase with the call this.props.firebase.*Function goes here*. */
}

export default withFirebase(Register);
