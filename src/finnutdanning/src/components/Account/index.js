import React from 'react';

import { PasswordForgetForm } from '../PasswordForget';
import PasswordChangeForm from '../PasswordChange';
import {AuthUserContext, withAuthorization } from '../Session';

const Account = () => (
    <AuthUserContext.Consumer>
        {authUser=> (
            <div>
                <h1>Bruker: {authUser.email} </h1>
                <h1>Rolle:  {authUser.role}</h1>
                <h3>Endre Passord:</h3>
                <PasswordChangeForm />
            </div>
        )}
    </AuthUserContext.Consumer>
);

const condition = authUser => ! !authUser;

export default withAuthorization(condition)(Account);