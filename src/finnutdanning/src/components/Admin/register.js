import React,{Component} from 'react';
import {withFirebase} from '../Firebase';

const INITIAL_STATE = {
    email:"",
    fullName:"",
    error:null,
    role: ""
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
            </div>
        )
    }

    /*TODO:
    * Create register-form, confirm registration details (matching passwords, email contains @ and so on.
    * Write to firebase with the call this.props.firebase.*Function goes here*. */
}

export default withFirebase(Register);