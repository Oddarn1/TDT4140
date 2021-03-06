import React, {Component} from 'react';
import withAuthorization from "../Session/withAuthorization";
import {withFirebase} from '../Firebase';
import {compose} from 'recompose';
import * as ROLES from "../../constants/roles";
import './index.css';
import red from '@material-ui/core/colors/red'

const primary = red[500];

class Blackboard extends Component {

  constructor(props) {
    super(props);

    // Denne linjen gjør at props kan brukes i funksjonen assignMe.
    this.assignMe = this.assignMe.bind(this);
    this.state = {
      messages : Object,
      sroles : Object,
      loading : false,
      user: String,
      role: String
    };
  };

  /**Under hentes følgende data: Brukerens rolle,
  alle meldingene, og rollen til alle de som sendte meldingen.
  */
  componentDidMount(){
    this.setState({ loading: true });

    var component = this;
    var messageObjects;
    var curRole;
    var senderRoles = {};
    this.props.firebase.messages().once('value', snapshot => {
        messageObjects = snapshot.val();
        const userID = this.props.firebase.auth.currentUser.uid;
        this.props.firebase.role(userID).once('value', snapshot2 => {
          curRole = snapshot2.val();
          Object.keys(messageObjects).forEach(function (message) {
            try {
                component.props.firebase.role(messageObjects[message]["senderid"]).once('value', snapshot3 => {
                    var obj = {};
                    obj[message] = snapshot3.val();
                    Object.assign(senderRoles, obj);
                    component.setState({
                        messages: messageObjects,
                        sroles: senderRoles,
                        loading: false,
                        user: component.props.firebase.auth.currentUser.uid,
                        role: curRole
                    });
                });
            }catch{
                var obj={};
                obj[message]="Gjest";
                Object.assign(senderRoles, obj);
                component.setState({
                    messages: messageObjects,
                    sroles: senderRoles,
                    loading: false,
                    user: component.props.firebase.auth.currentUser.uid,
                    role: curRole
                });
            }});
        });
    });
  };

  componentWillUnmount() {
    this.props.firebase.messages().off();
    this.props.firebase.role().off();
  }

  // Denne funksjonen starter når en av meldingsknappene trykkes.
  // "Event" er koblet opp mot selve knappen og kan da brukes
  // til å hente verdier (event.target.value).
  showMessage(event){

    // Her henter vi innholdet i meldingen.
    const content = event.target.value;

    // Her henter vi nøkkelen til meldingen for å senere hente
    // akkurat den fra databasen.
    const key = event.target.getAttribute('data-value');

    // På de to neste linjene endrer vi verdien på tekstområdet
    // og "min"-knappen får nå nøkkelen som den da kan sendes til
    // assignMe-funksjonen.
    document.getElementById("textarea").value = content;
    document.getElementById("assignBtn").value = key;
  };

  // Denne funksjonen oppdaterer meldingen sin recpid i databasen til
  // den veilederen som er innlogget og har trykket "Min".
  assignMe(event) {
  try{
    if (event.target.value !== 0) {
      // Denne linjen skjuler meldingen som har blitt valgt av veileder.
      document.getElementById(event.target.value).style.display = "none";

      const key = event.target.value;

      // Her skjer den faktiske oppdateringen på databasen.
      this.props.firebase.recpid(key).set(this.state.user);
      document.getElementById("textarea").value = "";
      event.target.value = 0;

      var conversationsRef = this.props.firebase.conversations();
      var newConversationRef = conversationsRef.push();
      newConversationRef.set({
        msgids: {
          0 : key
        },
        participant1: document.getElementById(key).getAttribute('data-value2'),
        participant2: this.state.user,
          read: 0
      });
    }}catch(error){
    console.log(error)}
  }

  render() {

    const {messages, sroles, loading, role}=this.state;
    console.log(sroles);

    var messageList = [];
    // Dersom det er meldinger og antall tilhørende roller er det samme.
    if (Object.keys(messages).length !== 0 && Object.keys(sroles).length === Object.keys(messages).length) {

      Object.keys(messages).forEach(function (message) {
        // Her sjekker vi alle meldingen og om hvilken av de som ikke har en
        // recpid.
        if (role === "Veileder") {
          if ((messages[message]["recpid"] === "Veileder")) {
          // Her lages en liste med alle meldingene som er relevante for tavlen.
            messageList.push({
              key : message,
              content: messages[message]["content"],
              senderid: messages[message]["senderid"]
            });
          }
        } else if (role === "Admin") {
            if ((messages[message]["recpid"] === "Admin")) {
            // Her lages en liste med alle meldingene som er relevante for tavlen.
              messageList.push({
                key : message,
                content: messages[message]["content"],
                senderid: messages[message]["senderid"],
                srole: sroles[message]
              });
            }
          }
      });

      /** Sortering av meldingene slik at veiledermeldingene kommer øverst
      i vedlikeholdstavla.
      */
      if (role === "Admin") {
        messageList.sort(function (a, b) {
          if ((a.srole !== "Veileder" && b.srole !== "Veileder") || a.srole === b.srole) {
            return 0;
          }
          if (a.srole === "Veileder") {
            return -1;
          }
          if (b.srole === "Veileder") {
            return 1;
          }
        });
      }

        // Slutten av loopen
        var messageButtons = messageList.map((message) =>
            //Lengden på denne må være like lang som lengden på en header.
            <button id = {message.key} type = "button" data-value = {message.key} data-value2 = {message.senderid} value = {message.content} onClick = {this.showMessage} className="messageButton">

            {message.content.substr(0, 30)}

            </button>
        );
      }
        console.log(messageList);


    return(
      <div className="blackBoard">
        <h1>Meldingstavle: </h1>

          {!loading &&<div className="buttonDiv">
          {messageButtons}
        </div>}
          {loading && <div>Loading ...</div>}
        <div className="textAreaDiv">

          <textarea rows="4" cols="50" disabled name = "Melding:" id = "textarea" value = "">

          </textarea>
          <button type = "button" id = "assignBtn" color = "primary" value = {0} variant = "contained" data-value = "" onClick = {this.assignMe}>Jeg tar denne!</button>
        </div>
      </div>
    );

  };
}

/*Kun brukere som er logget inn som veileder eller admin har tilgang til meldingstavlen*/
const condition = authUser =>
    authUser && (authUser.role===ROLES.COUNSELOR || authUser.role===ROLES.ADMIN);

export default compose(
    withFirebase,
    withAuthorization(condition),)(Blackboard);
