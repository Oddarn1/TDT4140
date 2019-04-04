import AuthUserContext from './context';
import withAuthentication from './withAuthentication';
import withAuthorization from './withAuthorization';

/*For SignIn, SignOut, SignUp, PasswordForget, Session, Firebase, Account har vi fulgt tutorial på:
* https://www.robinwieruch.de/complete-firebase-authentication-react-tutorial/ */

//Samler imports og exports i index-filen for enkel aksess

export {AuthUserContext,withAuthentication, withAuthorization};