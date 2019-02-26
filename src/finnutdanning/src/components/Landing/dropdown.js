import React, {Component} from 'react';

class Dropdown extends Component{
    constructor(props){
        super(props);
    }


    render(){

        // Henter json-filen som har alle mulige interesser og koblingen til studieretninger
        var jsonData = require('../../data/interests');
        
        // Oppretter tomt array for å lagre interesser
        var interests = []

        // Fyller arrayet med alle mulige interesser
        Object.keys(jsonData).forEach(function(interest){
            interests.push(interest)
        })

        // Lager HTML-liste med alle knappene som skal lages
        var allButtons = interests.sort().map((interest) =>
            <button value = {interest} onClick = {this.props.capture}>{interest}</button>
        )
        
        return(
            // Itererer gjennom alle interessene for å lage knapper
            <div>
                {allButtons}
            </div>
        )
    }
}

export default Dropdown;