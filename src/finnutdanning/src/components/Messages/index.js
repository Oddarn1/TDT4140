import React, {Component} from 'react';
import withAuthorization from "../Session/withAuthorization";

class Messages extends Component {
    constructor(props){
        super(props);
        this.state={
            messages:[],
            loading: false
        }
    }

    //Laster inn ALLE meldinger i databasen. Snapshot er verdien som hentes inn, hentes ut som en objekt-liste ved .val().
    //Settes til messages i state.
    componentDidMount(){
        this.setState({loading: true});
        //.messages() er definert i firebase.js. Det samme er også .message(msgid) som kan hente ut spesifikke id-er på
        // samme vis.
        this.props.firebase.messages().on('value',snapshot => {
            const messageObject=snapshot.val();

            if (messageObject===null) {
                return;
            }
            const messageList = Object.keys(messageObject).map(key => ({
                ...messageObject[key],
                msgid: key,
            }));

            this.setState({
            messages: messageList,
            loading: false})
            }
        )
    }

    //Skrur av listener som opprettes i ComponentDidMount.
    componentWillUnmount(){
        this.props.firebase.messages().off();
    }

    //Mapper meldingsobjekter til en liste, kan reformateres senere. attributter kan hentes på message.*attributt*.
    MessageList({messages}) {
        return (
            <ul>
                {messages.map(message => (
                    <li key={message.msgid}><span>{message.content}</span></li>
                    ))}
            </ul>
        )
    }



    render(){
        const {loading,messages}=this.state;
        const messageList=this.MessageList({messages});
        return(
            <div>
                {/*Setter siden til loading mens meldingene lastes inn*/}
                {loading && <p>Loading</p>}
                {messageList}
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