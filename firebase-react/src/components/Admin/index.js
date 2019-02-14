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
            queriedUsers:[],
        };

        this.isAdmin=[];
        this.isEmployee=[];
    }

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


    componentWillUnmount(){
        this.props.firebase.users().off();
    }

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

    render() {
        const { users, loading } = this.state;
        const userList= this.UserList({users});

        return (
            <div>
                <h1>Admin</h1>
                <p>
                    The Admin page is accessible by every signed in admin user.
                </p>
                {loading && <div>Loading ...</div>}
                <div ref="ListUsers">{userList}</div>
                {this.state.error}
                <button type="submit" onClick={this.onSubmit}>Submit Changes</button>
            </div>
        );
    }
}

const condition = authUser =>
    authUser && authUser.roles.includes(ROLES.ADMIN);

export default compose(
    withAuthorization(condition),
    withFirebase,
)(AdminPage);