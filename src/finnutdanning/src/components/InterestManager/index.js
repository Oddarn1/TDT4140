import React, {Component} from 'react';
import {withAuthorization} from '../Session';
import AddInterest from './addInterest';
import ChangeInterest from './changeInterest';
import DeleteInterest from "./deleteInterest";
import RemoveStudies from "./removeStudies";
import MappingManager from "./manageMapping";
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

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
                <Typography variant="h4" gutterBottom style={{padding:20}}>
                    Hva ønsker du å gjøre?
                </Typography>
                <button value={0} onClick={this.selectAction}> Legge til interesse </button>
                <button value={1} onClick={this.selectAction}> Endre interesse </button>
                <button value={2} onClick={this.selectAction}> Slette interesse </button>
                <button value={3} onClick={this.selectAction}> Slette studieretning </button>
                {this.state.selectedAction==="0"&&
                <div>
                    <Typography variant="h6" gutterBottom style={{padding:20}}>
                        Legg til interesser med mapping:
                    </Typography><br/>
                    <AddInterest/><br/>
                </div>}
                {this.state.selectedAction==="1"&&
                <div>
                    <Typography variant="h6" gutterBottom style={{padding:20}}>
                        Endre interessemapping:
                    </Typography>
                    <ChangeInterest/><br/>
                </div>}
                {this.state.selectedAction==="2"&&
                <div>
                    <Typography variant="h6" gutterBottom style={{padding:20}}>
                        Slette interesse:
                    </Typography><br/>
                    <DeleteInterest/>
                </div>}
                {this.state.selectedAction==="3"&&
                <div>
                    <h3>Slette studieretning:</h3>
                    <RemoveStudies/>
                </div>}
                {this.state.selectedAction==="4"&&
                <div>
                    <h3>Sette mapping for studieretning:</h3>
                    <MappingManager/>
                </div>}
            </div>
        )
    }
}

const condition=authUser=>! !authUser; {/*authUser.role!==ROLES.USER*/}

export default withAuthorization(condition)(InterestManager);
