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
            user:"",
        };
        this.userFromUid=this.userFromUid.bind(this);
    }

    componentWillReceiveProps(nextProps,nextContent){
        if (nextProps.conversation!==this.props.conversation){
            this.componentDidMount();
            this.props.firebase.messages().off();
            console.log(this.state.user);
            console.log(this.state.messages);
        }
    }

    //Ved mounting av funksjon (kallet i messages/index)
    /*Promises benyttes som en sekvensiell try/catch-blokk i hovedsak, en .then kan ikke gjøre noe før funksjonen før
    * er gjennomført, en siste catch for å fange alle errors i promisene*/
    componentDidMount(){
        this.setState({loading:true});
        const msg=[];
        //Henter props fra komponetkall i index
        const conv=this.props.conversation;
        //Henter ut en liste med promises for hvert objekt i listen fra props.
        const messagePromises=conv.msgids.map(msgid=>{
            return this.props.firebase.message(msgid).once('value',s=>s)
        });
        //Resolver alle promises i listen.
        Promise.all(messagePromises)
        //Oppretter nytt promise for messageobjektet i messagePromises, henter ut dataen fra message som en snapshot
            .then(messages=> {
                messages.map(message=>{
                    const obj=message.val();
                    //Pusher til listen som defineres i toppen
                    msg.push(obj);
                })
                //Ny promise for å sette state og gjøre endringer, dette kommer etter forrige promise er resolved (gjennomført)
            }).then(()=>{
                this.setState({messages:msg,
                loading: false,});
            this.userFromUid();
                }
            )
            //Fallback dersom promisene ikke gjennomføres
            .catch(error=>
        console.log(error))
    }

    componentWillUnmount(){
        this.props.firebase.messages().off();
        this.props.firebase.users().off();
    }

    //Leser inn meldingslisten fra state, endrer senderid til navnet på avsender. Benytter også promises.
    //Tar utgangspunkt i at å svare på en melding henter inn participant1 eller participant2 som mottager.
    userFromUid(){
        let {messages}=this.state;
        messages.map(message=>{
            this.props.firebase.user(message.senderid).once('value',snapshot=>{
                message['senderid']=snapshot.val()['fullName'];
            }).then(()=>
                this.setState({messages})
            ).catch(error=>
            console.log(error))
        })
    }


    //Mapper meldinger til en liste for å displaye i innboks.
    ConvList(){
        return (
            <ul>
                {this.state.messages.map(message=>(

                    <li key={message.msgid}>
                        <div>
                        <span><strong>Fra: </strong>{message.senderid}</span><br/>
                        <span><strong> Innhold: </strong>{message.content}</span>
                        </div>
                    </li>
                ))}
            </ul>
        )
    }

    render(){
        const ConvList=this.ConvList();
        return(
            <div className="inbox">
                {!this.state.loading && <div>{ConvList}</div>}
            </div>
        )
    }
}

export default withFirebase(Inbox);