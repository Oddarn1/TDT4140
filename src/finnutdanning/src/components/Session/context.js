import React from 'react';

//Oppretter Context som benytter for provider og consumer som blir wrappere i klasser som skal bruke autorisering
const AuthUserContext = React.createContext(null);

export default AuthUserContext;