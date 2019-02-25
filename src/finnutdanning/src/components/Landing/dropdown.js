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

        Object.keys(jsonData).forEach(function(interest){
            interests.push(interest)
        })
        
        return(
            <div>
                {interests.map(function(interest){
                    return <button value = {interest} onClick = {"placeholder".capture}>{interest}</button>
                })}
                <button value="Fotball" onClick={this.props.capture}>Fotball</button>
                <button value="Sudoku" onClick={this.props.capture}> Sudoku </button>
                <button value="Helse" onClick={this.props.capture}> Helse </button>
            </div>
        )
    }
}

export default Dropdown;