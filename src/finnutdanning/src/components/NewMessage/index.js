import React, {Component} from 'react';
import withAuthorization from "../Session/withAuthorization";
import {AuthUserContext} from '../Session';
import * as ROLES from '../../constants/roles';
import withAuthentication from "../Session/withAuthentication";
import {withFirebase} from '../Firebase';
import firebase from 'firebase';


const INITIAL_STATE = {
       to: "",
       content: ""
}

class NewMessage extends Component{
     constructor(props){
        super(props);
        this.state={...INITIAL_STATE};
        this.onChange=this.onChange.bind(this);
        this.onSubmit=this.onSubmit.bind(this);
     }

       onChange(event){
       this.setState({[event.target.name]:event.target.value});
       }

       onSubmit = event => {
       const {content, to} = this.state;
       const senderid = this.props.firebase.auth.currentUser.uid;
       const recpid = "";
       const first = true;
       this.props.firebase
       .messages().push({senderid, recpid, content})
       .then(() => {
              event.preventDefault();
              this.setState({...INITIAL_STATE});

       });

};

// hente brukerid currentuser : this.props.firebase.auth.currentUser.uid

// "sende" melding this.props.firebase.messages().push({senderid: ^,content})
// .then(this.setState({standard}))
// .catch(error)



    render() {

       const {to, content} = this.state;
       const isInvalid = content === '';


      return (


        <div>
        <form onSubmit={this.onSubmit}>
        <label>Til </label>

       {this.props.firebase.auth.currentUser === ROLES.ADMIN &&
                <input value={this.state.to}
                       placeholder="Mottakere"
                       onChange={this.onChange}
                       name="to"
                       />
                }

                       <br/>


                <textarea value={this.state.content}
                       placeholder="Skriv din melding her"
                       onChange={this.onChange}
                       name="content"
                       />
                       <br/>




                       <button disabled={isInvalid} type="submit">Send </button>



        </form>
        </div>

)



}

}

const condition =authUser => ! !authUser;

export default withAuthorization(condition)(NewMessage);
