import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import "./index.css";
import {AuthUserContext} from '../Session';
import * as ROLES from '../../constants/roles';
import {withFirebase} from '../Firebase';
import SignOut from "../SignOut";

/*Whenever TODO:
Implement search bar in the navigation bar.
Sprint 2 TODO:
User-protected routes, make sure registered users get access to messages, employees to employee-protected pages and so on.*/
const NavigationAuth = ({authUser}) => (
            <div>
                <Link to={ROUTES.LANDING}>
                    <button> Hjem</button>
                </Link>
                <Link to={ROUTES.MESSAGES}>
                    <button> Meldinger</button>
                </Link>
                <Link to={ROUTES.ABOUT}>
                    <button> Om oss</button>
                </Link>
                {authUser.role === ROLES.ADMIN &&
                <Link to={ROUTES.ADMIN}>
                    <button> Admin </button>
                </Link>
                }
                <SignOut/>
                <p>Logget inn som: {authUser.email}</p>
            </div>
        );


const NavigationNonAuth = () => (
    <div>
            <Link to={ROUTES.LANDING}>
                <button>Hjem</button>
            </Link>
            <Link to={ROUTES.ABOUT}>
                <button>Om oss</button>
            </Link>
            <Link to={ROUTES.SIGNIN}>
                <button>Logg inn</button>
            </Link>
    </div>
);

const Navigation = ()=>(
    <AuthUserContext.Consumer>
        {authUser =>
            authUser ?
                <NavigationAuth authUser={authUser}/>
                :
                <NavigationNonAuth/>}
    </AuthUserContext.Consumer>
);

export default Navigation;