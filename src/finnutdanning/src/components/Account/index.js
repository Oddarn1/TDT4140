import React from 'react';

import { PasswordForgetForm } from '../PasswordForget';
import PasswordChangeForm from '../PasswordChange';
import {AuthUserContext, withAuthorization } from '../Session';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const Account = () => (
    <AuthUserContext.Consumer>
        {authUser=> (
            <div>
                <Typography variant="h6" gutterBottom style={{padding:15}}>
                    Bruker: {authUser.email}
                </Typography>
                <Typography variant="h6" gutterBottom style={{padding:15}}>
                    Rolle: {authUser.role}
                </Typography>
                <Typography variant="h6" gutterBottom style={{padding:15}}>
                    Endre Passord:
                </Typography>
                <PasswordChangeForm />
            </div>
        )}
    </AuthUserContext.Consumer>
);

const condition = authUser => ! !authUser;

export default withAuthorization(condition)(Account);
