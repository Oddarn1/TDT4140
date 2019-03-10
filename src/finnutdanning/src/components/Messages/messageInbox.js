/*Midlertidig lagring av kall til firebase for å hente ut meldinger. Vil bli brukt til å hente meldinger fra samtale
som blir valgt i index
 */
import React,{Component} from "react";
import {withFirebase} from "../Firebase";

class Inbox extends Component{
    constructor(props){
        super(props);
        this.state={
            messages:[],
            loading:false,
        }
    }


    ConvList(){
        let messages=[];
        const conv=this.props.conversation;
        for(var i=0;i<conv.msgids.length;i++ ){
            this.props.firebase.message(conv.msgids[i]).once('value',snapshot=>{
                messages.push(snapshot.val());
            })
        }
        console.log(messages);
        return (
            <ul>
                {messages.map(message=>(
                    <li key={message.msgid}>
                        <span><strong>Fra: </strong>{message.senderid}</span><br/>
                        <span><strong> Innhold: </strong>{message.content}</span>
                    </li>
                ))}
            </ul>
        )
    }

    render(){
        const ConvList=this.ConvList();
        return(
            <div className="inbox">
                {ConvList}
            </div>
        )
    }
}


export default withFirebase(Inbox);