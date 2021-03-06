import React, {Component} from 'react';
import * as ROLES from '../../constants/roles';
import withAuthorization from "../Session/withAuthorization";
import {withFirebase} from "../Firebase";
import {compose} from 'recompose';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import './index.css';

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

     //Fjerner lytter til database for å unngå memory-leak
     componentWillUnmount(){
         this.props.firebase.users().off();
     };

     //Leser inn brukere fra firebase som matcher email som fylles inn i til-feltet
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

     //Når melding skrives oppdateres dette
      onContent(event) {
          this.setState({content : event.target.value})
      };


        //Meldingen og mottaker leses inn og skrives til firebase
       onSubmit = event => {
         event.preventDefault();
         let {content, to, users} = this.state;
         to=this.props.authUser.role===ROLES.USER?ROLES.COUNSELOR:to;

         if (users.filter(user => (user.email === to)).length !== 0 || to === "Veileder" || to === "Alle" || "Admin") {

           var recpid = to;
           if (users.filter(user => (user.email === to)).length === 1) {
             const userObject = users.filter(user => (user.email === to));
             recpid = userObject["0"]["uid"];
           }
           //Setter avsender til bruker som sender
           const senderid = this.props.authUser.uid;
           const first = true;
           const read=0;
           //Får tilbake messageID fra skriving til firebase
           const messageID = this.props.firebase.messages().push({
             senderid,
             recpid,
             content,
             first,
             read}).getKey();
          if (recpid === "Veileder" || recpid === "Alle" || recpid === "Admin") {
          } else {
              //Dersom mottaker ikke er veileder,alle eller admin så opprettes et samtaleobjekt med meldingen.
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

//Lister brukere i databasen
UserList ({users}) {
    return (
        <div>
            {users.map(user => (
                    <span key={user.uid}>
                        <Typography variant="body1" gutterBottom style={{padding:4}}>
                            <strong> E-post:</strong> {user.email}
                        </Typography>
                        <Typography variant="body1" gutterBottom style={{padding:4}}>
                            <strong>Fullt navn:</strong> {user.fullName}
                        </Typography>
                        <Typography variant="body1" gutterBottom style={{padding:4}}>
                            <strong>Rolle:</strong> {user.role}
                        </Typography>
                        <br/>
                    </span>
            ))}
        </div>
    );
}

    render() {

       const { content, loading, search, users} = this.state;
       const isInvalid = content === '';
       const role=this.props.authUser.role;
       const userList=this.UserList({users});

      return (
        <div className="newMessageContent">
        <form onSubmit={this.onSubmit}>
          <div>
            {role === ROLES.USER?null: <Typography variant="body1" gutterBottom style={{padding:15}}>Brukersøk (NB: Case-sensitiv)</Typography>}
          </div>
                <TextField value={role===ROLES.USER?ROLES.COUNSELOR:search}
                           className="recieverField"
                   label={role===ROLES.USER?"Veileder":"Epost til mottaker"}
                   onChange={this.onSearch}
                   name="to"
                   type="text"
                   disabled={role===ROLES.USER}
                           style={{color:"#3F51B5",margin:10,width: "30%"}}
                           variant="outlined"
            />
            <br/>
                <TextField value={content}
                           className="newMessageArea"
                       label="Skriv din melding her"
                           multiline
                           rows="3"
                           autoComplete={"off"}
                       onChange={this.onContent}
                       name="content"
                           style={{color:"#3F51B5",margin:10,width: "30%"}}
                           variant="outlined"
                       />
                       <br/>
                       <Button variant="contained" style={{padding:15,marginTop:25}} disabled={isInvalid} type="submit">Send </Button>
        </form>
          {role === ROLES.USER?<Typography variant="body1" gutterBottom>Du kan kun sende melding til {ROLES.COUNSELOR}</Typography>:
          (<div>
              {!loading && <div ref="ListUsers"><br/><Typography variant="body1" gutterBottom>Du kan sende til disse brukerne:</Typography><br/>{userList}</div>}
            {this.state.error}
          </div>)}
        </div>


)
}
}

//Wrapper klassen i en consumer som gir tilgang til authUser
//Setter en condition som forhindrer siden i å laste før authUser er registrert.
const condition=authUser => ! !authUser;

export default compose(withFirebase,withAuthorization(condition))(NewMessage);
