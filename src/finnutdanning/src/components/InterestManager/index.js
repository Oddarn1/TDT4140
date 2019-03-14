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
    }

    render(){
        return(
            <div>
                <h1>Legg til interesser med mapping:</h1> <br/>
                <AddInterest/><br/>
                <h1> Endre interesser med mapping:</h1> <br/>
                <ChangeInterest/><br/>
                <h1>Slette interesser:</h1>
                <DeleteInterest/>
            </div>
        )
    }
}

const condition=authUser=>! !authUser; {/*authUser.role===ROLES.COUNSELOR||authUser.role===ROLES.EMPLOYEE;*/}

export default withAuthorization(condition)(InterestManager);