import React, {Component} from 'react';
import {withFirebase} from '../Firebase';

class Dropdown extends Component{

    constructor(props) {
      super(props);
      this.state = {
        interests : Object,
        loading : false
      }
    };

    componentDidMount(){

    this.setState({ loading: true });
    this.props.firebase.interests().once('value', snapshot => {
        const interestObjects = snapshot.val();
        this.setState({
            interests: interestObjects,
            loading: false
        });
    });
  }

  componentWillUnmount() {
    this.props.firebase.interests().off();
  }


    render(){

        const {interests}=this.state;

        // Oppretter tomt array for å lagre interesser
        var interestList = [];

        // Fyller arrayet med alle mulige interesser

        if (interests != null) {
            Object.keys(interests).forEach(function(interest) {
              interestList.push(interest);
            })
        };

        // Lager HTML-liste med alle knappene som skal lages
        var allButtons = interestList.sort().map((interest) =>
            <button value = {interest} onClick = {this.props.capture}>{interest}</button>
        );

        return(
            // Itererer gjennom alle interessene for å lage knapper
            <div className="buttons">
                {allButtons}
            </div>
        )
    }
}

export default withFirebase(Dropdown);
