import React, {Component} from 'react';
import * as ROLES from '../../constants/roles';
import withAuthorization from "../Session/withAuthorization";
import {withFirebase} from "../Firebase";
import {compose} from 'recompose';

const INITIAL_STATE = {
       to: "",
       content: ""
};

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
         event.preventDefault();
       let {content, to} = this.state;
       to=this.props.authUser.role===ROLES.USER?ROLES.COUNSELOR:to;
       const senderid = this.props.authUser.uid;
       const recpid = to;
       const first = true;
       this.props.firebase.messages().push({senderid, recpid, content, first})
       .then(() => {
              this.setState({...INITIAL_STATE});
       }).catch(error=>console.log(error));

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
        <form onSubmit={this.onSubmit}>
        <label>Til </label>
                <input value={role===ROLES.USER?ROLES.COUNSELOR:to}
                   placeholder={role===ROLES.USER?"Veileder":"Mottaker"}
                   onChange={this.onChange}
                   name="to"
                   disabled={role===ROLES.USER}
            />
            <br/>

                <textarea value={content}
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

//Setter en condition som forhindrer siden i å laste før authUser er registrert.
//Dette var bakgrunnen i at man ikke fikk desablet inputfelt, ettersom den først leste siden uten at bruker var logget inn
const condition=authUser => ! !authUser;

export default compose(withFirebase,withAuthorization(condition))(NewMessage);
