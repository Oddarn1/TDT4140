import React, {Component} from 'react';

class Dropdown extends Component{
    constructor(props){
        super(props);
        this.capture=this.capture.bind(this);
    }

    capture(event){
        var text=event.target.value;
        this.props.onClick(this.props.id,text);
    }

    render(){
        return(
            <div>
                <button value="Fotball" onClick={this.capture}>Fotball</button>
                <button value="Sudoku" onClick={this.capture}> Sudoku </button>
                <button value="Helse" onClick={this.capture}> Helse </button>
            </div>
        )
    }
}

export default Dropdown;