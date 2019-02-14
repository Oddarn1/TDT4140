import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';

import Navigation from '../Navigation';
import Admin from '../Admin';
import Landing from '../Landing';
import Messages from '../Messages';
import About from '../About';
import Results from '../Results';

import * as ROUTES from '../../constants/routes';

const App =()=>(
    <Router>
        <div>
            <Navigation/>

            <Route exact path={ROUTES.LANDING} component={Landing}/>
            <Route path={ROUTES.ADMIN} component={Admin}/>
            <Route path={ROUTES.ABOUT} component={About}/>
            <Route path={ROUTES.MESSAGES} component={Messages}/>
            <Route path={ROUTES.RESULTS} component={Results}/>
        </div>
    </Router>
);

export default App;
