import React, {Component} from 'react';
import {withAuthorization} from "../Session";
import Inbox from './messageInbox';
import * as ROUTES from '../../constants/routes';
import {Link} from 'react-router-dom';
import AdminMessage from "./adminMsg";
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

/*TODO: Egen meldingsboks for sist sendte og sist mottatte meldinger*/
const INITIAL_STATE={
    messages:[],
    loading: false,
    conversations: [],
    activeMessages: null,
    names:[],
    activeButton:-1,
    messageToggle:0,
    renderCount:0,
};

class Messages extends Component {
    constructor(props){
        super(props);
        this.state={
            messages:[], //Vil inneholde siste melding i hver samtale for å displaye dette
            loading: false,
            conversations: [],
            names:[],
            activeButton:-1,
            activeMessages: null,
            renderCount:0,
            messageToggle:false,
        };
        this.getConversationsFromUid = this.getConversationsFromUid.bind(this);
        this.getMessageFromID=this.getMessageFromID.bind(this);
        this.openConversation=this.openConversation.bind(this);
        this.update=this.update.bind(this);
        this.getNames=this.getNames.bind(this);
        this.messageView=this.messageView.bind(this);
    }

    //Laster inn ALLE meldinger i databasen. Snapshot er verdien som hentes inn, hentes ut som en objekt-liste ved .val().
    //Settes til messages i state.
    componentDidMount(){
        this.getConversationsFromUid(this.props.authUser.uid);
    }

    //Leser inn navn og endrer message-objektet så navn kan displayes
    getNames(){
        const {messages}=this.state;
        console.log(messages);
        const userpromises=messages.map(message=>{
            const uid=message.senderid===this.props.authUser.uid?message.recpid:message.senderid;
            return this.props.firebase.user(uid).once('value',s=>s);
        });
        Promise.all(userpromises)
            .then(userList=>
                userList.map(snapshot=>{
                    this.setState(prevState=>({
                    names:[...prevState.names,snapshot.val()['fullName']]
                }))
                })
            ).catch(error=>console.log(error))
    }

    getMessageFromID(){
        const convs=this.state.conversations.reverse();
        const messagepromises=convs.map(conv=>{
            return this.props.firebase.message(conv.msgids[conv.msgids.length -1]).once('value',s=>s);
        });
        Promise.all(messagepromises)
            .then(messagelist=>
            messagelist.map(snapshot=>{{this.setState(prevState => ({
                messages: [...prevState.messages, snapshot.val()]
            }))}}))
            .then(()=>this.getNames())
            .catch(error=> console.log(error));
        }

    //Skrur av listener som opprettes i ComponentDidMount.
    componentWillUnmount(){
        this.setState({...INITIAL_STATE});
        this.props.firebase.messages().off();
        this.props.firebase.users().off();
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
                this.setState({loading:false})})
                .catch(error=>console.log(error))
        }

    //Endrer renderCount for å tvinge remount av Inbox
    openConversation(event){
        event.preventDefault();
        if(event.target.value!==this.state.activeButton) {
            document.getElementById("conversation" + event.target.value).style.backgroundColor = "#cccccc";
            if(this.state.activeButton!==-1) {
                document.getElementById("conversation" + this.state.activeButton).style.backgroundColor = "white";
            }
        }
        let convmessages=this.state.conversations[event.target.value];
        this.setState({activeMessages:convmessages,
            activeButton:event.target.value,
            renderCount:this.state.renderCount+1});
        if(this.state.messages[event.target.value].recpid===this.props.authUser.uid){
            this.props.firebase.message(convmessages['msgids'][convmessages.msgids.length-1]).update({read: 1})
                .then(this.forceUpdate())
                .catch(error => console.log(error))
    }}

    messageDisplay(message){
        let content=message.content.length>=32?message.content.substr(0,29)+"...":message.content;
        if (message.senderid===this.props.authUser.uid){
            if(message.read){
                content=message.content.length>=27?"Deg: "+message.content.substr(0,24)+"..."+"\u0020\u2713":"Deg: "+message.content+"\u0020\u2713";
            }else{
                content=message.content.length>=27?"Deg: "+message.content.substr(0,24)+"...":"Deg: "+message.content;
            }
        }
        return content;
    }

    //Mapper samtaleobjekter til en liste med knapper
    ConversationList({messages}) {
        return (
            <div className="inboxContent">
            {messages.map((message,index) =>
                    <button id={"conversation"+index} value={index} onClick={this.openConversation}
                            style={{fontWeight:(message.recpid===this.props.authUser.uid&&!message.read)?'bold':'normal'}}>
                        {this.state.names[index]}
                        <br/>
                        {this.messageDisplay(message)}
                        </button>
            )}
            </div>
        )
    }

    //Workaround for å oppdatere meldingsinnboksen uten å refreshe siden
    update(){
        this.setState({renderCount:this.state.renderCount+1})
    }

    //Endrer state som sier noe om hva som skal synes av systemmeldinger og samtaler
    messageView(event){
        event.preventDefault();
        this.setState({
            messageToggle: event.target.value,
            renderCount:this.state.renderCount+1,
        })
    }


    render(){
        const {loading, messages}=this.state;
        const conversationList = this.ConversationList({messages});
        return(
            <div className="messageContent">
                <Typography component="h5" variant="h5" gutterBottom style={{padding:20}}>
                    Mine meldinger
                </Typography>
                <div className="messageToggleDiv" key={this.state.renderCount}>
                    <button onClick={this.messageView} id={"samtaler"} value={false}
                            className="toggleMessage" style={{backgroundColor: !this.state.messageToggle?"white":"lightblue"}}>Mine Samtaler</button>
                    <button onClick={this.messageView} id={"system"} value={true}
                            className="toggleMessage" style={{backgroundColor: this.state.messageToggle?"white":"lightblue"}}>Systemmeldinger</button>
                </div>
                <div>
                    {!loading && conversationList}
                </div>
                <div className="messageWindow">
                {this.state.activeMessages?
                        <Inbox updateParent={this.update} key={this.state.renderCount} conversation={this.state.activeMessages}/>
                        :null
                }
                </div>
                <br/>
                <Link to={ROUTES.NEWMESSAGE}>
                    <button>Ny melding</button>
                </Link>
                <br/>
                    <Typography component="h5" variant="h5" gutterBottom style={{padding:20}}>
                        Systemmeldinger
                    </Typography>
                <AdminMessage/>
            </div>
        )
    }
}


const condition =authUser => ! !authUser;

export default withAuthorization(condition)(Messages);
