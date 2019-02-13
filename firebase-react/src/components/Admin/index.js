import React, { Component } from 'react';
import {compose} from 'recompose';

import { withFirebase } from '../Firebase';
import {withAuthorization} from '../Session';
import * as ROLES from '../../constants/roles';

class AdminPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            users: [],
            error: null,
            searchQuery: "",
        };

        this.isAdmin=[];
        this.isEmployee=[];
        this.onChange=this.onChange.bind(this);
    }

    /*As soon as the component renders, componentDidMount is ran. This function retrieves users from firebase and
    * also sets a listener for changes in the database, e.g by updating the role of user A to admin.*/
    componentDidMount() {
        this.setState({ loading: true });

        this.props.firebase.users().on('value', snapshot => {
            const usersObject = snapshot.val();

            const usersList = Object.keys(usersObject).map(key => ({
                ...usersObject[key],
                uid: key,
            }));

            this.setState({
                users: usersList,
                loading: false,
            });
        });
    }

    /*While searching: update the user-list. Functions for managing roles are still stable.*/
    onChange=event=>{
        this.setState({searchQuery:event.target.value});
        this.setState({loading:true});
        this.props.firebase.users().orderByChild('username').startAt(this.state.searchQuery)
            .endAt(this.state.searchQuery+"\uf8ff").on('value', snapshot => {
            const usersObject = snapshot.val();

            if (usersObject===null) {
                this.setState({
                    users:[],
                    loading: false,
                });
                return}
            const usersList = Object.keys(usersObject).map(key => ({
                ...usersObject[key],
                uid: key,
            }));

            this.setState({
                users: usersList,
                loading: false,
            });
        });
    };

    /*Lifecycle method. Removes the listener when the admin-page is unrendered to keep the website running fast and stable*/
    componentWillUnmount(){
        this.props.firebase.users().off();
    }


    /*Function for submit button.
    * No parameters.
    * Updates the roles of every user according to checkboxes. */
    onSubmit = () =>{
        for (let i=0;i<this.state.users.length;i++){
            const roles=[];
            roles.push(ROLES.USER);
            if (this.isAdmin[i].checked){
                roles.push(ROLES.ADMIN);
            }
            if(this.isEmployee[i].checked){
                roles.push(ROLES.EMPLOYEE);
            }
            this.props.firebase.users().ref.child(this.state.users[i].uid).update({
                roles,
            })
        }
    };

    /*Function to create the userlist we wish to display to admin.
    Param: the acquired userlist from reading userbase in firebase.
    * Returns html-like object that is rendered in the render-function.*/
    UserList ({users}){
        return (
        <ul>
            {users.map((user,index) => (
                <li key={user.uid}>
        <span>
          <strong>ID:</strong> {user.uid}
        </span>
                    <span>
          <strong>E-Mail:</strong> {user.email}
        </span>
                    <span>
          <strong>Username:</strong> {user.username}
        </span>
                    <span>
                    <strong>Roles:</strong> {user.roles}
                </span>
                    <span>
                <label>
                    Admin:
                    <input
                        name="isAdmin"
                        type="checkbox"
                        ref={(ref) => this.isAdmin[index] = ref}
                        defaultChecked={user.roles.includes(ROLES.ADMIN)}
                    />
                </label>
                </span>
                    <span>
                <label>
                    Employee:
                    <input
                            name="isEmployee"
                            type="checkbox"
                            ref={(ref) => this.isEmployee[index] = ref}
                            defaultChecked={user.roles.includes(ROLES.EMPLOYEE)}
                        />
                </label>
                </span>
                </li>
            ))}
        </ul>
        );
    }



    /*Renders the components given as return-value. */
    render() {
        const { users, loading } = this.state;
        const userList= this.UserList({users});

        return (
            <div>
                <h1>Admin</h1>
                <p>
                    The Admin page is accessible by every signed in admin user.
                </p>
                <input type="text" value={this.state.searchQuery} onChange={this.onChange} placeholder="Search users"/>
                {loading && <div>Loading ...</div>}
                <div ref="ListUsers">{userList}</div>
                {this.state.error}
                <button type="submit" onClick={this.onSubmit}>Submit Changes</button>
            </div>
        );
    }
}

/*Controls that authorized user is admin*/
const condition = authUser =>
    authUser && authUser.roles.includes(ROLES.ADMIN);

export default compose(
    withAuthorization(condition),
    withFirebase,
)(AdminPage);