import React, {Component} from 'react';
import Register from './register';
import {withFirebase} from '../Firebase';
import * as ROLES from "../../constants/roles";
import {compose} from 'recompose';
import withAuthorization from "../Session/withAuthorization";

class Admin extends Component {
    constructor(props) {
        super(props);
        this.state={users:[],
            loading: false,
            error:null,};
        this.userStates=[[],[],[],[]];
        this.stateList=[ROLES.USER,ROLES.COUNSELOR,ROLES.EMPLOYEE,ROLES.ADMIN];
        this.selectedRole=ROLES.ADMIN;
        this.search="";
        this.onSubmit=this.onSubmit.bind(this);
    }

    componentDidMount(){
        this.setState({ loading: true });

        this.props.firebase.users().on('value', snapshot => {
            const usersObject = snapshot.val();

            if (usersObject===null){
                return;
            }

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

    nameSearch(event){
        this.search=event.target.value;
        this.props.firebase.db.ref("users").orderByChild("fullName").startAt(this.search)
            .endAt(this.search+"\uf8ff").on('value', snapshot => {
            const usersObject = snapshot.val();
            let usersList;
            if (usersObject===null){
                usersList=[];
                this.setState({users:usersList,
                    loading: false,});
                return;
            }

            usersList = Object.keys(usersObject).map(key => ({
                ...usersObject[key],
                uid: key,
            }));

            this.setState({
                users: usersList,
                loading: false,
            });
        });
        event.preventDefault();
    }


    onSubmit(){
        const {users}=this.state;
        for(var i=0;i<users.length;i++){
            let role=null;
            for (var n=0;n<4;n++){
                if (this.userStates[n][i].checked){
                    role=this.stateList[n];
                }
            }
            if (role===null){
                this.setState({error:"User "+users[i].uid+" must have a role!"})
                return;
            }
            this.props.firebase.users().ref.child(users[i].uid).update({
                role
            })
                .then(this.setState({error: null}))
                .catch(error=>
                {this.setState(error)})
        }
    }

    UserList ({users}) {
        return (
            <ul>
                {users.map((user,index) => (
                    <li key={user.uid}>
                        <span>
                            <strong>ID:</strong> &nbsp; {user.uid}
                        </span>
                        <span>
                            <strong>&nbsp;&nbsp;E-post:</strong>&nbsp; {user.email}
                        </span>
                        <span>
                            <strong>&nbsp;&nbsp;Fullt navn:</strong>&nbsp; {user.fullName}
                        </span>
                        <span>
                            <strong>&nbsp;&nbsp;Rolle:</strong> &nbsp;{user.role}
                        </span>
                        <span>
                        <strong>&nbsp;&nbsp; Endre rolle: </strong>

                        <label>Bruker&nbsp;</label>
                        <input type="checkbox"
                               name="role"
                               value={ROLES.USER}
                               defaultChecked={this.state.users[index].role === ROLES.USER}
                               ref={(ref) => this.userStates[0][index] = ref}
                        />

                        <label> Veileder&nbsp;</label>
                        <input type="checkbox"
                               name="role"
                               value={ROLES.COUNSELOR}
                               defaultChecked={this.state.users[index].role === ROLES.COUNSELOR}
                               ref={(ref) => this.userStates[1][index] = ref}
                        />

                        <label> Ansatt&nbsp;</label>
                        <input type="checkbox"
                               name="role"
                               value={ROLES.EMPLOYEE}
                               defaultChecked={this.state.users[index].role === ROLES.EMPLOYEE}
                               ref={(ref) => this.userStates[2][index] = ref}
                        />

                        <label> Admin&nbsp;</label>
                        <input type="checkbox"
                               name="role"
                               value={ROLES.ADMIN}
                               defaultChecked={this.state.users[index].role === ROLES.ADMIN}
                               ref={(ref) => this.userStates[3][index] = ref}
                        />
                        </span>
                    </li>
                ))}
            </ul>
        );
    }

    roleSearch(event){
        this.selectedRole=event.target.value;
        this.props.firebase.db.ref("users").orderByChild("role").equalTo(this.selectedRole).on('value', snapshot => {
            const usersObject = snapshot.val();

            if (usersObject===null){
                return;
            }

            const usersList = Object.keys(usersObject).map(key => ({
                ...usersObject[key],
                uid: key,
            }));

            this.setState({
                users: usersList,
                loading: false,
            });
        });
        event.preventDefault();
    }

    render() {
        const {users,loading}=this.state;
        const userList=this.UserList({users});


        return (
            <div>
                <Register registered={users}/>
                {loading && <div>Loading ...</div>}
                {!loading && <h1>Brukere: </h1>}
                <input name="search" type="text" onChange={this.nameSearch} placeholder="Søk i brukere på navn"/>
                <select name="selectedRole" defaultChecked={this.selectedRole} onChange={this.roleSearch}>
                    <option value={ROLES.ADMIN}>Admin</option>
                    <option value={ROLES.EMPLOYEE}>Ansatt</option>
                    <option value={ROLES.COUNSELOR}>Veileder</option>
                    <option value={ROLES.USER}>Bruker</option>
                </select>
                {this.selectedRole}
                <div ref="ListUsers">{userList}</div>
                {this.state.error}
                <button onClick={this.onSubmit}> Lagre </button>
        </div>
        );
    }
}


const condition = authUser =>
    authUser && (authUser.role===ROLES.ADMIN);

export default compose(
    withFirebase,
    withAuthorization(condition),)(Admin);
