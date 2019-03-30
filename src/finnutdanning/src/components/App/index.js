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
import Feedback, {FeedbackButton} from '../Feedback';

import * as ROUTES from '../../constants/routes';
import withAuthentication from "../Session/withAuthentication";
import {compose} from 'recompose';

/*Hovedkomponenten i applikasjonen. Her defineres alle routes som er tilgjengelig i programmet, og åpner disse for bruk
* med react-router. */
const App =()=>(
    <Router>
        <div>
            {/*Navigasjonsbaren ligger alltid på topp av siden.*/}
            <Navigation className="navBar"/>

            <div className="content">
            <Switch>
                {/*Redirigeres til landing-siden når man åpner siden*/}
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
                <Route path={ROUTES.FEEDBACK} component={Feedback}/>
                {/*Dersom ingen av routes over er gjenkjent blir man omdirigert til 404 Not Found*/}
                <Route component={NotFound}/>
            </Switch>
            <FeedbackButton/>
            </div>
        </div>
    </Router>
);


/*withFirebase er en Higher Order Component som "wrapper" klassen med funksonalitet for aksess til firebase på f.eks. formen
* this.props.firebase...*/
export default compose(
    withAuthentication,
    withFirebase,)(App);
