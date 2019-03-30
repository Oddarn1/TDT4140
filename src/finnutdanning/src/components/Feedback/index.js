import React, {Component} from 'react';
import {withFirebase} from "../Firebase";
import * as ROLES from '../../constants/roles';
import {compose} from 'recompose';
import {withAuthentication} from '../Session';


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
      <div>
      <form onSubmit={this.onSubmit}>

      <label>Til </label>
          <input value={ROLES.ADMIN}
              name="to"
              disabled
              />
              <br/>




      <label>Fra </label>
          <input value={this.props.firebase.auth.currentUser ? this.props.firebase.auth.currentUser.email:from}
              placeholder="Din epost"
              onChange={this.onChange}
              name="from"
              />
              {this.props.firebase.auth.currentUser ? null:
                  <label> Fyll inn eposten din dersom du ønsker å bli kontaktet angående feilen du melder</label>}
              <br/>

          <textarea value={content}
                placeholder="Tilbakemelding"
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

export default compose(withAuthentication,withFirebase)(Feedback);
