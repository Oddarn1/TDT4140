import React, {Component} from 'react';
import {withAuthorization} from "../Session";
import Inbox from './messageInbox';
import * as ROUTES from '../../constants/routes';
import {Link} from 'react-router-dom';
import AdminMessage from "./adminMsg";


/*TODO: Egen meldingsboks for sist sendte og sist mottatte meldinger*/
const INITIAL_STATE={
    messages:[],
    loading: false,
    conversations: [],
    activeMessages: null,
    renderCount:0,
};

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
        this.update=this.update.bind(this);
    }

    //Laster inn ALLE meldinger i databasen. Snapshot er verdien som hentes inn, hentes ut som en objekt-liste ved .val().
    //Settes til messages i state.
    componentDidMount(){
        this.getConversationsFromUid(this.props.authUser.uid);
    }

    getMessageFromID(){
        const convs=this.state.conversations;
        const messagepromises=convs.map(conv=>{
            return this.props.firebase.message(conv.msgids[conv.msgids.length -1]).once('value',s=>s);
        });
        Promise.all(messagepromises)
            .then(messagelist=>
            messagelist.map(snapshot=>{{this.setState(prevState => ({
                messages: [...prevState.messages, snapshot.val()]
            }))}}))
            .catch(error=> console.log(error));
        }

    //Skrur av listener som opprettes i ComponentDidMount.
    componentWillUnmount(){
        this.setState({...INITIAL_STATE});
        this.props.firebase.messages().off();
    }

    sortConversations(){
        const conversations=[];
        this.state.conversations.map(conv=>{
            conv['read']?conversations.push(conv):conversations.unshift(conv);
        });
        this.setState({conversations});
    }

    //Henter inn en liste med samtaler hvor en gitt bruker er en deltaker
    getConversationsFromUid(uid){
        this.setState({
            loading: true
        });
        const parts=['participant1','participant2'];
        const convpromises=parts.map(part=>{
            return this.props.firebase.conversations().orderByChild(part).equalTo(uid).once('value',s=>s)
        });
        Promise.all(convpromises)
        //Tar inn liste med datasnapshots, mappes til snap.val();
            .then(convo=>{
                convo.map(snap=>{
                    const obj=snap.val();
                    if (obj===null){
                        return;
                    }
                    const convList=Object.keys(obj).map(key=>({
                        ...obj[key],
                        convid:key,
                    }));
                    convList.map(conv=>{
                        this.setState(prevState => ({
                            conversations: [...prevState.conversations, conv]
                        }))
                    });
                })
            })
            .then(()=>this.getMessageFromID())
            .then(()=>{this.forceUpdate();
                this.setState({loading:false});})
                .catch(error=>console.log(error))
        }

    //Endrer renderCount for å tvinge remount av Inbox
    openConversation(event){
        event.preventDefault();
        let convmessages=this.state.conversations[event.target.value];
        this.setState({activeMessages:convmessages,
            renderCount:this.state.renderCount+1});
        console.log(convmessages);
        if(this.state.messages[event.target.value].recpid===this.props.authUser.uid){
            this.props.firebase.message(convmessages['msgids'][convmessages.msgids.length-1]).update({read: 1})
                .then(this.forceUpdate())
                .catch(error => console.log(error))
    }}


    //Mapper samtaleobjekter til en liste med knapper
    ConversationList({messages}) {
        return (
            <ul>
            {messages.map((message,index) =>
                <li key={index}>
                    <button value={index} onClick={this.openConversation}>
                        {message.recpid===this.props.authUser.uid&&!message.read?
                        <strong>{message.content.length>=50?message.content.substr(0,50)+"...":message.content}</strong>
                            :message.recpid===this.props.authUser.uid?
                            message.content.length>=50?message.content.substr(0,50)+"...":message.content
                        :message.content.length>=50?message.content.substr(0,50)+"..."+"\u0020\u2713":message.content}
                        </button>
                </li>
            )}
            </ul>
        )
    }

    update(){
        this.setState({renderCount:this.state.renderCount+1})
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
                        <Inbox updateParent={this.update} key={this.state.renderCount} conversation={this.state.activeMessages}/>
                        :null
                }
                <br/>
                <Link to={ROUTES.NEWMESSAGE}>
                    <button>Ny melding</button>
                </Link>
                <br/>
                <h2>Systemmeldinger:</h2>
                <AdminMessage/>
            </div>
        )
    }
}


const condition =authUser => ! !authUser;

export default withAuthorization(condition)(Messages);
