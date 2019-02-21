import React,{Component} from 'react';
import {withFirebase} from '../Firebase';

const INITIAL_STATE = {
    email:"",
    fullName:"",
    password1:"",
    password2:"",
    error:null,
    role: ""
};

class Register extends Component {
    constructor(props){
        super(props);
        this.state={...INITIAL_STATE};
    }

    /*TODO:
    * Create register-form, confirm registration details (matching passwords, email contains @ and so on.
    * Write to firebase with the call this.props.firebase.*Function goes here*. */
}

export default withFirebase(Register);