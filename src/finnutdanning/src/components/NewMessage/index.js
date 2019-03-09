import React, {Component} from 'react';
import withAuthorization from "../Session/withAuthorization";




class NewMessage extends Component{
     constructor(props){
        super(props);
        this.state={
            to: "",
            subject: "",
            content: ""
        };
        this.onChange=this.onChange.bind(this);
}

       onChange(event){
       this.setState({[event.target.name]:event.target.value});
       }
       




    render() {


      return (

        <div>
        <label>Til </label>
                <input value={this.state.to}
                       placeholder="Mottakere"
                       onChange={this.onChange}
                       name="to"
                       />
                       <br/>


                <input value={this.state.subject}
                       placeholder="Emne"
                       onChange={this.onChange}
                       name="subject"
                       />
                       <br/>


                <textarea value={this.state.content}
                       placeholder="Skriv din melding her"
                       onChange={this.onChange}
                       name="content"
                       />
                       <br/>

                       <button type="submit">Send </button>



        </div>
      )



    }

}

const condition =authUser => ! !authUser;

export default withAuthorization(condition)(NewMessage);
