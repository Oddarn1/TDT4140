import React, {Component} from 'react';
import Register from './register';
import {withFirebase} from '../Firebase';

/*General function for stateless component*/
class Admin extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                <Register/>
            {/*Sprint 1 TODO:
        * Create a way to register and administrate employees (counselors and general employees).
        * Making use of firebase to store employees and admins might be a good idea.
        * Sprint 2: TODO:
        * Ability to administrate all registered users in the application. Firebase also a good idea here.*/}
        </div>
        );
    }
}

export default withFirebase(Admin);