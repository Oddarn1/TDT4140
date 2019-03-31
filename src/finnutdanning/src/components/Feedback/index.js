import React, {Component} from 'react';
import {withFirebase} from "../Firebase";
import * as ROLES from '../../constants/roles';
import {compose} from 'recompose';
import {withAuthentication} from '../Session';
import * as ROUTES from "../../constants/routes";
import Fab from "@material-ui/core/Fab/Fab";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {Link} from "react-router-dom";
import './index.css';


const INITIAL_STATE = {
  to: "",
  from: "",
  content: ""

};

class Feedback extends Component{
  constructor(props){
    super(props);
    this.state={...INITIAL_STATE};
    this.onChange=this.onChange.bind(this);
  }

  onChange(event){
       this.setState({[event.target.name]:event.target.value});
       }



       onSubmit = event => {
         event.preventDefault();
         let {content, to, from} = this.state;
         to=ROLES.ADMIN;
         from = this.props.firebase.auth.currentUser?this.props.firebase.auth.currentUser.uid:from;
         let sender;
         if (from === ''){
           sender = 'Anonym';
         } else {
           sender = from;
         }
         const senderid = sender;
         const read = 0;
         const first = true;
         const recpid = to;
         this.props.firebase.messages().push({senderid, recpid, content, read, first})
         .then(() => {
           this.setState({...INITIAL_STATE});
         }).catch(error=>console.log(error));
       };

  render() {

      const {from, content} = this.state;
      const isInvalid = content === '';


    return (
      <div className="feedbackContent">
      <form onSubmit={this.onSubmit}>

          <TextField value={ROLES.ADMIN}
              name="to"
              disabled
                     label="Til"
                     style={{color:"#3F51B5",margin:10,width: "30%"}}
                     variant="outlined"
              />
              <br/>
          <TextField value={this.props.firebase.auth.currentUser ? this.props.firebase.auth.currentUser.email:from}
              label="Din epost"
              onChange={this.onChange}
              name="from"
                     style={{color:"#3F51B5",margin:10,width: "30%"}}
                     variant="outlined"
              />
              {this.props.firebase.auth.currentUser ? null:
                  <Typography variant="body1" gutterBottom> Fyll inn eposten din dersom du ønsker å bli kontaktet angående feilen du melder, <br/>
                  hvis ikke lar du epost-feltet stå tomt.</Typography>}
              <br/>

          <TextField value={content}
                label="Tilbakemelding"
                     multiline
                     rows="3"
                onChange={this.onChange}
                name="content"
                     autoComplete={"off"}
                     style={{color:"#3F51B5",margin:10,width: "30%"}}
                     variant="outlined"
                />
                <br/>

                <Button variant="contained" style={{padding:15,marginTop:25}} disabled={isInvalid} type="submit">Send </Button>
      </form>
      </div>
    )
  }
}

const FeedbackButton=()=>(
    <Link className="feilmelding" to={ROUTES.FEEDBACK}>
        <Fab style={{backgroundColor:"#3F51B5",color:"white"}}>
            Meld feil
        </Fab>
    </Link>
);

export default compose(withAuthentication,withFirebase)(Feedback);

export {FeedbackButton};
