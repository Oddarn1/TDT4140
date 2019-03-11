import React, {Component} from 'react';
import {withAuthorization} from "../Session";
import Inbox from './messageInbox';
import * as ROUTES from '../../constants/routes';
import {Link} from 'react-router-dom';
import * as ROLES from '../../constants/roles';

class Messages extends Component {
    constructor(props){
        super(props);
        this.state={
            messages:[], //Vil inneholde siste melding i hver samtale for å displaye dette
            loading: false,
            conversations: [],
            activeMessages: null,
            renderCount:0,
        };
        this.getConversationsFromUid = this.getConversationsFromUid.bind(this);
        this.getMessageFromID=this.getMessageFromID.bind(this);
        this.openConversation=this.openConversation.bind(this);
    }

    //Laster inn ALLE meldinger i databasen. Snapshot er verdien som hentes inn, hentes ut som en objekt-liste ved .val().
    //Settes til messages i state.
    componentDidMount(){
        this.getConversationsFromUid(this.props.firebase.auth.currentUser.uid);
    }

    getMessageFromID(msgid){
        this.props.firebase.message(msgid).on('value',snapshot=>{
            console.log(snapshot.val().content);
            let messages=this.state.messages;
            messages.push(snapshot.val());
            this.setState({messages})
        })
    }

    //Skrur av listener som opprettes i ComponentDidMount.
    componentWillUnmount(){
        this.props.firebase.messages().off();
    }
    
    //Henter inn en liste med samtaler hvor en gitt bruker er en deltaker
    getConversationsFromUid(uid){
        const query=this.props.authUser.role===ROLES.USER?'participant1':'participant2';
        this.setState({
            loading: true
        });
        this.props.firebase.conversations().orderByChild(query).equalTo(uid)
            .on("value", snapshot => {
            const convObject = snapshot.val();
            if (convObject===null) {
                return;
            }
            const convList = Object.keys(convObject).map(key =>({
                ...convObject[key],
                convid: key,
            }));

            this.setState({
                conversations: convList,
                loading: false
            });
            for (let i =0;i<this.state.conversations.length;i++) {
                let tempId = this.state.conversations[i].msgids[this.state.conversations[i].msgids.length - 1];
                this.getMessageFromID(tempId);
            }
        });
    }

    //Endrer renderCount for å tvinge remount av Inbox
    openConversation(event){
        event.preventDefault();
        console.log(this.state.conversations[event.target.value]);
        let convmessages=this.state.conversations[event.target.value];
        this.setState({activeMessages:convmessages,
        renderCount: this.state.renderCount +1})
    }


    //Mapper samtaleobjekter til en liste med knapper
    ConversationList({messages}) {
        return (
            <ul>
            {messages.map((message,index) =>
                <li key={index}> <button value={index} onClick={this.openConversation}>{message.content.substr(0,50)}</button> </li>
            )}
            </ul>
        )
    }



    render(){
        const {loading, messages}=this.state;
        const conversationList = this.ConversationList({messages});
        return(
            <div>
                <h1>Mine Meldinger</h1>
                {/*Setter siden til loading mens meldingene lastes inn*/}
                {loading && <p>Loading</p>}
                {conversationList}
                {this.state.activeMessages?
                        <Inbox key={this.state.renderCount} conversation={this.state.activeMessages}/>
                        :null
                }
                {/*Sprint 2 TODO:
      * Create a messaging service, connection to a firebase with stored messages. General messages to counselor
      * can be accessed by all counselors, messages from counselors and admin to users can only be accessed by
      * that user.*/}
      <br/>
                <Link to={ROUTES.NEWMESSAGE}>
                    <button>Ny melding</button>
                </Link>
            </div>
        )
    }
}


const condition =authUser => ! !authUser;

export default withAuthorization(condition)(Messages);