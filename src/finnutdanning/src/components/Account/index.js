import React from 'react';

import PasswordChangeForm from '../PasswordChange';
import {AuthUserContext, withAuthorization } from '../Session';
import Typography from '@material-ui/core/Typography';
import './index.css';

/*For SignIn, SignOut, SignUp, PasswordForget, Session, Firebase, Account har vi fulgt tutorial på:
* https://www.robinwieruch.de/complete-firebase-authentication-react-tutorial/ */

/*Account-klassen inneholder en authusercontext-wrapper som gir oss mulighet til å hente ut informasjon om innlogget bruker.
* Komponenten PasswordChangeForm inneholder tekstfeltene for å endre passordet til innlogget bruker.*/
const Account = () => (
    <AuthUserContext.Consumer>
        {authUser=> (
            <div className="Account">
                <Typography variant="h6" gutterBottom style={{paddingTop:15}}>
                    Bruker: {authUser.email}
                </Typography>
                <Typography variant="h6" gutterBottom style={{paddingTop:15}}>
                    Rolle: {authUser.role}
                </Typography>
                <Typography variant="h6" gutterBottom style={{paddingTop:15}}>
                    Endre Passord:
                </Typography>
                <PasswordChangeForm />
            </div>
        )}
    </AuthUserContext.Consumer>
);


const condition = authUser => ! !authUser;

/*withAuthorization er en Higher Order Component som "wrapper" den eksporterte klassen med en condition som definert over.
* Condition bestemmer hvilke sider en bruker har tilgang på, authUser=>! !authUser vil si at bruker må være logget inn for å se
* siden.
* withAuthorization gjør det også mulig å skrive til/fra firebase med this.props.firebase...*/
export default withAuthorization(condition)(Account);
