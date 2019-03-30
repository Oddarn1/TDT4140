import React, {Component} from 'react';
import {withAuthorization} from '../Session';
import AddInterest from './addInterest';
import ChangeInterest from './changeInterest';
import DeleteInterest from "./deleteInterest";
import RemoveStudies from "./removeStudies";
import MappingManager from "./manageMapping";
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

class InterestManager extends Component{
    constructor(props){
        super(props);
        this.state={
            selectedAction:null,
        };
        this.selectAction=this.selectAction.bind(this);
    }

    //Funksjon for å velge hva som skal vises
    selectAction(event){
        event.preventDefault();
        this.setState({selectedAction:event.currentTarget.value===this.state.selectedAction?null:event.currentTarget.value,});
    }

    render(){
        return(
            <div>
                {console.log(this.state.selectedAction)}
                <Typography variant="h4" gutterBottom style={{padding:20}}>
                    Hva ønsker du å gjøre?
                </Typography>
                <Button value={0} onClick={this.selectAction} variant="contained" style={{padding:15, margin:10}}>
                    Legge til interesse
                </Button>
                <Button value={1} onClick={this.selectAction} variant="contained" style={{padding:15, margin:10}}>
                    Endre på interessemapping
                </Button>
                <Button value={2} onClick={this.selectAction} variant="contained" style={{padding:15, margin:10}}>
                    Slette interesse
                </Button>
                <Button value={3} onClick={this.selectAction} variant="contained" style={{padding:15, margin:10}}>
                    Slette studieretning
                </Button>
                <Button value={4} onClick={this.selectAction} variant="contained" style={{padding:15, margin:10}} >
                    Sette kobling på studieretninger
                </Button>

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
                    <Typography variant="h6" gutterBottom style={{padding:20}}>
                        Slette studieretning:
                    </Typography><br/>
                    <RemoveStudies/>
                </div>}

                {this.state.selectedAction==="4"&&
                <div>
                    <Typography variant="h6" gutterBottom style={{padding:20}}>
                        Sette kobling på studieretninger:
                    </Typography><br/>
                    <MappingManager/>
                </div>}
            </div>
        )
    }
}

const condition=authUser=>! !authUser; {/*authUser.role!==ROLES.USER*/}

export default withAuthorization(condition)(InterestManager);
