import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import "./index.css";
import {AuthUserContext} from '../Session';
import * as ROLES from '../../constants/roles';
import SignOut from "../SignOut";

/*Whenever TODO:
Implement search bar in the navigation bar.
Sprint 2 TODO:
User-protected routes, make sure registered users get access to messages, employees to employee-protected pages and so on.*/

const NavigationAuth = ({authUser}) => (
    <ul>
        <li>
            <Link to={ROUTES.LANDING}> Hjem </Link>
        </li>
        <li>
            <Link to={ROUTES.MESSAGES}> Meldinger </Link>
        </li>
        <li>
            <Link to={ROUTES.ABOUT}> Om oss </Link>
        </li>
        {authUser.role===ROLES.ADMIN &&
        <li>
            <Link to={ROUTES.ADMIN}> Admin </Link>
        </li>}
        <li>
            <p>Logget inn som: {authUser.email}</p>
            </li>
        <li>
            <SignOut/>
        </li>
    </ul>
);

const NavigationNonAuth = () => (
    <ul>
        <li>
            <Link to={ROUTES.LANDING}> Finn Utdanning </Link>
        </li>
        <li>
            <Link to={ROUTES.ABOUT}> Om oss </Link>
        </li>
        <li>
            <Link to={ROUTES.SIGNIN}> Logg inn </Link>
        </li>
    </ul>
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