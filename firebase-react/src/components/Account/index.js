import React from 'react';

import { PasswordForgetForm } from '../PasswordForget';
import PasswordChangeForm from '../PasswordChange';
import {AuthUserContext, withAuthorization } from '../Session';


/*AccountPage is a component which is only available for signed-in users. This component lists email, roles (user,employee,admin)
 * and also gives the possibility to change password */
const AccountPage = () => (
    <AuthUserContext.Consumer>
        {authUser=> (
    <div>
        <h1>Account: {authUser.email} </h1>
        <h1>Roles:  {authUser.roles}</h1>
        <PasswordForgetForm />
        <PasswordChangeForm />
    </div>
        )}
    </AuthUserContext.Consumer>
);

const condition = authUser => ! !authUser;

export default withAuthorization(condition)(AccountPage);