/*Midlertidig lagring av kall til firebase for å hente ut meldinger. Vil bli brukt til å hente meldinger fra samtale
som blir valgt i index
 */
import React,{Component} from "react";
import {withFirebase} from "../Firebase";
import './index.css';

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
                },()=> {this.setState({loading:false,});
                this.userFromUid();});
                }
            )
            //Fallback dersom promisene ikke gjennomføres
            .catch(error=>
        console.log(error));
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
            <div className="inbox">
                {this.state.messages.map(message=>(
                        <div>
                        <span><label> Fra: </label><br/><input disabled value={message.senderid}/></span><br/>
                        <span><label> Innhold: </label><br/><textarea value={message.content} disabled/></span>
                        </div>
                ))}
            </div>
        )
    }

    render(){
        const ConvList=this.ConvList();
        const {loading}=this.state;
        return(
            <div className="inbox">
                {!loading && <div>{ConvList}</div>}
            </div>
        )
    }
}

export default withFirebase(Inbox);