import React,{Component} from 'react';
import {withFirebase} from '../Firebase';

class AdminMessage extends Component{
    constructor(props){
        super(props);
        this.state={
            messages:[],
            content:"",
        }
    }

    componentDidMount(){
        let messages=[];
        this.props.firebase.messages().orderByChild("recpid").equalTo("Alle").once('value',s=> {
            const obj = s.val();
            if (obj === null) {
                return;
            }
            messages = Object.keys(obj).map(key=>({
                ...obj[key],
                msgid:key
            }));
            this.setState({messages: messages})
        }).catch(error=>console.log(error))
    }

    componentWillUnmount(){
        this.props.firebase.messages().off();
    }

    showMessage=event=>{
        this.setState({content:this.state.messages[event.target.value].content});
    };


    MessageList({messages}){
        return(
            <ul>
                {messages.map((message,index)=>
                    <li key={message.msgid}><button value={index} onClick={this.showMessage}>{message.content.length>=50?message.content.substr(0,50)+"...":message.content}</button> </li>
                )}
            </ul>
        )
    }

    render(){
        const {messages}=this.state;
        const msglist=this.MessageList({messages});
        return(
            <div>
                {msglist}
                {this.state.content!==""&&<div><textarea disabled value={this.state.content}/>
                    <button disabled> Du kan ikke svare på denne meldingen</button></div>}
            </div>
        )
    }
}

export default withFirebase(AdminMessage);