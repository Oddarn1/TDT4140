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
    ConversationList({conversations}) {
        return (
            <ul>
                {conversations.map(conversation => (
                    <li key = {conversation.convid}><span>{conversation.participant1}</span></li>
                ))}
            </ul>
        )
    }



    render(){
        const {loading,conversations}=this.state;
        const conversationList = this.ConversationList({conversations});
        return(
            <div>
                {/*Setter siden til loading mens meldingene lastes inn*/}
                {loading && <p>Loading</p>}
                {conversationList}
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