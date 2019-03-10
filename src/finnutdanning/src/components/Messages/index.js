import React, {Component} from 'react';
import {withAuthorization} from "../Session";

class Messages extends Component {
    constructor(props){
        super(props);
        this.state={
            messages:[], //Vil inneholde siste melding i hver samtale for å displaye dette
            loading: false,
            conversations: []
        };
        this.getConversationsFromUid = this.getConversationsFromUid.bind(this);
    }

    //Laster inn ALLE meldinger i databasen. Snapshot er verdien som hentes inn, hentes ut som en objekt-liste ved .val().
    //Settes til messages i state.
    componentDidMount(){
        this.getConversationsFromUid(this.props.firebase.auth.currentUser.uid);
        let messages=[];
        for(let i = 0; i < this.state.conversations.length; i++){
            messages.push(this.state.conversations[i].msgids[this.state.conversations[i].msgids.length - 1]);
        }
        this.setState({messages});
    }

    //Skrur av listener som opprettes i ComponentDidMount.
    componentWillUnmount(){
        this.props.firebase.messages().off();
    }
    
    //Henter inn en liste med samtaler hvor en gitt bruker er en deltaker
    getConversationsFromUid(uid){
        this.setState({
            loading: true
        });
        this.props.firebase.conversations().orderByChild("participant1").equalTo(uid).on("value", snapshot => {
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
            })
        })
    }


    //Mapper samtaleobjekter til en liste med knapper
    ConversationList({conversations, messages}) {
        var conversationList = []
        for(let i = 0; i < conversations.length; i++)
            conversationList.push(
                <button>{messages[i].content}</button>
            )
        return (
            <ul>
            {conversationList.map((conversation) =>
            <li>{conversation}</li>
            )}
            </ul>
        )
    }



    render(){
        const {loading,conversations, messages}=this.state;
        const conversationList = this.ConversationList({conversations, messages});
        return(
            <div>
                {/*Setter siden til loading mens meldingene lastes inn*/}
                {loading && <p>Loading</p>}
                {conversationList}
                {messages[0].content}
                {/*Sprint 2 TODO:
      * Create a messaging service, connection to a firebase with stored messages. General messages to counselor
      * can be accessed by all counselors, messages from counselors and admin to users can only be accessed by
      * that user.*/}
                [Placeholder for meldingsboks]
            </div>
        )
    }
}


const condition =authUser => ! !authUser;

export default withAuthorization(condition)(Messages);