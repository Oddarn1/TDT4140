import React from 'react';
import {BrowserRouter as Router,Route} from 'react-router-dom';
import * as ROUTES from '../../constants/routes';

import Navigation from '../Navigation';
import LandingPage from '../Landing';
import About from '../About';
import Message from '../Message';
import AdminPage from '../Admin';
import ResultPage from '../Results';


const App = () => (
    <Router>
        <div>
            <Navigation />

            <hr />
            <Route exact path={ROUTES.LANDING} component={LandingPage} />
            <Route path={ROUTES.ABOUT} component={About} />
            <Route path={ROUTES.MESSAGE} component={Message}/>
            <Route path={ROUTES.ADMIN} component={AdminPage} />
            <Route path={ROUTES.RESULT} component={ResultPage} />
        </div>
    </Router>
);

export default App;