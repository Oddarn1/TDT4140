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
import './index.css';

import * as ROUTES from '../../constants/routes';

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
            <Route path={ROUTES.RESULTS} component={Results} props={{query:""}}/>
            <Route component={NotFound}/>
            </Switch>
            </div>
        </div>
    </Router>
);

export default withFirebase(App);
