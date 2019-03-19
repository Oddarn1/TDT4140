import React, {Component} from 'react';
import {withAuthorization} from '../Session';
import * as ROLES from '../../constants/roles';
import AddInterest from './addInterest';
import ChangeInterest from './changeInterest';
import DeleteInterest from "./deleteInterest";

class InterestManager extends Component{
    constructor(props){
        super(props);
        this.state={
            selectedAction:null,
        };
        this.selectAction=this.selectAction.bind(this);
    }

    selectAction(event){
        event.preventDefault();
        this.setState({selectedAction:event.target.value===this.state.selectedAction?null:event.target.value,});
    }

    render(){
        return(
            <div>
                {console.log(this.state.selectedAction)}
                <h3>Hva ønsker du å gjøre?</h3>
                <button value={0} onClick={this.selectAction}> Legge til interesse </button>
                <button value={1} onClick={this.selectAction}> Endre på interessemapping </button>
                <button value={2} onClick={this.selectAction}> Slette interesse </button>
                {this.state.selectedAction==="0"&&
                <div>
                    <h3>Legg til interesser med mapping:</h3> <br/>
                    <AddInterest/><br/>
                </div>}
                {this.state.selectedAction==="1"&&
                <div>
                    <h3> Endre interesser med mapping:</h3> <br/>
                    <ChangeInterest/><br/>
                </div>}
                {this.state.selectedAction==="2"&&
                <div>
                    <h3>Slette interesser:</h3>
                    <DeleteInterest/>
                </div>}
            </div>
        )
    }
}

const condition=authUser=>! !authUser; {/*authUser.role!==ROLES.USER*/}

export default withAuthorization(condition)(InterestManager);