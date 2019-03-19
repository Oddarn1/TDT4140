import React from 'react';
import {BrowserRouter as Router, Route,Switch} from 'react-router-dom';
import {withFirebase} from '../Firebase';

import Navigation from '../Navigation';
import Admin from '../Admin';
import Landing from '../Landing';
import Messages from '../Messages';
import About from '../About';
import Results from '../Results';
import NotFound from '../NotFound';
import PasswordForget from '../PasswordForget';
import SignIn from '../SignIn';
import SignUp from '../SignUp';
import Account from '../Account';
import './index.css';
import NewMessage from '../NewMessage';
import Blackboard from '../Blackboard';
import InterestManager from '../InterestManager';

import * as ROUTES from '../../constants/routes';
import withAuthentication from "../Session/withAuthentication";
import {compose} from 'recompose';

/*The main component of the application. Deals with routes and which components to render at different paths.*/
const App =()=>(
    <Router>
        <div>
            <Navigation className="navBar"/>

            <div className="content">
            <Switch>
                <Route exact path={ROUTES.LANDING} component={Landing}/>
                <Route path={ROUTES.ADMIN} component={Admin}/>
                <Route path={ROUTES.ABOUT} component={About}/>
                <Route path={ROUTES.MESSAGES} component={Messages}/>
                <Route path={ROUTES.RESULTS} component={Results}/>
                <Route path={ROUTES.SIGNUP} component={SignUp}/>
                <Route path={ROUTES.SIGNIN} component={SignIn}/>
                <Route path={ROUTES.PASSWORDFORGET} component={PasswordForget}/>
                <Route path={ROUTES.ACCOUNT} component={Account}/>
                <Route path={ROUTES.NEWMESSAGE} component={NewMessage}/>
                <Route path={ROUTES.BLACKBOARD} component={Blackboard}/>
                <Route path={ROUTES.INTERESTMANAGER} component={InterestManager}/>
                <Route component={NotFound}/>

            </Switch>
            </div>
        </div>
    </Router>
);

export default compose(
    withAuthentication,
    withFirebase,)(App);
