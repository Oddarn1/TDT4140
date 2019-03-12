import React, {Component} from 'react';
import withAuthorization from "../Session/withAuthorization";
import * as roles from '../../constants/roles';
import {withRouter} from 'react-router-dom';
import * as routes from '../../constants/routes';
import {compose} from 'recompose';

class ContactCouncellor extends Component {
    constructor(props) {
        super(props);

    }

    contact(event) {
        this.props.authUser.role === roles.USER ?
        this.props.history.push(routes.NEWMESSAGE) :
        this.props.history.push(routes.SIGNIN);
    }

    render () {
        return (<button type="button" onClick={this.contact}>
            Kontakt veileder
        </button>)
    }
}

const condition=authUser => !authUser || authUser.role === roles.USER;

export default compose (withRouter,withAuthorization(condition)) (ContactCouncellor);
