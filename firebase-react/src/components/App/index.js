import React from 'react';
import {BrowserRouter as Router,Route} from 'react-router-dom';

import Navigation from '../Navigation';
//import LandingPage from '../Landing';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import PasswordForgetPage from '../PasswordForget';
import HomePage from '../Home';
import AccountPage from '../Account';
import AdminPage from '../Admin';

import * as ROUTES from '../../constants/routes';
import {withAuthentication} from '../Session';


/*The main component. When rendered by the ReactDOM in src/index.js, this component controls the flow of the webapp
* Router is an effective way of dealing with multi-page react-apps. This makes it possible to render page-loading
* immediately. Landing page is not yet defined as a component, this will become the main page for both authorized and
* unauthorized users. */
const App = () => (
    <Router>
        <div>
            <Navigation />

            <hr />

            {/*<Route exact path={ROUTES.LANDING} component={LandingPage} />
            */}
            <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
            <Route path={ROUTES.SIGN_IN} component={SignInPage} />
            <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage}/>
            <Route path={ROUTES.ACCOUNT} component={AccountPage} />
            <Route path={ROUTES.HOME} component={HomePage} />
            <Route path={ROUTES.ADMIN} component={AdminPage} />
        </div>
    </Router>
);

export default withAuthentication(App);