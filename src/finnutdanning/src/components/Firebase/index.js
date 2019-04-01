import Firebase from './firebase';
import FirebaseContext,{withFirebase} from './context';

/*For SignIn, SignOut, SignUp, PasswordForget, Session, Firebase, Account har vi fulgt tutorial på:
* https://www.robinwieruch.de/complete-firebase-authentication-react-tutorial/ */

/*Import/export fra index for å holde alle exports samlet på ett sted.*/
export default Firebase;

export {FirebaseContext,withFirebase};