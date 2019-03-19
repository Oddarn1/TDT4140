import React, {Component} from 'react';
import withAuthorization from "../Session/withAuthorization";


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
            <div>
                <form onSubmit={this.submit}>
                <textarea name="answerText" placeholder="Skriv ditt svar her" onChange={this.onChange} value={this.state.answerText}/>
                <button type="submit" disabled={isInvalid}>Send</button>
                </form>
            </div>
        )
    }
}

const condition = authUser=> ! !authUser;

export default withAuthorization(condition)(Answer);