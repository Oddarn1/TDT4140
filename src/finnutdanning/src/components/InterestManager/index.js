import React, {Component} from 'react';
import {withAuthorization} from '../Session';
import * as ROLES from '../../constants/roles';
import AddInterest from './addInterest';
import ChangeInterest from './changeInterest';
import DeleteInterest from "./deleteInterest";
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';

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
                <Button value={0} onClick={this.selectAction} variant="contained" style={{padding:15, margin:10}}>
                    Legge til interesse
                </Button>
                <Button value={1} onClick={this.selectAction} variant="contained" style={{padding:15, margin:10}}>
                    Endre på interessemapping
                </Button>
                <Button value={2} onClick={this.selectAction} variant="contained" style={{padding:15, margin:10}}>
                    Slette interesse
                </Button>
                {/*<button value={1} onClick={this.selectAction}> Endre på interessemapping </button>
            <button value={2} onClick={this.selectAction}> Slette interesse </button>*/}
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
            </div>
        )
    }
}

const condition=authUser=>! !authUser; {/*authUser.role!==ROLES.USER*/}

export default withAuthorization(condition)(InterestManager);
