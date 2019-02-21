import React, {Component} from 'react';

class Dropdown extends Component{
    constructor(props){
        super(props);
    }


    render(){
        return(
            <div>
                <button value="Fotball" onClick={this.props.capture}>Fotball</button>
                <button value="Sudoku" onClick={this.props.capture}> Sudoku </button>
                <button value="Helse" onClick={this.props.capture}> Helse </button>
            </div>
        )
    }
}

export default Dropdown;