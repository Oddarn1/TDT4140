import React, {Component} from 'react';
import * as ROLES from '../../constants/roles';
import {AuthUserContext} from '../Session';
import withAuthorization from "../Session/withAuthorization";

const INITIAL_STATE = {
       to: "",
       content: ""
};

class MessageForm extends Component{
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
       const role=this.props.authUser.role;

      return (


        <div>
            {console.log(role)}
        <form onSubmit={this.onSubmit}>
        <label>Til </label>
                <input value={this.state.to}
                   placeholder="Mottaker"
                   onChange={this.onChange}
                   name="to"
                   disabled={role===ROLES.USER}
            />
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


//Wrapper klassen i en consumer som gir tilgang til authUser
const NewMessage=()=>(
    <AuthUserContext.Consumer>
        {authUser =>
            <MessageForm authUser={authUser}/>}
    </AuthUserContext.Consumer>
);

//Setter en condition som forhindrer siden i å laste før authUser er registrert.
//Dette var bakgrunnen i at man ikke fikk desablet inputfelt, ettersom den først leste siden uten at bruker var logget inn
const condition=authUser => ! !authUser;

export default withAuthorization(condition)(NewMessage);
