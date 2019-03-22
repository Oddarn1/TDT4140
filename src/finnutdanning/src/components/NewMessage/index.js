import React, {Component} from 'react';
import * as ROLES from '../../constants/roles';
import withAuthorization from "../Session/withAuthorization";
import {withFirebase} from "../Firebase";
import {compose} from 'recompose';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const INITIAL_STATE = {
       to: "",
       content: "",
       loading: false,
       error: null,
       search: "",
       users: []
};

class NewMessage extends Component{
     constructor(props){
        super(props);
        this.state={...INITIAL_STATE};
        this.onSearch=this.onSearch.bind(this);
        this.onContent=this.onContent.bind(this);
        this.onSubmit=this.onSubmit.bind(this);
     }

     componentDidMount() {
       //Henter ut alle brukere i firebase under 'users', users()-funksjonen er definert i firebase.js
       this.props.firebase.users().on('value', snapshot => {
           const usersObject = snapshot.val();

           if (usersObject===null){
               return;
           }

           const usersList = Object.keys(usersObject).map(key => ({
               ...usersObject[key],
               uid: key,
           }));

           this.setState({
               users: usersList,
               loading: false,
           });
       })
     };

     componentWillUnmount(){
         this.props.firebase.users().off();
     };

     onSearch(event) {
           this.props.firebase.db.ref("users").orderByChild("email").startAt(event.target.value)
               .endAt(event.target.value+"\uf8ff").on('value', snapshot => {
               const usersObject = snapshot.val();
               let usersList;
               if (usersObject===null){
                   usersList=[];
                   this.setState({users:usersList,
                       loading: false,});
                   return;
               }

               usersList = Object.keys(usersObject).map(key => ({
                   ...usersObject[key],
                   uid: key
               }));

               this.setState({
                   users: usersList,
                   loading: false,
               })

           });
           this.setState({search:event.target.value, to: event.target.value});
           event.preventDefault();
      };

      onContent(event) {
          this.setState({content : event.target.value})
      };



       onSubmit = event => {
         event.preventDefault();
         let {content, to, users} = this.state;
         to=this.props.authUser.role===ROLES.USER?ROLES.COUNSELOR:to;

         if (users.filter(user => (user.email === to)).length != 0 || to === "Veileder" || to === "Alle" || "Admin") {

           var recpid = to;
           if (users.filter(user => (user.email === to)).length === 1) {
             const userObject = users.filter(user => (user.email === to));
             recpid = userObject["0"]["uid"];
           }
           const senderid = this.props.authUser.uid;
           const first = true;
           const read=0;
           const messageID = this.props.firebase.messages().push({
             senderid,
             recpid,
             content,
             first,
             read}).getKey();
          if (recpid === "Veileder" || recpid === "Alle" || recpid === "Admin") {
          } else {
             this.props.firebase.conversations().push({
               msgids : {
                 0 : messageID
               },
               participant1 : this.props.authUser.uid,
               participant2 : recpid,
               read : 0
             }).then(() => {
               this.setState({...INITIAL_STATE});
             }).catch(error => console.log(error));
           }

           this.setState({...INITIAL_STATE});

         } else {
           console.log("Could not send, yippi")
         }



};

//Lister brukere i admin
UserList ({users}) {
    return (
        <ul>
            {users.map((user,index) => (
                <li key={user.uid}>
                    <span>
                        <Typography variant="body1" gutterBottom style={{padding:4}}>
                            E-post {user.email}
                        </Typography>
                        <Typography variant="body1" gutterBottom style={{padding:4}}>
                            Fullt navn: {user.fullName}
                        </Typography><Typography variant="body1" gutterBottom style={{padding:4}}>
                            rolle: {user.role}
                        </Typography>
                    </span>
                </li>
            ))}
        </ul>
    );
}

// hente brukerid currentuser : this.props.firebase.auth.currentUser.uid

// "sende" melding this.props.firebase.messages().push({senderid: ^,content})
// .then(this.setState({standard}))
// .catch(error)

    render() {

       const {to, content, loading, error, search, users} = this.state;
       const isInvalid = content === '';
       const role=this.props.authUser.role;
       const userList=this.UserList({users});

      return (
        <div>
        <form onSubmit={this.onSubmit}>
          <div>
            {role === ROLES.USER?ROLES.COUNSELOR : <Typography variant="body1" gutterBottom style={{padding:15}}>Brukersøk (NB: Case-sensitiv)</Typography>}
          </div>
          <label>Til</label>

                <input value={role===ROLES.USER?ROLES.COUNSELOR:search}
                   placeholder={role===ROLES.USER?"Veileder":"Epost til mottaker"}
                   onChange={this.onSearch}
                   name="to"
                   type="text"
                   disabled={role===ROLES.USER}
            />
            <br/>

                <textarea value={content}
                       placeholder="Skriv din melding her"
                       onChange={this.onContent}
                       name="content"
                       />
                       <br/>
                       <button disabled={isInvalid} type="submit">Send </button>
        </form>
          {role === ROLES.USER?ROLES.COUNSELOR :
          (<div>
            {!loading && <div ref="ListUsers"><br/>{userList}</div>}
            {this.state.error}
          </div>)}
        </div>


)
}
}


//Wrapper klassen i en consumer som gir tilgang til authUser

//Setter en condition som forhindrer siden i å laste før authUser er registrert.
//Dette var bakgrunnen i at man ikke fikk desablet inputfelt, ettersom den først leste siden uten at bruker var logget inn
const condition=authUser => ! !authUser;

export default compose(withFirebase,withAuthorization(condition))(NewMessage);
