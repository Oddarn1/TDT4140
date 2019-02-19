import React from 'react';
import {BrowserRouter as Router, Route,Switch} from 'react-router-dom';

import Navigation from '../Navigation';
import Admin from '../Admin';
import Landing from '../Landing';
import Messages from '../Messages';
import About from '../About';
import Results from '../Results';
import NotFound from '../NotFound';

import * as ROUTES from '../../constants/routes';

/*The main component of the application. Deals with routes and which components to render at different paths.*/
const App =()=>(
    <Router>
        <div>
            <Navigation/>

            <Switch>
            <Route exact path={ROUTES.LANDING} component={Landing}/>
            <Route path={ROUTES.ADMIN} component={Admin}/>
            <Route path={ROUTES.ABOUT} component={About}/>
            <Route path={ROUTES.MESSAGES} component={Messages}/>
            <Route path={ROUTES.RESULTS} component={Results}/>
            <Route component={NotFound}/>
            </Switch>
        </div>
    </Router>
);

export default App;
