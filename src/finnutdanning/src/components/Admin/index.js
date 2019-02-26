import React, {Component} from 'react';
import Register from './register';
import {withFirebase} from '../Firebase';

/*General function for stateless component*/
class Admin extends Component {
    constructor(props) {
        super(props);
        this.state={users:[],
            loading: false}
    }

    componentDidMount(){
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
        })
    }

    componentWillUnmount(){
        this.props.firebase.users().off();
    }

    UserList ({users}) {
        return (
            <ul>
                {users.map(user => (
                    <li key={user.uid}>
                        <span>
                            <strong>ID:</strong> {user.uid}
                        </span>
                        <span>
                            <strong>E-Mail:</strong> {user.email}
                        </span>
                        <span>
                            <strong>Username:</strong> {user.fullName}
                        </span>
                        <span>
                            <strong>Role:</strong> {user.role}
                        </span>
                    </li>
                ))}
            </ul>
        );
    }

    render() {
        const {users,loading}=this.state;
        const userList=this.UserList({users});


        return (
            <div>
                <Register/>
                {loading && <div>Loading ...</div>}
                <div ref="ListUsers">{userList}</div>
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

