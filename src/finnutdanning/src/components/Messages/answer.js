import React, {Component} from 'react';
import withAuthorization from "../Session/withAuthorization";
import './index.css';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';


class Answer extends Component{
    constructor(props){
        super(props);
        this.state={
            answerText:""
        };
        this.onChange=this.onChange.bind(this);
        this.submit=this.submit.bind(this);
    }


    submit(event){
        event.preventDefault();
        const conv=this.props.conversation;
        const message={
            content:this.state.answerText,
            first:false,
            recpid:this.props.authUser.uid===conv['participant1']?conv['participant2']:conv['participant1'],
            senderid: this.props.authUser.uid,
            read:0
        };
        const key=this.props.firebase.messages().push(message).key;
        conv['msgids'].push(key);
        this.props.firebase.conversation(conv['convid']).update({
                msgids: conv['msgids']
            })
            .catch(error=>console.log(error));
        this.setState({answerText:""});
        this.props.update();
    }


    onChange(event){
        event.preventDefault();
        this.setState({[event.target.name]:event.target.value})
    }

    render(){
        const {answerText}=this.state;
        const isInvalid=answerText==="";
        return(
            <div className="answerBox">
                <form onSubmit={this.submit}>
                <TextField
                    variant="outlined"
                    className="answerField"
                    autoComplete={"off"}
                    style={{backgroundColor:"white"}}
                    disabled={this.props.conversation.participant1==="Anonym"||
                this.props.conversation.participant1.includes("@")}
                          name="answerText"
                          label={this.props.conversation.participant1==="Anonym"||
                this.props.conversation.participant1.includes("@")?"Du kan ikke svare direkte på denne":
                              "Skriv ditt svar her"}
                          onChange={this.onChange}
                          value={this.state.answerText}/>
                <Button style={{backgroundColor:"#1c80e5",
                color: "white",
                height: "available"}}
                    className="sendAnswer" type="submit" disabled={isInvalid}>Send</Button>
                </form>
            </div>
        )
    }
}

const condition = authUser=> ! !authUser;

export default withAuthorization(condition)(Answer);