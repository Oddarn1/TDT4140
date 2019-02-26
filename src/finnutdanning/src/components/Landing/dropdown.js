import React, {Component} from 'react';

class Dropdown extends Component{
    constructor(props){
        super(props);
    }


    render(){

        // Henter json-filen som har alle mulige interesser og koblingen til studieretninger
        var jsonData = require('../../data/interests');
        
        // Oppretter tomt array for å lagre interesser
        var interests = [];

        Object.keys(jsonData).forEach(function(interest){
            interests.push(interest)
        });

        const menu = interests.map(interest=>
            <button value = {interest} onClick = {this.props.capture}>{interest}</button>);
        
        return(
            <div>
                {menu}
            </div>
        )
    }
}

export default Dropdown;