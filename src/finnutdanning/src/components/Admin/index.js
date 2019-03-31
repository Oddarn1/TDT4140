import React, {Component} from 'react';
import Register from './register';
import {withFirebase} from '../Firebase';
import * as ROLES from "../../constants/roles";
import {compose} from 'recompose';
import withAuthorization from "../Session/withAuthorization";
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import ThemeChanger from './changeTheme'
import './index.css';

class Admin extends Component {
    constructor(props) {
        super(props);
        this.state={users:[],
            loading: false,
            error:null,
            search:"",
            selectedRole: ROLES.ADMIN,
        };
        //userStates inneholder et array med roller for alle brukere som er lastet som brukes til checkboxene i admin-verktøyet
        this.userStates=[[],[],[],[]];
        //stateList inneholder roller på index tilsvarende userStates-arrayet for enkel aksessering i rolleendringen
        this.stateList=[ROLES.USER,ROLES.COUNSELOR,ROLES.EMPLOYEE,ROLES.ADMIN];
        this.onSubmit=this.onSubmit.bind(this);
        this.nameSearch=this.nameSearch.bind(this);
        this.roleSearch=this.roleSearch.bind(this);
    }


    //Livstidsfunksjon, når komponenten mountes (kalles av annen komponent) blir denne funksjonen kjørt.
    //Her lastes alle brukere i databasen inn i adminverktøyet.
    componentDidMount(){
        this.setState({ loading: true });

        //Henter ut alle brukere i firebase under 'users', users()-funksjonen er definert i firebase.js
        this.props.firebase.users().on('value', snapshot => {
            const usersObject = snapshot.val();

            //Hvis listen er tom: behold state som den er
            if (usersObject===null){
                return;
            }

            //Verdien vi får et er et objekt av objekter, dette parses til en liste av objekter på nøklene i usersObject.
            //usersList blir nå en liste med bruker-objekter, hvor uid er nøkkel.
            const usersList = Object.keys(usersObject).map(key => ({
                ...usersObject[key],
                uid: key,
            }));

            //Setter state for å ha tilgang utenfor funksjonen
            this.setState({
                users: usersList,
                loading: false,
            });
        })
    }

    //Skru av lytter på database for å unngå memory-leaks.
    componentWillUnmount(){
        this.props.firebase.users().off();
    }


    /*Samme prinsipp som componentdidmount, men med uthenting på navn på brukere.
    * "\uf8ff" er en UTF-karakter som markerer hva som helst i etterfølging. Dvs. søk på Mar vil gi Markus, Marius, Maren osv*/
    nameSearch(event){
        this.props.firebase.db.ref("users").orderByChild("fullName").startAt(event.target.value)
            .endAt(event.target.value+"\uf8ff").on('value', snapshot => {
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
            })

        });
        //Oppdaterer state etter uthenting fra database for å holde søket synkront med input
        this.setState({search:event.target.value,});
        event.preventDefault();
    }

    /*Samme prinsipp som namesearch, men velger ut rollene som velges i dropdown-menyen. Måtte benytte startAt og endAt av
    * en eller merkelig grunn, heller enn equalTo..*/
    roleSearch(event){
        this.props.firebase.db.ref("users").orderByChild("role").startAt(event.target.value).endAt(event.target.value+"\uf8ff")
            .on('value', snapshot => {
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
                })
            });
        this.setState({selectedRole:event.target.value});
        event.preventDefault();
    }

    /*Går gjennom listen med brukere som er synlige (de som er søkt opp, evt. alle) og tar checkboxene for hver enkelt bruker
    * og oppdaterer rolle-verdien i firebase deretter. */
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
                this.setState({error:"User "+users[i].uid+" must have a role!"});
                return;
            }
            //Skriver til firebase
            this.props.firebase.users().ref.child(users[i].uid).update({
                role
            })
                .then(this.setState({error: null}))
                .catch(error=>
                {this.setState(error)})
        }
    }

    //Lister alle innleste brukere.
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


    render() {
        const {users,loading}=this.state;
        const userList=this.UserList({users});


        return (
            <div className="admincontent">
                <ThemeChanger/>
                {/*Komponent for å registrere bruker i admin-verktøyet*/}
                <Register registered={users}/>
                    <Typography component="h5" variant="h5" gutterBottom style={{padding:20}}>
                        Brukere:
                    </Typography>
                <label>Brukersøk (NB: Case-sensitiv)</label><br/>
                <input name="search" type="text" onChange={this.nameSearch} placeholder="Søk i brukere på navn"/>
                <select name="selectedRole" defaultChecked={this.state.selectedRole} onChange={this.roleSearch}>
                    <option value=""> Alle Brukere </option>
                    <option value={ROLES.ADMIN}>Admin</option>
                    <option value={ROLES.EMPLOYEE}>Ansatt</option>
                    <option value={ROLES.COUNSELOR}>Veileder</option>
                    <option value={ROLES.USER}>Bruker</option>
                </select>
                {!loading && <div ref="ListUsers"><br/>{userList}</div>}
                {this.state.error}
                <button onClick={this.onSubmit}> Lagre </button>
        </div>
        );
    }
}


const condition = authUser =>
    authUser && (authUser.role===ROLES.ADMIN);


/*withAuthorization er en Higher Order Component som "wrapper" den eksporterte klassen med en condition som definert over.
* Condition bestemmer hvilke sider en bruker har tilgang på, authUser=>authUser && authUser.role===ROLES.ADMIN
 * vil si at bruker må være logget inn og være admin-bruker for å kunne se siden
* withFirebase er en Higher Order Component som "wrapper" klassen med funksonalitet for aksess til firebase på f.eks. formen
* this.props.firebase...*/
export default compose(
    withFirebase,
    withAuthorization(condition),)(Admin);
